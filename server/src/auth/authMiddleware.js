const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");
const logger = require("../utils/logger");

// Middleware to authenticate JWT tokens and ensure session is valid
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized: No token provided
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.error("Authentication error", err);
      return res.sendStatus(403); // Forbidden: Invalid token
    }

    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { authenticateToken };