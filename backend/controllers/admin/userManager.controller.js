const db = require('../../config/db.config');
const bcrypt = require('bcryptjs');
const { catchAsync, AppError } = require('../../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all users with filtering and pagination
 */
exports.getAllUsers = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    sort = 'created_at', 
    order = 'desc',
    search,
    role,
    startDate,
    endDate
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, email, first_name, last_name, phone, role, created_at, updated_at
    FROM users
    WHERE 1=1
  `;
  
  let countQuery = `
    SELECT COUNT(*) FROM users
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (search) {
    query += ` AND (email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
    countQuery += ` AND (email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }
  
  if (role) {
    query += ` AND role = $${paramIndex}`;
    countQuery += ` AND role = $${paramIndex}`;
    queryParams.push(role);
    paramIndex++;
  }
  
  if (startDate) {
    query += ` AND created_at >= $${paramIndex}`;
    countQuery += ` AND created_at >= $${paramIndex}`;
    queryParams.push(new Date(startDate));
    paramIndex++;
  }
  
  if (endDate) {
    query += ` AND created_at <= $${paramIndex}`;
    countQuery += ` AND created_at <= $${paramIndex}`;
    queryParams.push(new Date(endDate));
    paramIndex++;
  }
  
  query += ` ORDER BY ${sort} ${order.toUpperCase()} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  queryParams.push(limit, offset);

  const [usersResult, countResult] = await Promise.all([
    db.query(query, queryParams),
    db.query(countQuery, queryParams.slice(0, paramIndex - 2))
  ]);

  const users = usersResult.rows;
  const totalCount = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages
    },
    data: {
      users
    }
  });
});

/**
 * Get user by ID
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const userResult = await db.query(
    `SELECT id, email, first_name, last_name, phone, address, role, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  const user = userResult.rows[0];

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Get user orders
  const ordersResult = await db.query(
    `SELECT id, status, total_amount, created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [id]
  );

  // Get user activity
  const activityResult = await db.query(
    `SELECT *
     FROM user_activity
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 20`,
    [id]
  );

  // Get user favorites
  const favoritesResult = await db.query(
    `SELECT p.id, p.name, p.image
     FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1
     LIMIT 10`,
    [id]
  );

  user.orders = ordersResult.rows;
  user.activity = activityResult.rows;
  user.favorites = favoritesResult.rows;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Create a new user
 */
exports.createUser = catchAsync(async (req, res) => {
  const { email, password, first_name, last_name, phone, address, role } = req.body;

  // Check if email already exists
  const existingUser = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already in use'
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await db.query(
    `INSERT INTO users (
      id, email, password_hash, first_name, last_name, phone, address, role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, first_name, last_name, phone, address, role, created_at`,
    [
      uuidv4(),
      email,
      hashedPassword,
      first_name,
      last_name,
      phone || null,
      address || null,
      role || 'customer'
    ]
  );

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser.rows[0]
    }
  });
});

/**
 * Update user
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
      RETURNING id, email, first_name, last_name, phone, address, role, created_at, updated_at
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
 * Reset user password
 */
exports.resetUserPassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'New password is required'
    });
  }

  // Check if user exists
  const userCheck = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (userCheck.rows.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await db.query(
    `UPDATE users 
     SET password_hash = $1, 
         password_changed_at = $2,
         updated_at = $2
     WHERE id = $3`,
    [hashedPassword, new Date(), id]
  );

  res.status(200).json({
    status: 'success',
    message: 'Password has been reset successfully'
  });
});

/**
 * Delete user
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
    'SELECT COUNT(*) FROM orders WHERE user_id = $1',
    [id]
  );

  if (parseInt(ordersCheck.rows[0].count) > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete user with orders. Please anonymize the user instead.'
    });
  }

  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Delete user's favorites
    await client.query(
      'DELETE FROM favorites WHERE user_id = $1',
      [id]
    );

    // Delete user's product views
    await client.query(
      'DELETE FROM product_views WHERE user_id = $1',
      [id]
    );

    // Delete user's activity
    await client.query(
      'DELETE FROM user_activity WHERE user_id = $1',
      [id]
    );

    // Delete user's reviews
    await client.query(
      'DELETE FROM reviews WHERE user_id = $1',
      [id]
    );

    // Delete user
    await client.query(
      'DELETE FROM users WHERE id = $1',
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

/**
 * Anonymize user
 */
exports.anonymizeUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if user exists
  const userCheck = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (userCheck.rows.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Generate random values
  const randomEmail = `anonymized-${Date.now()}@example.com`;
  const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);

  // Update user with anonymized data
  await db.query(
    `UPDATE users 
     SET email = $1, 
         password_hash = $2,
         first_name = 'Anonymized',
         last_name = 'User',
         phone = NULL,
         address = NULL,
         updated_at = $3
     WHERE id = $4`,
    [randomEmail, randomPassword, new Date(), id]
  );

  res.status(200).json({
    status: 'success',
    message: 'User has been anonymized successfully'
  });
});

/**
 * Get user statistics
 */
exports.getUserStats = catchAsync(async (req, res) => {
  // Get user counts by role
  const usersByRoleQuery = `
    SELECT 
      role,
      COUNT(*) as count
    FROM users
    GROUP BY role
    ORDER BY count DESC
  `;
  
  // Get new users over time
  const newUsersQuery = `
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as count
    FROM users
    WHERE created_at > NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month
  `;
  
  // Get active users (users with orders)
  const activeUsersQuery = `
    SELECT 
      COUNT(DISTINCT user_id) as active_users
    FROM orders
    WHERE created_at > NOW() - INTERVAL '30 days'
  `;
  
  const [
    usersByRole,
    newUsers,
    activeUsers
  ] = await Promise.all([
    db.query(usersByRoleQuery),
    db.query(newUsersQuery),
    db.query(activeUsersQuery)
  ]);
  
  // Calculate total users
  const totalUsersQuery = `SELECT COUNT(*) as total FROM users`;
  const totalUsers = await db.query(totalUsersQuery);
  
  res.status(200).json({
    status: 'success',
    data: {
      totalUsers: parseInt(totalUsers.rows[0].total),
      activeUsers: parseInt(activeUsers.rows[0].active_users),
      usersByRole: usersByRole.rows,
      newUsers: newUsers.rows
    }
  });
});

/**
 * Export users
 */
exports.exportUsers = catchAsync(async (req, res) => {
  const { format = 'json', role } = req.query;
  
  let query = `
    SELECT id, email, first_name, last_name, phone, role, created_at, updated_at
    FROM users
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramIndex = 1;
  
  if (role) {
    query += ` AND role = $${paramIndex++}`;
    queryParams.push(role);
  }
  
  query += ` ORDER BY created_at DESC`;
  
  const usersResult = await db.query(query, queryParams);
  const users = usersResult.rows;
  
  if (format === 'csv') {
    // Generate CSV
    const fields = [
      'id', 'email', 'first_name', 'last_name', 'phone', 'role', 'created_at'
    ];
    
    const csv = [
      fields.join(','),
      ...users.map(user => {
        return fields.map(field => {
          const value = user[field];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',');
      })
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    return res.send(csv);
  }
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});