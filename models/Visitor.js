// models/Visitor.js
import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userAgent: { type: String },
  url: { type: String },
  visitDate: { type: Date, default: Date.now }
});

export default mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
