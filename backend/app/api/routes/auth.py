"""
Authentication routes
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta

from ...schemas.user import UserCreate, UserLogin, UserResponse, Token
from ...models.user import UserModel
from ...core.security import verify_password, get_password_hash, create_access_token
from ...core.database import get_users_collection
from ...core.config import settings
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Register a new user
    
    Args:
        user_data: User registration data
        
    Returns:
        Created user information
    """
    users_collection = await get_users_collection()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = user_data.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["is_active"] = True
    user_dict["is_admin"] = False
    
    user_model = UserModel(**user_dict)
    
    # Insert to database
    result = await users_collection.insert_one(user_model.model_dump(by_alias=True, exclude={"id"}))
    
    # Get created user
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    created_user["_id"] = str(created_user["_id"])
    
    return created_user


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """
    User login
    
    Args:
        login_data: Login credentials
        
    Returns:
        Access token
    """
    users_collection = await get_users_collection()
    
    # Find user
    user = await users_collection.find_one({"email": login_data.email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user["email"],
            "user_id": str(user["_id"]),
            "is_admin": user.get("is_admin", False)
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/admin/login", response_model=Token)
async def admin_login(login_data: UserLogin):
    """
    Admin login
    
    Args:
        login_data: Admin credentials
        
    Returns:
        Access token
    """
    users_collection = await get_users_collection()
    
    # Find admin user
    user = await users_collection.find_one({"email": login_data.email, "is_admin": True})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Verify password
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user["email"],
            "user_id": str(user["_id"]),
            "is_admin": True
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
