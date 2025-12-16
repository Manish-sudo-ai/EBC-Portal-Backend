const express = require('express');
require('dotenv').config();
const { promisePool, testConnection } = require('./config/database');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to EBC Portal Backend API',
    status: 'Server is running'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1 + 1 AS result, NOW() AS server_time, DATABASE() AS database_name');
    res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get all tables in the database
app.get('/db-tables', async (req, res) => {
  try {
    const [tables] = await promisePool.query('SHOW TABLES');
    res.status(200).json({
      success: true,
      database: process.env.DB_NAME || 'ebc_portal',
      tables: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message
    });
  }
});

// Get all users from the database
app.get('/users', async (req, res) => {
  try {
    const [users] = await promisePool.query('SELECT id, username, email, created_at, updated_at FROM users');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server and test database connection
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`\n📊 Available endpoints:`);
      console.log(`   GET  /           - Welcome message`);
      console.log(`   GET  /health     - Health check`);
      console.log(`   GET  /db-test    - Test database connection`);
      console.log(`   GET  /db-tables  - List all database tables`);
      console.log(`   GET  /users      - Get all users`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
