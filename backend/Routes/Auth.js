const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/googlelogin', async (req, res) => {
  const { credential } = req.body;

  try {
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
        password: "", // or "google-user"
        location: "Google User",
      });
      await user.save();
    }

    // ✅ Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // or any duration you prefer
    });

    res.json({ success: true, user, token }); // ✅ return token

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
});

module.exports = router;
