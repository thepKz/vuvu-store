/**
 * Format price as currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: VND)
 * @returns {string} - Formatted price
 */
exports.formatPrice = (price, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency
  }).format(price);
};

/**
 * Calculate discount percentage
 * @param {number} currentPrice - Current price
 * @param {number} originalPrice - Original price
 * @returns {number} - Discount percentage
 */
exports.calculateDiscount = (currentPrice, originalPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  return Math.round((1 - (currentPrice / originalPrice)) * 100);
};

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: vi-VN)
 * @returns {string} - Formatted date
 */
exports.formatDate = (date, locale = 'vi-VN') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format datetime
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: vi-VN)
 * @returns {string} - Formatted datetime
 */
exports.formatDateTime = (date, locale = 'vi-VN') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
exports.formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
exports.truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.substring(0, length) + '...';
};

/**
 * Slugify text
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
exports.slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};