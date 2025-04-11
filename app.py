import logging
import os
import subprocess
import traceback
import tempfile
import secrets
import json
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.document_loaders import UnstructuredExcelLoader
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain_community.llms.ollama import OllamaEndpointNotFoundError
from langchain.prompts import PromptTemplate
from langchain.callbacks.base import BaseCallbackHandler
from datetime import datetime

# Set up logging.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='public')
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Generate a random admin token for security
# In a production app, this would be set in environment variables
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(16))
logger.info(f"Admin Token: {ADMIN_TOKEN} (Keep this secure)")

# Dictionary to store QA chains by session ID
qa_chains = {}
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(temp_dir, exist_ok=True)

# Document metadata storage
documents = {}

# System prompts storage with enhanced templates
system_prompts = {
    "default": {
        "id": "default",
        "name": "Enhanced Analysis",
        "prompt": """You are a precise AI assistant that provides detailed, accurate answers based on the document content.

Your task is to:
1. Thoroughly analyze all provided document excerpts
2. Extract factual information directly from the text
3. Synthesize information into a coherent, comprehensive answer
4. Provide specific references to document sections when possible
5. Maintain the original meaning and intent of the document

You MUST:
- Prioritize factual accuracy above all else
- Include exact quotes when they provide value
- Avoid generating information not present in the document
- Clearly indicate any ambiguities or limitations in the source material
- Focus on directly answering the question with the most relevant information

Document Excerpts:
{context}

Question: {question}

Step 1: Consider what the question is asking for.
Step 2: Find the most relevant information in the document excerpts.
Step 3: Organize the information into a coherent response.
Step 4: Provide a clear, factual answer citing specific parts of the document where appropriate.

Answer:""",
        "temperature": 0.0,
        "description": "Optimized for accurate, factual responses with document references"
    },
    "concise": {
        "id": "concise",
        "name": "Concise Summary",
        "prompt": """You are a precise assistant that provides brief, direct answers.

Your task is to:
1. Identify the exact information requested in the question
2. Extract only the most relevant facts from the document excerpts
3. Create a succinct, focused response using 1-3 sentences where possible
4. Include only essential information directly related to the question

You MUST:
- Be extremely concise while remaining accurate
- Prioritize brevity without sacrificing important details
- Avoid vague statements or generalizations
- Provide direct answers without unnecessary elaboration
- Use simple, clear language

Document Excerpts:
{context}

Question: {question}

Provide only the essential information needed to answer the question:""",
        "temperature": 0.0,
        "description": "Optimized for short, direct answers with maximum factual density"
    }
}

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
# Post-processing functions for improved output quality
# =============================================================================
def post_process_answer(answer):
    """Apply post-processing to improve answer quality."""
    # Remove repetitive sentences
    sentences = re.split(r'(?<=[.!?])\s+', answer)
    unique_sentences = []
    sentence_set = set()
    
    for sentence in sentences:
        # Normalize the sentence for comparison (lowercase, remove extra spaces)
        normalized = ' '.join(sentence.lower().split())
        if normalized not in sentence_set and normalized:
            sentence_set.add(normalized)
            unique_sentences.append(sentence)
    
    # Reconstruct the answer with unique sentences
    cleaned_answer = ' '.join(unique_sentences)
    
    # Format lists consistently
    list_pattern = r'(\d+\.\s*)'
    if re.search(list_pattern, cleaned_answer):
        cleaned_answer = re.sub(r'(\d+\.\s*)(?=\w)', r'\n\1', cleaned_answer)
    
    # Fix common formatting issues
    cleaned_answer = re.sub(r'\s+', ' ', cleaned_answer)  # Remove extra spaces
    cleaned_answer = re.sub(r'\s+([.,;:])', r'\1', cleaned_answer)  # Fix punctuation spacing
    
    return cleaned_answer

def fact_check_answer(answer, source_documents):
    """Basic fact checking against source documents.
    Note: This is a simplified version - a production system would use more sophisticated methods.
    """
    # Get the answer's main claims
    claims = re.split(r'(?<=[.!?])\s+', answer)
    checked_claims = []
    
    for claim in claims:
        if not claim.strip():
            continue
            
        # Check if we can find evidence for this claim in the source documents
        found_evidence = False
        for doc in source_documents:
            if claim.lower() in doc.lower():
                checked_claims.append(claim)
                found_evidence = True
                break
                
        if not found_evidence:
            # Mark claims without direct evidence
            checked_claims.append(f"{claim} [Note: This information may need verification]")
    
    return ' '.join(checked_claims)

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
# Initialize the QA Chain using document type-specific loaders
# =============================================================================
def initialize_qa_chain(filepath, model_checkpoint, prompt_id="default", temperature=0.0):
    try:
        # Determine the document type based on file extension
        file_extension = os.path.splitext(filepath)[1].lower()
        
        # Select appropriate loader based on file type
        if file_extension == '.pdf':
            loader = PyPDFLoader(filepath)
            documents = loader.load()
        elif file_extension == '.docx':
            loader = Docx2txtLoader(filepath)
            documents = loader.load()
        elif file_extension in ['.xlsx', '.xls']:
            loader = UnstructuredExcelLoader(filepath, mode="elements")
            documents = loader.load()
        else:
            raise ValueError(f"Unsupported file type: {file_extension}. Supported formats are PDF, DOCX, XLSX, and XLS.")
            
        logger.info(f"Successfully loaded {file_extension} document from {filepath}")
    except Exception as e:
        logger.exception(f"Error loading document: {str(e)}")
        raise ValueError(f"Failed to load the document. The error was: {str(e)}")

    try:
        # Optimized chunking parameters for better semantic coherence
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,  # Balanced chunk size for semantic coherence
            chunk_overlap=200, # Higher overlap to maintain context between chunks
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        splits = text_splitter.split_documents(documents)
        logger.info(f"Document split into {len(splits)} chunks")
    except Exception as e:
        logger.exception("Error splitting document: %s", str(e))
        raise ValueError("Failed to split the document for processing.")

    try:
        # Use more powerful embeddings for better semantic matching
        embeddings = SentenceTransformerEmbeddings(model_name="all-mpnet-base-v2")
        
        # Build FAISS index with optimized parameters
        vectordb = FAISS.from_documents(
            splits, 
            embeddings,
            # Using a higher M value for better quality retrieval
            distance_strategy="cosine"
        )
    except Exception as e:
        logger.exception("Error creating embeddings/vector store: %s", str(e))
        raise ValueError("Failed to create embeddings or vector store.")

    try:
        # Get the system prompt
        prompt_template = system_prompts.get(prompt_id, system_prompts["default"])
        
        # Create prompt template
        custom_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=prompt_template["prompt"]
        )
        
        # Initialize the Ollama LLM using the selected local model with temperature
        llm = Ollama(
            model=model_checkpoint, 
            temperature=float(temperature),
            num_ctx=8192,  # Increased context window for handling more content
            num_predict=2048  # Increased token generation limit
        )
    except Exception as e:
        logger.exception("Error initializing the Ollama LLM: %s", str(e))
        raise ValueError("Failed to initialize the language model. Check your model configuration.")

    try:
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectordb.as_retriever(
                search_kwargs={"k": 7}  # Retrieve more chunks for better context
            ),
            chain_type_kwargs={"prompt": custom_prompt}
        )
        return qa_chain, vectordb
    except Exception as e:
        logger.exception("Error creating QA chain: %s", str(e))
        raise ValueError("Failed to initialize the QA chain.")

# =============================================================================
# Process Query with Streaming Output and Improved Accuracy
# =============================================================================
def process_answer(query, qa_chain, vectordb=None, enhance_factual_accuracy=True, max_new_tokens=1024):
    callback_handler = StreamingCallbackHandler()
    try:
        # Get the relevant document chunks for fact checking if needed
        source_documents = []
        if vectordb and enhance_factual_accuracy:
            source_documents = [doc.page_content for doc in vectordb.similarity_search(query, k=5)]
        
        # Pass the callback handler to the chain's run method.
        final_output = qa_chain.run(query, callbacks=[callback_handler])
        
        # Apply post-processing to improve quality
        processed_output = post_process_answer(final_output)
        
        # Optionally apply fact checking
        if enhance_factual_accuracy and source_documents:
            processed_output = fact_check_answer(processed_output, source_documents)
        
        return processed_output, callback_handler.tokens
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

@app.route('/api/system-prompts', methods=['GET'])
def get_system_prompts():
    """Get all available system prompts."""
    try:
        return jsonify({"prompts": list(system_prompts.values())})
    except Exception as e:
        logger.exception("Error fetching system prompts: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/select-document', methods=['POST'])
def select_document():
    """Select a document and initialize QA chain for it."""
    data = request.json
    document_id = data.get('document_id')
    model = data.get('model')
    prompt_id = data.get('prompt_id', 'default')
    temperature = data.get('temperature', 0.0)
    retrieval_options = data.get('retrieval_options', {})
    
    if not document_id:
        return jsonify({"error": "Missing document_id"}), 400
    
    if not model:
        return jsonify({"error": "No model selected"}), 400
    
    if document_id not in documents:
        return jsonify({"error": "Document not found"}), 404
    
    try:
        document = documents[document_id]
        filepath = os.path.join(uploads_dir, document['filename'])
        
        # Initialize QA chain with prompt and temperature
        qa_chain, vectordb = initialize_qa_chain(filepath, model, prompt_id, temperature)
        qa_chains[document_id] = {
            "chain": qa_chain,
            "vectordb": vectordb,
            "retrieval_options": retrieval_options
        }
        
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
    enhance_factual_accuracy = data.get('enhance_factual_accuracy', True)
    max_new_tokens = data.get('max_new_tokens', 1024)
    
    if not session_id or not query_text:
        return jsonify({"error": "Missing session_id or query"}), 400
    
    if session_id not in qa_chains:
        return jsonify({"error": "Session not found or expired"}), 404
    
    try:
        qa_chain_data = qa_chains[session_id]
        qa_chain = qa_chain_data["chain"]
        vectordb = qa_chain_data.get("vectordb")
        
        result, tokens = process_answer(
            {"query": query_text}, 
            qa_chain, 
            vectordb,
            enhance_factual_accuracy,
            max_new_tokens
        )
        
        return jsonify({
            "answer": result,
            "tokens": tokens,  # For streaming support in frontend
            "enhanced": enhance_factual_accuracy
        })
    except Exception as e:
        logger.exception("Error processing query: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a file and initialize QA chain for it."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    model = request.form.get('model')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not model:
        return jsonify({"error": "No model selected"}), 400
    
    try:
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(uploads_dir, filename)
        file.save(filepath)
        
        # Generate a unique session ID
        session_id = secrets.token_hex(16)
        
        # Initialize QA chain
        qa_chain, vectordb = initialize_qa_chain(filepath, model)
        qa_chains[session_id] = {
            "chain": qa_chain,
            "vectordb": vectordb
        }
        
        return jsonify({
            "success": True,
            "message": "File uploaded and processed successfully",
            "session_id": session_id
        })
    except Exception as e:
        logger.exception("Error uploading file: %s", str(e))
        return jsonify({"error": str(e)}), 500

# =============================================================================
# Admin Routes
# =============================================================================

@app.route('/admin/validate-token', methods=['POST'])
def admin_validate_token():
    """Validate the admin token."""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"valid": False, "error": "No token provided"}), 400
    
    is_valid = validate_admin_token(token)
    return jsonify({"valid": is_valid})

@app.route('/admin/token', methods=['GET'])
def admin_token():
    """Return the admin token for setup purposes."""
    return jsonify({"admin_token": ADMIN_TOKEN})

@app.route('/admin/upload', methods=['POST'])
def admin_upload():
    """Admin route to upload files and initialize QA chains for them."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Check if file is present in the request
    if 'file' not in request.files:
        logger.error("No file part in the request")
        return jsonify({"error": "No file provided"}), 400
    
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
        logger.info(f"Saved file: {filepath}")
        
        # Get file extension
        file_extension = os.path.splitext(filename)[1].lower()
        
        # Process supported file types
        supported_extensions = ['.pdf', '.docx', '.xlsx', '.xls']
        if file_extension in supported_extensions:
            # Generate a unique document ID
            document_id = os.path.splitext(filename)[0] + '_' + secrets.token_hex(4)
            logger.info(f"Processing {file_extension} file: {filename}, ID: {document_id}")
            
            # Initialize QA chain with temperature 0
            qa_chain, vectordb = initialize_qa_chain(filepath, model, "default", 0.0)
            qa_chains[document_id] = {
                "chain": qa_chain,
                "vectordb": vectordb
            }
            
            # Store document metadata
            documents[document_id] = {
                "id": document_id,
                "title": title,
                "description": description,
                "filename": filename,
                "file_type": file_extension[1:].upper(),  # Store file type without the dot
                "model": model,
                "created_at": str(datetime.now())
            }
            
            return jsonify({
                "success": True,
                "message": f"{file_extension[1:].upper()} document processed successfully",
                "document": documents[document_id]
            })
        else:
            # Remove unsupported file
            os.remove(filepath)
            return jsonify({
                "error": f"Unsupported file type: {file_extension}. Supported formats are: {', '.join(supported_extensions)}"
            }), 400
            
    except Exception as e:
        logger.exception("Error processing file: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/admin/system-prompts', methods=['GET'])
def admin_get_system_prompts():
    """Admin route to get all system prompts."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    return jsonify({"prompts": list(system_prompts.values())})

@app.route('/admin/system-prompts', methods=['POST'])
def admin_create_system_prompt():
    """Admin route to create a new system prompt."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    name = data.get('name')
    prompt_template = data.get('prompt')
    temperature = data.get('temperature', 0.0)
    description = data.get('description', '')
    
    if not name or not prompt_template:
        return jsonify({"error": "Missing name or prompt template"}), 400
    
    try:
        # Generate a unique prompt ID
        prompt_id = name.lower().replace(' ', '_') + '_' + secrets.token_hex(4)
        
        # Store prompt
        system_prompts[prompt_id] = {
            "id": prompt_id,
            "name": name,
            "prompt": prompt_template,
            "temperature": float(temperature),
            "description": description
        }
        
        return jsonify({
            "success": True,
            "message": "System prompt created successfully",
            "prompt": system_prompts[prompt_id]
        })
    except Exception as e:
        logger.exception("Error creating system prompt: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/admin/system-prompts/<prompt_id>', methods=['PUT'])
def admin_update_system_prompt(prompt_id):
    """Admin route to update a system prompt."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    if prompt_id not in system_prompts:
        return jsonify({"error": "System prompt not found"}), 404
    
    data = request.json
    name = data.get('name')
    prompt_template = data.get('prompt')
    temperature = data.get('temperature', 0.0)
    description = data.get('description', '')
    
    if not name or not prompt_template:
        return jsonify({"error": "Missing name or prompt template"}), 400
    
    try:
        # Update prompt
        system_prompts[prompt_id] = {
            "id": prompt_id,
            "name": name,
            "prompt": prompt_template,
            "temperature": float(temperature),
            "description": description
        }
        
        return jsonify({
            "success": True,
            "message": "System prompt updated successfully",
            "prompt": system_prompts[prompt_id]
        })
    except Exception as e:
        logger.exception("Error updating system prompt: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/admin/system-prompts/<prompt_id>', methods=['DELETE'])
def admin_delete_system_prompt(prompt_id):
    """Admin route to delete a system prompt."""
    # Validate admin token
    token = request.headers.get('Authorization')
    if not token or not validate_admin_token(token.replace('Bearer ', '')):
        return jsonify({"error": "Unauthorized"}), 401
    
    if prompt_id not in system_prompts:
        return jsonify({"error": "System prompt not found"}), 404
    
    # Don't allow deleting default prompts
    if prompt_id in ["default", "concise"]:
        return jsonify({"error": "Cannot delete default system prompts"}), 400
    
    try:
        # Delete prompt
        del system_prompts[prompt_id]
        
        return jsonify({
            "success": True,
            "message": "System prompt deleted successfully"
        })
    except Exception as e:
        logger.exception("Error deleting system prompt: %s", str(e))
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
    if path.startswith("api/") or path.startswith("admin/"):
        # Let the Flask routes handle API and admin requests
        return {"error": "Not Found"}, 404
    
    # For all other routes, serve the React app
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
