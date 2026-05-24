# 🍍 AgriData Smarts - Deployment Guide

## Project Overview
AgriData Smarts is a web application for smart pineapple farming in Tanzania with AI-powered crop analysis, chatbot support, and real-time analytics.

**Stack:**
- Backend: Node.js + Express 5, MongoDB, Socket.io
- Frontend: React 18 + Vite, Material UI
- Authentication: JWT
- Image Analysis: OpenAI or Azure Computer Vision (optional)
- WhatsApp Integration: Twilio (optional)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client (Phone/Browser)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐         ┌────────┐      ┌──────────┐
   │ Vercel │         │ Replit │      │ MongoDB  │
   │(Frontend)        │(Backend)      │  Atlas   │
   └────────┘         └────────┘      └──────────┘
```

---

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas (Cloud Database)

#### 1.1 Create MongoDB Account
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Click **Sign Up** (use Google, GitHub, or email)
- Follow verification steps

#### 1.2 Create a Free Cluster
- Click **Create** → **Build a Database**
- Select **Free** tier (M0)
- Choose region closest to Tanzania (e.g., **Frankfurt** or **N. Virginia**)
- Click **Create Cluster** (wait 5-10 minutes)

#### 1.3 Create Database User
- Go to **Database Access**
- Click **Add New Database User**
- Username: `agridata_user`
- Password: Generate secure password (save it!)
- Click **Add User**

#### 1.4 Configure Network Access
- Go to **Network Access**
- Click **Add IP Address**
- Select **Allow Access from Anywhere** (0.0.0.0/0) for testing
- Click **Confirm**

#### 1.5 Get Connection String
- Click **Connect** on your cluster
- Select **Drivers** → **Node.js**
- Copy connection string: `mongodb+srv://agridata_user:PASSWORD@cluster.mongodb.net/agridata?retryWrites=true&w=majority`
- Replace `PASSWORD` with your actual password

---

### 2. Deploy Backend to Replit

#### 2.1 Create Replit Account
- Go to [replit.com](https://replit.com)
- Sign up with GitHub or email
- Verify email

#### 2.2 Create New Replit Project
- Click **Create** button
- Select **Import from GitHub** (if your repo is on GitHub)
  - OR **Upload Files** if you want to upload locally
- Choose **Node.js** language
- Name your Replit: `agridata-backend`

#### 2.3 Upload Backend Code (if not using GitHub)
- In Replit, upload all files from `backend/` folder
- Make sure `package.json`, `server.js`, and all routes are present

#### 2.4 Install Dependencies
```bash
npm install
```

#### 2.5 Add Environment Variables
- Click the **Secrets** (lock icon) in left panel
- Add each variable from `.env.example`:

```
MONGODB_URI=mongodb+srv://agridata_user:YOUR_PASSWORD@cluster.mongodb.net/agridata
PORT=3000
NODE_ENV=production
JWT_SECRET=your_super_secure_random_secret_key_min_32_chars
```

(Optional - only if using these features):
```
OPENAI_API_KEY=sk-xxxxx
AZURE_COMPUTER_VISION_ENDPOINT=https://xxxxx.cognitiveservices.azure.com/
AZURE_COMPUTER_VISION_KEY=xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+1415xxxxxxx
```

#### 2.6 Configure Replit to Run Backend
- In the `.replit` file (should exist), set:
```
run = "npm install && npm start"
```

#### 2.7 Start Backend
- Click **Run** button
- Backend should start on `https://agridata-backend.replit.dev`
- You'll see: `Server running on port 3000`

**Save your backend URL:** `https://agridata-backend.replit.dev` (your actual Replit name)

---

### 3. Deploy Frontend to Vercel

#### 3.1 Prepare Frontend for Production
- Update `frontend/.env.production`:
```
VITE_API_URL=https://agridata-backend.replit.dev
```

#### 3.2 Push to GitHub
```bash
# In your agridata-smarts folder
git init
git add .
git commit -m "Initial commit - ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/agridata-smarts.git
git branch -M main
git push -u origin main
```

#### 3.3 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Click **Sign Up** → Choose **GitHub**
- Authorize Vercel to access your GitHub

#### 3.4 Import Project to Vercel
- Click **New Project**
- Select your `agridata-smarts` repository
- **Framework Preset:** React
- **Root Directory:** `frontend`
- Add Environment Variable:
  - Key: `VITE_API_URL`
  - Value: `https://agridata-backend.replit.dev`
- Click **Deploy**

**Your frontend is now live at:** `https://agridata-smarts-xxx.vercel.app`

---

### 4. Testing Deployment

#### 4.1 Test Backend API
```bash
curl https://agridata-backend.replit.dev/api/chatbot/image-test
```

Expected response:
```json
{
  "ok": false,
  "message": "No image analysis provider configured..."
}
```

#### 4.2 Test Frontend
- Open your Vercel URL in browser
- Should display the landing page
- Try registering and logging in
- Test chatbot messages
- Verify database saves messages

#### 4.3 Test on Phone
- Get your laptop's local IP: `ipconfig` (Windows) or `ifconfig` (Mac)
- On phone (same Wi-Fi), visit: `http://<YOUR_IP>:3000`
- Should see the landing page with QR code

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string (password must be URL-encoded if it has special chars)
- Verify all required environment variables are set
- Check Replit logs for errors

### Frontend can't reach backend
- Verify backend URL is correct and running
- Check CORS is enabled (it should be in server.js)
- Open browser console (F12) to see exact error

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username and password are correct
- Ensure database name is correct: `agridata`

### Performance issues
- Replit free tier may be slow; consider upgrading
- Use MongoDB Atlas free tier (limited but free)
- Enable gzip compression in backend

---

## Custom Domain (Optional)

### For Vercel Frontend
1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Click **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### For Replit Backend
- Replit doesn't easily support custom domains on free tier
- Keep using `replit.dev` URL or upgrade to Replit Pro

---

## Monitoring & Maintenance

### Monitor Backend Logs
- Replit: Click **Logs** tab to see real-time logs

### Monitor Frontend
- Vercel: Dashboard shows deployment status and analytics

### Database Backups
- MongoDB Atlas free tier has automatic daily backups
- Access via **Backup** section in Atlas console

---

## Security Best Practices

✅ **Done:**
- JWT authentication enabled
- Password hashing with bcryptjs
- CORS configured
- Environment variables not in git

⚠️ **TODO:**
- [ ] Use strong `JWT_SECRET` (min 32 characters, random)
- [ ] Enable MongoDB encryption
- [ ] Use HTTPS everywhere (automatically with Vercel/Replit)
- [ ] Rotate secrets regularly
- [ ] Add rate limiting for API endpoints
- [ ] Enable SSL/TLS for database connection

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | ✅ Yes (512MB) | Free |
| Replit | ✅ Yes | Free (slower), $7/month for Pro |
| Vercel | ✅ Yes | Free, $20/month for Pro |
| OpenAI API | ❌ No | $0.10 per image |
| Azure Vision | ✅ Free tier (5K calls/month) | ~$1 per 1K calls |
| Twilio WhatsApp | ❌ No | $0.005 per message |

**Minimum Cost (Free):** $0/month
**Recommended (all features):** ~$20-30/month

---

## Next Steps

1. ✅ Create MongoDB Atlas cluster
2. ✅ Deploy backend to Replit
3. ✅ Deploy frontend to Vercel
4. ✅ Test all features
5. ✅ Monitor logs and performance
6. ✅ Share with farmers in Tanzania

---

## Support & Contact

**Issues?**
- Check Replit logs: Click **Logs** tab
- Check Vercel logs: Dashboard → Deployments
- Check MongoDB status: MongoDB Atlas dashboard

**Need Help?**
- Replit Docs: https://docs.replit.com
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com

---

**Deployed Application:**
- Frontend: https://agridata-smarts-xxx.vercel.app
- Backend API: https://agridata-backend.replit.dev
- Database: MongoDB Atlas

🎉 **Your AgriData Smarts application is now live!**
