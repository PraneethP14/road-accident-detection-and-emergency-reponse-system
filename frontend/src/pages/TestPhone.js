import React, { useState } from 'react';
import { Phone } from 'lucide-react';

function TestPhone() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Number Test
          </h3>
          
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
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
               {phoneError}
            </p>
          )}
          
          {phoneNumber && !phoneError && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
               Valid phone number: +91 {phoneNumber}
            </p>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
             Get ambulance ETA and status updates via SMS
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestPhone;
