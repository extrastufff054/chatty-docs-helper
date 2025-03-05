
import logging
import secrets
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

from backend.auth import ADMIN_TOKEN, validate_admin_token
from backend.storage import documents, qa_chains, system_prompts
from backend.utils.document_loader import load_document
from backend.utils.qa_chain import initialize_qa_chain

logger = logging.getLogger(__name__)

def register_admin_routes(app):
    """Register admin routes with the Flask app"""
    
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
            uploads_dir = app.config['UPLOAD_FOLDER']
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
                
                # Load the document
                loaded_documents = load_document(filepath)
                
                # Initialize QA chain with temperature 0
                qa_chain = initialize_qa_chain(loaded_documents, model, "default", 0.0)
                qa_chains[document_id] = qa_chain
                
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
            uploads_dir = app.config['UPLOAD_FOLDER']
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
