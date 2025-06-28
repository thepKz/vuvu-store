const db = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

/**
 * Track product view
 * @param {string} productId - Product ID
 * @param {string|null} userId - User ID (if authenticated)
 * @param {string} ipAddress - IP address of viewer
 */
exports.trackProductView = async (productId, userId, ipAddress) => {
  try {
    await db.query(
      `INSERT INTO product_views (
        id, product_id, user_id, ip_address
      ) VALUES ($1, $2, $3, $4)`,
      [uuidv4(), productId, userId, ipAddress]
    );
    
    // Update product view count
    await db.query(
      `UPDATE products 
       SET view_count = view_count + 1
       WHERE id = $1`,
      [productId]
    );
    
    return true;
  } catch (error) {
    console.error('Error tracking product view:', error);
    return false;
  }
};

/**
 * Track user activity
 * @param {string} userId - User ID
 * @param {string} activityType - Type of activity
 * @param {Object} metadata - Additional activity data
 */
exports.trackUserActivity = async (userId, activityType, metadata = {}) => {
  try {
    await db.query(
      `INSERT INTO user_activity (
        id, user_id, activity_type, metadata
      ) VALUES ($1, $2, $3, $4)`,
      [uuidv4(), userId, activityType, JSON.stringify(metadata)]
    );
    
    return true;
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return false;
  }
};

/**
 * Track search query
 * @param {string} query - Search query
 * @param {number} resultCount - Number of results
 * @param {string|null} userId - User ID (if authenticated)
 */
exports.trackSearchQuery = async (query, resultCount, userId = null) => {
  try {
    await db.query(
      `INSERT INTO search_queries (
        id, query, result_count, user_id
      ) VALUES ($1, $2, $3, $4)`,
      [uuidv4(), query, resultCount, userId]
    );
    
    return true;
  } catch (error) {
    console.error('Error tracking search query:', error);
    return false;
  }
};

/**
 * Get popular search queries
 * @param {number} limit - Number of queries to return
 */
exports.getPopularSearches = async (limit = 10) => {
  try {
    const result = await db.query(
      `SELECT query, COUNT(*) as count
       FROM search_queries
       WHERE created_at > NOW() - INTERVAL '30 days'
       GROUP BY query
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
};

/**
 * Get product view history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of products to return
 */
exports.getUserViewHistory = async (userId, limit = 10) => {
  try {
    const result = await db.query(
      `SELECT p.id, p.name, p.image, p.price, 
              MAX(pv.created_at) as last_viewed_at,
              COUNT(pv.id) as view_count
       FROM product_views pv
       JOIN products p ON pv.product_id = p.id
       WHERE pv.user_id = $1
       GROUP BY p.id, p.name, p.image, p.price
       ORDER BY last_viewed_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user view history:', error);
    return [];
  }
};

/**
 * Get most viewed products
 * @param {string} period - Time period ('day', 'week', 'month', 'year')
 * @param {number} limit - Number of products to return
 */
exports.getMostViewedProducts = async (period = 'week', limit = 10) => {
  try {
    let timeFilter;
    switch (period) {
      case 'day':
        timeFilter = "pv.created_at > NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeFilter = "pv.created_at > NOW() - INTERVAL '7 days'";
        break;
      case 'month':
        timeFilter = "pv.created_at > NOW() - INTERVAL '30 days'";
        break;
      case 'year':
        timeFilter = "pv.created_at > NOW() - INTERVAL '365 days'";
        break;
      default:
        timeFilter = "pv.created_at > NOW() - INTERVAL '7 days'";
    }
    
    const result = await db.query(
      `SELECT p.id, p.name, p.image, p.price, COUNT(pv.id) as view_count
       FROM products p
       JOIN product_views pv ON p.id = pv.product_id
       WHERE ${timeFilter}
       GROUP BY p.id, p.name, p.image, p.price
       ORDER BY view_count DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting most viewed products:', error);
    return [];
  }
};