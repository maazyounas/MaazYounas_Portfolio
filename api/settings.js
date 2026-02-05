import connectDB from "../lib/db.js";
import GlobalSettings from "../models/GlobalSettings.js";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const data = await GlobalSettings.findOne();
        return res.status(200).json(data || null);

      case "POST":
        let settings = await GlobalSettings.findOne();
        if (settings) {
          Object.assign(settings, req.body);
          await settings.save();
        } else {
          settings = new GlobalSettings(req.body);
          await settings.save();
        }
        return res.status(200).json(settings);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
