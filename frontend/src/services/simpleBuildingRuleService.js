import api from './api';
import { handleError } from '../utils';
import { BUILDING_RULES_ENDPOINTS } from '../apiConfig';
import { getAuthHeader } from './adminService';

/**
 * Get all building rules
 * @returns {Promise} API response with rules data
 */
export const getAllRules = async () => {
  try {
    const response = await api.get(BUILDING_RULES_ENDPOINTS.SIMPLE_RULES, {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError('Error fetching building rules');
    return { rules: [] };
  }
};

/**
 * Get building rules by city
 * @param {string} cityName - Name of the city
 * @returns {Promise} API response with rules for the specified city
 */
export const getRulesByCity = async (cityName) => {
  try {
    const response = await api.get(BUILDING_RULES_ENDPOINTS.SIMPLE_RULES_BY_CITY(cityName), {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(`Error fetching rules for city ${cityName}`);
    return { rules: [] };
  }
};

/**
 * Get building rules by pincode
 * @param {string} pincode - Pincode to search for
 * @returns {Promise} API response with rules for the specified pincode
 */
export const getRulesByPincode = async (pincode) => {
  try {
    const response = await api.get(BUILDING_RULES_ENDPOINTS.SIMPLE_RULES_BY_PINCODE(pincode), {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError(`Error fetching rules for pincode ${pincode}`);
    return { rule: null };
  }
};

/**
 * Get all cities and their pincodes for dropdown selection
 * @returns {Promise} API response with list of cities and their pincodes
 */
export const getCitiesAndPincodes = async () => {
  try {
    const response = await api.get(BUILDING_RULES_ENDPOINTS.CITIES_PINCODES);
    return response.data;
  } catch (error) {
    handleError('Error fetching cities and pincodes');
    return { cities: [] };
  }
};

/**
 * Get all cities and their pincodes from SimpleBuildingRule for dropdown selection
 * @returns {Promise} API response with list of cities and their pincodes from building rules
 */
export const getCitiesAndPincodesFromRules = async () => {
  try {
    const response = await api.get(BUILDING_RULES_ENDPOINTS.SIMPLE_RULES_CITIES_PINCODES);
    return response.data;
  } catch (error) {
    handleError('Error fetching cities and pincodes from building rules');
    return { cities: [] };
  }
};

/**
 * Create new building rules
 * @param {Object} ruleData - Rule data including cityName, pincode, and rules array
 * @returns {Promise} API response with created rule
 */
export const createRule = async (ruleData) => {
  try {
    const response = await api.post(BUILDING_RULES_ENDPOINTS.SIMPLE_RULES, ruleData, {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError('Error creating building rules');
    throw error;
  }
};

/**
 * Update building rule
 * @param {string} id - Rule ID to update
 * @param {Object} ruleData - Updated rule data
 * @returns {Promise} API response with updated rule
 */
export const updateRule = async (id, ruleData) => {
  try {
    const response = await api.put(`${BUILDING_RULES_ENDPOINTS.SIMPLE_RULES}/${id}`, ruleData, {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError('Error updating building rules');
    throw error;
  }
};

/**
 * Delete building rule
 * @param {string} id - Rule ID to delete
 * @returns {Promise} API response
 */
export const deleteRule = async (id) => {
  try {
    const response = await api.delete(`${BUILDING_RULES_ENDPOINTS.SIMPLE_RULES}/${id}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    handleError('Error deleting building rule');
    throw error;
  }
}; 