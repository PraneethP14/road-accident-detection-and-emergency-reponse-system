"""
Accident Report database model - Pydantic v2 compatible
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId
from enum import Enum


class ReportStatus(str, Enum):
    """Report status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class LocationModel(BaseModel):
    """Location coordinates"""
    latitude: float
    longitude: float
    address: Optional[str] = None


class PredictionModel(BaseModel):
    """ML prediction details"""
    is_accident: bool
    confidence: float
    accident_probability: Optional[float] = None
    non_accident_probability: Optional[float] = None
    
    class Config:
        extra = 'allow'  # Allow extra fields from predictors


class ReportModel(BaseModel):
    """Accident report model for database"""
    
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    user_email: str
    user_name: str
    
    # Image details
    image_path: Optional[str] = None  # Optional for SOS without image
    image_filename: Optional[str] = None
    
    # Location
    location: LocationModel
    
    # ML Prediction
    prediction: PredictionModel
    
    # Status and review
    status: ReportStatus = ReportStatus.PENDING
    admin_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    
    # Description
    description: Optional[str] = None
    
    # User phone number for notifications
    phone_number: Optional[str] = None
    
    # Ambulance dispatch information
    ambulance_eta_minutes: Optional[int] = None
    ambulance_number: Optional[str] = None
    hospital_name: Optional[str] = None
    severity_level: Optional[str] = None
    estimated_arrival: Optional[str] = None
    
    # Notification tracking
    sms_sent_at: Optional[datetime] = None
    sms_status: Optional[str] = None  # 'sent', 'failed', 'pending'
    
    # Timestamps
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
                "user_email": "user@example.com",
                "user_name": "John Doe",
                "location": {
                    "latitude": 37.7749,
                    "longitude": -122.4194,
                    "address": "San Francisco, CA"
                },
                "description": "Car accident at intersection",
                "status": "pending"
            }
        }
    }
