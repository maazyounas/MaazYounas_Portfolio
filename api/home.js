import connectDB from "../lib/db.js";
import Home from "../models/Home.js";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const data = await Home.findOne();
        return res.status(200).json(data || null);

      case "POST":
        let home = await Home.findOne();
        if (home) {
          Object.assign(home, req.body);
          await home.save();
        } else {
          home = new Home(req.body);
          await home.save();
        }
        return res.status(200).json(home);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
