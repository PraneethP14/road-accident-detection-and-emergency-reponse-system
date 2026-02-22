"""
User request/response schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: str  # Changed from EmailStr to avoid email-validator dependency
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: str  # Changed from EmailStr to avoid email-validator dependency
    password: str


class UserResponse(UserBase):
    """Schema for user response"""
    id: str = Field(..., alias="_id")
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        populate_by_name = True
        from_attributes = True


class UserUpdate(BaseModel):
    """Schema for updating user"""
    full_name: Optional[str] = None
    phone: Optional[str] = None


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data"""
    email: Optional[str] = None
    user_id: Optional[str] = None
    is_admin: bool = False
