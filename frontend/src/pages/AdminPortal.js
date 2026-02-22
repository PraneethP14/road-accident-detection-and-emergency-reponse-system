import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, MapPin, Truck, Phone, AlertTriangle, Loader, Trash2, AlertCircle } from 'lucide-react';
import { reportsAPI } from '../services/api';
import MapComponent from '../components/MapComponent';

/**
 * ADMIN PORTAL
 * Features: Confirm/Dispatch
 * For emergency services/hospital staff
 */
function AdminPortal() {
  // State for reports and actions
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Dispatch form state
  const [ambulanceNumber, setAmbulanceNumber] = useState('');
  const [eta, setEta] = useState('');
  const [hospital, setHospital] = useState('');
  const [severity, setSeverity] = useState('moderate');

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [filter]);

  const fetchReports = async () => {
    try {
      console.log('Fetching reports with filter:', filter);
      const response = await reportsAPI.getAllReports(0, 100, filter === 'all' ? null : filter);
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle axios response structure
      let reportsData;
      if (response && response.data) {
        // Check if response.data is the reports array or contains it
        if (Array.isArray(response.data)) {
          reportsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          reportsData = response.data.data;
        } else if (response.data.data) {
          reportsData = response.data.data;
        } else {
          reportsData = [];
        }
      } else {
        reportsData = [];
      }
      
      console.log('Final reports array:', reportsData);
      console.log('Reports count:', reportsData.length);
      
      // Ensure it's an array
      const reportsArray = Array.isArray(reportsData) ? reportsData : [];
      
      // If no reports found with current filter, try getting all reports
      if (reportsArray.length === 0 && filter !== 'all') {
        console.log('No reports with current filter, trying all reports...');
        try {
          const allResponse = await reportsAPI.getAllReports(0, 100, null);
          let allReportsData;
          if (allResponse && allResponse.data) {
            if (Array.isArray(allResponse.data)) {
              allReportsData = allResponse.data;
            } else if (allResponse.data.data && Array.isArray(allResponse.data.data)) {
              allReportsData = allResponse.data.data;
            } else if (allResponse.data.data) {
              allReportsData = allResponse.data.data;
            } else {
              allReportsData = [];
            }
          }
          console.log('All reports fallback:', allReportsData);
          setReports(Array.isArray(allReportsData) ? allReportsData : []);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setReports(reportsArray);
        }
      } else {
        setReports(reportsArray);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      console.error('Error details:', error.response);
      setReports([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedReport) return;
    
    if (!ambulanceNumber || !eta || !hospital) {
      alert('Please fill all dispatch details!');
      return;
    }

    setActionLoading(true);
    try {
      // Create FormData for the approve endpoint
      const formData = new FormData();
      formData.append('ambulance_number', ambulanceNumber);
      formData.append('eta', eta);
      formData.append('hospital', hospital);
      formData.append('severity', severity);
      formData.append('phone_number', selectedReport.phone_number || '');
      
      // Use shorter adminNotes to prevent SMS failures
      const adminNotes = `Approved: Ambulance ${ambulanceNumber}, ETA ${eta}, Hospital: ${hospital}`;

      formData.append('admin_notes', adminNotes);

      // DEBUG: Log what we're sending
      console.log('🔍 ADMIN PORTAL DEBUG - Approval Request:');
      console.log('   Report ID:', selectedReport._id);
      console.log('   Phone Number:', selectedReport.phone_number);
      console.log('   FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`     ${key}: ${value}`);
      }

      // Use the reportsAPI instead of direct fetch
      console.log('📤 Sending approval request...');
      const response = await reportsAPI.approveReport(selectedReport._id, formData);

      console.log('📥 Approval response:', response);
      const updatedReport = response.data;

      console.log('📱 SMS Status:', updatedReport.sms_status);
      console.log('📨 Message:', updatedReport.message);

      alert(`Report CONFIRMED! Ambulance dispatched successfully.\n\nSMS notification sent to: ${selectedReport.phone_number || 'No phone number provided'}\nAmbulance: ${ambulanceNumber}\nETA: ${eta}`);
      
      // Reset form
      setSelectedReport(null);
      setAmbulanceNumber('');
      setEta('');
      setHospital('');
      setSeverity('moderate');
      
      // Refresh reports
      fetchReports();
    } catch (error) {
      console.error('❌ ADMIN PORTAL APPROVAL ERROR:', error);
      console.error('Error details:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      alert('Failed to confirm report! Please check the connection.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReport) return;

    const reason = prompt('Rejection reason:');
    if (!reason) return;

    setActionLoading(true);
    try {
      // Create FormData for the reject endpoint
      const formData = new FormData();
      formData.append('admin_notes', `REJECTED: ${reason}`);
      formData.append('phone_number', selectedReport.phone_number || '');
      
      // DEBUG: Log what we're sending
      console.log('🔍 ADMIN PORTAL DEBUG - Rejection Request:');
      console.log('   Report ID:', selectedReport._id);
      console.log('   Phone Number:', selectedReport.phone_number);
      console.log('   FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`     ${key}: ${value}`);
      }
      
      // Use the SMS-enabled reject endpoint
      console.log('📤 Sending rejection request...');
      const response = await reportsAPI.rejectReport(selectedReport._id, formData);

      console.log('📥 Rejection response:', response);
      const updatedReport = response.data;

      console.log('📱 SMS Status:', updatedReport.sms_status);
      console.log('📨 Message:', updatedReport.message);

      alert(`Report rejected. SMS notification sent to: ${selectedReport.phone_number || 'No phone number provided'}`);
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('❌ ADMIN PORTAL REJECTION ERROR:', error);
      console.error('Error details:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      alert('Failed to reject report! Please check the connection.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReport) return;

    const confirmed = window.confirm(
      ` Are you sure you want to DELETE this report permanently?\n\nReport #${selectedReport._id.slice(-6)}\nThis action CANNOT be undone!`
    );
    
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await reportsAPI.deleteReport(selectedReport._id);

      alert(' Report deleted successfully.');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      alert('Failed to delete report!');
      console.error('Delete error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickDelete = async (reportId, reportNumber, event) => {
    event.stopPropagation(); // Prevent selecting the report

    const confirmed = window.confirm(
      ` DELETE Report #${reportNumber}?\n\nThis action CANNOT be undone!`
    );
    
    if (!confirmed) return;

    try {
      await reportsAPI.deleteReport(reportId);
      alert(' Report deleted successfully.');
      
      // If the deleted report was selected, deselect it
      if (selectedReport?._id === reportId) {
        setSelectedReport(null);
      }
      
      fetchReports();
    } catch (error) {
      alert('Failed to delete report!');
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Shield className="w-10 h-10" />
                Admin Portal
              </h1>
              <p className="mt-2 text-white/90">Confirm/Dispatch - Emergency Response</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Reports List */}
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-2 mb-2">
                {['pending', 'approved', 'rejected', 'all'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      filter === f
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'pending' && <Clock className="w-4 h-4 inline mr-1" />}
                    {f === 'approved' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                    {f === 'rejected' && <XCircle className="w-4 h-4 inline mr-1" />}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchReports()}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                >
                   Refresh Reports
                </button>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                  {Array.isArray(reports) ? reports.length : 0} reports
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {!Array.isArray(reports) || reports.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-500">No reports found</p>
                </div>
              ) : (
                reports.map(report => (
                  <div
                    key={report._id}
                    onClick={() => setSelectedReport(report)}
                    className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all hover:shadow-2xl relative ${
                      selectedReport?._id === report._id ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {report.prediction.is_accident && (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-bold text-gray-800">
                          Report #{report._id.slice(-6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => handleQuickDelete(report._id, report._id.slice(-6), e)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                      </p>
                      <p>
                        AI: {report.prediction.is_accident ? 'ACCIDENT' : 'NO ACCIDENT'} ({(report.prediction.confidence * 100).toFixed(1)}%)
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Dispatch Panel */}
          <div className="space-y-4">
            {selectedReport ? (
              <>
                {/* Report Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Report Details</h3>
                  
                  <img
                    src={`http://localhost:8000/${selectedReport.image_path}`}
                    alt="Accident"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <strong>AI Prediction:</strong>
                      <span className={`px-2 py-1 rounded ${
                        selectedReport.prediction.is_accident
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedReport.prediction.is_accident ? 'ACCIDENT' : 'NO ACCIDENT'}
                      </span>
                    </p>
                    <p><strong>Confidence:</strong> {(selectedReport.prediction.confidence * 100).toFixed(1)}%</p>
                    <p><strong>Time:</strong> {new Date(selectedReport.created_at).toLocaleString()}</p>
                    
                    {/* User Information */}
                    <div className="border-t pt-2 mt-3">
                      <p className="font-semibold text-gray-700 mb-2">Reporter Information:</p>
                      <p><strong>Name:</strong> {selectedReport.user_name || 'Anonymous'}</p>
                      <p><strong>Email:</strong> {selectedReport.user_email || 'Not provided'}</p>
                      {selectedReport.phone_number ? (
                        <div className="mt-2 p-3 bg-green-100 border-2 border-green-300 rounded-lg">
                          <p className="flex items-center gap-2 font-bold text-green-800">
                            <Phone className="w-5 h-5" />
                             PHONE NUMBER: {selectedReport.phone_number}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                             SMS notifications will be sent to this number
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                          <p className="flex items-center gap-2 font-bold text-yellow-800">
                            <AlertCircle className="w-5 h-5" />
                             NO PHONE NUMBER PROVIDED
                          </p>
                          <p className="text-sm text-yellow-600 mt-1">
                             SMS notifications cannot be sent
                          </p>
                        </div>
                      )}
                      {selectedReport.description && (
                        <p><strong>Description:</strong> {selectedReport.description}</p>
                      )}
                    </div>

                    {/* SMS Notification Status */}
                    {selectedReport.phone_number && (
                      <div className="border-t pt-2 mt-3">
                        <p className="font-semibold text-gray-700 mb-2">SMS Notification Status:</p>
                        <div className={`p-2 rounded-lg border ${
                          selectedReport.sms_status === 'sent' ? 'bg-green-50 border-green-200' :
                          selectedReport.sms_status === 'failed' ? 'bg-red-50 border-red-200' :
                          selectedReport.sms_status === 'no_phone' ? 'bg-gray-50 border-gray-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}>
                          <p className="flex items-center gap-2 text-sm">
                            {selectedReport.sms_status === 'sent' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {selectedReport.sms_status === 'failed' && <XCircle className="w-4 h-4 text-red-600" />}
                            {selectedReport.sms_status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                            {selectedReport.sms_status === 'no_phone' && <AlertTriangle className="w-4 h-4 text-gray-600" />}
                            
                            <span className={`font-medium ${
                              selectedReport.sms_status === 'sent' ? 'text-green-700' :
                              selectedReport.sms_status === 'failed' ? 'text-red-700' :
                              selectedReport.sms_status === 'no_phone' ? 'text-gray-600' :
                              'text-yellow-700'
                            }`}>
                              {selectedReport.sms_status === 'sent' && 'SMS Sent Successfully'}
                              {selectedReport.sms_status === 'failed' && 'SMS Failed'}
                              {selectedReport.sms_status === 'pending' && 'SMS Pending'}
                              {selectedReport.sms_status === 'no_phone' && 'No Phone Number'}
                              {!selectedReport.sms_status && 'Not Processed'}
                            </span>
                          </p>
                          {selectedReport.sms_sent_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Sent at: {new Date(selectedReport.sms_sent_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ambulance Dispatch Information */}
                    {(selectedReport.ambulance_number || selectedReport.hospital_name || selectedReport.ambulance_eta_minutes) && (
                      <div className="border-t pt-2 mt-3">
                        <p className="font-semibold text-gray-700 mb-2">Ambulance Dispatch Details:</p>
                        <div className="space-y-1 text-sm">
                          {selectedReport.ambulance_number && (
                            <p><strong>Ambulance:</strong> {selectedReport.ambulance_number}</p>
                          )}
                          {selectedReport.hospital_name && (
                            <p><strong>Hospital:</strong> {selectedReport.hospital_name}</p>
                          )}
                          {selectedReport.ambulance_eta_minutes && (
                            <p><strong>ETA:</strong> {selectedReport.ambulance_eta_minutes} minutes</p>
                          )}
                          {selectedReport.severity_level && (
                            <p><strong>Severity:</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${
                              selectedReport.severity_level === 'minor' ? 'bg-green-100 text-green-800' :
                              selectedReport.severity_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>{selectedReport.severity_level.toUpperCase()}</span></p>
                          )}
                          {selectedReport.estimated_arrival && (
                            <p><strong>Expected Arrival:</strong> {selectedReport.estimated_arrival}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Location</h3>
                  <MapComponent
                    latitude={selectedReport.location.latitude}
                    longitude={selectedReport.location.longitude}
                    height="300px"
                  />
                </div>

                {/* Dispatch Form */}
                {selectedReport.status === 'pending' && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Truck className="w-6 h-6 text-green-600" />
                      Dispatch Emergency Services
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ambulance Number
                        </label>
                        <input
                          type="text"
                          value={ambulanceNumber}
                          onChange={(e) => setAmbulanceNumber(e.target.value)}
                          placeholder="e.g., AMB-101"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estimated Time of Arrival (ETA)
                        </label>
                        <input
                          type="text"
                          value={eta}
                          onChange={(e) => setEta(e.target.value)}
                          placeholder="e.g., 15 minutes"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hospital
                        </label>
                        <input
                          type="text"
                          value={hospital}
                          onChange={(e) => setHospital(e.target.value)}
                          placeholder="e.g., City General Hospital"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Severity Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['minor', 'moderate', 'severe'].map(s => (
                            <button
                              key={s}
                              onClick={() => setSeverity(s)}
                              className={`py-2 px-4 rounded-lg font-semibold transition ${
                                severity === s
                                  ? s === 'minor' ? 'bg-green-600 text-white' :
                                    s === 'moderate' ? 'bg-yellow-600 text-white' :
                                    'bg-red-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {s.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        {/* Confirm Button */}
                        <button
                          onClick={handleConfirm}
                          disabled={actionLoading}
                          className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          {actionLoading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              CONFIRM & DISPATCH
                            </>
                          )}
                        </button>

                        {/* Reject and Delete Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            REJECT
                          </button>

                          <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 disabled:bg-gray-400 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-5 h-5" />
                            DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already processed */}
                {selectedReport.status !== 'pending' && (
                  <div className={`rounded-xl shadow-lg p-6 ${
                    selectedReport.status === 'approved'
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-red-50 border-2 border-red-500'
                  }`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {selectedReport.status === 'approved' ? ' Already Dispatched' : ' Rejected'}
                    </h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg">
                      {selectedReport.admin_notes || 'No notes'}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a report to view details and dispatch</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Live Updates</span>
      </div>
    </div>
  );
}

export default AdminPortal;
