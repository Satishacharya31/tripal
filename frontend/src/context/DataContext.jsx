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

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setRequests([]);
        setNotifications([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [destRes, guidesRes, reqRes, notifRes] = await Promise.all([
          fetch(`/api/destinations`),
          fetch(`/api/guides`),
          fetch(`/api/requests`, { headers: getAuthHeaders() }),
          fetch(`/api/notifications`, { headers: getAuthHeaders() })
        ]);

        if (!destRes.ok || !guidesRes.ok) {
          throw new Error('Failed to fetch initial data');
        }

        const destData = await destRes.json();
        const guidesData = await guidesRes.json();
        setDestinations(destData.data.destinations);
        setGuides(guidesData.data);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequests(reqData.data.requests || []);
        }
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const value = {
    destinations,
    guides,
    requests,
    notifications,
    loading,
    error,
    submitRequest,
    assignGuide,
    updateRequestStatus,
    updateGuide,
    getNotifications: () => notifications,
    markNotificationAsRead,
    clearNotifications
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
