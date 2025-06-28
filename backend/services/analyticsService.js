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

/**
 * Get product view statistics
 * @param {Object} params - Query parameters
 */
exports.getProductViewStats = async (params = {}) => {
  try {
    const { period = 'month', productId, limit = 10 } = params;
    
    let timeFilter;
    switch (period) {
      case 'day':
        timeFilter = "created_at > NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeFilter = "created_at > NOW() - INTERVAL '7 days'";
        break;
      case 'month':
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
        break;
      case 'year':
        timeFilter = "created_at > NOW() - INTERVAL '365 days'";
        break;
      default:
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
    }
    
    let query;
    let queryParams = [];
    
    if (productId) {
      // Get views for specific product
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as view_count
        FROM product_views
        WHERE product_id = $1 AND ${timeFilter}
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      queryParams = [productId];
    } else {
      // Get views for all products
      query = `
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.image,
          COUNT(pv.id) as view_count
        FROM products p
        LEFT JOIN product_views pv ON p.id = pv.product_id AND ${timeFilter}
        GROUP BY p.id, p.name, p.image
        ORDER BY view_count DESC
        LIMIT $1
      `;
      queryParams = [limit];
    }
    
    const result = await db.query(query, queryParams);
    
    return {
      period,
      stats: result.rows
    };
  } catch (error) {
    console.error('Error getting product view statistics:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async () => {
  try {
    // Get total products
    const productsQuery = `
      SELECT COUNT(*) as total_products,
             COUNT(*) FILTER (WHERE stock > 0) as in_stock,
             COUNT(*) FILTER (WHERE stock = 0) as out_of_stock
      FROM products
    `;
    
    // Get total orders
    const ordersQuery = `
      SELECT COUNT(*) as total_orders,
             COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
             COUNT(*) FILTER (WHERE status = 'processing') as processing_orders,
             COUNT(*) FILTER (WHERE status = 'shipped') as shipped_orders,
             COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
             COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders
      FROM orders
    `;
    
    // Get total users
    const usersQuery = `
      SELECT COUNT(*) as total_users,
             COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users
      FROM users
    `;
    
    // Get total revenue
    const revenueQuery = `
      SELECT 
        SUM(total_amount) as total_revenue,
        SUM(total_amount) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as monthly_revenue,
        SUM(total_amount) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as weekly_revenue
      FROM orders
      WHERE status != 'cancelled'
    `;
    
    // Get recent orders
    const recentOrdersQuery = `
      SELECT o.id, o.user_id, o.status, o.total_amount, o.created_at,
             u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;
    
    // Get low stock products
    const lowStockQuery = `
      SELECT id, name, stock, price
      FROM products
      WHERE stock > 0 AND stock <= 5
      ORDER BY stock ASC
      LIMIT 5
    `;
    
    const [
      products,
      orders,
      users,
      revenue,
      recentOrders,
      lowStock
    ] = await Promise.all([
      db.query(productsQuery),
      db.query(ordersQuery),
      db.query(usersQuery),
      db.query(revenueQuery),
      db.query(recentOrdersQuery),
      db.query(lowStockQuery)
    ]);
    
    return {
      products: products.rows[0],
      orders: orders.rows[0],
      users: users.rows[0],
      revenue: revenue.rows[0],
      recentOrders: recentOrders.rows,
      lowStock: lowStock.rows
    };
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    throw error;
  }
};

/**
 * Get sales statistics
 * @param {Object} params - Query parameters
 */
exports.getSalesStats = async (params = {}) => {
  try {
    const { period = 'month' } = params;
    
    let timeFilter;
    switch (period) {
      case 'day':
        timeFilter = "created_at > NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeFilter = "created_at > NOW() - INTERVAL '7 days'";
        break;
      case 'month':
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
        break;
      case 'year':
        timeFilter = "created_at > NOW() - INTERVAL '365 days'";
        break;
      default:
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
    }
    
    // Get sales over time
    const salesQuery = `
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as order_count
      FROM orders
      WHERE status != 'cancelled' AND ${timeFilter}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    
    // Get top selling products
    const topProductsQuery = `
      SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' AND ${timeFilter}
      GROUP BY p.id, p.name
      ORDER BY quantity_sold DESC
      LIMIT 10
    `;
    
    // Get sales by category
    const categorySalesQuery = `
      SELECT 
        c.id,
        c.name,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' AND ${timeFilter}
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `;
    
    const [sales, topProducts, categorySales] = await Promise.all([
      db.query(salesQuery),
      db.query(topProductsQuery),
      db.query(categorySalesQuery)
    ]);
    
    // Calculate total revenue and orders
    const totalRevenue = sales.rows.reduce((sum, row) => sum + parseFloat(row.revenue), 0);
    const totalOrders = sales.rows.reduce((sum, row) => sum + parseInt(row.order_count), 0);
    
    return {
      period,
      totalRevenue,
      totalOrders,
      sales: sales.rows,
      topProducts: topProducts.rows,
      categorySales: categorySales.rows
    };
  } catch (error) {
    console.error('Error getting sales statistics:', error);
    throw error;
  }
};

/**
 * Get user activity statistics
 * @param {Object} params - Query parameters
 */
exports.getUserActivityStats = async (params = {}) => {
  try {
    const { period = 'month' } = params;
    
    let timeFilter;
    switch (period) {
      case 'day':
        timeFilter = "created_at > NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeFilter = "created_at > NOW() - INTERVAL '7 days'";
        break;
      case 'month':
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
        break;
      case 'year':
        timeFilter = "created_at > NOW() - INTERVAL '365 days'";
        break;
      default:
        timeFilter = "created_at > NOW() - INTERVAL '30 days'";
    }
    
    // Get user registrations over time
    const registrationsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE ${timeFilter}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    
    // Get active users (users with views or orders)
    const activeUsersQuery = `
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM (
        SELECT user_id FROM product_views WHERE user_id IS NOT NULL AND ${timeFilter}
        UNION
        SELECT user_id FROM orders WHERE ${timeFilter}
      ) as active
    `;
    
    // Get most active users
    const mostActiveUsersQuery = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(pv.id) as view_count
      FROM users u
      JOIN product_views pv ON u.id = pv.user_id
      WHERE ${timeFilter}
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY view_count DESC
      LIMIT 10
    `;
    
    const [registrations, activeUsers, mostActiveUsers] = await Promise.all([
      db.query(registrationsQuery),
      db.query(activeUsersQuery),
      db.query(mostActiveUsersQuery)
    ]);
    
    return {
      period,
      registrations: registrations.rows,
      activeUsers: activeUsers.rows[0]?.active_users || 0,
      mostActiveUsers: mostActiveUsers.rows
    };
  } catch (error) {
    console.error('Error getting user activity statistics:', error);
    throw error;
  }
};