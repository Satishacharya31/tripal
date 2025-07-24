import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(endpoint, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        // Extract data based on possible keys
        let result = data.data?.destinations || data.data?.guides || data.data?.requests || data.data?.notifications || data.data || [];
        if (!Array.isArray(result)) {
          result = [];
        }
        setter(result);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(`/api/destinations`, setDestinations),
        fetchData(`/api/guides?limit=100`, setGuides), // Fetch up to 100 guides
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(`/api/requests`, setRequests);
      fetchData(`/api/notifications`, setNotifications);
    } else {
      setRequests([]);
      setNotifications([]);
    }
  }, [user]);

  const submitRequest = async (requestData) => {
    try {
      const response = await fetch(`/api/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => [...prev, data.data]);
        return { success: true, data: data.data };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: 'Request submission failed' };
    }
  };

  const assignGuide = async (requestId, guideId) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ guideId })
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => prev.map(r => r._id === requestId ? data.data : r));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: 'Failed to assign guide' };
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(prev => prev.map(r => r._id === requestId ? data.data : r));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: 'Failed to update status' };
    }
  };

  const updateGuide = async (guideId, updates) => {
    try {
      const response = await fetch(`/api/guides/${guideId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (response.ok) {
        setGuides(prev => prev.map(g => g._id === guideId ? data.data : g));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: 'Failed to update guide' };
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const getNotifications = async () => {
    await fetchData(`/api/notifications`, setNotifications);
  };

  const fetchAvailableGuides = async (requestId) => {
    await fetchData(`/api/guides/available/${requestId}`, setAvailableGuides);
  };

  const value = {
    destinations,
    guides,
    availableGuides,
    requests,
    notifications,
    loading,
    fetchAvailableGuides,
    error,
    submitRequest,
    assignGuide,
    updateRequestStatus,
    updateGuide,
    getNotifications,
    markNotificationAsRead,
    clearNotifications,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
