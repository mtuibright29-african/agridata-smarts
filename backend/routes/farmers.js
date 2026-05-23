const express = require('express');
const User = require('../models/User');
const FarmData = require('../models/FarmData');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get farmer profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Farmer not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get farm data for the authenticated farmer
router.get('/data', verifyToken, async (req, res) => {
  try {
    const records = await FarmData.find({ farmerId: req.user.id }).sort('-createdAt');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit farm data
router.post('/data', verifyToken, async (req, res) => {
  try {
    const {
      cropType,
      plantingDate,
      harvestDate,
      yieldKg,
      soilMoisture,
      soilPH,
      temperature,
      rainfall,
      diseaseDetected,
      imageUrl
    } = req.body;

    const farmData = new FarmData({
      farmerId: req.user.id,
      cropType,
      plantingDate,
      harvestDate,
      yieldKg,
      soilMoisture,
      soilPH,
      temperature,
      rainfall,
      diseaseDetected,
      imageUrl
    });

    await farmData.save();
    res.status(201).json(farmData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
