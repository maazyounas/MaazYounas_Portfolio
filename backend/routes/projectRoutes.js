const router = require("express").Router();
const Project = require("../models/Project");

// CREATE
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    // Map _id → id for frontend
    const mappedProjects = projects.map(p => ({
      ...p.toObject(),
      id: p._id,
    }));
    res.json(mappedProjects);
  } catch (err) {
    res.status(500).json(err);
  }
});


// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
