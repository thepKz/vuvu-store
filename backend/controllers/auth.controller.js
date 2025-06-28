const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db.config');
const { catchAsync, AppError } = require('../middleware/errorHandler');

/**
 * Generate JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Create and send JWT token
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * Register a new user
 */
exports.register = catchAsync(async (req, res, next) => {
  const { email, password, first_name, last_name, phone, address } = req.body;

  // Check if email already exists
  const existingUser = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    return next(new AppError('Email already in use', 400));
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
      'customer'
    ]
  );

  // Create and send token
  createSendToken(newUser.rows[0], 201, res);
});

/**
 * Login user
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists and password is correct
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Create and send token
  createSendToken(user, 200, res);
});

/**
 * Get current user profile
 */
exports.getMe = catchAsync(async (req, res, next) => {
  // User is already available in req.user from authMiddleware
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

/**
 * Update password
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [req.user.id]
  );

  const user = result.rows[0];

  // Check if current password is correct
  if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  const updatedUser = await db.query(
    `UPDATE users 
     SET password_hash = $1, password_changed_at = $2
     WHERE id = $3
     RETURNING id, email, first_name, last_name, phone, address, role, created_at`,
    [hashedPassword, new Date(), req.user.id]
  );

  // Create and send token
  createSendToken(updatedUser.rows[0], 200, res);
});

/**
 * Forgot password
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const passwordResetExpires = new Date(
    Date.now() + 10 * 60 * 1000 // 10 minutes
  );

  // Save reset token to database
  await db.query(
    `UPDATE users 
     SET password_reset_token = $1, password_reset_expires = $2
     WHERE id = $3`,
    [passwordResetToken, passwordResetExpires, user.id]
  );

  // Send email with reset token (implementation depends on email service)
  // For now, just return the token in development environment
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      resetToken
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!'
  });
});

/**
 * Reset password
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token from params
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const result = await db.query(
    `SELECT * FROM users 
     WHERE password_reset_token = $1 
     AND password_reset_expires > $2`,
    [hashedToken, new Date()]
  );

  const user = result.rows[0];

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const updatedUser = await db.query(
    `UPDATE users 
     SET password_hash = $1, 
         password_reset_token = NULL, 
         password_reset_expires = NULL,
         password_changed_at = $2
     WHERE id = $3
     RETURNING id, email, first_name, last_name, phone, address, role, created_at`,
    [hashedPassword, new Date(), user.id]
  );

  // Create and send token
  createSendToken(updatedUser.rows[0], 200, res);
});