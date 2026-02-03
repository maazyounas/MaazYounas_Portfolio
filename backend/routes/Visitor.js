// routes/visitor.js
const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// Log a visitor
router.post("/log", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const url = req.body.url || "/";

    const visitor = new Visitor({ ip, userAgent, url });
    await visitor.save();

    res.status(201).json({ message: "Visitor logged" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all visitors (admin)
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitDate: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
