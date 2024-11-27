const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  JWT_SECRET,
  JWT_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
} = require("../config/jwtConfig");
const authService = require("./authService");
const { errorResponse, successResponse } = require("../utils/responseUtils");

// Helper functions to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};

// Controller functions
const register = async (req, res) => {
  const { username, password } = req.body;

  if (authService.findUserByUsername(username)) {
    return errorResponse(res, "Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await authService.createUser(username, hashedPassword);
  successResponse(res, { username: data.username }, "User registered successfully", 201);
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await authService.findUserByUsername(username);
  if (!user) {
    return errorResponse(res, "Invalid username or password");
  }

  const isMatch = authService.comparePasswords(password, user.password);
  if (!isMatch) {
    return errorResponse(res, "Invalid username or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  successResponse(res, {accessToken: accessToken });
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  successResponse(res, null, "Logged out successfully");
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return errorResponse(res, "Refresh token not provided");
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, "Invalid refresh token", 403);
    }

    const newAccessToken = generateAccessToken(user);
    successResponse(res, { accessToken: newAccessToken });
  });
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};
