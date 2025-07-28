import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # In production, use service account key
    # For development, you can use default credentials
    try:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
    except:
        # Fallback for local development without credentials
        print("Warning: Firebase Admin SDK not initialized. Auth will be bypassed in development.")

security = HTTPBearer()

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify Firebase ID token and return user info
    """
    try:
        # Extract the token
        token = credentials.credentials
        
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token['uid']
        
        return {
            "uid": user_id,
            "email": decoded_token.get('email'),
            "email_verified": decoded_token.get('email_verified', False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {str(e)}"
        )

async def get_current_user(user_data = Depends(verify_firebase_token)):
    """
    Get current authenticated user
    """
    return user_data

# Optional: For development/testing without auth
async def get_current_user_optional():
    """
    Development mode - returns a test user
    Use this for testing when Firebase is not set up
    """
    return {
        "uid": "test_user_123",
        "email": "test@example.com",
        "email_verified": True
    }