const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify user authentication
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(404).send("User not found");
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

// Authorize roles
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send("Access forbidden");
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };