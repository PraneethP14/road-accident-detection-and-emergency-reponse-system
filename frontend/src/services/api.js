/**
 * API service for backend communication
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and debug logging
api.interceptors.request.use(
  (config) => {
    console.log('🔍 API REQUEST DEBUG:');
    console.log('   Method:', config.method?.toUpperCase());
    console.log('   URL:', config.url);
    console.log('   Headers:', config.headers);
    console.log('   Data type:', typeof config.data);
    console.log('   Data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('🔍 API RESPONSE DEBUG:');
    console.log('   Status:', response.status);
    console.log('   URL:', response.config.url);
    console.log('   Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API RESPONSE ERROR:');
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    
    // Don't auto-redirect on 401 - allow anonymous access
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - continuing as anonymous user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

// Reports API
export const reportsAPI = {
  create: (formData) => {
    return api.post('/reports/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserReports: (skip = 0, limit = 100) => 
    api.get(`/reports/user?skip=${skip}&limit=${limit}`),
  getAllReports: (skip = 0, limit = 100, status = null) => {
    let url = `/reports/all?skip=${skip}&limit=${limit}`;
    if (status) url += `&status_filter=${status}`;
    return api.get(url);
  },
  getReport: (reportId) => api.get(`/reports/${reportId}`),
  updateReport: (reportId, data) => api.put(`/reports/${reportId}`, data),
  approveReport: (reportId, formData) => 
    api.put(`/reports/${reportId}/approve`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  rejectReport: (reportId, formData) => 
    api.put(`/reports/${reportId}/reject`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteReport: (reportId) => api.delete(`/reports/${reportId}`),
  getStats: () => api.get('/reports/stats/overview'),
  testSMS: (phoneNumber) => {
    const formData = new FormData();
    formData.append('phone_number', phoneNumber);
    return api.post('/reports/test-sms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSMSStatus: () => api.get('/reports/sms-status'),
};

// Get current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// Get address from coordinates using reverse geocoding
export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    // Using OpenStreetMap Nominatim API (free)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    return response.data.display_name || 'Address not found';
  } catch (error) {
    console.error('Error getting address:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

export default api;
