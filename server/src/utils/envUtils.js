const dotenv = require("dotenv");
const path = require("path");

const loadEnv = () => {
  // Set the current working directory to the directory containing server.js
  process.chdir(path.dirname(process.argv[1]));
  dotenv.config(); // Load environment variables
};

module.exports = loadEnv;