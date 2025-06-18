const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken")
const jwtSecret="jaishreeramsabhiko"

/* ---------- SIGN‑UP ---------- */
router.post(
  '/createuser',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('name', 'Name must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(req.body.password, salt);

      // Create user
      await User.create({
        name: req.body.name,
        password: secpassword,
        email: req.body.email,
        location: req.body.location,
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/* ---------- LOGIN ---------- */
router.post(
  '/loginuser',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
    
      // Find user by email
      const userData = await User.findOne({ email });
      

      if (!userData) {
        return res.status(400).json({ success: false, error: 'Invalid credentials' });
      }
        const pwdcompare=await bcrypt.compare(req.body.password,userData.password)
      if(!pwdcompare){
        return res.status(400).json({errors:"try logging with correct credentials"})
      }
      const data={
        user:{
          id:userData.id
        }
      }
      const authToken=jwt.sign(data,jwtSecret)
      

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(400).json({ success: false,error: 'Invalid credentials' });
      }

      res.json({ success: true,authToken:authToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

module.exports = router;
