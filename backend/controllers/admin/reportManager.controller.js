const db = require('../../config/db.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

/**
 * Get sales report
 */
exports.getSalesReport = catchAsync(async (req, res) => {
  const { 
    startDate, 
    endDate, 
    groupBy = 'day', 
    format = 'json' 
  } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'Start date and end date are required'
    });
  }
  
  let timeGrouping;
  switch (groupBy) {
    case 'day':
      timeGrouping = 'DATE(created_at)';
      break;
    case 'week':
      timeGrouping = 'DATE_TRUNC(\'week\', created_at)';
      break;
    case 'month':
      timeGrouping = 'DATE_TRUNC(\'month\', created_at)';
      break;
    case 'year':
      timeGrouping = 'DATE_TRUNC(\'year\', created_at)';
      break;
    default:
      timeGrouping = 'DATE(created_at)';
  }
  
  // Get sales data
  const salesQuery = `
    SELECT 
      ${timeGrouping} as time_period,
      COUNT(*) as order_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as average_order_value
    FROM orders
    WHERE created_at BETWEEN $1 AND $2
      AND status != 'cancelled'
    GROUP BY time_period
    ORDER BY time_period
  `;
  
  // Get payment method breakdown
  const paymentMethodsQuery = `
    SELECT 
      payment_method,
      COUNT(*) as order_count,
      SUM(total_amount) as revenue
    FROM orders
    WHERE created_at BETWEEN $1 AND $2
      AND status != 'cancelled'
    GROUP BY payment_method
    ORDER BY revenue DESC
  `;
  
  // Get status breakdown
  const statusQuery = `
    SELECT 
      status,
      COUNT(*) as order_count,
      SUM(total_amount) as revenue
    FROM orders
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY status
    ORDER BY order_count DESC
  `;
  
  const [
    salesResult,
    paymentMethodsResult,
    statusResult
  ] = await Promise.all([
    db.query(salesQuery, [startDate, endDate]),
    db.query(paymentMethodsQuery, [startDate, endDate]),
    db.query(statusQuery, [startDate, endDate])
  ]);
  
  // Calculate totals
  const totalOrders = salesResult.rows.reduce((sum, row) => sum + parseInt(row.order_count), 0);
  const totalRevenue = salesResult.rows.reduce((sum, row) => sum + parseFloat(row.revenue), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const reportData = {
    period: {
      startDate,
      endDate,
      groupBy
    },
    summary: {
      totalOrders,
      totalRevenue,
      averageOrderValue
    },
    salesByTimePeriod: salesResult.rows,
    paymentMethods: paymentMethodsResult.rows,
    orderStatus: statusResult.rows
  };
  
  if (format === 'csv') {
    // Generate CSV for sales data
    const fields = ['time_period', 'order_count', 'revenue', 'average_order_value'];
    
    const csv = [
      fields.join(','),
      ...salesResult.rows.map(row => {
        return fields.map(field => {
          const value = row[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    data: reportData
  });
});

/**
 * Get product performance report
 */
exports.getProductReport = catchAsync(async (req, res) => {
  const { 
    startDate, 
    endDate, 
    categoryId,
    limit = 100,
    format = 'json' 
  } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'Start date and end date are required'
    });
  }
  
  let query = `
    WITH product_sales AS (
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        c.name as category_name,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.price * oi.quantity) as revenue,
        COUNT(DISTINCT o.id) as order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.created_at BETWEEN $1 AND $2 AND o.status != 'cancelled'
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
  `;
  
  const queryParams = [startDate, endDate];
  let paramIndex = 3;
  
  if (categoryId) {
    query += ` AND p.category_id = $${paramIndex++}`;
    queryParams.push(categoryId);
  }
  
  query += `
      GROUP BY p.id, p.name, p.price, p.stock, c.name
    ),
    product_views AS (
      SELECT 
        product_id,
        COUNT(*) as view_count,
        COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_viewers
      FROM product_views
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY product_id
    )
    SELECT 
      ps.id,
      ps.name,
      ps.price,
      ps.stock,
      ps.category_name,
      COALESCE(ps.quantity_sold, 0) as quantity_sold,
      COALESCE(ps.revenue, 0) as revenue,
      COALESCE(ps.order_count, 0) as order_count,
      COALESCE(pv.view_count, 0) as view_count,
      COALESCE(pv.unique_viewers, 0) as unique_viewers,
      CASE 
        WHEN COALESCE(pv.view_count, 0) > 0 
        THEN (COALESCE(ps.order_count, 0)::float / COALESCE(pv.view_count, 0)) * 100
        ELSE 0
      END as conversion_rate
    FROM product_sales ps
    LEFT JOIN product_views pv ON ps.id = pv.product_id
    ORDER BY revenue DESC
    LIMIT $${paramIndex++}
  `;
  
  queryParams.push(limit);
  
  const result = await db.query(query, queryParams);
  
  // Calculate totals
  const totalQuantitySold = result.rows.reduce((sum, row) => sum + parseInt(row.quantity_sold), 0);
  const totalRevenue = result.rows.reduce((sum, row) => sum + parseFloat(row.revenue), 0);
  const totalViews = result.rows.reduce((sum, row) => sum + parseInt(row.view_count), 0);
  
  const reportData = {
    period: {
      startDate,
      endDate
    },
    summary: {
      totalProducts: result.rows.length,
      totalQuantitySold,
      totalRevenue,
      totalViews
    },
    products: result.rows
  };
  
  if (format === 'csv') {
    // Generate CSV for product data
    const fields = [
      'id', 'name', 'price', 'stock', 'category_name', 
      'quantity_sold', 'revenue', 'order_count', 
      'view_count', 'unique_viewers', 'conversion_rate'
    ];
    
    const csv = [
      fields.join(','),
      ...result.rows.map(row => {
        return fields.map(field => {
          const value = row[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=product-report.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    data: reportData
  });
});

/**
 * Get customer report
 */
exports.getCustomerReport = catchAsync(async (req, res) => {
  const { 
    startDate, 
    endDate, 
    limit = 100,
    format = 'json' 
  } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'Start date and end date are required'
    });
  }
  
  const query = `
    WITH customer_orders AS (
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at as registration_date,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date,
        MIN(o.created_at) as first_order_date
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.created_at BETWEEN $1 AND $2 AND o.status != 'cancelled'
      GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at
    ),
    customer_views AS (
      SELECT 
        user_id,
        COUNT(*) as view_count,
        COUNT(DISTINCT product_id) as products_viewed
      FROM product_views
      WHERE user_id IS NOT NULL AND created_at BETWEEN $1 AND $2
      GROUP BY user_id
    )
    SELECT 
      co.id,
      co.email,
      co.first_name,
      co.last_name,
      co.registration_date,
      co.order_count,
      co.total_spent,
      co.last_order_date,
      co.first_order_date,
      COALESCE(cv.view_count, 0) as view_count,
      COALESCE(cv.products_viewed, 0) as products_viewed,
      CASE 
        WHEN co.order_count > 0 THEN co.total_spent / co.order_count
        ELSE 0
      END as average_order_value,
      CASE 
        WHEN co.first_order_date IS NOT NULL AND co.last_order_date IS NOT NULL 
        THEN EXTRACT(DAY FROM co.last_order_date - co.first_order_date) / GREATEST(co.order_count - 1, 1)
        ELSE NULL
      END as average_days_between_orders
    FROM customer_orders co
    LEFT JOIN customer_views cv ON co.id = cv.user_id
    ORDER BY co.total_spent DESC
    LIMIT $3
  `;
  
  const result = await db.query(query, [startDate, endDate, limit]);
  
  // Calculate totals
  const totalCustomers = result.rows.length;
  const totalSpent = result.rows.reduce((sum, row) => sum + parseFloat(row.total_spent || 0), 0);
  const totalOrders = result.rows.reduce((sum, row) => sum + parseInt(row.order_count || 0), 0);
  
  // Calculate averages
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const averageCustomerValue = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
  
  const reportData = {
    period: {
      startDate,
      endDate
    },
    summary: {
      totalCustomers,
      totalSpent,
      totalOrders,
      averageOrderValue,
      averageCustomerValue
    },
    customers: result.rows
  };
  
  if (format === 'csv') {
    // Generate CSV for customer data
    const fields = [
      'id', 'email', 'first_name', 'last_name', 'registration_date',
      'order_count', 'total_spent', 'last_order_date', 'first_order_date',
      'view_count', 'products_viewed', 'average_order_value', 'average_days_between_orders'
    ];
    
    const csv = [
      fields.join(','),
      ...result.rows.map(row => {
        return fields.map(field => {
          const value = row[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customer-report.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    data: reportData
  });
});

/**
 * Get inventory report
 */
exports.getInventoryReport = catchAsync(async (req, res) => {
  const { 
    categoryId,
    stockStatus,
    limit = 1000,
    format = 'json' 
  } = req.query;
  
  let query = `
    SELECT 
      p.id,
      p.name,
      p.price,
      p.stock,
      p.view_count,
      c.name as category_name,
      (
        SELECT SUM(oi.quantity)
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.product_id = p.id
          AND o.status != 'cancelled'
          AND o.created_at > NOW() - INTERVAL '30 days'
      ) as monthly_sales,
      CASE 
        WHEN p.stock = 0 THEN 'Out of Stock'
        WHEN p.stock <= 5 THEN 'Low Stock'
        WHEN p.stock <= 20 THEN 'Medium Stock'
        ELSE 'Good Stock'
      END as stock_status
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (categoryId) {
    query += ` AND p.category_id = $${paramIndex++}`;
    queryParams.push(categoryId);
  }
  
  if (stockStatus) {
    if (stockStatus === 'out_of_stock') {
      query += ` AND p.stock = 0`;
    } else if (stockStatus === 'low_stock') {
      query += ` AND p.stock > 0 AND p.stock <= 5`;
    } else if (stockStatus === 'medium_stock') {
      query += ` AND p.stock > 5 AND p.stock <= 20`;
    } else if (stockStatus === 'good_stock') {
      query += ` AND p.stock > 20`;
    }
  }
  
  query += ` ORDER BY p.stock ASC LIMIT $${paramIndex++}`;
  queryParams.push(limit);
  
  const result = await db.query(query, queryParams);
  
  // Get inventory summary
  const summaryQuery = `
    SELECT 
      COUNT(*) as total_products,
      COUNT(*) FILTER (WHERE stock = 0) as out_of_stock,
      COUNT(*) FILTER (WHERE stock > 0 AND stock <= 5) as low_stock,
      COUNT(*) FILTER (WHERE stock > 5 AND stock <= 20) as medium_stock,
      COUNT(*) FILTER (WHERE stock > 20) as good_stock,
      SUM(stock) as total_stock,
      AVG(stock) as average_stock
    FROM products
  `;
  
  const summaryResult = await db.query(summaryQuery);
  
  // Get category breakdown
  const categoryQuery = `
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count,
      SUM(p.stock) as total_stock,
      COUNT(p.id) FILTER (WHERE p.stock = 0) as out_of_stock_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
    ORDER BY product_count DESC
  `;
  
  const categoryResult = await db.query(categoryQuery);
  
  const reportData = {
    summary: summaryResult.rows[0],
    categories: categoryResult.rows,
    products: result.rows
  };
  
  if (format === 'csv') {
    // Generate CSV for inventory data
    const fields = [
      'id', 'name', 'price', 'stock', 'view_count', 
      'category_name', 'monthly_sales', 'stock_status'
    ];
    
    const csv = [
      fields.join(','),
      ...result.rows.map(row => {
        return fields.map(field => {
          const value = row[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    data: reportData
  });
});