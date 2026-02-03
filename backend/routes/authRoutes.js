const express = require("express");
const router = express.Router();

// Placeholder auth routes - can be expanded later
router.post("/login", async (req, res) => {
  res.status(501).json({ error: "Auth not implemented" });
});

router.post("/register", async (req, res) => {
  res.status(501).json({ error: "Auth not implemented" });
});

module.exports = router;
