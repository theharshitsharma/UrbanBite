const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // store this safely in .env

router.post('/googlelogin', async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify token from frontend
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "", // or "google-user" if required
        location: "Google User"
      });
      await user.save();
    }

    // Optionally, generate JWT token for your own session
    return res.json({ success: true, user });

  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ success: false, message: "Google login failed" });
  }
});

module.exports = router;
