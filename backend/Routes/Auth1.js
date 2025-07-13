const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "3d9f0a2c9a1f3d0b6c7e1a8a6d2c3b4f";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/googlelogin", async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Invalid Google data" });
    }

    let user = await User.findOne({ email });

    // 2. If user doesn't exist, try to create one
    if (!user) {
      const safeName = name.length >= 3 ? name : "Google User";

      try {
        user = new User({
          name: safeName,
          email,
          password: "", // No password for Google login
          location: "Google User",
        });
        await user.save();
      } catch (err) {
        console.error("User save failed:", err.message);
        return res.status(400).json({
          success: false,
          message: "User creation failed due to invalid data",
        });
      }
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Google login error:", err.message);
    return res.status(500).json({ success: false, message: "Google login failed" });
  }
});

module.exports = router;
