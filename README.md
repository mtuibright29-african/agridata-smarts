# AgriData Smarts 🍍

**Kilimo Cha Kisasa - Smart Pineapple Farming for Tanzania**

A complete web application for smart agriculture with AI-powered crop analysis, real-time chatbot support, and farmer analytics.

## Features

✨ **Smart Chatbot** - Kiswahili-language chatbot for farming advice and WhatsApp integration
📊 **AI Image Analysis** - Analyze crop health using OpenAI or Azure Computer Vision
📈 **Analytics Dashboard** - Real-time farm data visualization and trends
🌾 **Farmer Dashboard** - Track moisture, temperature, and crop health
🏪 **Digital Marketplace** - Connect farmers directly with buyers
💬 **Socket.io Real-time Updates** - Live notifications and chat
🔐 **JWT Authentication** - Secure user accounts and data

## Tech Stack

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.io for real-time chat
- JWT authentication
- Multer for file uploads

**Frontend:**
- React 18 with Vite
- Material UI components
- React Router v6
- Socket.io client
- Recharts for analytics

**Services:**
- MongoDB Atlas (cloud database)
- Replit (backend hosting)
- Vercel (frontend hosting)
- OpenAI / Azure Computer Vision (image analysis)
- Twilio (WhatsApp integration)

## Quick Start

### Local Development

**Backend:**
```bash
cd backend
npm install
# Create .env file with MongoDB URI and secrets
npm start
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Access on Phone (Same Wi-Fi)

1. Find your laptop IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. On phone, visit: `http://<YOUR_IP>:3000`
3. Or scan the QR code on the landing page

## Deployment

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.**

Quick summary:
1. Set up MongoDB Atlas
2. Deploy backend to Replit
3. Deploy frontend to Vercel
4. Configure environment variables

## Project Structure

```
agridata-smarts/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # User authentication
│   │   ├── chatbot.js       # Chatbot & image analysis
│   │   ├── farmers.js
│   │   ├── market.js
│   │   ├── social.js
│   │   └── admin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ChatMessage.js   # Chat persistence
│   │   ├── FarmData.js
│   │   └── Market.js
│   ├── services/
│   │   └── imageAnalysis.js # AI image analysis
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── server.js            # Express server entry
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Home with QR code
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chatbot.jsx          # AI chatbot UI
│   │   │   ├── FarmerDashboard.jsx  # Analytics
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx                  # Router & theme
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── database/
│   └── seed.js              # Sample data
│
├── DEPLOYMENT.md            # Deployment guide
├── README.md                # This file
├── Procfile                 # Replit/Heroku config
└── .replit                  # Replit config
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - User login (returns JWT)

### Chatbot
- `POST /api/chatbot/message` - Send text message
- `POST /api/chatbot/image` - Upload & analyze image
- `GET /api/chatbot/history` - Get chat history (auth required)
- `GET /api/chatbot/image-test` - Test image provider connectivity
- `POST /api/chatbot/send-whatsapp` - Send WhatsApp message
- `POST /api/chatbot/webhook/whatsapp` - Receive WhatsApp message

### Farmers
- `GET /api/farmers/dashboard` - Farm data & analytics
- `POST /api/farmers/data` - Log sensor readings

### Marketplace
- `GET /api/market/listings` - Get product listings
- `POST /api/market/listing` - Create listing
- `POST /api/market/order` - Place order

## Environment Variables

See `.env.example` files in `backend/` and `frontend/` for required variables.

**Critical for production:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secure random key (min 32 chars)
- `VITE_API_URL` - Backend URL for frontend

**Optional (for advanced features):**
- `OPENAI_API_KEY` - For image analysis
- `AZURE_COMPUTER_VISION_ENDPOINT` - Alternative image provider
- `TWILIO_ACCOUNT_SID` - For WhatsApp integration

## Features Walkthrough

### 1. User Authentication
- Register with email/phone
- JWT token stored in localStorage
- Protected routes for authenticated users

### 2. Smart Chatbot
- Kiswahili natural language processing
- Quick command buttons ("hali ya hewa", "bei", "mafunzo", etc.)
- Real-time Socket.io updates
- Message history persistence in MongoDB
- WhatsApp integration ready

### 3. AI Image Analysis
- Upload crop images
- Automatic analysis using OpenAI Responses API or Azure Computer Vision
- Health score and recommendations
- Fallback analysis if no API configured
- Images persisted with metadata

### 4. Farmer Dashboard
- Moisture and temperature trend charts
- Quick health indicators
- Crop stage tracking
- Monthly analytics

### 5. Real-time Updates
- Socket.io server broadcasts messages to all connected clients
- Live notifications when WhatsApp messages arrive
- Instant chat updates

## Testing

### Test Chatbot Locally
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message":"hali ya hewa","phoneNumber":"+255123456789"}'
```

### Test Image Analysis
```bash
curl -X POST http://localhost:5000/api/chatbot/image-test
```

### Test on Phone
1. Same Wi-Fi as laptop
2. Visit `http://<LAPTOP_IP>:3000`
3. Try all features

## Performance Optimization

✅ **Implemented:**
- Vite for fast frontend builds
- React lazy loading
- Socket.io compression
- Express gzip middleware
- MongoDB indexing on frequently queried fields
- JWT token caching in localStorage

⚠️ **TODO:**
- Implement API rate limiting
- Add Redis caching layer
- Optimize image compression before upload
- Implement database query pagination

## Security Checklist

✅ Done:
- Password hashing with bcryptjs
- JWT authentication
- Environment variables secured
- CORS enabled selectively
- SQL injection prevention via Mongoose

⚠️ TODO:
- Add rate limiting
- Implement CSRF protection
- Add helmet.js for headers security
- Regular security audits

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure password is URL-encoded

### Frontend gets 404 on API calls
- Ensure backend is running on port 5000
- Check `VITE_API_URL` matches backend URL
- Verify CORS is enabled in backend

### Image analysis doesn't work
- This is optional - falls back to rule-based scoring
- If you want full AI: set `OPENAI_API_KEY` or Azure credentials

### Phone can't reach laptop
- Ensure phone and laptop are on same Wi-Fi
- Use laptop IP not localhost
- Check Windows Firewall allows port 3000/5000

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE.md for details

## Support

**Issues?** Open a GitHub issue
**Questions?** Contact: agridatasmart@gmail.com
**WhatsApp:** +255 093 653 378

---

**Made with 🍍 for Tanzanian farmers. Kilimo Cha Kisasa Sasa! 🌾**
