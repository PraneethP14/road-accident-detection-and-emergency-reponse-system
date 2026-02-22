#!/usr/bin/env python3
"""
Working SMS service integration for approval/rejection
"""
import os
from twilio.rest import Client
from typing import Optional
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

class WorkingSMSService:
    def __init__(self):
        self.twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN') 
        self.twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        self.enabled = bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)
    
    def send_approval_notification(self, phone_number: str, report_data: dict) -> bool:
        """
        Send SMS notification for approved report
        """
        if not self.enabled or not phone_number:
            return False
        
        try:
            client = Client(self.twilio_account_sid, self.twilio_auth_token)
            
            # Simple ASCII-only message to avoid Unicode issues
            ambulance = report_data.get('ambulance_number', 'Not assigned')
            eta = report_data.get('eta', 'Not specified')
            hospital = report_data.get('hospital_name', 'Not specified')
            
            message_body = f"""ACCIDENT REPORT APPROVED
Ambulance: {ambulance}
ETA: {eta} minutes
Hospital: {hospital}
Your report has been approved and help is on the way.
Thank you for using the Accident Detection System."""
            
            message = client.messages.create(
                body=message_body,
                from_=self.twilio_phone_number,
                to=f"+91{phone_number}"
            )
            
            print(f"SMS sent successfully for approval. SID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"SMS approval notification failed: {str(e)}")
            return False
    
    def send_rejection_notification(self, phone_number: str, report_data: dict) -> bool:
        """
        Send SMS notification for rejected report
        """
        if not self.enabled or not phone_number:
            return False
        
        try:
            client = Client(self.twilio_account_sid, self.twilio_auth_token)
            
            # Simple ASCII-only message to avoid Unicode issues
            admin_notes = report_data.get('admin_notes', 'No additional information provided')
            
            message_body = f"""ACCIDENT REPORT UPDATE
Your report has been reviewed.
Status: Rejected
Note: {admin_notes}
Thank you for your report. For emergency assistance, call emergency services directly."""
            
            message = client.messages.create(
                body=message_body,
                from_=self.twilio_phone_number,
                to=f"+91{phone_number}"
            )
            
            print(f"SMS sent successfully for rejection. SID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"SMS rejection notification failed: {str(e)}")
            return False
    
    def test_sms_service(self, test_phone: str = "9606848038") -> bool:
        """
        Test SMS service functionality
        """
        if not self.enabled:
            print("SMS service is not configured")
            return False
        
        try:
            client = Client(self.twilio_account_sid, self.twilio_auth_token)
            
            message_body = f"""TEST MESSAGE - Accident Detection System
This is a test message to verify SMS notifications are working.
If you receive this, SMS functionality is operational.
Time: {str(datetime.now())}"""
            
            message = client.messages.create(
                body=message_body,
                from_=self.twilio_phone_number,
                to=f"+91{test_phone}"
            )
            
            print(f"Test SMS sent. SID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"Test SMS failed: {str(e)}")
            return False

# Create global instance
sms_service = WorkingSMSService()

print(f"SMS Service initialized. Enabled: {sms_service.enabled}")
