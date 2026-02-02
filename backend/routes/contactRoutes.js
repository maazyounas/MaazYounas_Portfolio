const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Nodemailer Transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Transport error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});


// GET Contact Data (admin / page info)
router.get("/", async (req, res) => {
  try {
    const data = await Contact.findOne();
    if (!data) return res.json(null);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Contact Message (user submits form)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send Email
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
