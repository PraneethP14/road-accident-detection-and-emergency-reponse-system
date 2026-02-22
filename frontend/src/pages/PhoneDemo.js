import React, { useState } from 'react';

function PhoneDemo() {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [phoneError, setPhoneError] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
           PHONE NUMBER FEATURE DEMO 
        </h1>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
             Phone Number Implementation Complete!
          </h2>
          
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Features Implemented:</h3>
            <ul className="space-y-2 text-green-700">
              <li> Phone number collection in UserMobileApp</li>
              <li> Phone number validation (10-digit Indian numbers)</li>
              <li> Phone number display in AdminPortal</li>
              <li> SMS notifications on approve/reject</li>
              <li> Ambulance ETA calculation</li>
              <li> SMS status tracking</li>
            </ul>
          </div>
          
          <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Phone Number Input:</h3>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-700 font-bold">+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-16 pr-4 py-3 text-lg border-2 border-blue-500 rounded-lg font-bold"
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
            <p className="mt-2 text-sm text-blue-600">
              Current phone: +91 {phoneNumber}
            </p>
          </div>
          
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">Access URLs:</h3>
            <div className="space-y-2 text-yellow-700">
              <p> <strong>Main App:</strong> <a href="/" className="underline">http://localhost:3000/</a></p>
              <p> <strong>Web Form:</strong> <a href="/report-accident" className="underline">http://localhost:3000/report-accident</a></p>
              <p> <strong>Dashboard:</strong> <a href="/dashboard" className="underline">http://localhost:3000/dashboard</a></p>
              <p> <strong>Admin Portal:</strong> <a href="/admin" className="underline">http://localhost:3000/admin</a></p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-semibold">
               All phone number and SMS features have been successfully implemented!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneDemo;
