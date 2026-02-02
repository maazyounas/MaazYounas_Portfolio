const express = require("express");
const router = express.Router();
const About = require("../models/About");

// GET
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE / UPDATE
router.post("/", async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      { upsert: true, new: true }
    );
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
