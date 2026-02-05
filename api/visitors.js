import connectDB from "../lib/db.js";
import Visitor from "../models/Visitor.js";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const visitors = await Visitor.find().sort({ visitDate: -1 });
        const mappedVisitors = visitors.map(v => ({
          id: v._id,
          email: v.email || "",
          date: v.visitDate || v.createdAt,
          page: v.url || "/",
          ipAddress: v.ip,
          userAgent: v.userAgent,
          country: v.country || "Unknown",
        }));
        return res.status(200).json(mappedVisitors);

      case "POST":
        const visitor = new Visitor({
          ip: req.body.ipAddress || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          userAgent: req.body.userAgent || req.headers["user-agent"],
          url: req.body.page || "/",
          email: req.body.email,
        });
        await visitor.save();
        return res.status(200).json({
          id: visitor._id,
          ...req.body,
        });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
