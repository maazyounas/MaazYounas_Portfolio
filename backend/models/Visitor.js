// models/Visitor.js
const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userAgent: { type: String },
  url: { type: String },
  visitDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visitor", VisitorSchema);
