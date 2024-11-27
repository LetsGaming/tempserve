const express = require("express");
const { authenticateToken } = require("../auth/authMiddleware");
const { addTemp, getTemp } = require("../controller/tempController");
const router = express.Router();

router.post("/add", authenticateToken, addTemp);
router.get("/get", getTemp);

module.exports = router;