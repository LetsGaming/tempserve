const express = require("express");
const authController = require("./authController");

const router = express.Router();

// Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshAccessToken);

module.exports = router;
