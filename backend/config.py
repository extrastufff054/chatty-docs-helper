
import os
import logging

logger = logging.getLogger(__name__)

def configure_app(app):
    """
    Configure Flask application settings
    
    Args:
        app: The Flask application instance
    """
    # Set up maximum content length for file uploads (50 MB)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    
    # Set up upload and temporary directories
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Define directories
    uploads_dir = os.path.join(base_dir, "uploads")
    temp_dir = os.path.join(base_dir, "temp")
    
    # Ensure directories exist
    for directory in [uploads_dir, temp_dir]:
        if not os.path.exists(directory):
            try:
                os.makedirs(directory)
                logger.info(f"Created directory: {directory}")
            except Exception as e:
                logger.error(f"Failed to create directory {directory}: {str(e)}")
    
    # Set directory configurations
    app.config['UPLOAD_FOLDER'] = uploads_dir
    app.config['TEMP_FOLDER'] = temp_dir
    
    logger.info(f"Uploads directory configured: {app.config['UPLOAD_FOLDER']}")
    logger.info(f"Temp directory configured: {app.config['TEMP_FOLDER']}")
