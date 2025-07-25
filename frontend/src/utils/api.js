import axios from 'axios';
import storage from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://nepxplore.onrender.com',
  withCredentials: true, // Important for sending cookies
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;