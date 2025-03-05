
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

# Catch-all route to serve the frontend application
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the frontend application for any route.
    This ensures that routes like /admin are handled by the React Router.
    """
    if path and os.path.exists(os.path.join('public', path)):
        # For static files that exist, serve them directly
        return send_from_directory('public', path)
    elif path and '.' in path:
        # For other assets that don't exist, return 404
        logger.warning(f"File not found: {path}")
        return "Not found", 404
    
    # For all other routes including /admin, serve the index.html
    # This allows React Router to handle the routing client-side
    logger.info(f"Serving index.html for path: {path}")
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000...")
    app.run(debug=True, host='0.0.0.0', port=5000)
