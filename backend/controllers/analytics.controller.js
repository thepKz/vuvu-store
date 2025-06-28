const db = require('../config/db.config');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * Get product view statistics
 */
exports.getProductViewStats = catchAsync(async (req, res) => {
  const { period = 'week', productId } = req.query;
  
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
        COUNT(pv.id) as view_count
      FROM products p
      LEFT JOIN product_views pv ON p.id = pv.product_id AND ${timeFilter}
      GROUP BY p.id, p.name
      ORDER BY view_count DESC
      LIMIT 10
    `;
  }
  
  const result = await db.query(query, params);
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      stats: result.rows
    }
  });
});

/**
 * Get user activity statistics
 */
exports.getUserActivityStats = catchAsync(async (req, res) => {
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
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      registrations: registrations.rows,
      activeUsers: activeUsers.rows[0]?.active_users || 0,
      mostActiveUsers: mostActiveUsers.rows
    }
  });
});

/**
 * Get sales statistics
 */
exports.getSalesStats = catchAsync(async (req, res) => {
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
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalRevenue,
      totalOrders,
      sales: sales.rows,
      topProducts: topProducts.rows,
      categorySales: categorySales.rows
    }
  });
});

/**
 * Get dashboard summary statistics
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
  
  res.status(200).json({
    status: 'success',
    data: {
      products: products.rows[0],
      orders: orders.rows[0],
      users: users.rows[0],
      revenue: revenue.rows[0],
      recentOrders: recentOrders.rows,
      lowStock: lowStock.rows
    }
  });
});