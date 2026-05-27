// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// expose io to routes via app.locals
app.set('io', io);

// Ensure uploads folder exists and serve it
const fs = require('fs');
const path = require('path');
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://agridata-smarts.netlify.app,http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map(origin => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('/*foo', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const marketRoutes = require('./routes/market');
const chatbotRoutes = require('./routes/chatbot');
const socialRoutes = require('./routes/social');
const adminRoutes = require('./routes/admin');

// Health checks
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AgriData Smarts backend is running',
    dbState: mongoose.connection.readyState,
    dbConnected: mongoose.connection.readyState === 1
  });
});

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    dbState: state,
    dbConnected: state === 1
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agridata';
const maskedMongoUri = mongoUri.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/, '$1***$3');
console.log('Using MongoDB URI:', maskedMongoUri);
console.log('Allowed origins:', allowedOrigins.join(', '));

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});