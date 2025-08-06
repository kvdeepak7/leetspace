# routes/auth.py

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from typing import Dict, Any
from db.mongo import db
from schemas.user import UserCreate, UserLogin, UserResponse, Token, RefreshToken, UserInDB
from auth.jwt_auth import verify_password, get_password_hash, create_tokens, verify_token
from auth.dependencies import get_current_active_user
from bson import ObjectId

router = APIRouter()

users_collection = db["users"]

@router.post("/register", response_model=Dict[str, Any])
async def register_user(user: UserCreate):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username is taken
    existing_username = await users_collection.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    user_dict = jsonable_encoder(user)
    user_dict["hashed_password"] = get_password_hash(user.password)
    del user_dict["password"]  # Remove plain password
    user_dict["is_active"] = True
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Create tokens
    tokens = create_tokens(user_id, user.email)
    
    # Return user data and tokens
    user_response = UserResponse(
        id=user_id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        is_active=True,
        created_at=user_dict["created_at"]
    )
    
    return {
        "user": user_response,
        "tokens": tokens,
        "message": "User registered successfully"
    }

@router.post("/login", response_model=Dict[str, Any])
async def login_user(user_credentials: UserLogin):
    """
    Login user and return JWT tokens
    """
    # Find user by email
    user_doc = await users_collection.find_one({"email": user_credentials.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    
    # Create tokens
    user_id = str(user_doc["_id"])
    tokens = create_tokens(user_id, user_doc["email"])
    
    # Update last login
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Return user data and tokens
    user_response = UserResponse(
        id=user_id,
        email=user_doc["email"],
        username=user_doc["username"],
        full_name=user_doc.get("full_name"),
        is_active=user_doc["is_active"],
        created_at=user_doc["created_at"]
    )
    
    return {
        "user": user_response,
        "tokens": tokens,
        "message": "Login successful"
    }

@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_data: RefreshToken):
    """
    Refresh access token using refresh token
    """
    try:
        # Verify refresh token
        token_data = verify_token(refresh_data.refresh_token, "refresh")
        
        # Get user from database
        user_doc = await users_collection.find_one({"_id": ObjectId(token_data.user_id)})
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Check if user is still active
        if not user_doc.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled"
            )
        
        # Create new tokens
        tokens = create_tokens(token_data.user_id, token_data.email)
        
        return Token(**tokens)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: UserInDB = Depends(get_current_active_user)):
    """
    Get current user profile
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.post("/logout")
async def logout_user(current_user: UserInDB = Depends(get_current_active_user)):
    """
    Logout user (client should delete tokens)
    """
    return {"message": "Logout successful"}

@router.delete("/delete-account")
async def delete_user_account(current_user: UserInDB = Depends(get_current_active_user)):
    """
    Delete user account and all associated data
    """
    try:
        # Delete all user's problems
        problems_collection = db["problems"]
        await problems_collection.delete_many({"user_id": current_user.id})
        
        # Delete user account
        result = await users_collection.delete_one({"_id": ObjectId(current_user.id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )