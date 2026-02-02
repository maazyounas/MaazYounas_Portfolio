const express = require("express");
const router = express.Router();
const Home = require("../models/Home");

// GET Home Data
router.get("/", async (req, res) => {
  try {
    const homeData = await Home.findOne();
    if (!homeData) return res.json(null); // Return null if no data yet
    res.json(homeData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE/UPDATE Home Data
router.post("/", async (req, res) => {
  try {
    const existing = await Home.findOne();
    if (existing) {
      const updated = await Home.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json(updated);
    } else {
      const newData = new Home(req.body);
      const saved = await newData.save();
      return res.json(saved);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
