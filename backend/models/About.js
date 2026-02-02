const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  tagline: String,
  shortIntro: String,
  bio: String,
  profileImage: String,
  techStack: [
    {
      name: String,
      icon: String
    }
  ]
});

module.exports = mongoose.model("About", aboutSchema);
