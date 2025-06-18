// routes/Profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path as needed

router.post('/userprofile', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in /userprofile:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
