/**
 * User model
 * 
 * This file defines the structure and validation for user data
 */

/**
 * Validate user registration data
 * @param {Object} data - User data to validate
 * @returns {Object} - Validation result with errors if any
 */
exports.validateRegistration = (data) => {
  const errors = {};

  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Validate name
  if (!data.first_name) {
    errors.first_name = 'First name is required';
  }

  if (!data.last_name) {
    errors.last_name = 'Last name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate user update data
 * @param {Object} data - User data to validate
 * @returns {Object} - Validation result with errors if any
 */
exports.validateUpdate = (data) => {
  const errors = {};

  // Validate email if provided
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  // Validate phone if provided
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Please provide a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format user data for response
 * @param {Object} user - Raw user data from database
 * @returns {Object} - Formatted user data
 */
exports.formatUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: `${user.first_name} ${user.last_name}`,
    phone: user.phone,
    address: user.address,
    role: user.role,
    created_at: user.created_at
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}