const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, default: "admin" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resumeUrl: { type: String },
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("Admin", AdminSchema);
