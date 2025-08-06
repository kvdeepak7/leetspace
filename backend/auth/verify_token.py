# auth/verify_token.py

# This file is kept for backward compatibility
# All Firebase authentication logic has been moved to firebase_auth.py
# Use firebase_auth.py for token verification and user management

from .firebase_auth import verify_firebase_token, get_firebase_user

__all__ = ["verify_firebase_token", "get_firebase_user"]