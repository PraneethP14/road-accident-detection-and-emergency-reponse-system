import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Calendar, Loader, TrendingUp } from 'lucide-react';
import { reportsAPI } from '../services/api';

function AdminDashboard({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(null); // null, 'pending', 'approved', 'rejected'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsResponse, statsResponse] = await Promise.all([
        reportsAPI.getAllReports(0, 100, filter),
        reportsAPI.getStats(),
      ]);
      setReports(reportsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reportId, adminNotes = '') => {
    setActionLoading(reportId);
    try {
      await reportsAPI.approveReport(reportId, adminNotes || null);
      await fetchData();
    } catch (err) {
      setError('Failed to approve report');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reportId) => {
    const adminNotes = prompt('Enter reason for rejection (optional):');
    setActionLoading(reportId);
    try {
      await reportsAPI.rejectReport(reportId, adminNotes || null);
      await fetchData();
    } catch (err) {
      setError('Failed to reject report');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        text: 'Pending',
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

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white flex items-center gap-3">
          <Loader className="w-8 h-8 animate-spin" />
          <span className="text-xl">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Admin: {user.email}</span>
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-800">
              x
            </button>
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_reports}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending_reports}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved_reports}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">AI Accuracy</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.accuracy_rate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Loader className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Reports Found</h2>
            <p className="text-gray-600">No reports match the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="lg:w-80 flex-shrink-0">
                      <img
                        src={`http://localhost:8000/${report.image_path}`}
                        alt="Accident"
                        className="w-full h-64 object-cover rounded-lg"
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
                          <div>
                            <span className="text-sm text-gray-600">Reported by:</span>
                            <span className="ml-2 font-medium text-gray-800">{report.user_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({report.user_email})</span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1 justify-end">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                          <div>{new Date(report.created_at).toLocaleTimeString()}</div>
                        </div>
                      </div>

                      {/* AI Prediction */}
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">AI Analysis:</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Prediction:</span>
                            <span className={`ml-2 font-semibold ${
                              report.prediction.is_accident ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {report.prediction.is_accident ? 'ACCIDENT' : 'NO ACCIDENT'}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Confidence:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                              {(report.prediction.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Accident Probability:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                              {(report.prediction.accident_probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Non-Accident Probability:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                              {(report.prediction.non_accident_probability * 100).toFixed(1)}%
                            </span>
                          </div>
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
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {report.admin_notes && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm font-medium text-purple-700 mb-1">Admin Notes:</p>
                          <p className="text-sm text-purple-600">{report.admin_notes}</p>
                          <p className="text-xs text-purple-500 mt-2">
                            By: {report.reviewed_by} on {new Date(report.reviewed_at).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {report.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(report._id)}
                            disabled={actionLoading === report._id}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                          >
                            {actionLoading === report._id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(report._id)}
                            disabled={actionLoading === report._id}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                          >
                            {actionLoading === report._id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-5 h-5" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}
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

export default AdminDashboard;
