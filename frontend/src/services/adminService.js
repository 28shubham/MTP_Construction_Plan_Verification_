import axios from 'axios';
import { handleError, handleSuccess } from '../utils';

const API_URL = 'http://localhost:8080/admin';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
adminApi.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'An error occurred';
      handleError(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      handleError('No response from server. Please check if the server is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      handleError('An error occurred while setting up the request');
    }
    return Promise.reject(error);
  }
);

// Admin login service
export const loginAdmin = async (credentials) => {
  try {
    console.log('Attempting admin login with:', { email: credentials.email });
    const response = await adminApi.post('/login', credentials);
    
    if (response.data.message === 'Login successful') {
      // Store the token and admin info in localStorage
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data.data.admin));
      handleSuccess('Login successful');
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error.response?.data || { message: 'Network error. Please check your connection and try again.' };
  }
};

// Check if admin is logged in
export const isAdminLoggedIn = () => {
  const token = localStorage.getItem('adminToken');
  const adminInfo = localStorage.getItem('adminInfo');
  return !!(token && adminInfo);
};

// Get admin info
export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  handleSuccess('Logged out successfully');
};

// Get admin token
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    // Verify token is not expired
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Register new admin
export const registerAdmin = async (adminData) => {
  try {
    console.log('Attempting to register admin:', { email: adminData.email });
    const response = await adminApi.post('/register', adminData, {
      headers: {
        ...getAuthHeader() // Include admin token for authorization
      }
    });
    
    if (response.data) {
      handleSuccess('Admin registered successfully');
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error.response?.data || { message: 'Failed to register admin. Please try again.' };
  }
};

// Get all admins
export const getAllAdmins = async () => {
  try {
    const response = await adminApi.get('/', {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error.response?.data || { message: 'Failed to fetch admins' };
  }
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  try {
    const response = await adminApi.delete(`/${adminId}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    handleSuccess('Admin deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error.response?.data || { message: 'Failed to delete admin' };
  }
};

// Update admin
export const updateAdmin = async (adminId, adminData) => {
  try {
    const response = await adminApi.put(`/${adminId}`, adminData, {
      headers: {
        ...getAuthHeader()
      }
    });
    handleSuccess('Admin updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error.response?.data || { message: 'Failed to update admin' };
  }
};

// Update admin profile
export const updateAdminProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_URL}/admin/profile`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Update stored admin info
    const updatedAdmin = response.data.admin;
    localStorage.setItem('adminInfo', JSON.stringify(updatedAdmin));
    
    return updatedAdmin;
  } catch (error) {
    throw error;
  }
};

// Save admin settings
export const saveSettings = async (settings) => {
  try {
    const response = await adminApi.post('/settings', settings, {
      headers: {
        ...getAuthHeader()
      }
    });
    
    // Store settings in localStorage for persistence
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    handleSuccess('Settings saved successfully');
    return response.data;
  } catch (error) {
    console.error('Error saving settings:', error);
    handleError('Failed to save settings');
    throw error;
  }
};

// Get admin settings
export const getAdminSettings = () => {
  const settings = localStorage.getItem('adminSettings');
  return settings ? JSON.parse(settings) : null;
}; 