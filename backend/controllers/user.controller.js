const bcrypt = require('bcryptjs');
const db = require('../config/db.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { getUserViewHistory } = require('../services/analytics.service');

/**
 * Get user profile
 */
exports.getProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await db.query(
    `SELECT id, email, first_name, last_name, phone, address, role, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Update user profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, phone, address } = req.body;

  // Build update query dynamically
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (first_name !== undefined) {
    updateFields.push(`first_name = $${paramIndex++}`);
    queryParams.push(first_name);
  }

  if (last_name !== undefined) {
    updateFields.push(`last_name = $${paramIndex++}`);
    queryParams.push(last_name);
  }

  if (phone !== undefined) {
    updateFields.push(`phone = $${paramIndex++}`);
    queryParams.push(phone);
  }

  if (address !== undefined) {
    updateFields.push(`address = $${paramIndex++}`);
    queryParams.push(address);
  }

  // Add updated_at timestamp
  updateFields.push(`updated_at = $${paramIndex++}`);
  queryParams.push(new Date());

  // Add user ID to params
  queryParams.push(userId);

  // Update user if there are fields to update
  if (updateFields.length > 0) {
    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, phone, address, role, created_at
    `;

    const result = await db.query(updateQuery, queryParams);
    const user = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        user
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
 * Get user orders
 */
exports.getUserOrders = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  const ordersQuery = `
    SELECT o.*, 
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM orders 
    WHERE user_id = $1
  `;

  const [ordersResult, countResult] = await Promise.all([
    db.query(ordersQuery, [userId, limit, offset]),
    db.query(countQuery, [userId])
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
 * Get user view history
 */
exports.getViewHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { limit = 10 } = req.query;

  const viewHistory = await getUserViewHistory(userId, limit);

  res.status(200).json({
    status: 'success',
    results: viewHistory.length,
    data: {
      viewHistory
    }
  });
});

/**
 * Get user favorites
 */
exports.getFavorites = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await db.query(
    `SELECT p.*, c.name as category_name
     FROM favorites f
     JOIN products p ON f.product_id = p.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  const favorites = result.rows;

  res.status(200).json({
    status: 'success',
    results: favorites.length,
    data: {
      favorites
    }
  });
});

/**
 * Add product to favorites
 */
exports.addFavorite = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params;

  // Check if product exists
  const productCheck = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [productId]
  );

  if (productCheck.rows.length === 0) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if already in favorites
  const favoriteCheck = await db.query(
    'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (favoriteCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Product is already in favorites'
    });
  }

  // Add to favorites
  await db.query(
    'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)',
    [userId, productId]
  );

  res.status(201).json({
    status: 'success',
    data: {
      message: 'Product added to favorites'
    }
  });
});

/**
 * Remove product from favorites
 */
exports.removeFavorite = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params;

  // Check if in favorites
  const favoriteCheck = await db.query(
    'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (favoriteCheck.rows.length === 0) {
    return next(new AppError('Product not found in favorites', 404));
  }

  // Remove from favorites
  await db.query(
    'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  res.status(200).json({
    status: 'success',
    data: null
  });
});

/**
 * Get all users (admin only)
 */
exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, email, first_name, last_name, phone, role, created_at
    FROM users
  `;
  
  let countQuery = `
    SELECT COUNT(*) FROM users
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (search) {
    query += ` WHERE email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex}`;
    countQuery += ` WHERE email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex}`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }
  
  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  const [usersResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, search ? [`%${search}%`] : [])
  ]);

  const users = usersResult.rows;
  const totalUsers = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalUsers,
      totalPages
    },
    data: {
      users
    }
  });
});

/**
 * Get user by ID (admin only)
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT id, email, first_name, last_name, phone, address, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  const user = result.rows[0];

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Get user orders
  const ordersResult = await db.query(
    `SELECT id, status, total_amount, created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 5`,
    [id]
  );

  user.orders = ordersResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Update user (admin only)
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { email, first_name, last_name, phone, address, role } = req.body;

  // Check if user exists
  const userCheck = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (userCheck.rows.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Check if email is unique if provided
  if (email) {
    const emailCheck = await db.query(
      'SELECT * FROM users WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
  }

  // Build update query dynamically
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (email !== undefined) {
    updateFields.push(`email = $${paramIndex++}`);
    queryParams.push(email);
  }

  if (first_name !== undefined) {
    updateFields.push(`first_name = $${paramIndex++}`);
    queryParams.push(first_name);
  }

  if (last_name !== undefined) {
    updateFields.push(`last_name = $${paramIndex++}`);
    queryParams.push(last_name);
  }

  if (phone !== undefined) {
    updateFields.push(`phone = $${paramIndex++}`);
    queryParams.push(phone);
  }

  if (address !== undefined) {
    updateFields.push(`address = $${paramIndex++}`);
    queryParams.push(address);
  }

  if (role !== undefined) {
    updateFields.push(`role = $${paramIndex++}`);
    queryParams.push(role);
  }

  // Add updated_at timestamp
  updateFields.push(`updated_at = $${paramIndex++}`);
  queryParams.push(new Date());

  // Add user ID to params
  queryParams.push(id);

  // Update user if there are fields to update
  if (updateFields.length > 0) {
    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, phone, address, role, created_at
    `;

    const result = await db.query(updateQuery, queryParams);
    const user = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        user
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
 * Delete user (admin only)
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if user exists
  const userCheck = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (userCheck.rows.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Check if user has orders
  const ordersCheck = await db.query(
    'SELECT * FROM orders WHERE user_id = $1',
    [id]
  );

  if (ordersCheck.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete user with orders. Please delete or reassign orders first.'
    });
  }

  // Delete user
  await db.query(
    'DELETE FROM users WHERE id = $1',
    [id]
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});