const db = require('../config/db.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new order
 */
exports.createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { 
    items, 
    shipping_address, 
    payment_method,
    total_amount
  } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Order must contain at least one item'
    });
  }

  if (!shipping_address) {
    return res.status(400).json({
      status: 'error',
      message: 'Shipping address is required'
    });
  }

  if (!payment_method) {
    return res.status(400).json({
      status: 'error',
      message: 'Payment method is required'
    });
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Calculate total amount if not provided
    let calculatedTotal = 0;
    
    if (!total_amount) {
      for (const item of items) {
        // Get product price
        let price;
        
        if (item.variant_id) {
          // Get variant price
          const variantResult = await client.query(
            'SELECT price FROM product_variants WHERE id = $1',
            [item.variant_id]
          );
          
          if (variantResult.rows.length === 0) {
            throw new AppError(`Variant with ID ${item.variant_id} not found`, 404);
          }
          
          price = variantResult.rows[0].price;
        } else {
          // Get product price
          const productResult = await client.query(
            'SELECT price FROM products WHERE id = $1',
            [item.product_id]
          );
          
          if (productResult.rows.length === 0) {
            throw new AppError(`Product with ID ${item.product_id} not found`, 404);
          }
          
          price = productResult.rows[0].price;
        }
        
        calculatedTotal += price * item.quantity;
      }
    }
    
    // Create order
    const orderId = uuidv4();
    const orderResult = await client.query(
      `INSERT INTO orders (
        id, user_id, status, total_amount, shipping_address, payment_method, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        orderId,
        userId,
        'pending',
        total_amount || calculatedTotal,
        shipping_address,
        payment_method,
        'pending'
      ]
    );
    
    const order = orderResult.rows[0];
    
    // Create order items
    for (const item of items) {
      // Get product price
      let price;
      
      if (item.variant_id) {
        // Get variant price
        const variantResult = await client.query(
          'SELECT price, stock FROM product_variants WHERE id = $1',
          [item.variant_id]
        );
        
        if (variantResult.rows.length === 0) {
          throw new AppError(`Variant with ID ${item.variant_id} not found`, 404);
        }
        
        price = variantResult.rows[0].price;
        
        // Check stock
        if (variantResult.rows[0].stock < item.quantity) {
          throw new AppError(`Not enough stock for variant with ID ${item.variant_id}`, 400);
        }
        
        // Update stock
        await client.query(
          'UPDATE product_variants SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
      } else {
        // Get product price
        const productResult = await client.query(
          'SELECT price, stock FROM products WHERE id = $1',
          [item.product_id]
        );
        
        if (productResult.rows.length === 0) {
          throw new AppError(`Product with ID ${item.product_id} not found`, 404);
        }
        
        price = productResult.rows[0].price;
        
        // Check stock
        if (productResult.rows[0].stock < item.quantity) {
          throw new AppError(`Not enough stock for product with ID ${item.product_id}`, 400);
        }
        
        // Update stock
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
      
      // Create order item
      await client.query(
        `INSERT INTO order_items (
          id, order_id, product_id, variant_id, quantity, price
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          uuidv4(),
          orderId,
          item.product_id,
          item.variant_id || null,
          item.quantity,
          price
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

/**
 * Get all orders (admin only)
 */
exports.getAllOrders = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    sort = 'created_at', 
    order = 'desc',
    search
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
  
  query += ` ORDER BY o.${sort} ${order.toUpperCase()} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  const [ordersResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, queryParams.slice(0, paramIndex - 2))
  ]);

  const orders = ordersResult.rows;
  const totalOrders = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalOrders,
      totalPages
    },
    data: {
      orders
    }
  });
});

/**
 * Get user's own orders
 */
exports.getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const offset = (page - 1) * limit;
  
  let query = `
    SELECT o.*, 
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    WHERE o.user_id = $1
  `;
  
  let countQuery = `
    SELECT COUNT(*) FROM orders WHERE user_id = $1
  `;
  
  const queryParams = [userId];
  let paramIndex = 2;
  
  if (status) {
    query += ` AND o.status = $${paramIndex}`;
    countQuery += ` AND status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }
  
  query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  const [ordersResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, queryParams.slice(0, paramIndex - 2))
  ]);

  const orders = ordersResult.rows;
  const totalOrders = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalOrders,
      totalPages
    },
    data: {
      orders
    }
  });
});

/**
 * Get order by ID (admin only)
 */
exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderResult = await db.query(
    `SELECT o.*, u.email, u.first_name, u.last_name
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
            pv.name as variant_name
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     LEFT JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = $1`,
    [id]
  );

  order.items = itemsResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Get user's own order by ID
 */
exports.getMyOrderById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const orderResult = await db.query(
    `SELECT *
     FROM orders
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  const order = orderResult.rows[0];

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Get order items
  const itemsResult = await db.query(
    `SELECT oi.*, p.name as product_name, p.image as product_image,
            pv.name as variant_name
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     LEFT JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = $1`,
    [id]
  );

  order.items = itemsResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Update order (admin only)
 */
exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  // Check if order exists
  const orderCheck = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );

  if (orderCheck.rows.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

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

    const result = await db.query(updateQuery, queryParams);
    const order = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'No fields to update'
    });
  }
});

/**
 * Delete order (admin only)
 */
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if order exists
  const orderCheck = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );

  if (orderCheck.rows.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Get order items
    const itemsResult = await client.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    const items = itemsResult.rows;

    // Restore stock for each item
    for (const item of items) {
      if (item.variant_id) {
        // Restore variant stock
        await client.query(
          'UPDATE product_variants SET stock = stock + $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
      } else {
        // Restore product stock
        await client.query(
          'UPDATE products SET stock = stock + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
    }

    // Delete order items
    await client.query(
      'DELETE FROM order_items WHERE order_id = $1',
      [id]
    );

    // Delete order
    await client.query(
      'DELETE FROM orders WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});