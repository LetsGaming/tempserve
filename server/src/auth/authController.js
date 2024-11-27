const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  JWT_SECRET,
  JWT_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
} = require("../config/jwtConfig");
const authService = require("./authService");

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
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await authService.createUser(username, hashedPassword)
  res.status(201).json({ message: "User registered successfully", username: data.username });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await authService.findUserByUsername(username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = authService.comparePasswords(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ accessToken });
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not provided" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  });
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};
