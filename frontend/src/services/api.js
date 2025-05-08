import axios from 'axios';
import { getAuthHeader, getAuthToken } from '../apiConfig';
import { handleError } from '../utils';

// Create a function to handle navigation using React Router
let authErrorHandler = null;

// Function to set the auth error handler from components
export const setAuthErrorHandler = (handler) => {
  authErrorHandler = handler;
};

// Create an axios instance with default configuration
const api = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Ensure proper format with space after "Bearer"
      config.headers.Authorization = `Bearer ${token}`;
      
      // For debugging - log the headers being sent
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle specific HTTP errors
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser');
          handleError('Your session has expired. Please log in again.');
          
          // Use the auth error handler if available
          if (typeof authErrorHandler === 'function') {
            authErrorHandler();
          }
          break;
        case 403:
          // Forbidden
          handleError('You do not have permission to access this resource.');
          break;
        case 500:
          // Server error
          handleError('Server error. Please try again later.');
          break;
        default:
          // Other errors
          handleError(response.data?.message || 'Something went wrong.');
      }
    } else {
      // Network error or other issues
      handleError('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// File upload specific API with multipart/form-data
export const uploadFile = async (url, formData) => {
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api; 