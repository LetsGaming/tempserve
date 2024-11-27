// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
