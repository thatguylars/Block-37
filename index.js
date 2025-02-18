
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const routes = require("./api"); // Path to your API routes

require("dotenv").config(); // Load environment variables

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(morgan("dev")); 
app.use(express.json()); 

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api", routes); // Mount your API routes

// Error handling middleware (Improved)
app.use((err, req, res, next) => {
  console.error("Error on request:", req.method, req.originalUrl);
  console.error(err);
   if (req.user) {
     // Example: Check if a user is logged in (if applicable)
     console.error("User:", req.user);
   }

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