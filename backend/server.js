const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://agridata-smarts.netlify.app', 'http://localhost:3000']
}));
app.use(express.json());

// ✅ THIS IS THE CRITICAL PART - Mount your routes
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const farmerRoutes = require('./routes/farmers');
const marketRoutes = require('./routes/market');
const socialRoutes = require('./routes/social');
const adminRoutes = require('./routes/admin');

// ✅ Use the routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);

// Test route (to confirm API is working)
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AgriData Smarts backend is running',
    dbState: mongoose.connection.readyState === 1 ? 1 : 0,
    dbConnected: mongoose.connection.readyState === 1
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
