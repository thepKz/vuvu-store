const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../config/db.config');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const result = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    const currentUser = result.rows[0];
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    const passwordChangedResult = await db.query(
      'SELECT password_changed_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (passwordChangedResult.rows[0]?.password_changed_at) {
      const changedTimestamp = parseInt(
        passwordChangedResult.rows[0].password_changed_at.getTime() / 1000,
        10
      );

      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          status: 'error',
          message: 'User recently changed password. Please log in again.'
        });
      }
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};

/**
 * Role-based authorization middleware
 * Restricts access based on user role
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};