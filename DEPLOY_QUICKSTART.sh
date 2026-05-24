#!/bin/bash
# AgriData Smarts - Quick Deployment Setup Script

echo "🍍 AgriData Smarts Deployment Setup"
echo "===================================="
echo ""

# Step 1: Git Setup
echo "📦 Step 1: Setting up Git repository"
echo "Run the following commands:"
echo ""
echo "git init"
echo "git add ."
echo 'git commit -m "Initial commit - AgriData Smarts production ready"'
echo "git remote add origin https://github.com/YOUR_USERNAME/agridata-smarts.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

# Step 2: MongoDB Setup
echo "💾 Step 2: Set up MongoDB Atlas"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create free cluster"
echo "3. Create database user and get connection string"
echo "4. Whitelist IP 0.0.0.0/0 for development"
echo "5. Copy connection string"
echo ""

# Step 3: Backend Deployment
echo "🔧 Step 3: Deploy Backend to Replit"
echo "1. Go to https://replit.com"
echo "2. Create new project"
echo "3. Upload 'backend' folder or import from GitHub"
echo "4. Add secrets in Replit:"
echo "   - MONGODB_URI=<your_mongodb_connection_string>"
echo "   - JWT_SECRET=<generate_random_32_char_string>"
echo "   - NODE_ENV=production"
echo "5. Click Run"
echo "6. Your backend URL: https://your-replit-name.replit.dev"
echo ""

# Step 4: Frontend Deployment
echo "⚛️  Step 4: Deploy Frontend to Vercel"
echo "1. Go to https://vercel.com"
echo "2. Import GitHub repository"
echo "3. Set Root Directory to: frontend"
echo "4. Add environment variable:"
echo "   - VITE_API_URL=https://your-replit-name.replit.dev"
echo "5. Click Deploy"
echo "6. Your frontend URL: https://your-project-name.vercel.app"
echo ""

# Step 5: Verification
echo "✅ Step 5: Verify Deployment"
echo "1. Test backend: curl https://your-replit-name.replit.dev/api/chatbot/image-test"
echo "2. Open frontend: https://your-project-name.vercel.app"
echo "3. Try features:"
echo "   - Register new account"
echo "   - Send chat message"
echo "   - Upload image for analysis"
echo "   - Check analytics dashboard"
echo ""

echo "🎉 Deployment Complete!"
echo ""
echo "📚 Documentation:"
echo "- Full guide: DEPLOYMENT.md"
echo "- Code docs: README.md"
echo ""
echo "💬 Need Help?"
echo "- Backend logs: Replit dashboard → Logs"
echo "- Frontend logs: Vercel dashboard → Deployments"
echo "- GitHub: https://github.com/YOUR_USERNAME/agridata-smarts"
