import React, { useState } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';
import { reportsAPI, getCurrentLocation } from '../services/api';

/**
 * SOSButton - Emergency quick report button
 * Allows instant accident reporting with one click
 */
function SOSButton({ onSuccess }) {
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSOSClick = async () => {
    if (!window.confirm(' EMERGENCY: Report accident at your current location?\n\nThis will:\n- Get your GPS location\n- Send emergency report to admin\n- Alert emergency services')) {
      return;
    }

    setLoading(true);
    setSosActive(true);

    try {
      // Get current location
      const location = await getCurrentLocation();

      // Prepare form data (simplified - no camera)
      const formData = new FormData();
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('address', 'Emergency SOS Location');
      formData.append('description', ' EMERGENCY SOS REPORT - Immediate assistance required!');

      // Submit report
      await reportsAPI.create(formData);

      alert(' Emergency report sent successfully!\n\nEmergency services have been notified.');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('SOS Error:', error);
      alert(' Failed to send emergency report. Please try manual reporting.');
    } finally {
      setLoading(false);
      setSosActive(false);
    }
  };

  return (
    <div>
      {/* Floating SOS Button */}
      <button
        onClick={handleSOSClick}
        disabled={loading}
        className={`fixed bottom-8 right-8 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 z-50 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : sosActive
            ? 'bg-yellow-500 animate-pulse'
            : 'bg-red-600 hover:bg-red-700 animate-bounce'
        }`}
        title="Emergency SOS - Quick Report"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
        ) : (
          <AlertTriangle className="w-10 h-10 text-white" />
        )}
      </button>

      {/* SOS Label */}
      <div className="fixed bottom-[120px] right-8 text-center z-50 pointer-events-none">
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm">
           SOS
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Emergency<br/>Report
        </div>
      </div>

      {/* SOS Instructions (when active) */}
      {sosActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="animate-pulse">
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 EMERGENCY REPORT
              </h2>
              <p className="text-gray-600 mb-4">
                Sending emergency report...
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Getting location
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOSButton;
