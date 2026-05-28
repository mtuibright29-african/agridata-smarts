// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Validation helper function
const validateInput = (phoneNumber, name, password) => {
  const errors = [];
  
  if (!phoneNumber || phoneNumber.trim() === '') {
    errors.push('Nambari ya simu ni lazima');
  }
  
  if (!name || name.trim() === '') {
    errors.push('Jina kamili ni lazima');
  }
  
  if (!password || password.trim() === '') {
    errors.push('Nywila ni lazima');
  } else if (password.length < 4) {
    errors.push('Nywila lazima iwe na angalau herufi 4');
  }
  
  return errors;
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, name, password, role, location } = req.body;
    
    // Validate input
    const validationErrors = validateInput(phoneNumber, name, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(', ') });
    }
    
    // Trim and normalize inputs
    const trimmedPhone = phoneNumber.trim();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
    
    // Check if user exists
    const existingUser = await User.findOne({ phoneNumber: trimmedPhone });
    if (existingUser) {
      return res.status(400).json({ message: 'Mtumiaji na nambari hii tayari anajumui' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    
    const user = new User({
      phoneNumber: trimmedPhone,
      name: trimmedName,
      password: hashedPassword,
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
      message: 'Mtumiaji amesajiliwa kwa mafanikio',
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
    
    // Validate input
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Nambari ya simu na nywila zote ni lazima' });
    }
    
    const trimmedPhone = phoneNumber.trim();
    
    const user = await User.findOne({ phoneNumber: trimmedPhone });
    if (!user) {
      return res.status(401).json({ message: 'Taarifa za kuingia hazikufanikiwa' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Taarifa za kuingia hazikufanikiwa' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '30d' }
    );
    
    res.json({
      message: 'Kuingia kumefanikiwa',
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Kosa la seva: ' + error.message });
  }
});

// Send OTP (for WhatsApp verification)
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber || phoneNumber.trim() === '') {
      return res.status(400).json({ message: 'Nambari ya simu ni lazima' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP in database or cache with expiration
    // In production, use Redis or a temporary collection with TTL
    // TODO: Implement Redis/cache storage with 5-minute expiration
    
    // Send via WhatsApp (using Twilio or WhatsApp Business API)
    // TODO: Implement WhatsApp API integration
    // For now, return success message (remove OTP from response in production)
    
    console.log(`OTP for ${phoneNumber}: ${otp}`); // For testing only
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP error:', error);
    res.status(500).json({ message: 'Kosa la seva: ' + error.message });
  }
});

module.exports = router;
