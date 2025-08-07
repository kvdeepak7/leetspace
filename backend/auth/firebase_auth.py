# auth/firebase_auth.py

import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        # Try to get service account from environment variable
        service_account_key = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        
        if service_account_key:
            # Parse the service account key from JSON string
            try:
                service_account_info = json.loads(service_account_key)
                cred = credentials.Certificate(service_account_info)
            except json.JSONDecodeError:
                raise Exception("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Should be valid JSON.")
        else:
            # Try to get from file path
            service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
            if os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
            else:
                # Use default credentials (works in Google Cloud environment)
                cred = credentials.ApplicationDefault()
        
        firebase_admin.initialize_app(cred)

# Initialize Firebase on module import
initialize_firebase()

async def verify_firebase_token(id_token: str) -> dict:
    """
    Verify Firebase ID token and return user information
    """
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        
        # Extract user information
        user_info = {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture"),
            "firebase_claims": decoded_token
        }
        
        return user_info
        
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_firebase_user(uid: str) -> dict:
    """
    Get Firebase user information by UID
    """
    try:
        user_record = auth.get_user(uid)
        return {
            "uid": user_record.uid,
            "email": user_record.email,
            "email_verified": user_record.email_verified,
            "display_name": user_record.display_name,
            "photo_url": user_record.photo_url,
            "disabled": user_record.disabled,
            "created_at": user_record.user_metadata.creation_timestamp,
            "last_sign_in": user_record.user_metadata.last_sign_in_timestamp,
        }
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )