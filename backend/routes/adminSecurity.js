const express = require("express");
const AdminUser = require("../models/AdminUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

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
const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed"));
  }
});

// Helper to get admin (Assuming single admin for now)
const getAdmin = async () => {
    let admin = await AdminUser.findOne();
    if (!admin) {
        // Create default admin if not exists (Should be seeded, but failsafe)
        admin = new AdminUser({
            email: process.env.EMAIL_USER || "admin@example.com",
            password: "Admin@123", // Will be hashed by pre-save
        });
        await admin.save();
    }
    return admin;
};

// --- Change Password ---
router.post("/change-password", async (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;
    
    // If we have authentication middleware, we'd use req.user.id
    // identifying admin by email "admin@example.com" or just first user for this portfolio
    const admin = await getAdmin();

    // Verify current (if provided - mostly safe to require it)
    if (currentPassword) {
         const isMatch = await admin.comparePassword(currentPassword);
         if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Forgot Password: Send Reset Code ---
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    admin.resetCode = resetCode;
    admin.resetCodeExpiry = expiry;
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use process.env.SMTP_HOST etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${resetCode}. It expires in 15 minutes.`,
    });

    res.json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Reset Password using Code ---
router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (
      !admin.resetCode ||
      admin.resetCode !== resetCode ||
      !admin.resetCodeExpiry ||
      admin.resetCodeExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    admin.password = newPassword;
    admin.resetCode = null;
    admin.resetCodeExpiry = null;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Security Settings ---
router.get("/security-settings", async (req, res) => {
    try {
        const admin = await getAdmin();
        const defaultSettings = {
          adminUsername: admin.email, // using email as username
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          lockoutDuration: 15,
          resumeUrl: admin.resumeUrl || "",
        };
        
        // Merge with saved settings if any (assuming we stored them in securitySettings Map)
        // For now, simpler to just return constructed object + logic
        const settings = admin.securitySettings ? Object.fromEntries(admin.securitySettings) : {};
        res.json({ ...defaultSettings, ...settings });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/security-settings", async (req, res) => {
    try {
        const admin = await getAdmin();
        // Save arbitrary settings to the Map
        // Filter out password/email from direct update here usually, but keeping it flexible
        const { adminUsername, ...rest } = req.body;
        
        // If adminUsername (email) changes
        if (adminUsername && adminUsername !== admin.email) {
            // Check if exist? Single user system, so maybe just update
            admin.email = adminUsername;
        }

        // Update securitySettings map
        for (const [key, value] of Object.entries(rest)) {
             admin.securitySettings.set(key, value);
        }
        
        await admin.save();
        res.json({ message: "Settings updated", settings: req.body });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- Resume Routes ---
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
      const admin = await getAdmin();
      admin.resumeUrl = `/uploads/${req.file.filename}`;
      await admin.save();
      res.json({ success: true, resumeUrl: admin.resumeUrl });
  } catch (error) {
      res.status(500).json({ error: "Database save failed" });
  }
});

router.get("/resume-url", async (req, res) => {
    try {
        const admin = await getAdmin();
        res.json({ resumeUrl: admin.resumeUrl || "" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
