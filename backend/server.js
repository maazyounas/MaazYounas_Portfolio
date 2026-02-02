const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Static files for resume uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => res.send("Portfolio API is running..."));

// API Routes
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

// Admin security routes
app.use("/api/admin", require("./routes/adminRoutes"));

// MongoDB test
app.get("/test-db", (req, res) => {
  res.send("MongoDB state: " + mongoose.connection.readyState);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
