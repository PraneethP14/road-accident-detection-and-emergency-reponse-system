"""
API dependencies for dependency injection
"""

from fastapi import Depends, HTTPException, status, UploadFile
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from typing import Optional
from bson import ObjectId

from ..core.security import decode_access_token
from ..core.database import get_users_collection
from ..schemas.user import TokenData
from ..core.config import settings

security = HTTPBearer(auto_error=False)  # Don't auto-error on missing token


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """
    Get current authenticated user (OPTIONAL - supports anonymous access)
    
    Args:
        credentials: HTTP Bearer credentials (optional)
        
    Returns:
        User document from database or None for anonymous users
        
    Raises:
        HTTPException: If token provided but invalid
    """
    # If no credentials provided, return None (anonymous user)
    if credentials is None:
        return None
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    try:
        payload = decode_access_token(credentials.credentials)
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if email is None or user_id is None:
            raise credentials_exception
        
        # Get user from database
        users_collection = await get_users_collection()
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user is None:
            raise credentials_exception
        
        if not user.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user"
            )
        
        return user
    except Exception:
        # If token is invalid, return None (allow anonymous)
        return None


async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Get current admin user
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Admin user document
        
    Raises:
        HTTPException: If user is not admin
    """
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required."
        )
    
    return current_user


def validate_image_file(file: UploadFile) -> UploadFile:
    """
    Validate uploaded image file
    
    Args:
        file: Uploaded file
        
    Returns:
        Validated file
        
    Raises:
        HTTPException: If file validation fails
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded"
        )
    
    # Check file extension
    filename = file.filename.lower()
    allowed_extensions = settings.ALLOWED_EXTENSIONS
    
    if not any(filename.endswith(f".{ext}") for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    return file
