// models/AdminUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetCode: { type: String, default: null },
  resetCodeExpiry: { type: Date, default: null },
  lastLogin: { type: Date },
  resumeUrl: { type: String, default: "" }, // Added resumeUrl
  securitySettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("AdminUser", AdminUserSchema);
