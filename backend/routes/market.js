const express = require('express');
const FarmData = require('../models/FarmData');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get market listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await FarmData.find().sort('-createdAt').limit(30).populate('farmerId', 'name location');
    const formatted = listings.map((item) => ({
      id: item._id,
      farmerName: item.farmerId?.name || 'Unknown',
      location: item.farmerId?.location?.region || 'Unknown',
      cropType: item.cropType,
      quantityKg: item.yieldKg || 0,
      pricePerKg: item.pricePerKg || 2500,
      description: item.diseaseDetected || 'Bidhaa safi ya kilimo',
      postedAt: item.createdAt
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new marketplace listing
router.post('/sell', verifyToken, async (req, res) => {
  try {
    const { cropType, quantityKg, pricePerKg, description } = req.body;
    const listing = new FarmData({
      farmerId: req.user.id,
      cropType,
      yieldKg: quantityKg,
      pricePerKg,
      diseaseDetected: description,
      plantingDate: new Date(),
      harvestDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created', listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
