const db = require('../config/db.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');

/**
 * Get admin dashboard statistics
 */
exports.getDashboardStats = catchAsync(async (req, res) => {
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

  // Get top viewed products
  const topViewedQuery = `
    SELECT p.id, p.name, p.image, COUNT(pv.id) as view_count
    FROM products p
    JOIN product_views pv ON p.id = pv.product_id
    WHERE pv.created_at > NOW() - INTERVAL '30 days'
    GROUP BY p.id, p.name, p.image
    ORDER BY view_count DESC
    LIMIT 5
  `;
  
  const [
    products,
    orders,
    users,
    revenue,
    recentOrders,
    lowStock,
    topViewed
  ] = await Promise.all([
    db.query(productsQuery),
    db.query(ordersQuery),
    db.query(usersQuery),
    db.query(revenueQuery),
    db.query(recentOrdersQuery),
    db.query(lowStockQuery),
    db.query(topViewedQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      products: products.rows[0],
      orders: orders.rows[0],
      users: users.rows[0],
      revenue: revenue.rows[0],
      recentOrders: recentOrders.rows,
      lowStock: lowStock.rows,
      topViewed: topViewed.rows
    }
  });
});

/**
 * Get sales overview
 */
exports.getSalesOverview = catchAsync(async (req, res) => {
  const { period = 'week' } = req.query;
  
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
      timeFilter = "created_at > NOW() - INTERVAL '7 days'";
  }
  
  // Get sales by date
  const salesByDateQuery = `
    SELECT 
      DATE(created_at) as date,
      SUM(total_amount) as revenue,
      COUNT(*) as order_count
    FROM orders
    WHERE status != 'cancelled' AND ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  // Get sales by category
  const salesByCategoryQuery = `
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
  
  // Get top selling products
  const topProductsQuery = `
    SELECT 
      p.id,
      p.name,
      p.image,
      SUM(oi.quantity) as quantity_sold,
      SUM(oi.price * oi.quantity) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled' AND ${timeFilter}
    GROUP BY p.id, p.name, p.image
    ORDER BY quantity_sold DESC
    LIMIT 10
  `;
  
  // Get payment methods distribution
  const paymentMethodsQuery = `
    SELECT 
      payment_method,
      COUNT(*) as count,
      SUM(total_amount) as total
    FROM orders
    WHERE status != 'cancelled' AND ${timeFilter}
    GROUP BY payment_method
    ORDER BY count DESC
  `;
  
  const [
    salesByDate,
    salesByCategory,
    topProducts,
    paymentMethods
  ] = await Promise.all([
    db.query(salesByDateQuery),
    db.query(salesByCategoryQuery),
    db.query(topProductsQuery),
    db.query(paymentMethodsQuery)
  ]);
  
  // Calculate totals
  const totalRevenue = salesByDate.rows.reduce((sum, row) => sum + parseFloat(row.revenue), 0);
  const totalOrders = salesByDate.rows.reduce((sum, row) => sum + parseInt(row.order_count), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      salesByDate: salesByDate.rows,
      salesByCategory: salesByCategory.rows,
      topProducts: topProducts.rows,
      paymentMethods: paymentMethods.rows
    }
  });
});

/**
 * Get customer insights
 */
exports.getCustomerInsights = catchAsync(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let timeFilter;
  switch (period) {
    case 'week':
      timeFilter = "created_at > NOW() - INTERVAL '7 days'";
      break;
    case 'month':
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
      break;
    case 'quarter':
      timeFilter = "created_at > NOW() - INTERVAL '90 days'";
      break;
    case 'year':
      timeFilter = "created_at > NOW() - INTERVAL '365 days'";
      break;
    default:
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
  }
  
  // Get new users over time
  const newUsersQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM users
    WHERE ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  // Get top customers by order value
  const topCustomersQuery = `
    SELECT 
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      COUNT(o.id) as order_count,
      SUM(o.total_amount) as total_spent
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE o.status != 'cancelled' AND ${timeFilter}
    GROUP BY u.id, u.email, u.first_name, u.last_name
    ORDER BY total_spent DESC
    LIMIT 10
  `;
  
  // Get customer retention
  const retentionQuery = `
    WITH first_orders AS (
      SELECT 
        user_id, 
        MIN(created_at) as first_order_date
      FROM orders
      GROUP BY user_id
    ),
    repeat_customers AS (
      SELECT 
        COUNT(DISTINCT o.user_id) as repeat_count
      FROM orders o
      JOIN first_orders fo ON o.user_id = fo.user_id
      WHERE o.created_at > fo.first_order_date
        AND o.status != 'cancelled'
        AND ${timeFilter}
    ),
    total_customers AS (
      SELECT 
        COUNT(DISTINCT user_id) as total_count
      FROM orders
      WHERE status != 'cancelled' AND ${timeFilter}
    )
    SELECT 
      rc.repeat_count,
      tc.total_count,
      CASE 
        WHEN tc.total_count > 0 THEN (rc.repeat_count::float / tc.total_count) * 100
        ELSE 0
      END as retention_rate
    FROM repeat_customers rc, total_customers tc
  `;
  
  // Get customer activity
  const activityQuery = `
    SELECT 
      activity_type,
      COUNT(*) as count
    FROM user_activity
    WHERE ${timeFilter}
    GROUP BY activity_type
    ORDER BY count DESC
  `;
  
  const [
    newUsers,
    topCustomers,
    retention,
    activity
  ] = await Promise.all([
    db.query(newUsersQuery),
    db.query(topCustomersQuery),
    db.query(retentionQuery),
    db.query(activityQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      newUsers: newUsers.rows,
      topCustomers: topCustomers.rows,
      retention: retention.rows[0] || { repeat_count: 0, total_count: 0, retention_rate: 0 },
      activity: activity.rows
    }
  });
});

/**
 * Get inventory status
 */
exports.getInventoryStatus = catchAsync(async (req, res) => {
  // Get inventory summary
  const summaryQuery = `
    SELECT 
      COUNT(*) as total_products,
      COUNT(*) FILTER (WHERE stock > 0) as in_stock,
      COUNT(*) FILTER (WHERE stock = 0) as out_of_stock,
      COUNT(*) FILTER (WHERE stock > 0 AND stock <= 5) as low_stock,
      SUM(stock) as total_stock,
      AVG(stock) as average_stock
    FROM products
  `;
  
  // Get stock by category
  const stockByCategoryQuery = `
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count,
      SUM(p.stock) as total_stock,
      AVG(p.stock) as average_stock,
      COUNT(p.id) FILTER (WHERE p.stock = 0) as out_of_stock_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
    ORDER BY total_stock DESC
  `;
  
  // Get low stock products
  const lowStockQuery = `
    SELECT 
      p.id,
      p.name,
      p.stock,
      p.price,
      p.image,
      c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.stock > 0 AND p.stock <= 5
    ORDER BY p.stock ASC
    LIMIT 20
  `;
  
  // Get out of stock products
  const outOfStockQuery = `
    SELECT 
      p.id,
      p.name,
      p.price,
      p.image,
      c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.stock = 0
    ORDER BY p.updated_at DESC
    LIMIT 20
  `;
  
  const [
    summary,
    stockByCategory,
    lowStock,
    outOfStock
  ] = await Promise.all([
    db.query(summaryQuery),
    db.query(stockByCategoryQuery),
    db.query(lowStockQuery),
    db.query(outOfStockQuery)
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      summary: summary.rows[0],
      stockByCategory: stockByCategory.rows,
      lowStock: lowStock.rows,
      outOfStock: outOfStock.rows
    }
  });
});

/**
 * Get analytics overview
 */
exports.getAnalyticsOverview = catchAsync(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let timeFilter;
  switch (period) {
    case 'week':
      timeFilter = "created_at > NOW() - INTERVAL '7 days'";
      break;
    case 'month':
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
      break;
    case 'quarter':
      timeFilter = "created_at > NOW() - INTERVAL '90 days'";
      break;
    case 'year':
      timeFilter = "created_at > NOW() - INTERVAL '365 days'";
      break;
    default:
      timeFilter = "created_at > NOW() - INTERVAL '30 days'";
  }
  
  // Get product views over time
  const viewsOverTimeQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as view_count
    FROM product_views
    WHERE ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  // Get most viewed products
  const mostViewedQuery = `
    SELECT 
      p.id,
      p.name,
      p.image,
      COUNT(pv.id) as view_count
    FROM products p
    JOIN product_views pv ON p.id = pv.product_id
    WHERE ${timeFilter}
    GROUP BY p.id, p.name, p.image
    ORDER BY view_count DESC
    LIMIT 10
  `;
  
  // Get search trends
  const searchTrendsQuery = `
    SELECT 
      query,
      COUNT(*) as search_count,
      AVG(result_count) as avg_results
    FROM search_queries
    WHERE ${timeFilter}
    GROUP BY query
    ORDER BY search_count DESC
    LIMIT 10
  `;
  
  // Get user activity
  const userActivityQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as activity_count
    FROM user_activity
    WHERE ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  const [
    viewsOverTime,
    mostViewed,
    searchTrends,
    userActivity
  ] = await Promise.all([
    db.query(viewsOverTimeQuery),
    db.query(mostViewedQuery),
    db.query(searchTrendsQuery),
    db.query(userActivityQuery)
  ]);
  
  // Calculate totals
  const totalViews = viewsOverTime.rows.reduce((sum, row) => sum + parseInt(row.view_count), 0);
  const totalSearches = searchTrends.rows.reduce((sum, row) => sum + parseInt(row.search_count), 0);
  const totalActivity = userActivity.rows.reduce((sum, row) => sum + parseInt(row.activity_count), 0);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalViews,
      totalSearches,
      totalActivity,
      viewsOverTime: viewsOverTime.rows,
      mostViewed: mostViewed.rows,
      searchTrends: searchTrends.rows,
      userActivity: userActivity.rows
    }
  });
});