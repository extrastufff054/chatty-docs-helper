
import os
import secrets
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Generate a random admin token for security
# In a production app, this would be set in environment variables
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(16))

def validate_admin_token(token):
    """
    Validate the admin token
    
    Args:
        token (str): The token to validate
        
    Returns:
        bool: True if the token is valid, False otherwise
    """
    logger.debug(f"Validating token: {token[:5]}... against {ADMIN_TOKEN[:5]}...")
    
    if not token:
        logger.warning("Empty token provided")
        return False
        
    is_valid = token == ADMIN_TOKEN
    
    if not is_valid:
        logger.warning("Invalid admin token provided")
    else:
        logger.debug("Admin token validated successfully")
        
    return is_valid
