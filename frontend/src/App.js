import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserMobileApp from './pages/UserMobileApp';
import WebDashboard from './pages/WebDashboard';
import AdminPortal from './pages/AdminPortal';
import ReportAccident from './pages/ReportAccident';
import TestPhone from './pages/TestPhone';
import PhoneDemo from './pages/PhoneDemo';

/**
 * THREE SEPARATE WEBSITES - NO LOGIN REQUIRED!
 * 1. User Mobile App - Camera - GPS - SOS
 * 2. Web Dashboard - Incident Analytics
 * 3. Admin Portal - Confirm/Dispatch
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* User Mobile Application - Camera - GPS - SOS */}
        <Route path="/" element={<UserMobileApp />} />
        <Route path="/mobile" element={<UserMobileApp />} />
        
        {/* Report Accident - Web Form with Phone Number */}
        <Route path="/report-accident" element={<ReportAccident />} />
        <Route path="/report" element={<ReportAccident />} />
        
        {/* Test Phone Number Feature */}
        <Route path="/test-phone" element={<TestPhone />} />
        
        {/* Phone Number Demo */}
        <Route path="/phone-demo" element={<PhoneDemo />} />
        
        {/* Web Dashboard - Incident Analytics */}
        <Route path="/dashboard" element={<WebDashboard />} />
        <Route path="/analytics" element={<WebDashboard />} />
        
        {/* Admin Portal - Confirm/Dispatch */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/portal" element={<AdminPortal />} />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
