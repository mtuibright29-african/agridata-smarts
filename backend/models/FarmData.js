// backend/models/FarmData.js
const mongoose = require('mongoose');

const FarmDataSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  plantingDate: Date,
  harvestDate: Date,
  yieldKg: Number,
  soilMoisture: Number,
  soilPH: Number,
  temperature: Number,
  rainfall: Number,
  pricePerKg: Number,
  diseaseDetected: String,
  imageUrl: String,
  aiAnalysis: {
    healthScore: Number,
    recommendations: [String],
    riskLevel: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FarmData', FarmDataSchema);