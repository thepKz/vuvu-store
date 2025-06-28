const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file paths
const accessLogPath = path.join(logsDir, 'access.log');
const errorLogPath = path.join(logsDir, 'error.log');

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level}] ${message} ${metaString}\n`;
};

/**
 * Write to log file
 * @param {string} filePath - Path to log file
 * @param {string} message - Log message
 */
const writeToLog = (filePath, message) => {
  fs.appendFile(filePath, message, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

/**
 * Logger object
 */
const logger = {
  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  info: (message, meta = {}) => {
    const logMessage = formatLogMessage(LogLevel.INFO, message, meta);
    console.log(logMessage);
    writeToLog(accessLogPath, logMessage);
  },
  
  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  warn: (message, meta = {}) => {
    const logMessage = formatLogMessage(LogLevel.WARN, message, meta);
    console.warn(logMessage);
    writeToLog(accessLogPath, logMessage);
  },
  
  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  error: (message, meta = {}) => {
    const logMessage = formatLogMessage(LogLevel.ERROR, message, meta);
    console.error(logMessage);
    writeToLog(errorLogPath, logMessage);
  },
  
  /**
   * Log debug message (only in development)
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = formatLogMessage(LogLevel.DEBUG, message, meta);
      console.debug(logMessage);
    }
  },
  
  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  request: (req, res) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
      userAgent: req.headers['user-agent']
    };
    
    logger.info('HTTP Request', meta);
  }
};

module.exports = logger;