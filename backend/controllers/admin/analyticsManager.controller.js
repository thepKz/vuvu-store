const db = require('../../config/db.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

/**
 * Get product view analytics
 */
exports.getProductViewAnalytics = catchAsync(async (req, res) => {
  const { period = 'month', productId, limit = 10 } = req.query;
  
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
  let params = [];
  
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
    params = [productId];
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
    params = [limit];
  }
  
  const result = await db.query(query, params);
  
  // Get total views for the period
  const totalViewsQuery = `
    SELECT COUNT(*) as total_views
    FROM product_views
    WHERE ${timeFilter}
  `;
  
  const totalViewsResult = await db.query(totalViewsQuery);
  const totalViews = parseInt(totalViewsResult.rows[0].total_views);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalViews,
      stats: result.rows
    }
  });
});

/**
 * Get user activity analytics
 */
exports.getUserActivityAnalytics = catchAsync(async (req, res) => {
  const { period = 'month', activityType } = req.query;
  
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
  let params = [];
  let paramIndex = 1;
  
  // Base query
  query = `
    SELECT 
      DATE(created_at) as date,
      activity_type,
      COUNT(*) as count
    FROM user_activity
    WHERE ${timeFilter}
  `;
  
  // Add activity type filter if specified
  if (activityType) {
    query += ` AND activity_type = $${paramIndex++}`;
    params.push(activityType);
  }
  
  // Group and order
  query += `
    GROUP BY DATE(created_at), activity_type
    ORDER BY date, activity_type
  `;
  
  const result = await db.query(query, params);
  
  // Get activity type distribution
  const activityTypesQuery = `
    SELECT 
      activity_type,
      COUNT(*) as count
    FROM user_activity
    WHERE ${timeFilter}
    GROUP BY activity_type
    ORDER BY count DESC
  `;
  
  const activityTypesResult = await db.query(activityTypesQuery);
  
  // Get most active users
  const activeUsersQuery = `
    SELECT 
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      COUNT(ua.id) as activity_count
    FROM users u
    JOIN user_activity ua ON u.id = ua.user_id
    WHERE ${timeFilter}
    GROUP BY u.id, u.email, u.first_name, u.last_name
    ORDER BY activity_count DESC
    LIMIT 10
  `;
  
  const activeUsersResult = await db.query(activeUsersQuery);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      activityByDate: result.rows,
      activityTypes: activityTypesResult.rows,
      mostActiveUsers: activeUsersResult.rows
    }
  });
});

/**
 * Get search analytics
 */
exports.getSearchAnalytics = catchAsync(async (req, res) => {
  const { period = 'month', limit = 20 } = req.query;
  
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
  
  // Get popular search queries
  const popularSearchesQuery = `
    SELECT 
      query,
      COUNT(*) as search_count,
      AVG(result_count) as avg_results
    FROM search_queries
    WHERE ${timeFilter}
    GROUP BY query
    ORDER BY search_count DESC
    LIMIT $1
  `;
  
  // Get searches with no results
  const noResultsQuery = `
    SELECT 
      query,
      COUNT(*) as search_count
    FROM search_queries
    WHERE result_count = 0 AND ${timeFilter}
    GROUP BY query
    ORDER BY search_count DESC
    LIMIT $1
  `;
  
  // Get search counts by date
  const searchesByDateQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as search_count
    FROM search_queries
    WHERE ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  const [
    popularSearches,
    noResults,
    searchesByDate
  ] = await Promise.all([
    db.query(popularSearchesQuery, [limit]),
    db.query(noResultsQuery, [limit]),
    db.query(searchesByDateQuery)
  ]);
  
  // Get total searches for the period
  const totalSearchesQuery = `
    SELECT COUNT(*) as total_searches
    FROM search_queries
    WHERE ${timeFilter}
  `;
  
  const totalSearchesResult = await db.query(totalSearchesQuery);
  const totalSearches = parseInt(totalSearchesResult.rows[0].total_searches);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalSearches,
      popularSearches: popularSearches.rows,
      noResults: noResults.rows,
      searchesByDate: searchesByDate.rows
    }
  });
});

/**
 * Get conversion analytics
 */
exports.getConversionAnalytics = catchAsync(async (req, res) => {
  const { period = 'month' } = req.query;
  
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
  
  // Get total product views
  const viewsQuery = `
    SELECT COUNT(*) as total_views
    FROM product_views
    WHERE ${timeFilter}
  `;
  
  // Get total orders
  const ordersQuery = `
    SELECT COUNT(*) as total_orders
    FROM orders
    WHERE ${timeFilter} AND status != 'cancelled'
  `;
  
  // Get total revenue
  const revenueQuery = `
    SELECT SUM(total_amount) as total_revenue
    FROM orders
    WHERE ${timeFilter} AND status != 'cancelled'
  `;
  
  // Get conversion rate by product
  const productConversionQuery = `
    WITH product_views_count AS (
      SELECT 
        product_id,
        COUNT(*) as view_count
      FROM product_views
      WHERE ${timeFilter}
      GROUP BY product_id
    ),
    product_orders_count AS (
      SELECT 
        oi.product_id,
        COUNT(DISTINCT o.id) as order_count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE ${timeFilter} AND o.status != 'cancelled'
      GROUP BY oi.product_id
    )
    SELECT 
      p.id,
      p.name,
      p.image,
      COALESCE(pvc.view_count, 0) as view_count,
      COALESCE(poc.order_count, 0) as order_count,
      CASE 
        WHEN COALESCE(pvc.view_count, 0) > 0 
        THEN (COALESCE(poc.order_count, 0)::float / COALESCE(pvc.view_count, 0)) * 100
        ELSE 0
      END as conversion_rate
    FROM products p
    LEFT JOIN product_views_count pvc ON p.id = pvc.product_id
    LEFT JOIN product_orders_count poc ON p.id = poc.product_id
    WHERE COALESCE(pvc.view_count, 0) > 0 OR COALESCE(poc.order_count, 0) > 0
    ORDER BY conversion_rate DESC
    LIMIT 20
  `;
  
  const [
    views,
    orders,
    revenue,
    productConversion
  ] = await Promise.all([
    db.query(viewsQuery),
    db.query(ordersQuery),
    db.query(revenueQuery),
    db.query(productConversionQuery)
  ]);
  
  // Calculate overall conversion rate
  const totalViews = parseInt(views.rows[0].total_views);
  const totalOrders = parseInt(orders.rows[0].total_orders);
  const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalViews,
      totalOrders,
      totalRevenue: parseFloat(revenue.rows[0].total_revenue || 0),
      conversionRate,
      productConversion: productConversion.rows
    }
  });
});

/**
 * Get real-time analytics
 */
exports.getRealTimeAnalytics = catchAsync(async (req, res) => {
  // Get active users in the last 15 minutes
  const activeUsersQuery = `
    SELECT COUNT(DISTINCT user_id) as active_users
    FROM user_activity
    WHERE created_at > NOW() - INTERVAL '15 minutes'
  `;
  
  // Get recent product views
  const recentViewsQuery = `
    SELECT 
      pv.id,
      pv.created_at,
      p.name as product_name,
      p.image as product_image,
      u.email as user_email,
      u.first_name,
      u.last_name
    FROM product_views pv
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN users u ON pv.user_id = u.id
    WHERE pv.created_at > NOW() - INTERVAL '15 minutes'
    ORDER BY pv.created_at DESC
    LIMIT 10
  `;
  
  // Get recent orders
  const recentOrdersQuery = `
    SELECT 
      o.id,
      o.created_at,
      o.total_amount,
      o.status,
      u.email as user_email,
      u.first_name,
      u.last_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.created_at > NOW() - INTERVAL '15 minutes'
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  
  // Get recent searches
  const recentSearchesQuery = `
    SELECT 
      id,
      query,
      result_count,
      created_at
    FROM search_queries
    WHERE created_at > NOW() - INTERVAL '15 minutes'
    ORDER BY created_at DESC
    LIMIT 10
  `;
  
  const [
    activeUsers,
    recentViews,
    recentOrders,
    recentSearches
  ] = await Promise.all([
    db.query(activeUsersQuery),
    db.query(recentViewsQuery),
    db.query(recentOrdersQuery),
    db.query(recentSearchesQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      timestamp: new Date(),
      activeUsers: parseInt(activeUsers.rows[0].active_users),
      recentViews: recentViews.rows,
      recentOrders: recentOrders.rows,
      recentSearches: recentSearches.rows
    }
  });
});