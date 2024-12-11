require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json());

// Routes
const alertRoutes = require("./routes/alertRoutes");
app.use("/api/alerts", alertRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit process on failure
  });
module.exports = app;
