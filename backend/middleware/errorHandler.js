/**
 * Global error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response (detailed)
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production error response (clean)
  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // PostgreSQL unique constraint error
  if (err.code === '23505') {
    error.message = 'Duplicate field value. Please use another value.';
    error.statusCode = 400;
  }

  // PostgreSQL foreign key constraint error
  if (err.code === '23503') {
    error.message = 'Related record not found. Please check your input.';
    error.statusCode = 400;
  }

  // PostgreSQL not null constraint error
  if (err.code === '23502') {
    error.message = 'Required field missing. Please check your input.';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again.';
    error.statusCode = 401;
  }

  // Send generic error for production
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message || 'Something went wrong'
  });
};

/**
 * Async error handler wrapper
 * Eliminates need for try/catch blocks in controllers
 */
exports.catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Custom error class
 */
exports.AppError = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
};