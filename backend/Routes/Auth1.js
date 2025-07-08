const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Use this if you want to verify the Google token instead of decoding it blindly
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/googlelogin", async (req, res) => {
  const { credential } = req.body;

  try {
    // ✅ Verify and decode token from Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // Make sure this matches the one from Google Cloud
    });

    const payload = ticket.getPayload(); // Decoded user data

    const { email, name } = payload;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Invalid Google data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Register new user
      user = new User({
        name,
        email,
        password: "", // leave password empty
        location: "Google User",
      });
      await user.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
  console.error("Google login error:", err.message, err.stack); // log full error
  res.status(500).json({ success: false, message: "Google login failed" });
}

});

module.exports = router;
