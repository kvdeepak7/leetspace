# auth/firebase_auth_dev.py

# Development-only Firebase auth that skips token verification
# DO NOT USE IN PRODUCTION

from fastapi import HTTPException, status
import base64
import json

async def verify_firebase_token(id_token: str) -> dict:
    """
    Development-only token verification that extracts user info without validation
    WARNING: This is insecure and should only be used for development/testing
    """
    try:
        # Split the token to get the payload
        parts = id_token.split('.')
        if len(parts) != 3:
            raise ValueError("Invalid token format")
        
        # Decode the payload (middle part)
        payload_b64 = parts[1]
        # Add padding if needed
        missing_padding = len(payload_b64) % 4
        if missing_padding:
            payload_b64 += '=' * (4 - missing_padding)
        
        payload_bytes = base64.urlsafe_b64decode(payload_b64)
        payload = json.loads(payload_bytes)
        
        # Extract user information from token payload
        user_info = {
            "uid": payload.get("user_id", payload.get("sub")),
            "email": payload.get("email"),
            "email_verified": payload.get("email_verified", False),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
            "firebase_claims": payload
        }
        
        if not user_info["uid"]:
            raise ValueError("No user ID in token")
        
        return user_info
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase ID token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_firebase_user(uid: str) -> dict:
    """
    Mock function for development - returns basic user info
    """
    return {
        "uid": uid,
        "email": f"{uid}@example.com",
        "email_verified": True,
        "display_name": f"User {uid}",
        "photo_url": None,
        "disabled": False,
        "created_at": None,
        "last_sign_in": None,
    }