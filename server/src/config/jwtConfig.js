const loadEnv = require("../utils/envUtils");

loadEnv();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRATION: '15m',           // Access token expiration
  JWT_REFRESH_EXPIRATION: '7d'    // Refresh token expiration
};