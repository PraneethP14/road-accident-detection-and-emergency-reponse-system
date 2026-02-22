import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Car, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Calendar, Loader } from 'lucide-react';
import { reportsAPI } from '../services/api';

function MyReports({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getUserReports();
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        text: 'Pending Review',
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        text: 'Approved',
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        text: 'Rejected',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  const getPredictionBadge = (isAccident, confidence) => {
    return isAccident ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
        <AlertCircle className="w-4 h-4" />
        Accident Detected ({(confidence * 100).toFixed(0)}%)
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <CheckCircle className="w-4 h-4" />
        No Accident ({(confidence * 100).toFixed(0)}%)
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white flex items-center gap-3">
          <Loader className="w-8 h-8 animate-spin" />
          <span className="text-xl">Loading reports...</span>
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
                <span className="text-xl font-bold text-gray-800">My Reports</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Reports Yet</h2>
            <p className="text-gray-600 mb-6">You haven't submitted any accident reports.</p>
            <Link
              to="/report"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Report an Accident
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-64 flex-shrink-0">
                      <img
                        src={`http://localhost:8000/${report.image_path}`}
                        alt="Accident"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="space-y-2">
                          {getStatusBadge(report.status)}
                          {getPredictionBadge(
                            report.prediction.is_accident,
                            report.prediction.confidence
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1 justify-end">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                          <div>{new Date(report.created_at).toLocaleTimeString()}</div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mb-4">
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {report.location.address || 'Location not available'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {report.description && (
                        <div className="mb-4">
                          <p className="text-gray-700">
                            <span className="font-medium">Description:</span> {report.description}
                          </p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {report.admin_notes && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-600">{report.admin_notes}</p>
                          {report.reviewed_by && (
                            <p className="text-xs text-gray-500 mt-2">
                              Reviewed by: {report.reviewed_by}
                            </p>
                          )}
                        </div>
                      )}

                      {/* AI Prediction Details */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">AI Analysis:</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Accident Probability:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                              {(report.prediction.accident_probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Confidence:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                              {(report.prediction.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
