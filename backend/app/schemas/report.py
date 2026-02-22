"""
Report request/response schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..models.report import ReportStatus, LocationModel, PredictionModel


class ReportCreate(BaseModel):
    """Schema for creating a report"""
    latitude: float
    longitude: float
    address: Optional[str] = None
    description: Optional[str] = None


class ReportResponse(BaseModel):
    """Schema for report response"""
    id: str = Field(..., alias="_id")
    user_id: str
    user_email: str
    user_name: str
    image_path: Optional[str] = None
    image_filename: Optional[str] = None
    location: LocationModel
    prediction: PredictionModel
    status: ReportStatus
    admin_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    description: Optional[str] = None
    phone_number: Optional[str] = None
    
    # Ambulance dispatch information
    ambulance_number: Optional[str] = None
    eta: Optional[str] = None
    hospital_name: Optional[str] = None
    severity_level: Optional[str] = None
    
    # SMS notification fields
    sms_status: Optional[str] = None  # 'sent', 'failed', 'pending', 'no_phone'
    sms_sent_at: Optional[datetime] = None
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        from_attributes = True


class ReportUpdate(BaseModel):
    """Schema for updating report status"""
    status: ReportStatus
    admin_notes: Optional[str] = None


class ReportStats(BaseModel):
    """Schema for report statistics"""
    total_reports: int
    pending_reports: int
    approved_reports: int
    rejected_reports: int
    total_accidents_detected: int
    accuracy_rate: float
