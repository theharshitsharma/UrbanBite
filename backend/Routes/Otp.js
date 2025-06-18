const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// In-memory OTP store (replace with DB in production)
const OTPs = new Map();

/**
 * @route   POST /api/sendotp
 * @desc    Send OTP to user's email
 */
router.post("/sendotp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  console.log("📨 Sending OTP to:", email);

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
  });

  // Store with expiry of 5 minutes
  OTPs.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "harshitsharmaji14@gmail.com", // ✅ Your Gmail
      pass: "qbjfhmmaylrawgty"             // ✅ 16-char App Password (no spaces)
    },
  });

  const mailOptions = {
    from: `"Urban Bite" <harshitsharmaji14@gmail.com>`,  // ✅ Professional 'from' name
    to: email,
    subject: "Urban Bite - Email Verification OTP",
    text: `Your OTP for Urban Bite signup is: ${otp}\n\nIt will expire in 5 minutes.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, msg: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Failed to send OTP:", error);
    res.status(500).json({ success: false, msg: "Failed to send OTP" });
  }
});

/**
 * @route   POST /api/verifyotp
 * @desc    Verify OTP entered by user
 */
router.post("/verifyotp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, msg: "Email and OTP are required" });
  }

  const entry = OTPs.get(email);

  if (!entry) {
    return res.status(400).json({ success: false, msg: "No OTP found for this email" });
  }

  if (Date.now() > entry.expires) {
    OTPs.delete(email);
    return res.status(400).json({ success: false, msg: "OTP expired" });
  }

  if (entry.otp !== otp) {
    return res.status(400).json({ success: false, msg: "Incorrect OTP" });
  }

  OTPs.delete(email); // OTP used, remove from store
  res.json({ success: true, msg: "OTP verified successfully" });
});

module.exports = router;
