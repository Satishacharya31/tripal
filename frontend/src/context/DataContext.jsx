import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { apiPaths } from '../utils/apiPaths';

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

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(endpoint);
      let result = response.data.data?.destinations || response.data.data?.guides || response.data.data?.requests || response.data.data?.notifications || response.data.data || [];
      if (!Array.isArray(result)) {
        result = [];
      }
      setter(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(apiPaths.getDestinations, setDestinations),
        fetchData(`${apiPaths.getGuides}?limit=100`, setGuides),
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(apiPaths.getRequests, setRequests);
      fetchData(apiPaths.getNotifications, setNotifications);
    } else {
      setRequests([]);
      setNotifications([]);
    }
  }, [user]);

  const submitRequest = async (requestData) => {
    try {
      const response = await api.post(apiPaths.createRequest, requestData);
      setRequests(prev => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Request submission failed' };
    }
  };

  const assignGuide = async (requestId, guideId) => {
    try {
      const response = await api.put(apiPaths.updateRequest(requestId), { guideId });
      setRequests(prev => prev.map(r => r._id === requestId ? response.data.data : r));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to assign guide' };
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await api.put(apiPaths.updateRequest(requestId), { status });
      setRequests(prev => prev.map(r => r._id === requestId ? response.data.data : r));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update status' };
    }
  };

  const updateGuide = async (guideId, updates) => {
    try {
      const response = await api.put(apiPaths.updateGuideAvailability(guideId), updates);
      setGuides(prev => prev.map(g => g._id === guideId ? response.data.data.guide : g));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update guide' };
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(apiPaths.markAsRead(notificationId));
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete(apiPaths.getNotifications);
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const getNotifications = async () => {
    await fetchData(apiPaths.getNotifications, setNotifications);
  };

  const fetchAvailableGuides = async (requestId) => {
    await fetchData(`${apiPaths.getGuides}/available/${requestId}`, setAvailableGuides);
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
