// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const authRoutes = require("./auth/authRouter");
const tempRoutes = require("./router/tempRouter");

// Initialize the Express app
const app = express();
// Port number
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/temps", tempRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
