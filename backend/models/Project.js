const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  tech: [String],
  link: String,
  github: String,

  // 🔥 Admin UI controls
  showLink: { type: Boolean, default: true },
  showGithub: { type: Boolean, default: true },

  category: { type: String, default: "web" },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  complexity: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "intermediate",
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
