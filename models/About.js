import mongoose from "mongoose";

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

export default mongoose.models.About || mongoose.model("About", aboutSchema);
