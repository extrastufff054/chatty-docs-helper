
import os

def configure_app(app):
    """Configure Flask application settings"""
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB max upload
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    app.config['TEMP_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "temp")
