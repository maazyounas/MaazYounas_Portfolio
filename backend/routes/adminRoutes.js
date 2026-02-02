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

module.exports = router;
