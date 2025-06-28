const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    console.log('Current time in database:', result.rows[0].now);
  });
});

// Export the pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};