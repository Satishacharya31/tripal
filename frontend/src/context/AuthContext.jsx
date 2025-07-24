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
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
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
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
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
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchUser(); // Refetch user to get updated data
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
    updateProfile,
    fetchUser // export fetchUser for Google OAuth callback
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
