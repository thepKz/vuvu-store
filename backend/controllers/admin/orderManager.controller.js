const db = require('../../config/db.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

/**
 * Get all orders with advanced filtering for admin
 */
exports.getAllOrders = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    sort = 'created_at', 
    order = 'desc',
    search,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    paymentMethod,
    paymentStatus
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = `
    SELECT o.*, 
           u.email, u.first_name, u.last_name,
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  let countQuery = `
    SELECT COUNT(*) FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (status) {
    query += ` AND o.status = $${paramIndex}`;
    countQuery += ` AND o.status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }
  
  if (search) {
    query += ` AND (u.email ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR o.id::text ILIKE $${paramIndex})`;
    countQuery += ` AND (u.email ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR o.id::text ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }
  
  if (startDate) {
    query += ` AND o.created_at >= $${paramIndex}`;
    countQuery += ` AND o.created_at >= $${paramIndex}`;
    queryParams.push(new Date(startDate));
    paramIndex++;
  }
  
  if (endDate) {
    query += ` AND o.created_at <= $${paramIndex}`;
    countQuery += ` AND o.created_at <= $${paramIndex}`;
    queryParams.push(new Date(endDate));
    paramIndex++;
  }
  
  if (minAmount) {
    query += ` AND o.total_amount >= $${paramIndex}`;
    countQuery += ` AND o.total_amount >= $${paramIndex}`;
    queryParams.push(minAmount);
    paramIndex++;
  }
  
  if (maxAmount) {
    query += ` AND o.total_amount <= $${paramIndex}`;
    countQuery += ` AND o.total_amount <= $${paramIndex}`;
    queryParams.push(maxAmount);
    paramIndex++;
  }
  
  if (paymentMethod) {
    query += ` AND o.payment_method = $${paramIndex}`;
    countQuery += ` AND o.payment_method = $${paramIndex}`;
    queryParams.push(paymentMethod);
    paramIndex++;
  }
  
  if (paymentStatus) {
    query += ` AND o.payment_status = $${paramIndex}`;
    countQuery += ` AND o.payment_status = $${paramIndex}`;
    queryParams.push(paymentStatus);
    paramIndex++;
  }
  
  query += ` ORDER BY o.${sort} ${order.toUpperCase()} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  const [ordersResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, queryParams.slice(0, paramIndex - 2))
  ]);

  const orders = ordersResult.rows;
  const totalCount = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages
    },
    data: {
      orders
    }
  });
});

/**
 * Get order details by ID
 */
exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderResult = await db.query(
    `SELECT o.*, u.email, u.first_name, u.last_name, u.phone, u.address
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = $1`,
    [id]
  );

  const order = orderResult.rows[0];

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Get order items
  const itemsResult = await db.query(
    `SELECT oi.*, p.name as product_name, p.image as product_image,
            pv.name as variant_name, pv.image as variant_image
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     LEFT JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = $1`,
    [id]
  );

  // Get order history
  const historyResult = await db.query(
    `SELECT * FROM order_history
     WHERE order_id = $1
     ORDER BY created_at DESC`,
    [id]
  );

  order.items = itemsResult.rows;
  order.history = historyResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Update order status
 */
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, payment_status, notes } = req.body;

  // Check if order exists
  const orderCheck = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );

  if (orderCheck.rows.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

  const oldOrder = orderCheck.rows[0];
  
  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Build update query dynamically
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (payment_status !== undefined) {
      updateFields.push(`payment_status = $${paramIndex++}`);
      queryParams.push(payment_status);
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = $${paramIndex++}`);
    queryParams.push(new Date());

    // Add order ID to params
    queryParams.push(id);

    // Update order if there are fields to update
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE orders
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const orderResult = await client.query(updateQuery, queryParams);
      const updatedOrder = orderResult.rows[0];
      
      // Create order history entry
      if (status !== undefined && status !== oldOrder.status) {
        await client.query(
          `INSERT INTO order_history (
            id, order_id, status, notes, created_by
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            uuidv4(),
            id,
            status,
            notes || `Status changed from ${oldOrder.status} to ${status}`,
            req.user.id
          ]
        );
      }
      
      if (payment_status !== undefined && payment_status !== oldOrder.payment_status) {
        await client.query(
          `INSERT INTO order_history (
            id, order_id, status, notes, created_by
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            uuidv4(),
            id,
            `payment_${payment_status}`,
            notes || `Payment status changed from ${oldOrder.payment_status} to ${payment_status}`,
            req.user.id
          ]
        );
      }
      
      await client.query('COMMIT');

      res.status(200).json({
        status: 'success',
        data: {
          order: updatedOrder
        }
      });
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Add order note
 */
exports.addOrderNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({
      status: 'error',
      message: 'Notes are required'
    });
  }

  // Check if order exists
  const orderCheck = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );

  if (orderCheck.rows.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Create order history entry
  const historyResult = await db.query(
    `INSERT INTO order_history (
      id, order_id, status, notes, created_by
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      uuidv4(),
      id,
      'note',
      notes,
      req.user.id
    ]
  );

  res.status(201).json({
    status: 'success',
    data: {
      history: historyResult.rows[0]
    }
  });
});

/**
 * Export orders
 */
exports.exportOrders = catchAsync(async (req, res) => {
  const { format = 'json', startDate, endDate, status } = req.query;
  
  let query = `
    SELECT o.*, 
           u.email, u.first_name, u.last_name,
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (startDate) {
    query += ` AND o.created_at >= $${paramIndex++}`;
    queryParams.push(new Date(startDate));
  }
  
  if (endDate) {
    query += ` AND o.created_at <= $${paramIndex++}`;
    queryParams.push(new Date(endDate));
  }
  
  if (status) {
    query += ` AND o.status = $${paramIndex++}`;
    queryParams.push(status);
  }
  
  query += ` ORDER BY o.created_at DESC`;
  
  const ordersResult = await db.query(query, queryParams);
  const orders = ordersResult.rows;
  
  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const itemsResult = await db.query(
        `SELECT oi.*, p.name as product_name, pv.name as variant_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         LEFT JOIN product_variants pv ON oi.variant_id = pv.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      
      return {
        ...order,
        items: itemsResult.rows
      };
    })
  );
  
  if (format === 'csv') {
    // Generate CSV
    const fields = [
      'id', 'user_id', 'email', 'first_name', 'last_name', 'status',
      'total_amount', 'payment_method', 'payment_status', 'created_at'
    ];
    
    const csv = [
      fields.join(','),
      ...ordersWithItems.map(order => {
        return fields.map(field => {
          const value = order[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders: ordersWithItems
    }
  });
});

/**
 * Get order statistics
 */
exports.getOrderStats = catchAsync(async (req, res) => {
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
  
  // Get order counts by status
  const statusCountsQuery = `
    SELECT 
      status,
      COUNT(*) as count
    FROM orders
    WHERE ${timeFilter}
    GROUP BY status
    ORDER BY count DESC
  `;
  
  // Get order counts by payment status
  const paymentStatusCountsQuery = `
    SELECT 
      payment_status,
      COUNT(*) as count
    FROM orders
    WHERE ${timeFilter}
    GROUP BY payment_status
    ORDER BY count DESC
  `;
  
  // Get order counts by payment method
  const paymentMethodCountsQuery = `
    SELECT 
      payment_method,
      COUNT(*) as count
    FROM orders
    WHERE ${timeFilter}
    GROUP BY payment_method
    ORDER BY count DESC
  `;
  
  // Get order counts by date
  const ordersByDateQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count,
      SUM(total_amount) as total_amount
    FROM orders
    WHERE ${timeFilter}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  const [
    statusCounts,
    paymentStatusCounts,
    paymentMethodCounts,
    ordersByDate
  ] = await Promise.all([
    db.query(statusCountsQuery),
    db.query(paymentStatusCountsQuery),
    db.query(paymentMethodCountsQuery),
    db.query(ordersByDateQuery)
  ]);
  
  // Calculate totals
  const totalOrders = ordersByDate.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
  const totalAmount = ordersByDate.rows.reduce((sum, row) => sum + parseFloat(row.total_amount), 0);
  const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      period,
      totalOrders,
      totalAmount,
      averageOrderValue,
      statusCounts: statusCounts.rows,
      paymentStatusCounts: paymentStatusCounts.rows,
      paymentMethodCounts: paymentMethodCounts.rows,
      ordersByDate: ordersByDate.rows
    }
  });
});