import React, { createContext, useContext, useState, useEffect } from 'react';

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
    try {
      const response = await fetch(`/api/auth/me`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      await fetchUser();
      setLoading(false);
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchUser();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (userData) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchUser();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`/api/auth/logout`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticating,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
