const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const upload = require("../middleware/upload");
const nodemailer = require("nodemailer");

// Change password
router.post("/change-password", async (req, res) => {
  const { newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);

  await Admin.findOneAndUpdate({}, { password: hashed });
  res.json({ success: true });
});

// Upload resume
router.post("/resume", upload.single("resume"), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  await Admin.findOneAndUpdate({}, { resumeUrl: url });
  res.json({ resumeUrl: url });
});

// Get resume
router.get("/resume", async (req, res) => {
  const admin = await Admin.findOne();
  res.json({ resumeUrl: admin?.resumeUrl || "" });
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Not found" });

  const token = crypto.randomBytes(32).toString("hex");

  admin.resetToken = token;
  admin.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
  await admin.save();

  const link = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your_app_password",
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `<a href="${link}">Reset Password</a>`,
  });

  res.json({ success: true });
});

// Reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const admin = await Admin.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!admin) return res.status(400).json({ error: "Invalid token" });

  admin.password = await bcrypt.hash(password, 10);
  admin.resetToken = undefined;
  admin.resetTokenExpiry = undefined;
  await admin.save();

  res.json({ success: true });
});

module.exports = router;
