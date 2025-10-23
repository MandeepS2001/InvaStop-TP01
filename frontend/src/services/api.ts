import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Determine base URL: prefer local API when running on localhost
const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
const computedBaseURL = isLocalhost
  ? 'http://localhost:8000/api/v1'
  : (process.env.REACT_APP_API_URL || 'https://invastopbackend.vercel.app/api/v1');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: computedBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (no auth needed)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    
    // Handle errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
