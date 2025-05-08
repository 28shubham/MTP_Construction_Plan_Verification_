/**
 * API Configuration
 * Centralizes all API endpoint URLs and config for the application
 */

const API_BASE_URL = 'http://localhost:8080';
const PYTHON_API_URL = 'http://127.0.0.1:5000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
};

// File handling endpoints
export const FILE_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/upload-files`,
  GET_FILES: `${API_BASE_URL}/get-files`,
  FILE_PATH: (filename) => `${API_BASE_URL}/files/${filename}`,
};

// Verification endpoints
export const VERIFICATION_ENDPOINTS = {
  VERIFY_FORM: `${API_BASE_URL}/api/verifyForm`,
  VERIFY_PDF: `${PYTHON_API_URL}/verify-pdf`,
};

// Product endpoints
export const PRODUCT_ENDPOINTS = {
  GET_PRODUCTS: `${API_BASE_URL}/products`,
};

// Building Rules endpoints
export const BUILDING_RULES_ENDPOINTS = {
  SIMPLE_RULES: `${API_BASE_URL}/api/simple-building-rules`,
  SIMPLE_RULES_BY_CITY: (cityName) => `${API_BASE_URL}/api/simple-building-rules/city/${cityName}`,
  SIMPLE_RULES_BY_PINCODE: (pincode) => `${API_BASE_URL}/api/simple-building-rules/pincode/${pincode}`,
  CITIES_PINCODES: `${API_BASE_URL}/api/building-plans/cities-pincodes`,
  SIMPLE_RULES_CITIES_PINCODES: `${API_BASE_URL}/api/simple-building-rules/cities-pincodes`,
};

// Auth token helpers
export const getAuthToken = () => localStorage.getItem('token');

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export default {
  API_BASE_URL,
  PYTHON_API_URL,
  AUTH_ENDPOINTS,
  FILE_ENDPOINTS,
  VERIFICATION_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  BUILDING_RULES_ENDPOINTS,
  getAuthToken,
  getAuthHeader,
}; 