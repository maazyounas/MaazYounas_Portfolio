// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const visitorRoutes = require("./routes/Visitor");


const app = express();
connectDB(); 

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/visitor", require("./routes/visitorRoutes"));
app.use("/api/visitors", visitorRoutes);


// Test route
app.get("/", (req, res) => res.send("Portfolio API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
