const express = require("express");
const router = express.Router();

// Placeholder message routes - can be expanded later
router.get("/", async (req, res) => {
  res.status(200).json([]);
});

router.post("/", async (req, res) => {
  res.status(501).json({ error: "Messages not implemented" });
});

module.exports = router;
