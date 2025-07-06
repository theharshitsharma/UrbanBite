// routes/Profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path as needed
// Update user profile fields (mobile, address, image)
router.post('/updateprofile', async (req, res) => {
  const { email, mobile, address, image } = req.body;
  const updateFields = {};

  if (mobile !== undefined) updateFields.mobile = mobile;
  if (address !== undefined) updateFields.address = address;
  if (image !== undefined) updateFields.image = image;

  console.log("Updating fields for", email, updateFields);  // DEBUGGING

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },   // ✅ USE $set and only update provided fields
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in /updateprofile:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


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
