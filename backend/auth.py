
import os
import secrets

# Generate a random admin token for security
# In a production app, this would be set in environment variables
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(16))

def validate_admin_token(token):
    """Validate the admin token"""
    return token == ADMIN_TOKEN
