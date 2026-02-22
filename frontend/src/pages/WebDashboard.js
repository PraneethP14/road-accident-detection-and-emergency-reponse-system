import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, MapPin, Clock, Activity, Phone, Camera } from 'lucide-react';
import { reportsAPI } from '../services/api';
import MapComponent from '../components/MapComponent';
import { Link } from 'react-router-dom';

/**
 * WEB DASHBOARD
 * Features: Incident Analytics
 * Public access - no login required!
 */
function WebDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24'); // hours

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        reportsAPI.getStats(),
        reportsAPI.getAllReports(0, 50, null),
      ]);
      
      setStats(statsRes.data);
      
      // Filter by time
      const now = new Date();
      const filterTime = new Date(now.getTime() - parseInt(timeFilter) * 60 * 60 * 1000);
      const filtered = reportsRes.data.filter(r => new Date(r.created_at) >= filterTime);
      setReports(filtered);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const recentAccidents = reports.filter(r => r.prediction.is_accident);
  const severity = {
    high: reports.filter(r => r.admin_notes?.includes('SEVERE')).length,
    medium: reports.filter(r => r.admin_notes?.includes('MODERATE')).length,
    low: reports.filter(r => r.admin_notes?.includes('MINOR')).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <BarChart3 className="w-10 h-10 text-blue-600" />
                Web Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Incident Analytics - Real-time Monitoring</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link 
                to="/report-accident"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Report Accident
              </Link>
              <Link 
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
              >
                <Camera className="w-5 h-5" />
                Mobile App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Time Filter */}
        <div className="flex justify-end gap-2">
          {['6', '12', '24', '48'].map(hours => (
            <button
              key={hours}
              onClick={() => setTimeFilter(hours)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === hours
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last {hours}h
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Reports</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats?.total || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recent Accidents</p>
                <p className="text-4xl font-bold text-red-600 mt-2">{recentAccidents.length}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{stats?.pending || 0}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{stats?.approved || 0}</p>
              </div>
              <Activity className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Severity Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-red-700 font-medium"> High Severity</span>
                <span className="text-gray-600">{severity.high}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-red-600 h-4 rounded-full transition-all"
                  style={{ width: `${reports.length > 0 ? (severity.high / reports.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-yellow-700 font-medium"> Medium Severity</span>
                <span className="text-gray-600">{severity.medium}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-yellow-600 h-4 rounded-full transition-all"
                  style={{ width: `${reports.length > 0 ? (severity.medium / reports.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-green-700 font-medium"> Low Severity</span>
                <span className="text-gray-600">{severity.low}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${reports.length > 0 ? (severity.low / reports.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Accidents List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Recent Accident Reports
          </h3>
          
          {recentAccidents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent accidents reported</p>
          ) : (
            <div className="space-y-4">
              {recentAccidents.slice(0, 5).map((report, index) => (
                <div key={report._id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-red-600">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-gray-800">
                            AI Confidence: {(report.prediction.confidence * 100).toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Map */}
        {recentAccidents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Latest Accident Location
            </h3>
            <MapComponent
              latitude={recentAccidents[0].location.latitude}
              longitude={recentAccidents[0].location.longitude}
              height="400px"
            />
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Live Updates</span>
      </div>
    </div>
  );
}

export default WebDashboard;
