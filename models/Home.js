import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  heroTagline: String,
  heroDescription: String,
  showProjects: Boolean,
  showServices: Boolean,
  showTestimonials: Boolean,
  heroBackgroundStyle: {
    type: String,
    enum: ['default', 'minimal', 'gradient', 'particles'],
    default: 'default'
  },
  heroButtons: [{
    text: String,
    link: String,
    variant: {
        type: String,
        enum: ['primary', 'secondary', 'outline'],
        default: 'primary'
    }
  }],
  featuredProjects: [String], // Array of project IDs
  seoTitle: String,
  seoDescription: String,
});

export default mongoose.models.Home || mongoose.model("Home", homeSchema);
