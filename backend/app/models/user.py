"""
User database model - Pydantic v2 compatible
"""

from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


class UserModel(BaseModel):
    """User model for database"""
    
    id: Optional[str] = Field(default=None, alias="_id")
    email: str  # Changed from EmailStr to avoid email-validator dependency
    full_name: str
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @field_validator('id', mode='before')
    @classmethod
    def validate_object_id(cls, v):
        """Convert ObjectId to string"""
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "full_name": "John Doe",
                "phone": "+1234567890",
                "is_active": True,
                "is_admin": False
            }
        }
    }
