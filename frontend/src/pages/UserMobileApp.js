import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, Upload, Loader, CheckCircle, Video, Phone } from 'lucide-react';
import { reportsAPI, getCurrentLocation } from '../services/api';
import { Link } from 'react-router-dom';

/**
 * USER MOBILE APPLICATION
 * Features: Camera - GPS - SOS - Phone Number for SMS
 * No login required!
 */
function UserMobileApp() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [location, setLocation] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sosMode, setSosMode] = useState(false);

  // Auto-get GPS location
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
    } catch (error) {
      console.error('GPS error:', error);
    }
  };

  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return false;
    }
    if (!/^[6-9]/.test(cleanNumber)) {
      setPhoneError('Phone number must start with 6, 7, 8, or 9');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value) {
      validatePhoneNumber(value);
    } else {
      setPhoneError('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = selectedFile.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert(`File too large! Max ${selectedFile.type.startsWith('video/') ? '50MB' : '10MB'}`);
        return;
      }

      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
      } else {
        alert('Only images and videos allowed!');
        return;
      }

      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSOS = async () => {
    if (!window.confirm(' EMERGENCY SOS! Send accident report immediately?')) {
      return;
    }

    setSosMode(true);
    setLoading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      if (location) {
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
      } else {
        // Get location immediately for SOS
        try {
          const coords = await getCurrentLocation();
          formData.append('latitude', coords.latitude);
          formData.append('longitude', coords.longitude);
        } catch (e) {
          // Use default location if GPS fails
          formData.append('latitude', 13.1692);
          formData.append('longitude', 77.5592);
        }
      }
      formData.append('description', ' EMERGENCY SOS REPORT');

      console.log(' Sending SOS...');
      const response = await reportsAPI.create(formData);
      console.log(' SOS sent successfully:', response.data);
      
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setFilePreview(null);
        setFileType(null);
        setSosMode(false);
      }, 5000);
    } catch (error) {
      console.error(' SOS error:', error);
      setLoading(false);
      alert(`Failed to send SOS! ${error.response?.data?.detail || 'Please try again.'}`);
      setSosMode(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please capture or upload media first!');
      return;
    }

    if (!location) {
      alert('GPS location required!');
      return;
    }

    if (!phoneNumber) {
      alert('Phone number required for SMS updates!');
      return;
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('description', 'Accident report from mobile app');
      if (phoneNumber) {
        formData.append('phone_number', `+91${phoneNumber.replace(/\D/g, '')}`);
      }

      console.log(' Submitting report...');
      const response = await reportsAPI.create(formData);
      console.log(' Report submitted successfully:', response.data);
      
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setFilePreview(null);
        setFileType(null);
        setPhoneNumber('');
        setPhoneError('');
      }, 5000); // Increased to 5 seconds
    } catch (error) {
      console.error(' Submit error:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
      alert(`Failed to submit report! ${error.response?.data?.detail || error.message}`);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center transform scale-100 animate-bounce-in">
          <div className="animate-pulse">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4"> Report Sent!</h2>
          <p className="text-xl text-gray-600 mb-3">Emergency services have been notified</p>
          {phoneNumber && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 font-semibold"> SMS updates will be sent to:</p>
              <p className="text-blue-600">+91 {phoneNumber}</p>
            </div>
          )}
          <div className="mt-6 bg-green-100 rounded-lg p-4">
            <p className="text-green-800 font-semibold"> Help is on the way!</p>
            <p className="text-sm text-green-600 mt-1">You'll receive ambulance ETA via SMS</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">Returning to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
           User Mobile App
        </h1>
        <p className="text-white/80 text-center">Camera - GPS - SOS - Phone Number - SMS Notifications</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Phone Number - PROMINENT POSITION */}
        <div className="bg-yellow-400 border-4 border-yellow-600 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="w-6 h-6" />
             MOBILE NUMBER (REQUIRED) 
          </h3>
          <p className="text-sm text-gray-700 mb-3 font-semibold">
            Enter your phone number to receive AMBULANCE ETA via SMS!
          </p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-6 w-6 text-gray-600" />
            </div>
            <div className="absolute inset-y-0 left-12 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-700 font-bold text-lg">+91</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`w-full pl-24 pr-4 py-4 text-lg border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-transparent outline-none transition font-bold ${
                phoneError ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="9876543210"
              maxLength={10}
              required
            />
          </div>
          
          {phoneError && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {phoneError}
              </p>
            </div>
          )}
          
          {phoneNumber && !phoneError && (
            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700 font-bold flex items-center gap-2">
                 Valid phone number: +91 {phoneNumber}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                 Get ambulance ETA and status updates via SMS
              </p>
            </div>
          )}
        </div>

        {/* Camera/Video Upload */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Capture Media
          </h3>

          {filePreview ? (
            <div className="space-y-4">
              {fileType === 'image' ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={filePreview}
                  controls
                  className="w-full h-64 rounded-lg"
                />
              )}
              <button
                onClick={() => {
                  setFile(null);
                  setFilePreview(null);
                  setFileType(null);
                }}
                className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Camera className="w-12 h-12 text-gray-400" />
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Take photo or video</p>
              <input
                type="file"
                accept="image/*,video/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700"
              >
                Open Camera
              </label>
              <p className="text-sm text-gray-500 mt-2">Or select from gallery</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file || !location || !phoneNumber || phoneError}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
              loading || !file || !location || !phoneNumber || phoneError
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Submit Report
              </span>
            )}
          </button>

          {/* SOS Button */}
          <button
            onClick={handleSOS}
            disabled={loading}
            className={`w-full py-6 rounded-xl font-bold text-white text-xl transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 shadow-2xl animate-pulse'
            }`}
          >
            <span className="flex items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8" />
               EMERGENCY SOS 
            </span>
          </button>
        </div>

        {/* Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white text-sm text-center">
          <p>No login required - Instant emergency reporting</p>
        </div>
      </div>
    </div>
  );
}

export default UserMobileApp;
