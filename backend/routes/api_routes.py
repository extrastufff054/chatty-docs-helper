
import logging
import secrets
from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

from backend.storage import documents, qa_chains
from backend.utils.ollama_utils import get_ollama_models
from backend.utils.document_loader import load_document
from backend.utils.qa_chain import initialize_qa_chain, process_answer

logger = logging.getLogger(__name__)

def register_api_routes(app):
    """Register API routes with the Flask app"""
    
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
        # Always use temperature 0.0 regardless of what is provided in the request
        temperature = 0.0
        
        if not document_id:
            return jsonify({"error": "Missing document_id"}), 400
        
        if not model:
            return jsonify({"error": "No model selected"}), 400
        
        if document_id not in documents:
            return jsonify({"error": "Document not found"}), 404
        
        try:
            document = documents[document_id]
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], document['filename'])
            
            # Load the document
            loaded_documents = load_document(filepath)
            
            # Initialize QA chain with prompt and fixed temperature 0.0
            qa_chain = initialize_qa_chain(loaded_documents, model, prompt_id, temperature)
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
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Generate a unique session ID
            session_id = secrets.token_hex(16)
            
            # Load the document
            loaded_documents = load_document(filepath)
            
            # Initialize QA chain
            qa_chain = initialize_qa_chain(loaded_documents, model)
            qa_chains[session_id] = qa_chain
            
            return jsonify({
                "success": True,
                "message": "File uploaded and processed successfully",
                "session_id": session_id
            })
        except Exception as e:
            logger.exception("Error uploading file: %s", str(e))
            return jsonify({"error": str(e)}), 500
