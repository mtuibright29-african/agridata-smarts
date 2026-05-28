// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, name, password, role, location } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      phoneNumber,
      name,
      password,
      role: role || 'farmer',
      location
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    // Detailed error logging and custom error messages
    console.error('Registration error:', error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: 'Nambari ya simu tayari imesajiliwa.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Tafadhali jaza taarifa zote kwa usahihi.' });
    }
    res.status(500).json({ message: 'Kosa la seva: ' + error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '30d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send OTP (for WhatsApp verification)
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Store OTP in database or cache
    // In production, use Redis or a temporary collection
    // Send via WhatsApp (using Twilio or WhatsApp Business API)
    // For now, return the OTP for testing
    res.json({ message: 'OTP sent', otp: otp }); // Remove otp in production
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
