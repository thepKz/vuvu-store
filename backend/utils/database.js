const db = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

/**
 * Create database tables if they don't exist
 */
exports.initializeDatabase = async () => {
  try {
    // Check if tables exist
    const tablesExist = await checkTablesExist();
    
    if (!tablesExist) {
      console.log('Initializing database tables...');
      
      // Read and execute migration files
      const fs = require('fs');
      const path = require('path');
      
      const migrationsDir = path.join(__dirname, '../migrations');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      for (const file of migrationFiles) {
        console.log(`Executing migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await db.query(sql);
      }
      
      console.log('Database initialization complete');
    } else {
      console.log('Database tables already exist');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Check if required tables exist
 */
async function checkTablesExist() {
  try {
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if tables exist:', error);
    return false;
  }
}

/**
 * Generate a UUID
 */
exports.generateId = () => {
  return uuidv4();
};

/**
 * Execute a transaction
 * @param {Function} callback - Function to execute within transaction
 */
exports.transaction = async (callback) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};