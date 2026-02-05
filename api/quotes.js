import connectDB from "../lib/db.js";
import Quote from "../models/Quote.js";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const quotes = await Quote.find();
        return res.status(200).json(quotes || []);

      case "POST":
        // Bulk replace to match frontend behavior
        await Quote.deleteMany({});
        const insertedQuotes = await Quote.insertMany(req.body);
        return res.status(200).json(insertedQuotes);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
