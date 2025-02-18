// const app = require("./app"); 
// require("dotenv").config();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, async () => {
//   console.log(`I am listening on port number ${PORT}`);
// });
// index.js (Main server file)
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const routes = require("./api"); // Path to your API routes

require("dotenv").config(); // Load environment variables

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(morgan("dev")); // Logging middleware
app.use(express.json()); // Body parsing middleware

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api", routes); // Mount your API routes

// Error handling middleware (Improved)
app.use((err, req, res, next) => {
  console.error(err);
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;