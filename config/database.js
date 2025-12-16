const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ebc_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a promise-based pool
const promisePool = pool.promise();

// Test the connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✓ Database connected successfully!');
    console.log(`✓ Connected to database: ${process.env.DB_NAME || 'ebc_portal'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { pool, promisePool, testConnection };
