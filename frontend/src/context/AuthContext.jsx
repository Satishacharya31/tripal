import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { apiPaths } from '../utils/apiPaths';
import storage from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const fetchUser = async () => {
    const token = storage.get('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(apiPaths.getMe);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Session check failed:', error);
      storage.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const response = await api.post(apiPaths.login, { email, password });
      const { token, data } = response.data;
      storage.set('token', token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (userData) => {
    setIsAuthenticating(true);
    try {
      const response = await api.post(apiPaths.register, userData);
      const { token, data } = response.data;
      storage.set('token', token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await api.post(apiPaths.logout);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      storage.remove('token');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put(apiPaths.updateProfile, profileData);
      setUser(prevUser => ({ ...prevUser, ...response.data.data.user }));
      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Profile update error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Profile update failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticating,
    login,
    register,
    logout,
    updateProfile,
    fetchUser // export fetchUser for Google OAuth callback
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
