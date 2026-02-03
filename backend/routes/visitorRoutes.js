const express = require("express");
const router = express.Router();

// POST /api/visitor - Track visitor
router.post("/", async (req, res) => {
  try {
    // Simple visitor tracking - could be expanded to save to DB
    res.status(200).json({ success: true, message: "Visitor tracked" });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).json({ error: "Failed to track visitor" });
  }
});

module.exports = router;
