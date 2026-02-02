const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");

// GET All Quotes
router.get("/", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE All Quotes (Bulk Replace)
// The frontend currently sends the entire array to save
router.post("/", async (req, res) => {
  try {
    // Delete all existing quotes and insert new ones to match frontend "save" behavior
    // Alternatively, we could implement proper diffing, but bulk replace is simpler for this sync
    await Quote.deleteMany({});
    const quotes = await Quote.insertMany(req.body);
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
