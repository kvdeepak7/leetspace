// src/lib/api.js

import axios from 'axios';
import { auth } from './firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get Firebase ID token
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    console.error('Error getting ID token:', error);
    throw new Error('Failed to get authentication token');
  }
};

// Request interceptor to add Firebase ID token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const idToken = await getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    } catch (error) {
      console.error('Failed to add auth token:', error);
      // Don't throw here, let the request go through and let backend handle auth error
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, try to refresh
      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true); // Force refresh
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config); // Retry the request
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login or handle as needed
      }
    }
    return Promise.reject(error);
  }
);

// API functions for problems
export const problemsAPI = {
  // Get all problems for authenticated user
  getProblems: (params = {}) => {
    // Remove user_id from params since it's handled by auth
    const { user_id, ...cleanParams } = params;
    return api.get('/api/problems', { params: cleanParams });
  },

  // Create a new problem
  createProblem: (problemData) => {
    // Remove user_id from data since it's handled by auth
    const { user_id, ...cleanData } = problemData;
    return api.post('/api/problems', cleanData);
  },

  // Get a specific problem
  getProblem: (id) => api.get(`/api/problems/${id}`),

  // Update a problem
  updateProblem: (id, updateData) => {
    const { user_id, ...cleanData } = updateData;
    return api.put(`/api/problems/${id}`, cleanData);
  },

  // Delete a problem
  deleteProblem: (id) => api.delete(`/api/problems/${id}`),

  // Get user statistics
  getStats: () => api.get('/api/problems/stats'),
};

// API functions for analytics
export const analyticsAPI = {
  // Get dashboard data for authenticated user
  getDashboard: () => api.get('/api/analytics/dashboard'),
};

// Export the configured axios instance for custom requests
export default api;