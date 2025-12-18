const express = require('express');
require('dotenv').config();
const { promisePool, testConnection } = require('./config/database');
const admin = require('./config/firebase');
const cors = require('cors');

// Firebase Auth Middleware
const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
};

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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

// Example protected route using Firebase Auth
app.get('/protected', firebaseAuth, (req, res) => {
  res.status(200).json({
    message: 'You are authenticated with Firebase!',
    user: req.user
  });
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
      console.log(`   GET  /protected  - Firebase Auth protected route`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
