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

// Hash password before saving - FIXED
UserSchema.pre('save', async function(next) {
  try {
    // Only hash if password is modified
    if (!this.isModified('password')) {
      return next();
    }
    
    // Hash the password with 10 rounds
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
