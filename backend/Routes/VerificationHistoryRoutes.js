const express = require("express");
const router = express.Router();
const authenticateToken = require("../Middlewares/AuthMiddleware");
const Verification = require("../models/Verification");

// Get verification history
router.get("/verifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const verifications = await Verification.find({ userId }).sort({
      submissionDate: -1,
    });
    res.json(verifications);
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ error: "Failed to fetch verification history" });
  }
});

// Save verification result
router.post("/save-verification", authenticateToken, async (req, res) => {
  try {
    const verification = new Verification({
      userId: req.user.id,
      ...req.body,
      submissionDate: new Date(),
    });
    await verification.save();
    res.json({ success: true, verification });
  } catch (error) {
    console.error("Error saving verification:", error);
    res.status(500).json({ error: "Failed to save verification" });
  }
});

module.exports = router;
