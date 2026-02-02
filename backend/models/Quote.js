const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  id: String, // Ensure we keep the string ID used by frontend or rely on _id
  text: String,
  author: String,
  category: String,
  visible: Boolean,
  createdAt: String,
});

module.exports = mongoose.model("Quote", quoteSchema);
