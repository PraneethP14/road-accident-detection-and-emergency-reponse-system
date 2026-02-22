import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, Loader, CheckCircle, AlertCircle, Car, Phone, X } from 'lucide-react';
import { reportsAPI, getCurrentLocation, getAddressFromCoords } from '../services/api';

function ReportAccident({ user, onLogout }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG images are allowed');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleGetLocation = async () => {
    setGettingLocation(true);
    setError('');

    try {
      const coords = await getCurrentLocation();
      setLocation(coords);

      // Get address from coordinates
      const addr = await getAddressFromCoords(coords.latitude, coords.longitude);
      setAddress(addr);
    } catch (err) {
      setError('Unable to get location. Please enable location services.');
    } finally {
      setGettingLocation(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please upload an image');
      return;
    }

    if (!location) {
      setError('Please allow location access');
      return;
    }

    if (!phoneNumber) {
      setError('Please provide your mobile number for SMS updates');
      return;
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('address', address);
      if (description) {
        formData.append('description', description);
      }
      if (phoneNumber) {
        formData.append('phone_number', `+91${phoneNumber.replace(/\D/g, '')}`);
      } else {
        formData.append('phone_number', '');
      }

      await reportsAPI.create(formData);
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/my-reports');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-get location on component mount
    handleGetLocation();
  }, []);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your accident report has been submitted successfully. An administrator will review it shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <Car className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">Report Accident</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Upload Accident Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-96 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">JPG or PNG (max 10MB)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                    >
                      Select Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Location *
              </label>
              {location ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-green-800 font-medium">Location captured</p>
                      <p className="text-sm text-green-600 mt-1">{address}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium"
                  >
                    Update Location
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  {gettingLocation ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5" />
                      Get Current Location
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Provide additional details about the accident..."
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Mobile Number <span className="text-red-500">*</span> (Required for SMS updates)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-10 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`w-full pl-20 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {phoneError}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                 Enter your 10-digit mobile number to receive ambulance ETA and status updates via SMS
              </p>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Why required?</strong> You'll receive instant SMS notifications when:
                </p>
                <ul className="text-xs text-blue-600 mt-1 space-y-1">
                  <li>- Your report is approved and ambulance is dispatched</li>
                  <li>- Ambulance ETA and arrival time</li>
                  <li>- Hospital details and emergency information</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !image || !location || !phoneNumber || phoneError}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                loading || !image || !location || !phoneNumber || phoneError
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      </div>
  );
}

export default ReportAccident;
