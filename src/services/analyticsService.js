import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Track product view
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
const trackProductView = async (productId) => {
  try {
    // Don't wait for response to avoid blocking
    axios.post(
      `${API_BASE_URL}/analytics/products/${productId}/view`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(error => {
      // Silently fail for tracking
      console.log('View tracking error:', error.message);
    });
  } catch (error) {
    // Silently fail for tracking
    console.log('View tracking error:', error.message);
  }
};

/**
 * Track search query
 * @param {string} query - Search query
 * @param {number} resultCount - Number of results
 * @returns {Promise<void>}
 */
const trackSearchQuery = async (query, resultCount) => {
  try {
    // Don't wait for response to avoid blocking
    axios.post(
      `${API_BASE_URL}/analytics/search`,
      { query, resultCount },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(error => {
      // Silently fail for tracking
      console.log('Search tracking error:', error.message);
    });
  } catch (error) {
    // Silently fail for tracking
    console.log('Search tracking error:', error.message);
  }
};

/**
 * Get product view statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - View statistics
 */
const getProductViewStats = async (params = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(
      `${API_BASE_URL}/analytics/products/views`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting product view stats:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Dashboard statistics
 */
const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(
      `${API_BASE_URL}/analytics/dashboard`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

/**
 * Get sales statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Sales statistics
 */
const getSalesStats = async (params = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(
      `${API_BASE_URL}/analytics/sales`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting sales stats:', error);
    throw error;
  }
};

/**
 * Get user activity statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - User activity statistics
 */
const getUserActivityStats = async (params = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await axios.get(
      `${API_BASE_URL}/analytics/users/activity`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting user activity stats:', error);
    throw error;
  }
};

export default {
  trackProductView,
  trackSearchQuery,
  getProductViewStats,
  getDashboardStats,
  getSalesStats,
  getUserActivityStats
};