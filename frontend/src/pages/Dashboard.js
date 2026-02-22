import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, LogOut, Upload, Car, MapPin, Shield } from 'lucide-react';

function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                Accident Detection System
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Road Accident Detection System
          </h1>
          <p className="text-gray-600 text-lg">
            Report road accidents quickly and easily. Our AI-powered system will analyze your
            images and send them to administrators for verification.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/report">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Report Accident</h2>
                  <p className="text-gray-600">Upload image and location</p>
                </div>
              </div>
              <p className="text-gray-600">
                Quickly report a road accident by uploading an image. Our AI will analyze it
                and notify administrators.
              </p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition inline-block">
                Report Now 
              </div>
            </div>
          </Link>

          <Link to="/my-reports">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
                  <p className="text-gray-600">View your submissions</p>
                </div>
              </div>
              <p className="text-gray-600">
                Track the status of your accident reports and see the verification results
                from administrators.
              </p>
              <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition inline-block">
                View Reports 
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Upload Image</h3>
              <p className="text-gray-600 text-sm">
                Take a photo of the accident scene and upload it through our secure platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our advanced AI model analyzes the image to detect if an accident occurred.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Admin Review</h3>
              <p className="text-gray-600 text-sm">
                Administrators verify the report and you'll receive a notification of the result.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Safety First</h3>
              <p className="text-yellow-700 text-sm">
                Always prioritize your safety and the safety of others. Only take photos if it's
                safe to do so. In case of emergency, call emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
