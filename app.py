import logging
import os
import subprocess
import traceback
import tempfile
import secrets
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for
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

# Generate a random admin token for security
# In a production app, this would be set in environment variables
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(16))
logger.info(f"Admin Token: {ADMIN_TOKEN} (Keep this secure)")

# Dictionary to store QA chains by session ID
qa_chains = {}
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Document metadata storage
documents = {}

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
        # Optimize chunking parameters for better balance between speed and context
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,  # Increased chunk size for faster processing
            chunk_overlap=100, # Reduced overlap to speed up processing
            separators=["\n\n", "\n", " ", ""]
        )
        splits = text_splitter.split_documents(documents)
    except Exception as e:
        logger.exception("Error splitting document: %s", str(e))
        raise ValueError("Failed to split the PDF document for processing.")

    try:
        # Use simpler, faster embeddings
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
# Helper function to validate admin token
# =============================================================================
def validate_admin_token(token):
    return token == ADMIN_TOKEN

# =============================================================================
# API Routes for Client
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

@app.route('/api/documents', methods=['GET'])
def get_documents():
    """Get list of available documents."""
    try:
        return jsonify({"documents": list(documents.values())})
    except Exception as e:
        logger.exception("Error fetching documents: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/document/<document_id>', methods=['GET'])
def get_document(document_id):
    """Get a specific document by ID."""
    try:
        if document_id in documents:
            return jsonify(documents[document_id])
        else:
            return jsonify({"error": "Document not found"}), 404
    except Exception as e:
        logger.exception("Error fetching document: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/select-document', methods=['POST'])
def select_document():
    """Select a document and initialize QA chain for it."""
    data = request.json
    document_id = data.get('document_id')
    model = data.get('model')
    
    if not document_id:
        return jsonify({"error": "Missing document_id"}), 400
    
    if not model:
        return jsonify({"error": "No model selected"}), 400
    
    if document_id not in documents:
        return jsonify({"error": "Document not found"}), 404
    
    try:
        document = documents[document_id]
        filepath = os.path.join(uploads_dir, document['filename'])
        
        # Initialize QA chain
        qa_chain = initialize_qa_chain(filepath, model)
        qa_chains[document_id] = qa_chain
        
        return jsonify({
            "success": True,
            "message": "Document selected successfully",
            "session_id": document_id
        })
    except Exception as e:
        logger.exception("Error selecting document: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/query', methods=['POST'])
def query():
    """Process a query against a previously selected document."""
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

# =============================================================================
# Admin Routes
# =============================================================================

@app.route('/admin/token', methods=['GET'])
def admin_token():
    """Return the admin token for setup purposes."""
    return jsonify({"admin_token": ADMIN_TOKEN})

@app.route('/admin/upload', methods=['POST'])
def admin_upload():
    """Admin route to upload a PDF file and initialize a QA chain for it."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    title = request.form.get('title', 'Untitled Document')
    description = request.form.get('description', '')
    model = request.form.get('model')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not model:
        return jsonify({"error": "No model selected"}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(uploads_dir, filename)
        file.save(filepath)
        
        # Generate a unique document ID
        document_id = os.path.splitext(filename)[0] + '_' + secrets.token_hex(4)
        
        # Initialize QA chain
        qa_chain = initialize_qa_chain(filepath, model)
        qa_chains[document_id] = qa_chain
        
        # Store document metadata
        documents[document_id] = {
            "id": document_id,
            "title": title,
            "description": description,
            "filename": filename,
            "model": model,
            "created_at": str(datetime.now())
        }
        
        return jsonify({
            "success": True,
            "message": "File processed successfully",
            "document": documents[document_id]
        })
    except Exception as e:
        logger.exception("Error processing file: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/admin/documents', methods=['GET'])
def admin_documents():
    """Admin route to get all documents."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    return jsonify({"documents": list(documents.values())})

@app.route('/admin/document/<document_id>', methods=['DELETE'])
def admin_delete_document(document_id):
    """Admin route to delete a document."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    if document_id not in documents:
        return jsonify({"error": "Document not found"}), 404
    
    try:
        document = documents[document_id]
        filepath = os.path.join(uploads_dir, document['filename'])
        
        # Remove from qa_chains
        if document_id in qa_chains:
            del qa_chains[document_id]
        
        # Remove document metadata
        del documents[document_id]
        
        # Remove file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({"success": True, "message": "Document deleted successfully"})
    except Exception as e:
        logger.exception("Error deleting document: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve the frontend application."""
    if path != "" and os.path.exists(os.path.join('public', path)):
        return send_from_directory('public', path)
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    # Import datetime here to avoid circular import issues
    from datetime import datetime
    app.run(debug=True, host='0.0.0.0', port=5000)
