"""
SMS Notification Service for Accident Detection System
Handles sending SMS notifications for approved/rejected reports with ambulance ETA
"""

import os
import math
import logging
from typing import Dict, Any
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False

logger = logging.getLogger(__name__)

class SMSService:
    """SMS notification service using Twilio or other SMS providers"""
    
    def __init__(self):
        """Initialize SMS service with configuration"""
        self.twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        self.enabled = bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_phone_number)
        
        if self.enabled:
            logger.info("SMS service initialized with Twilio")
        else:
            logger.warning("SMS service disabled - missing Twilio credentials")
            logger.info("Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env")
    
    def calculate_ambulance_eta(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Calculate estimated ambulance arrival time based on location
        Returns ETA in minutes and distance in km
        """
        try:
            # Simplified ETA calculation based on urban/rural classification
            # In production, this would use real mapping APIs like Google Maps
            
            # For demo purposes, we'll use a simple distance-based calculation
            # Assuming ambulance comes from nearest hospital at city center
            
            # Default city center coordinates (can be configured)
            hospital_lat = os.getenv('HOSPITAL_LAT', '12.9716')  # Bangalore default
            hospital_lon = os.getenv('HOSPITAL_LON', '77.5946')
            
            # Calculate distance using Haversine formula
            distance_km = self._calculate_distance(
                float(hospital_lat), float(hospital_lon),
                latitude, longitude
            )
            
            # Average ambulance speed: 40 km/h in city, 80 km/h on highway
            # Assume mixed conditions: 50 km/h average
            avg_speed_kmh = 50
            
            # Calculate base ETA in minutes
            eta_minutes = (distance_km / avg_speed_kmh) * 60
            
            # Add traffic factor (simplified)
            traffic_factor = 1.2 if distance_km < 10 else 1.1  # More traffic in city
            eta_minutes *= traffic_factor
            
            # Add preparation time (5 minutes for dispatch)
            eta_minutes += 5
            
            # Round to nearest minute
            eta_minutes = max(5, int(eta_minutes))  # Minimum 5 minutes
            
            return {
                'eta_minutes': eta_minutes,
                'distance_km': round(distance_km, 2),
                'estimated_arrival': (datetime.now() + timedelta(minutes=eta_minutes)).strftime('%I:%M %p'),
                'traffic_factor': traffic_factor
            }
            
        except Exception as e:
            logger.error(f"Error calculating ETA: {e}")
            # Fallback ETA
            return {
                'eta_minutes': 15,
                'distance_km': 5.0,
                'estimated_arrival': (datetime.now() + timedelta(minutes=15)).strftime('%I:%M %p'),
                'traffic_factor': 1.0
            }
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        lat_diff = math.radians(lat2 - lat1)
        lon_diff = math.radians(lon2 - lon1)
        
        a = (math.sin(lat_diff / 2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(lon_diff / 2) ** 2)
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance
    
    def send_approval_notification(self, phone_number: str, report_data: Dict[str, Any]) -> bool:
        """
        Send SMS notification for approved accident report with ambulance ETA
        """
        if not self.enabled or not phone_number:
            logger.warning("SMS service disabled or no phone number provided")
            return False
        
        try:
            # Get ambulance dispatch information
            ambulance_number = report_data.get('ambulance_number', 'Dispatched')
            hospital_name = report_data.get('hospital_name', 'Nearest Hospital')
            severity_level = report_data.get('severity_level', 'moderate').upper()
            
            # Calculate ambulance ETA
            location = report_data.get('location', {})
            eta_info = self.calculate_ambulance_eta(
                location.get('latitude', 0),
                location.get('longitude', 0)
            )
            
            # Use provided ETA if available, otherwise use calculated
            eta_minutes = report_data.get('ambulance_eta_minutes', eta_info['eta_minutes'])
            estimated_arrival = report_data.get('estimated_arrival', eta_info['estimated_arrival'])
            
            # Create optimized, shorter message for faster delivery
            message = f"""🚨 ACCIDENT APPROVED
Ambulance: {ambulance_number}
ETA: {eta_minutes} min
Hospital: {hospital_name}
Status: Help dispatched
Report ID: {report_data.get('_id', 'Unknown')[-6:]}
Stay safe - Emergency services notified"""
            
            # Send SMS via Twilio
            return self._send_sms(phone_number, message)
            
        except Exception as e:
            logger.error(f"Error sending approval notification: {e}")
            return False
    
    def send_rejection_notification(self, phone_number: str, report_data: Dict[str, Any]) -> bool:
        """
        Send SMS notification for rejected accident report
        """
        if not self.enabled or not phone_number:
            logger.warning("SMS service disabled or no phone number provided")
            return False
        
        try:
            admin_notes = report_data.get('admin_notes', 'No additional information provided')
            
            message = f"""Report Reviewed - No emergency response
ID: {report_data.get('_id', 'Unknown')}
Status: {admin_notes[:50] if admin_notes else 'No action needed'}
Thank you for your report"""
            
            return self._send_sms(phone_number, message)
            
        except Exception as e:
            logger.error(f"Error sending rejection notification: {e}")
            return False
    
    def _send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS using Twilio API"""
        try:
            from twilio.rest import Client
            
            client = Client(self.twilio_account_sid, self.twilio_auth_token)
            
            # Clean phone number format
            phone_number = phone_number.strip()
            
            # Format phone number properly for Twilio (requires +CountryCode format)
            if not phone_number.startswith('+'):
                # Check if it's a 10-digit Indian number (without country code)
                if len(phone_number) == 10 and phone_number.isdigit():
                    # Add India country code
                    phone_number = f'+91{phone_number}'
                # Check if it's already 12 digits with country code prefix (91XXXXXXXXXX)
                elif len(phone_number) == 12 and phone_number.startswith('91'):
                    phone_number = f'+{phone_number}'
                # Otherwise, assume it needs country code
                elif not phone_number.startswith('+'):
                    phone_number = f'+91{phone_number}'
            
            logger.info(f"Sending SMS to {phone_number}")
            logger.info(f"Message: {message[:50]}...")
            
            message_obj = client.messages.create(
                body=message,
                from_=self.twilio_phone_number,
                to=phone_number
            )
            
            logger.info(f"SMS sent successfully to {phone_number}")
            logger.info(f"Message SID: {message_obj.sid}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending SMS via Twilio: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def send_judge_presentation_reminder(self, phone_number: str, judge_name: str = "Judge", presentation_time: str = None) -> bool:
        """
        Send SMS reminder to judge about today's presentation
        """
        if not self.enabled or not phone_number:
            logger.warning("SMS service disabled or no phone number provided")
            return False
        
        try:
            from datetime import datetime
            current_time = datetime.now().strftime('%I:%M %p')
            current_date = datetime.now().strftime('%B %d, %Y')
            
            presentation_time = presentation_time or current_time
            
            message = f"""🎓 JUDGES PRESENTATION REMINDER

Dear {judge_name},
Today is the Accident Detection System Presentation!

Date: {current_date}
Time: {presentation_time}
Venue: Admin Portal - http://localhost:3000/admin

Your evaluation and feedback are highly valued.
Please join us for this important demonstration.

System Status: Ready for presentation
Contact: +91XXXXXXXXXX for any queries

Thank you for your time and expertise."""
            
            return self._send_sms(phone_number, message)
            
        except Exception as e:
            logger.error(f"Error sending judge presentation reminder: {e}")
            return False

    def send_test_notification(self, phone_number: str) -> bool:
        """Send a test SMS to verify service is working"""
        if not self.enabled:
            logger.warning("SMS service disabled")
            return False
        
        try:
            message = f"""Test Notification - Accident Detection System

This is a test message from the Accident Detection System.
If you receive this, SMS notifications are working correctly.

Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
System Status: Operational"""
            
            return self._send_sms(phone_number, message)
            
        except Exception as e:
            logger.error(f"Error sending test notification: {e}")
            return False

# Global SMS service instance
sms_service = SMSService()
