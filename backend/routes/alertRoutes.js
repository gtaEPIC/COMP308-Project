const express = require("express");
const router = express.Router();
const EmergencyAlert = require("../models/EmergencyAlert");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Create Alert
router.post("/create", authenticateUser, authorizeRole("patient"), async (req, res) => {
  try {
    const existingAlert = await EmergencyAlert.findOne({ patient: req.user._id });
    if (existingAlert) return res.status(400).send("You already have an active alert");

    const alert = new EmergencyAlert({ patient: req.user._id });
    await alert.save();
    res.status(201).send(alert);
  } catch (error) {
    res.status(500).send("Error creating alert");
  }
});

// Resolve Alert
router.delete("/resolve/:id", authenticateUser, authorizeRole("nurse"), async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);
    if (!alert) return res.status(404).send("Alert not found");

    await alert.remove();
    res.status(200).send("Alert resolved");
  } catch (error) {
    res.status(500).send("Error resolving alert");
  }
});

module.exports = router;
