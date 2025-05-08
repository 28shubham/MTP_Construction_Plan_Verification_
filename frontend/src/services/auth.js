import api from './api';
import { AUTH_ENDPOINTS } from '../apiConfig';
import { handleSuccess, handleError } from '../utils';

/**
 * Login user with email and password
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} - API response with token and user data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    
    if (response.data.success) {
      // Store auth data
      localStorage.setItem('token', response.data.jwtToken);
      localStorage.setItem('loggedInUser', response.data.name);
      
      handleSuccess(response.data.message || 'Login successful');
      return response.data;
    } else {
      handleError(response.data.message || 'Login failed');
      return null;
    }
  } catch (error) {
    // Error handling is done in the API interceptor
    return null;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise} - API response with registration status
 */
export const signup = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.SIGNUP, userData);
    
    if (response.data.success) {
      handleSuccess(response.data.message || 'Signup successful');
      return response.data;
    } else {
      handleError(response.data.message || 'Signup failed');
      return null;
    }
  } catch (error) {
    // Error handling is done in the API interceptor
    return null;
  }
};

/**
 * Logout the user
 * @param {Function} [callback] - Optional callback after logout
 */
export const logout = (callback) => {
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  
  handleSuccess('Logout successful');
  
  // Use callback for navigation if provided, otherwise let app handle redirect
  if (typeof callback === 'function') {
    // Short delay to allow success message to be seen
    setTimeout(callback, 1000);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  login,
  signup,
  logout,
  isAuthenticated,
}; 