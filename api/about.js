import connectDB from "../lib/db.js";
import About from "../models/About.js";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const data = await About.findOne();
        return res.status(200).json(data || null);

      case "POST":
        // Bulk replace/update
        let about = await About.findOne();
        if (about) {
          Object.assign(about, req.body);
          await about.save();
        } else {
          about = new About(req.body);
          await about.save();
        }
        return res.status(200).json(about);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
