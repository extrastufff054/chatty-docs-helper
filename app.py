
import logging
import os
import secrets
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from backend.config import configure_app
from backend.auth import ADMIN_TOKEN
from backend.routes.admin_routes import register_admin_routes
from backend.routes.api_routes import register_api_routes
from backend.storage import setup_storage

# Set up logging.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure app settings
configure_app(app)

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Set up storage directories
setup_storage()

# Log admin token for first-time setup
logger.info(f"Admin Token: {ADMIN_TOKEN} (Keep this secure)")

# Register route blueprints
register_admin_routes(app)
register_api_routes(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve the frontend application."""
    if path != "" and os.path.exists(os.path.join('public', path)):
        return send_from_directory('public', path)
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
