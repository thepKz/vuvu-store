const db = require('../../config/db.config');
const { catchAsync, AppError } = require('../../middleware/errorHandler');

/**
 * Get all system settings
 */
exports.getAllSettings = catchAsync(async (req, res) => {
  const result = await db.query('SELECT * FROM settings ORDER BY key');
  
  const settings = {};
  
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

/**
 * Update system settings
 */
exports.updateSettings = catchAsync(async (req, res) => {
  const { settings } = req.body;
  
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({
      status: 'error',
      message: 'Settings object is required'
    });
  }
  
  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    for (const [key, value] of Object.entries(settings)) {
      // Check if setting exists
      const settingCheck = await client.query(
        'SELECT * FROM settings WHERE key = $1',
        [key]
      );
      
      if (settingCheck.rows.length > 0) {
        // Update existing setting
        await client.query(
          'UPDATE settings SET value = $1, updated_at = $2 WHERE key = $3',
          [value, new Date(), key]
        );
      } else {
        // Create new setting
        await client.query(
          'INSERT INTO settings (key, value, created_at, updated_at) VALUES ($1, $2, $3, $4)',
          [key, value, new Date(), new Date()]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Get updated settings
    const result = await db.query('SELECT * FROM settings ORDER BY key');
    
    const updatedSettings = {};
    
    for (const row of result.rows) {
      updatedSettings[row.key] = row.value;
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        settings: updatedSettings
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
 * Get specific setting group
 */
exports.getSettingGroup = catchAsync(async (req, res) => {
  const { group } = req.params;
  
  // Define valid groups and their prefixes
  const validGroups = {
    general: 'site_',
    payment: 'payment_',
    shipping: 'shipping_',
    email: 'email_',
    analytics: 'analytics_',
    social: 'social_'
  };
  
  if (!validGroups[group]) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid setting group'
    });
  }
  
  const prefix = validGroups[group];
  
  const result = await db.query(
    `SELECT * FROM settings WHERE key LIKE $1 ORDER BY key`,
    [`${prefix}%`]
  );
  
  const settings = {};
  
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      group,
      settings
    }
  });
});

/**
 * Get system information
 */
exports.getSystemInfo = catchAsync(async (req, res) => {
  // Get database size
  const dbSizeQuery = `
    SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
  `;
  
  // Get table counts
  const tableCountsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM products) as products_count,
      (SELECT COUNT(*) FROM categories) as categories_count,
      (SELECT COUNT(*) FROM collections) as collections_count,
      (SELECT COUNT(*) FROM users) as users_count,
      (SELECT COUNT(*) FROM orders) as orders_count,
      (SELECT COUNT(*) FROM product_views) as views_count
  `;
  
  // Get system version
  const versionQuery = `
    SELECT version() as pg_version
  `;
  
  const [
    dbSize,
    tableCounts,
    version
  ] = await Promise.all([
    db.query(dbSizeQuery),
    db.query(tableCountsQuery),
    db.query(versionQuery)
  ]);
  
  // Get environment info
  const environment = process.env.NODE_ENV || 'development';
  const serverInfo = {
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
  
  res.status(200).json({
    status: 'success',
    data: {
      environment,
      server: serverInfo,
      database: {
        size: dbSize.rows[0].db_size,
        version: version.rows[0].pg_version,
        counts: tableCounts.rows[0]
      }
    }
  });
});

/**
 * Clear cache
 */
exports.clearCache = catchAsync(async (req, res) => {
  // In a real application, this would clear any caching system
  // For this example, we'll just return a success message
  
  res.status(200).json({
    status: 'success',
    message: 'Cache cleared successfully'
  });
});

/**
 * Run database maintenance
 */
exports.runMaintenance = catchAsync(async (req, res) => {
  // Start a transaction
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Vacuum analyze tables
    await client.query('VACUUM ANALYZE');
    
    // Clean up old product views (older than 90 days)
    const cleanupResult = await client.query(
      `DELETE FROM product_views 
       WHERE created_at < NOW() - INTERVAL '90 days'
       RETURNING COUNT(*) as deleted_count`
    );
    
    // Clean up old user activity (older than 90 days)
    const activityCleanupResult = await client.query(
      `DELETE FROM user_activity 
       WHERE created_at < NOW() - INTERVAL '90 days'
       RETURNING COUNT(*) as deleted_count`
    );
    
    // Clean up old search queries (older than 90 days)
    const searchCleanupResult = await client.query(
      `DELETE FROM search_queries 
       WHERE created_at < NOW() - INTERVAL '90 days'
       RETURNING COUNT(*) as deleted_count`
    );
    
    await client.query('COMMIT');
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Maintenance completed successfully',
        deleted: {
          product_views: parseInt(cleanupResult.rows[0]?.deleted_count || 0),
          user_activity: parseInt(activityCleanupResult.rows[0]?.deleted_count || 0),
          search_queries: parseInt(searchCleanupResult.rows[0]?.deleted_count || 0)
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});