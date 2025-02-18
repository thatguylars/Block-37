const express = require("express");
const morgan = require("morgan");
const app = express();
const routes = require("./api");
const cors = require("cors");

// Logging middleware
app.use(cors()); 
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());

// Define a route handler for the root path ("/")
app.get("/", (req, res) => {
  res.send("Welcome to the API!"); 
});

// Backend routes
app.use("/api", require("./api"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "Something went wrong!" });
});

app.listen(3000, () => {
  console.log("Server listening");
});

module.exports = app;
