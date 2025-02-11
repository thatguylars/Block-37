const express = require("express");
const morgan = require("morgan");
const app = express();
const routes = require("./api");


// Logging middleware
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());

// Backend routes
app.use("/api", require("./api"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "Something went wrong!" });
});

module.exports = app;
