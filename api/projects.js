import connectDB from "../lib/db.js";
import Project from "../models/Project.js";

export default async function handler(req, res) {
  console.log('API Request:', req.method, req.url);
  try {
    await connectDB();
    console.log('DB Connected');
  } catch (dbError) {
    console.error('DB Connection Error:', dbError);
    return res.status(500).json({ error: 'Database connection failed', details: dbError.message });
  }

  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case "GET":
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        const mappedProjects = projects.map((p) => ({
          ...p.toObject(),
          id: p._id,
        }));
        return res.status(200).json(mappedProjects);

      case "POST":
        if (query.action === "view") {
           await Project.findByIdAndUpdate(id, { $inc: { views: 1 } });
           return res.status(200).json({ message: "View added" });
        }
        const project = await Project.create(req.body);
        return res.status(201).json(project);

      case "PUT":
        const updatedProject = await Project.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true }
        );
        return res.status(200).json(updatedProject);

      case "DELETE":
        await Project.findByIdAndDelete(id);
        return res.status(200).json({ message: "Deleted" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
