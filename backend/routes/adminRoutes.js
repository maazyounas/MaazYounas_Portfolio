const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Mock admin data
let admin = {
  email: process.env.EMAIL_USER,
  passwordHash: bcrypt.hashSync("Admin@123", 10),
  resumeUrl: "",
};

// --- Resume upload setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed"));
}});

// --- Routes ---

// Change Password
router.post("/change-password", async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 chars" });

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  res.json({ success: true, message: "Password changed successfully" });
});

// Upload Resume
router.post("/upload-resume", upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  admin.resumeUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, resumeUrl: admin.resumeUrl });
});

// Get Resume URL
router.get("/resume", (req, res) => {
  if (!admin.resumeUrl) return res.status(404).json({ error: "Resume not found" });
  res.json({ resumeUrl: admin.resumeUrl });
});

// Send Reset Email
router.post("/send-reset-email", async (req, res) => {
  const { email } = req.body;
  if (!email || email !== admin.email)
    return res.status(400).json({ error: "Invalid email" });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetLink = `https://yourfrontend.com/reset-password?token=123456`;

  await transporter.sendMail({
    from: `"Admin" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Link",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  });

  res.json({ success: true, message: "Reset link sent" });
});

// Get Resume URL (alternate endpoint that frontend expects)
router.get("/resume-url", (req, res) => {
  res.json({ resumeUrl: admin.resumeUrl || "" });
});

// --- Security Settings ---
let securitySettings = {
  adminUsername: "admin",
  adminPassword: "Admin@123",
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  resumeUrl: "",
};

router.get("/security-settings", (req, res) => {
  res.json(securitySettings);
});

router.post("/security-settings", (req, res) => {
  securitySettings = { ...securitySettings, ...req.body };
  res.json(securitySettings);
});

// --- Visitors (Admin) ---
const Visitor = require("../models/Visitor");

router.get("/visitors", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitDate: -1 });
    // Map to expected format
    const mappedVisitors = visitors.map(v => ({
      id: v._id,
      email: v.email || "",
      date: v.visitDate || v.createdAt,
      page: v.url || "/",
      ipAddress: v.ip,
      userAgent: v.userAgent,
      country: v.country || "Unknown",
    }));
    res.json(mappedVisitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.json([]);
  }
});

router.post("/visitors", async (req, res) => {
  try {
    const visitor = new Visitor({
      ip: req.body.ipAddress || req.ip,
      userAgent: req.body.userAgent || req.headers["user-agent"],
      url: req.body.page || "/",
      email: req.body.email,
    });
    await visitor.save();
    res.json({
      id: visitor._id,
      ...req.body,
    });
  } catch (error) {
    console.error("Error adding visitor:", error);
    res.status(500).json({ error: "Failed to add visitor" });
  }
});

// --- Analytics ---
router.get("/analytics", async (req, res) => {
  try {
    const visitorCount = await Visitor.countDocuments();
    res.json({
      totalViews: visitorCount,
      uniqueVisitors: visitorCount,
      projectViews: {},
      pageViews: {},
      bounceRate: 0,
      avgSessionDuration: 0,
      topReferrers: [],
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.json({
      totalViews: 0,
      uniqueVisitors: 0,
      projectViews: {},
      pageViews: {},
      bounceRate: 0,
      avgSessionDuration: 0,
      topReferrers: [],
      lastUpdated: new Date().toISOString(),
    });
  }
});

// --- System Logs ---
let systemLogs = [];

router.get("/system-logs", (req, res) => {
  res.json(systemLogs);
});

router.post("/system-logs", (req, res) => {
  const log = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  systemLogs.unshift(log);
  // Keep only last 100 logs
  if (systemLogs.length > 100) systemLogs = systemLogs.slice(0, 100);
  res.json(log);
});

// --- Notifications ---
let notifications = [];

router.get("/notifications", (req, res) => {
  res.json(notifications);
});

router.post("/notifications", (req, res) => {
  const notification = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(notification);
  res.json(notification);
});

router.patch("/notifications/:id", (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  if (notification) {
    Object.assign(notification, req.body);
    res.json(notification);
  } else {
    res.status(404).json({ error: "Notification not found" });
  }
});

// --- Users ---
router.get("/users", (req, res) => {
  res.json([
    {
      id: "admin",
      username: "admin",
      email: admin.email || "admin@example.com",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      active: true,
      permissions: ["all"],
    },
  ]);
});

// --- Backups ---
let backups = [];

router.get("/backups", (req, res) => {
  res.json(backups);
});

router.post("/backups", (req, res) => {
  const backup = {
    id: Date.now().toString(),
    name: req.body.name || `Backup-${new Date().toISOString().split("T")[0]}`,
    type: req.body.type || "full",
    createdAt: new Date().toISOString(),
    size: "0 MB",
    status: "completed",
    includes: ["projects", "settings", "logs"],
    note: req.body.note,
  };
  backups.unshift(backup);
  res.json(backup);
});

// --- Security Alerts ---
let securityAlerts = [];

router.get("/security-alerts", (req, res) => {
  res.json(securityAlerts);
});

router.post("/security-alerts", (req, res) => {
  const alert = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    resolved: false,
  };
  securityAlerts.unshift(alert);
  res.json(alert);
});

// --- Reset to Defaults ---
router.post("/reset", (req, res) => {
  const { section } = req.body;
  if (!section || section === "all") {
    securitySettings = {
      adminUsername: "admin",
      adminPassword: "Admin@123",
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      resumeUrl: "",
    };
    systemLogs = [];
    notifications = [];
    backups = [];
    securityAlerts = [];
  }
  res.json({ success: true, message: "Reset completed" });
});

module.exports = router;
