
import logging
import os
import subprocess
import traceback
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain_community.llms.ollama import OllamaEndpointNotFoundError
from langchain.prompts import PromptTemplate
from langchain.callbacks.base import BaseCallbackHandler

# Set up logging.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Dictionary to store QA chains by session ID
qa_chains = {}
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# =============================================================================
# Callback handler for streaming output
# =============================================================================
class StreamingCallbackHandler(BaseCallbackHandler):
    """A callback handler that collects tokens for streaming."""
    def __init__(self):
        self.tokens = []
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.tokens.append(token)

# =============================================================================
# Custom Prompt Template for Synthesized, Coherent Output
# =============================================================================
custom_prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are a helpful assistant that carefully analyzes the entire document to generate a coherent, comprehensive answer.
Given the following document excerpts and a question, synthesize a well-rounded answer that provides full context and continuity.
Do not simply return isolated fragments; instead, integrate the information into a unified, context-rich response.

Document Excerpts:
{context}

Question: {question}
Answer:"""
)

# =============================================================================
# Utility: Get available Ollama models via the Ollama CLI.
# =============================================================================
def get_ollama_models():
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.splitlines()
            models = []
            # Skip header and extract the first token (model name) from each line.
            for line in lines:
                if line.startswith("NAME"):
                    continue
                tokens = line.split()
                if tokens:
                    models.append(tokens[0])
            return models
        else:
            logger.error("Ollama CLI error: %s", result.stderr)
            return []
    except Exception as e:
        logger.exception("Error detecting Ollama models: %s", str(e))
        return []

# =============================================================================
# Initialize the QA Chain using only the local Ollama model.
# =============================================================================
def initialize_qa_chain(filepath, model_checkpoint):
    try:
        loader = PyPDFLoader(filepath)
        documents = loader.load()
    except Exception as e:
        logger.exception("Error loading PDF: %s", str(e))
        raise ValueError("Failed to load the PDF document. Please ensure the file is valid.")

    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        splits = text_splitter.split_documents(documents)
    except Exception as e:
        logger.exception("Error splitting document: %s", str(e))
        raise ValueError("Failed to split the PDF document for processing.")

    try:
        embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        vectordb = FAISS.from_documents(splits, embeddings)
    except Exception as e:
        logger.exception("Error creating embeddings/vector store: %s", str(e))
        raise ValueError("Failed to create embeddings or vector store.")

    try:
        # Initialize the Ollama LLM using the selected local model.
        llm = Ollama(model=model_checkpoint)
    except Exception as e:
        logger.exception("Error initializing the Ollama LLM: %s", str(e))
        raise ValueError("Failed to initialize the language model. Check your model configuration.")

    try:
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectordb.as_retriever(),
            chain_type_kwargs={"prompt": custom_prompt_template}
        )
        return qa_chain
    except Exception as e:
        logger.exception("Error creating QA chain: %s", str(e))
        raise ValueError("Failed to initialize the QA chain.")

# =============================================================================
# Process Query with Streaming Output
# =============================================================================
def process_answer(query, qa_chain):
    callback_handler = StreamingCallbackHandler()
    try:
        # Pass the callback handler to the chain's run method.
        final_output = qa_chain.run(query, callbacks=[callback_handler])
        return final_output, callback_handler.tokens
    except OllamaEndpointNotFoundError as e:
        logger.exception("Ollama model endpoint not found: %s", str(e))
        error_msg = ("Ollama model endpoint not found. Please ensure that the specified model is pulled locally. "
                "Try running `ollama pull <model>` as suggested in the error message.")
        return error_msg, [error_msg]
    except Exception as e:
        logger.exception("Error during query processing: %s", str(e))
        error_msg = "An error occurred while processing your query. Please try again later."
        return error_msg, [error_msg]

# =============================================================================
# API Routes
# =============================================================================

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get all available Ollama models."""
    try:
        models = get_ollama_models()
        return jsonify({"models": models})
    except Exception as e:
        logger.exception("Error fetching models: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a PDF file and initialize a QA chain for it."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    model = request.form.get('model')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not model:
        return jsonify({"error": "No model selected"}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(uploads_dir, filename)
        file.save(filepath)
        
        # Generate a unique session ID
        session_id = os.path.basename(filepath)
        
        # Initialize QA chain
        qa_chain = initialize_qa_chain(filepath, model)
        qa_chains[session_id] = qa_chain
        
        return jsonify({
            "success": True,
            "message": "File processed successfully",
            "session_id": session_id
        })
    except Exception as e:
        logger.exception("Error processing file: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/query', methods=['POST'])
def query():
    """Process a query against a previously uploaded document."""
    data = request.json
    session_id = data.get('session_id')
    query_text = data.get('query')
    
    if not session_id or not query_text:
        return jsonify({"error": "Missing session_id or query"}), 400
    
    if session_id not in qa_chains:
        return jsonify({"error": "Session not found or expired"}), 404
    
    try:
        qa_chain = qa_chains[session_id]
        result, tokens = process_answer({"query": query_text}, qa_chain)
        
        return jsonify({
            "answer": result,
            "tokens": tokens  # For streaming support in frontend
        })
    except Exception as e:
        logger.exception("Error processing query: %s", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
