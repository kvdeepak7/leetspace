# auth/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from db.mongo import db
from auth.jwt_auth import verify_token
from schemas.user import UserInDB, TokenData
from bson import ObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """
    Dependency to get the current authenticated user from JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify the token
        token_data: TokenData = verify_token(credentials.credentials, "access")
        
        # Get user from database
        users_collection = db["users"]
        user_doc = await users_collection.find_one({"_id": ObjectId(token_data.user_id)})
        
        if user_doc is None:
            raise credentials_exception
            
        # Check if user is active
        if not user_doc.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled"
            )
        
        # Convert to UserInDB model
        user_doc["id"] = str(user_doc["_id"])
        del user_doc["_id"]
        
        return UserInDB(**user_doc)
        
    except Exception as e:
        raise credentials_exception

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Dependency to get the current active user
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    return current_user

def get_optional_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[UserInDB]:
    """
    Optional dependency to get current user (for endpoints that can work with or without auth)
    """
    if credentials is None:
        return None
    
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None