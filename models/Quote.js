import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  id: String, // Ensure we keep the string ID used by frontend or rely on _id
  text: String,
  author: String,
  category: String,
  visible: Boolean,
  createdAt: String,
});

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
