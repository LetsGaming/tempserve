const mysql = require('mysql2');
const loadEnv = require('../utils/envUtils.js');
const logger = require('../utils/logger.js');

// Load environment variables
loadEnv();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`Environment variable ${key} is missing.`);
    process.exit(1); // Exit the process if required variables are missing
  }
});

// Database configuration as a separate function to improve flexibility
const createDbPool = () => {
  return mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Ensure pool waits for available connections
    queueLimit: 0  // No limit for queueing connection requests
  });
};

// Centralized error handler for database connection errors
const handleConnectionError = (err) => {
  switch (err.code) {
    case 'PROTOCOL_CONNECTION_LOST':
      logger.error('Database connection was closed.');
      process.exit(1);
    case 'ER_CON_COUNT_ERROR':
      logger.error('Too many connections to the database.');
      break;
    case 'ECONNREFUSED':
      logger.error('Database connection was refused.');
      process.exit(1);
    default:
      logger.error(`Database connection error: ${err.message}`);
  }
};

// Create the pool
const pool = createDbPool();

// Test the connection when the pool is created
pool.getConnection((err, connection) => {
  if (err) {
    handleConnectionError(err);
  }

  if (connection) connection.release(); // Release the connection back to the pool
});

// Export the pool as a promise-based API for consistent usage
module.exports = pool.promise();