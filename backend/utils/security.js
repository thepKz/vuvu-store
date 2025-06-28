const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Generate a random token
 * @param {number} bytes - Number of bytes
 * @returns {string} - Random token
 */
exports.generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

/**
 * Compare password with hash
 * @param {string} password - Password to compare
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - Whether password matches
 */
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration
 * @returns {string} - JWT token
 */
exports.generateToken = (id, secret, expiresIn = '90d') => {
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Promise<Object>} - Decoded token
 */
exports.verifyToken = async (token, secret) => {
  return await jwt.verify(token, secret);
};

/**
 * Hash data with SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
exports.hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate a secure random password
 * @param {number} length - Password length
 * @returns {string} - Random password
 */
exports.generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/\//g, '/');
};