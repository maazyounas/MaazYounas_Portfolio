const express = require("express");
const router = express.Router();
const GlobalSettings = require("../models/GlobalSettings");

// GET Settings
router.get("/", async (req, res) => {
    try {
        const data = await GlobalSettings.findOne();
        if (!data) return res.json(null);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SAVE Settings
router.post("/", async (req, res) => {
    try {
        const existing = await GlobalSettings.findOne();
        if (existing) {
            const updated = await GlobalSettings.findByIdAndUpdate(existing._id, req.body, { new: true });
            return res.json(updated);
        } else {
            const newData = new GlobalSettings(req.body);
            const saved = await newData.save();
            return res.json(saved);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
