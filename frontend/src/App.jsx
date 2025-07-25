import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TouristDashboard from './pages/TouristDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GuideDashboard from './pages/GuideDashboard';
import ProfilePage from './pages/ProfilePage';
import GuideProfilePage from './pages/GuideProfilePage';
import TouristProfilePage from './pages/TouristProfilePage';
import DestinationForm from './pages/DestinationForm';
import RequestForm from './pages/RequestForm';
import CompleteProfilePage from './pages/CompleteProfilePage';
import DestinationManagementPage from './pages/DestinationManagementPage';
import GuideVerificationPage from './pages/GuideVerificationPage';
import GuideProfileEdit from './pages/GuideProfileEdit';
import UserManagementPage from './pages/UserManagementPage';
import AdminViewUserProfilePage from './pages/AdminViewUserProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function ProtectedRoute({ children, allowedRoles, adminOnly = false, allowIncomplete = false }) {
  const { user, loading, isAuthenticating } = useAuth();
  
  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.profileIncomplete && !allowIncomplete) {
    return <Navigate to="/complete-profile" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function GuestRoute({ children }) {
  const { user, loading, isAuthenticating } = useAuth();

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Publicly viewable guide profile for tourists and others */}
        <Route path="/guides/:id" element={<GuideProfilePage />} />
        {/* Publicly viewable tourist profile for guides */}
        <Route path="/tourists/:id" element={<TouristProfilePage />} />
        {/* Admin create/edit destination form */}
        <Route path="/admin/destinations" element={<ProtectedRoute adminOnly><DestinationManagementPage /></ProtectedRoute>} />
        <Route path="/admin/destinations/new" element={<ProtectedRoute adminOnly><DestinationForm /></ProtectedRoute>} />
        <Route path="/admin/destinations/:id/edit" element={<ProtectedRoute adminOnly><DestinationForm editMode={true} /></ProtectedRoute>} />
        <Route path="/admin/guides/verify" element={<ProtectedRoute adminOnly><GuideVerificationPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><UserManagementPage /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute adminOnly><AdminViewUserProfilePage /></ProtectedRoute>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/request" element={
          <ProtectedRoute allowedRoles={['tourist']}>
            <RequestForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : 
             user?.role === 'guide' ? <GuideDashboard /> : 
             <TouristDashboard />}
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/profile-edit" element={
          <ProtectedRoute allowedRoles={['guide']}>
            <GuideProfileEdit />
          </ProtectedRoute>
        } />
        <Route path="/complete-profile" element={
          <ProtectedRoute allowIncomplete>
            <CompleteProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
