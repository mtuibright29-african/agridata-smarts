// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin', 'extension_officer'],
    default: 'farmer'
  },
  password: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    region: String,
    district: String,
    ward: String
  },
  farmSize: Number,
  crops: [{
    cropType: String,
    plantingDate: Date,
    expectedHarvest: Date
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);