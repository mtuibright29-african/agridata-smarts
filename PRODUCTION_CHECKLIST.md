## ✅ Production Deployment Checklist

Use this checklist to ensure your AgriData Smarts application is ready for production deployment.

---

### Backend Preparation

- [ ] **Dependencies**
  - [ ] `npm install` runs without errors
  - [ ] All packages listed in `package.json`
  - [ ] No `npm audit` vulnerabilities

- [ ] **Environment Variables**
  - [ ] `.env.example` file created with all variables
  - [ ] Actual `.env` file is NOT committed to git
  - [ ] `.gitignore` includes `.env` file
  - [ ] All required env vars documented

- [ ] **Database**
  - [ ] MongoDB Atlas cluster created
  - [ ] Database user created with strong password
  - [ ] Connection string tested locally
  - [ ] IP whitelist configured (0.0.0.0/0 or specific IP)
  - [ ] Collections created: users, chatmessages, farmdata, marketplace

- [ ] **API Endpoints**
  - [ ] `POST /api/auth/register` returns token
  - [ ] `POST /api/auth/login` works
  - [ ] `POST /api/chatbot/message` persists messages
  - [ ] `POST /api/chatbot/image` analyzes images
  - [ ] `GET /api/chatbot/history` returns chat history
  - [ ] `GET /api/chatbot/image-test` shows provider status

- [ ] **Security**
  - [ ] `JWT_SECRET` is at least 32 random characters
  - [ ] Passwords hashed with bcryptjs
  - [ ] CORS configured properly
  - [ ] No sensitive data in logs
  - [ ] Rate limiting configured (optional but recommended)

- [ ] **File Uploads**
  - [ ] `uploads/` directory created
  - [ ] Directory exists in `.gitignore`
  - [ ] Multipart form data handling works
  - [ ] File size limits set

- [ ] **Replit/Hosting**
  - [ ] `.replit` file configured
  - [ ] `Procfile` configured
  - [ ] `package.json` `start` script correct
  - [ ] Port set to 3000 or configurable

---

### Frontend Preparation

- [ ] **Build & Dependencies**
  - [ ] `npm install` runs without errors
  - [ ] `npm run build` completes without errors
  - [ ] No TypeScript/ESLint errors
  - [ ] Build output in `dist/` folder

- [ ] **Environment Variables**
  - [ ] `.env.example` file created
  - [ ] `VITE_API_URL` points to deployed backend
  - [ ] Actual `.env` file is NOT committed to git
  - [ ] `.gitignore` includes `.env` files

- [ ] **Configuration**
  - [ ] `vite.config.js` has `--host 0.0.0.0` for local network
  - [ ] `package.json` scripts correct:
    - [ ] `npm run dev` starts dev server
    - [ ] `npm run build` creates production build
    - [ ] `npm run preview` works

- [ ] **Routing**
  - [ ] All routes in `App.jsx` configured
  - [ ] Protected routes check authentication
  - [ ] Redirect to login for unauthorized pages
  - [ ] 404 page for unknown routes (optional)

- [ ] **API Integration**
  - [ ] `Chatbot.jsx` uses `API_BASE_URL` variable
  - [ ] All `axios` calls use correct endpoints
  - [ ] Socket.io connection URL configurable
  - [ ] Error handling for network failures

- [ ] **Mobile Responsiveness**
  - [ ] Landing page QR code displays correctly
  - [ ] All components work on phone-sized screens
  - [ ] Input fields are mobile-friendly
  - [ ] Images scale properly

- [ ] **Performance**
  - [ ] Build file size is reasonable (< 1MB gzip)
  - [ ] Images are optimized
  - [ ] No console errors or warnings
  - [ ] Lazy loading configured for large components

- [ ] **Vercel/Hosting**
  - [ ] `README.md` file present
  - [ ] `.gitignore` configured
  - [ ] `package.json` has all scripts
  - [ ] Build preview works locally

---

### Deployment Readiness

- [ ] **Git Repository**
  - [ ] Repository created on GitHub
  - [ ] All code committed
  - [ ] `.env` files NOT included
  - [ ] `.gitignore` properly configured

- [ ] **Documentation**
  - [ ] `README.md` complete
  - [ ] `DEPLOYMENT.md` complete
  - [ ] `.env.example` files created
  - [ ] Comments in code for complex logic

- [ ] **Testing**
  - [ ] Backend API tested locally
  - [ ] Frontend tested on desktop
  - [ ] Frontend tested on phone (same Wi-Fi)
  - [ ] QR code scanned successfully
  - [ ] Chat messages save to database
  - [ ] Images upload and analyze

- [ ] **Replit Backend**
  - [ ] New Replit project created
  - [ ] Backend code uploaded or imported
  - [ ] All secrets added
  - [ ] `npm install` ran successfully
  - [ ] `npm start` works without errors
  - [ ] Logs show "Server running on port 3000"
  - [ ] Note the Replit URL: `https://your-name.replit.dev`

- [ ] **Vercel Frontend**
  - [ ] GitHub repository connected
  - [ ] `Root Directory` set to `frontend`
  - [ ] Environment variable set: `VITE_API_URL=<replit-url>`
  - [ ] Deployment completed
  - [ ] Frontend loads without errors
  - [ ] Note the Vercel URL: `https://your-project.vercel.app`

---

### Post-Deployment Testing

- [ ] **Frontend Loads**
  - [ ] Open Vercel URL in browser
  - [ ] Landing page displays
  - [ ] No 404 errors
  - [ ] QR code generates correctly

- [ ] **User Registration**
  - [ ] Create new account works
  - [ ] Email/phone validation works
  - [ ] Password hashing works
  - [ ] JWT token generated

- [ ] **User Login**
  - [ ] Login with correct credentials works
  - [ ] Login with wrong credentials fails
  - [ ] Token saved to localStorage
  - [ ] Redirected to dashboard

- [ ] **Chatbot**
  - [ ] Can send messages
  - [ ] Messages appear on screen
  - [ ] Messages saved to database
  - [ ] Quick commands work
  - [ ] Can upload images
  - [ ] Images analyzed (AI or fallback)
  - [ ] Analysis appears on screen

- [ ] **Data Persistence**
  - [ ] Close browser and reopen
  - [ ] Chat history still visible
  - [ ] User still logged in
  - [ ] Messages in database

- [ ] **Phone Access**
  - [ ] Same Wi-Fi as laptop
  - [ ] Can visit frontend URL on phone
  - [ ] Can interact with app on phone
  - [ ] Can send chat messages from phone
  - [ ] Can upload images from phone

- [ ] **Error Handling**
  - [ ] Network error shows proper message
  - [ ] Invalid input handled gracefully
  - [ ] Server errors logged but don't crash app
  - [ ] Retry buttons appear when needed

---

### Optional Features

- [ ] **Image Analysis (OpenAI)**
  - [ ] [ ] Add `OPENAI_API_KEY` to Replit secrets
  - [ ] [ ] Test image upload and analysis
  - [ ] [ ] Verify AI response format

- [ ] **Image Analysis (Azure)**
  - [ ] [ ] Add `AZURE_COMPUTER_VISION_ENDPOINT` and `KEY`
  - [ ] [ ] Test image upload and analysis
  - [ ] [ ] Verify fallback works if Azure disabled

- [ ] **WhatsApp Integration**
  - [ ] [ ] Create Twilio account
  - [ ] [ ] Configure WhatsApp sandbox
  - [ ] [ ] Add Twilio secrets to Replit
  - [ ] [ ] Test WhatsApp send/receive

---

### Monitoring & Maintenance

- [ ] **Logging**
  - [ ] Backend logs accessible (Replit console)
  - [ ] Frontend errors visible in browser console
  - [ ] Set up error tracking (optional: Sentry)

- [ ] **Backups**
  - [ ] MongoDB Atlas auto-backups enabled
  - [ ] Database backup accessible
  - [ ] Recovery plan documented

- [ ] **Updates**
  - [ ] Plan for Node.js updates
  - [ ] Plan for package updates
  - [ ] Security patches monitored
  - [ ] Version control strategy clear

- [ ] **Performance**
  - [ ] Monitor Replit metrics
  - [ ] Monitor Vercel metrics
  - [ ] Response times acceptable
  - [ ] Uptime target documented

---

### Sign-Off

- [ ] Application ready for production
- [ ] All critical features tested
- [ ] Team agrees to deploy
- [ ] Rollback plan in place
- [ ] Support contact documented

---

**Date Checked:** _______________

**Checked By:** _______________

**Notes:**
```



```

---

**Once all items are checked, you are ready to launch! 🚀**
