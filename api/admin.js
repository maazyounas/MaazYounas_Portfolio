import connectDB from "../lib/db.js";
import Visitor from "../models/Visitor.js";
import AdminUser from "../models/AdminUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export default async function handler(req, res) {
  await connectDB();

  const { method, query, body } = req;
  const { action } = query;

  try {
    switch (action) {
      case "login":
        if (method !== "POST") return res.status(405).end();
        const user = await AdminUser.findOne({ email: body.email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ token, user: { id: user._id, email: user.email } });

      case "visitors":
        if (method === "GET") {
          const visitors = await Visitor.find().sort({ visitDate: -1 });
          return res.status(200).json(visitors);
        }
        if (method === "POST") {
          const visitor = new Visitor(body);
          await visitor.save();
          return res.status(200).json(visitor);
        }
        break;

      case "analytics":
        const visitorCount = await Visitor.countDocuments();
        return res.status(200).json({
          totalViews: visitorCount,
          uniqueVisitors: visitorCount,
          projectViews: {},
          pageViews: {},
          bounceRate: 0,
          avgSessionDuration: 0,
          topReferrers: [],
          lastUpdated: new Date().toISOString(),
        });

      case "security-settings":
        const admin = await AdminUser.findOne();
        if (method === "GET") {
          return res.status(200).json(admin?.securitySettings || {});
        }
        if (method === "POST") {
          if (admin) {
            admin.securitySettings = body;
            await admin.save();
          } else {
             // Create initial admin if not exists (caution in production)
             const newAdmin = new AdminUser({
               email: process.env.EMAIL_USER || "admin@example.com",
               password: "Admin@123", // Should be changed
               securitySettings: body
             });
             await newAdmin.save();
          }
          return res.status(200).json(body);
        }
        break;

      default:
        return res.status(404).json({ error: "Action not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
