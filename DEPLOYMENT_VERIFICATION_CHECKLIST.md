# 🚀 AgriData Smarts - Deployment Verification Checklist

**Last Updated:** 2026-05-28  
**Status:** ⚠️ **URGENT: DEPLOYMENT LINKS NEED TO BE VERIFIED**

---

## 📋 Quick Reference - Deployment URLs

Based on your configuration files:

| Component | Expected URL | Status | Notes |
|-----------|--------------|--------|-------|
| **Frontend** | `https://agridata-smarts.netlify.app` | ❓ NEEDS CHECK | From `.env.example` |
| **Backend** | `https://agridata-smarts.onrender.com` | ❓ NEEDS CHECK | From frontend `.env.example` |
| **Database** | MongoDB Atlas | ✅ Configured | Connection string in backend `.env.example` |
| **Replit** | `https://agridata-backend.replit.dev` | ❓ NEEDS CHECK | Alternative backend option |
| **Vercel** | `https://agridata-smarts-xxx.vercel.app` | ❓ NEEDS CHECK | Alternative frontend option |

---

## ✅ STEP-BY-STEP VERIFICATION PROCESS

### 1. CHECK NETLIFY FRONTEND DEPLOYMENT
- [ ] Go to **https://agridata-smarts.netlify.app**
- [ ] Verify the landing page loads with **no 404 errors**
- [ ] Check browser console (F12) for **CORS or API connection errors**
- [ ] QR code should be visible on landing page
- [ ] Page should be responsive on mobile

**If NOT working:**
- [ ] Log into https://app.netlify.com
- [ ] Find your `agridata-smarts` site
- [ ] Check **Deployments** tab for build status
- [ ] Check **Deploy logs** for errors
- [ ] Verify environment variable: `VITE_API_URL` is set correctly

---

### 2. CHECK RENDER BACKEND DEPLOYMENT
- [ ] Go to **https://agridata-smarts.onrender.com**
- [ ] Should see JSON response: `{"status":"ok","message":"AgriData Smarts backend is running","dbConnected":true}`
- [ ] If database shows `"dbConnected":false`, **MongoDB is not connected**
- [ ] Try the test route: **https://agridata-smarts.onrender.com/api/test**

**If NOT working:**
- [ ] Log into https://dashboard.render.com
- [ ] Find your `agridata-smarts` service
- [ ] Check **Logs** tab for connection errors
- [ ] Verify all environment variables are set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT`
  - `NODE_ENV=production`
  - `ALLOWED_ORIGINS` (should include `https://agridata-smarts.netlify.app`)

---

### 3. TEST REGISTRATION FLOW ⭐ CRITICAL

**A. Test Backend Registration Endpoint:**
```bash
curl -X POST https://agridata-smarts.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+255993653378",
    "name": "Test Farmer",
    "password": "TestPassword123",
    "role": "farmer",
    "location": "Dar es Salaam"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test Farmer",
    "phoneNumber": "+255993653378",
    "role": "farmer"
  }
}
```

**If you get an error:**
- `400 - User already exists` → Phone number already registered
- `500 - Kosa la seva` → Check MongoDB connection and password hashing
- `CORS error` → Backend `ALLOWED_ORIGINS` doesn't include frontend URL

---

**B. Test Frontend Registration Form:**
1. Go to **https://agridata-smarts.netlify.app**
2. Click **Register** button
3. Fill in:
   - **Phone Number:** +255993653379 (use different number each test)
   - **Name:** Test User
   - **Password:** TestPassword123
   - **Location:** Dar es Salaam
4. Click **Submit**

**Expected:**
- ✅ User registered successfully
- ✅ Redirected to dashboard or login
- ✅ Data saved to MongoDB

**If NOT working:**
- [ ] Check browser console (F12) → **Network** tab
- [ ] Look for failed `POST` request to `/api/auth/register`
- [ ] Error message should appear on page
- [ ] Check if `VITE_API_URL` is correct in Netlify environment variables

---

### 4. TEST MONGODB CONNECTION

**Check from Backend:**
```bash
curl https://agridata-smarts.onrender.com
```

Response should show:
```json
{
  "status": "ok",
  "message": "AgriData Smarts backend is running",
  "dbConnected": true  ← THIS MUST BE TRUE
}
```

**If `"dbConnected": false`:**
- [ ] Go to **MongoDB Atlas** dashboard
- [ ] Check cluster status (should show green checkmark)
- [ ] Verify IP whitelist includes `0.0.0.0/0` for testing
- [ ] Check connection string in Render environment: `MONGODB_URI`
- [ ] Verify password is URL-encoded (special chars like `@` become `%40`)

**Sample connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/agridata?retryWrites=true&w=majority
```

---

### 5. TEST ALL ROUTES

After registration is working, test these endpoints:

**Authentication:**
- [ ] `POST https://agridata-smarts.onrender.com/api/auth/login`
  - Input: `{"phoneNumber": "+255993653378", "password": "..."}`
  - Should return JWT token

**Chatbot:**
- [ ] `GET https://agridata-smarts.onrender.com/api/chatbot/image-test`
  - Should return image provider status
- [ ] `POST https://agridata-smarts.onrender.com/api/chatbot/message`
  - Input: `{"message": "hali ya hewa", "phoneNumber": "+255993653378"}`
  - Should return chatbot response

**Farmers Dashboard:**
- [ ] `GET https://agridata-smarts.onrender.com/api/farmers/dashboard`
  - Should require JWT token in header

**Marketplace:**
- [ ] `GET https://agridata-smarts.onrender.com/api/market/listings`
  - Should return product listings

---

## 🔧 ENVIRONMENT VARIABLES VERIFICATION

### Backend (Render)
```
✅ MONGODB_URI = mongodb+srv://mtuibright29_db_user:2063africa@cluster0.tzo2iwj.mongodb.net/agridata?appName=Cluster0
✅ PORT = 10000
✅ NODE_ENV = production
✅ JWT_SECRET = agridata-smartsprojectbrightmtui
✅ ALLOWED_ORIGINS = https://agridata-smarts.netlify.app,http://localhost:3000
✅ GEMINI_API_KEY = AIzaSyBty2bss50uFQnXHfPDGLUELSv-23ANVao
⚠️  OPENAI_API_KEY = (optional - only if you want OpenAI image analysis)
⚠️  AZURE_COMPUTER_VISION_* = (optional - only if you want Azure image analysis)
⚠️  TWILIO_* = (optional - only if you want WhatsApp integration)
```

### Frontend (Netlify)
```
✅ VITE_API_URL = https://agridata-smarts.onrender.com
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Cannot connect to MongoDB"
**Symptoms:** Backend shows `"dbConnected": false`
**Fix:**
```
1. Check MongoDB Atlas cluster is running (green status)
2. Whitelist all IPs: Go to Network Access → Add 0.0.0.0/0
3. Verify password in connection string is URL-encoded
4. Copy exact connection string from Atlas → Connect → Drivers
```

---

### Issue 2: Registration returns 500 error
**Symptoms:** Form submission fails with "Server Error"
**Fix:**
```
1. Check Render logs: https://dashboard.render.com → Logs
2. Verify JWT_SECRET is set and is 32+ characters
3. Ensure bcryptjs is installed in backend: npm install bcryptjs
4. Check if phone number is already registered (should return 400, not 500)
```

---

### Issue 3: Frontend gets "CORS error" or blank page
**Symptoms:** Network tab shows failed requests
**Fix:**
```
1. Check ALLOWED_ORIGINS in Render includes: https://agridata-smarts.netlify.app
2. Verify VITE_API_URL in Netlify is exactly: https://agridata-smarts.onrender.com
3. Rebuild Netlify: https://app.netlify.com → Deployments → Trigger Redeploy
4. Clear browser cache (Ctrl+Shift+Delete) and refresh
```

---

### Issue 4: "Network error" when trying to register
**Symptoms:** Frontend shows network error, not CORS error
**Fix:**
```
1. Check backend is actually running: curl https://agridata-smarts.onrender.com
2. Verify Render service status (might be sleeping on free tier)
3. Check that VITE_API_URL doesn't have trailing slash
4. Try from different network (not just localhost)
```

---

## 📊 QUICK HEALTH CHECK

Run this command to test everything at once:

```bash
#!/bin/bash
echo "🔍 AGRIDATA SMARTS HEALTH CHECK"
echo "================================"
echo ""

echo "1️⃣  Backend Status:"
curl -s https://agridata-smarts.onrender.com | jq .dbConnected

echo ""
echo "2️⃣  Frontend Status:"
curl -s https://agridata-smarts.netlify.app -I | grep -E "HTTP|Content"

echo ""
echo "3️⃣  Registration Test:"
curl -X POST https://agridata-smarts.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+255993653380",
    "name": "Health Check",
    "password": "TestPass123",
    "role": "farmer",
    "location": "Test"
  }' | jq '.message'

echo ""
echo "✅ Health check complete!"
```

---

## 🎯 PRIORITY CHECKLIST

**MUST COMPLETE (to verify deployment works):**

- [ ] Frontend loads at `https://agridata-smarts.netlify.app` 
- [ ] Backend returns OK at `https://agridata-smarts.onrender.com`
- [ ] MongoDB is connected (`dbConnected: true`)
- [ ] Registration endpoint is reachable
- [ ] User can register from frontend form
- [ ] JWT token is returned after registration
- [ ] User data is saved to MongoDB

**SHOULD VERIFY (to ensure full functionality):**

- [ ] Login works
- [ ] Chatbot endpoint is working
- [ ] Image analysis fallback is working
- [ ] Farmer dashboard data loads
- [ ] Marketplace listings display
- [ ] Socket.io real-time updates work

**NICE TO HAVE (extra features):**

- [ ] WhatsApp integration (if Twilio configured)
- [ ] Image analysis with OpenAI (if API key set)
- [ ] Custom domain (if purchased)
- [ ] SSL/TLS certificate (automatic with Render/Netlify)

---

## 📞 SUPPORT LINKS

If you encounter issues:

1. **Netlify Issues:**
   - Dashboard: https://app.netlify.com
   - Docs: https://docs.netlify.com/deploy/deploy-overview/
   - Status: https://status.netlify.com

2. **Render Issues:**
   - Dashboard: https://dashboard.render.com
   - Docs: https://render.com/docs/troubleshooting-deploys
   - Status: https://status.render.com

3. **MongoDB Issues:**
   - Dashboard: https://cloud.mongodb.com
   - Docs: https://docs.mongodb.com/manual/reference/connection-string/
   - Support: https://support.mongodb.com

4. **Your Project:**
   - Repository: https://github.com/mtuibright29-african/agridata-smarts
   - Contact: agridatasmart@gmail.com
   - WhatsApp: +255 093 653 378

---

## 🎉 SUCCESS CRITERIA

Your deployment is **WORKING** when:

✅ User can register at `https://agridata-smarts.netlify.app`  
✅ Backend receives registration request at `https://agridata-smarts.onrender.com/api/auth/register`  
✅ User data is saved to MongoDB Atlas  
✅ JWT token is returned to frontend  
✅ User can log in  
✅ Chatbot responds to messages  
✅ Dashboard shows farmer data  

---

**Generated:** 2026-05-28  
**Next Review:** After completing all verification steps above  
**Maintainer:** mtuibright29-african
