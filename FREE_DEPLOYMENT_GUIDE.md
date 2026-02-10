# TriConnect MERN Stack - FREE Deployment Guide
## Deploy to MongoDB Atlas + Render + Vercel

---

## PHASE 1: Database - MongoDB Atlas Migration

### 1.1: Create Free MongoDB Atlas Account
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" → Create account with email
3. Verify email
4. Complete profile setup
```

### 1.2: Create Free Cluster
```
1. Click "Create Deployment"
2. Select "FREE" tier
3. Choose region (pick one closest to you)
4. Name: "TriConnect-Cluster"
5. Click "Create"
6. Wait 2-3 minutes...
```

### 1.3: Create Database User
```
1. Left sidebar → "Database Access"
2. "Add New Database User"
3. Username: triconnect_user
4. Password: Generate Strong Password (SAVE THIS!)
5. Select: "Atlas Admin"
6. Click "Add User"
```

### 1.4: Allow Network Access
```
1. Left sidebar → "Network Access"
2. "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"
```

### 1.5: Get Connection String
```
1. Click "Databases" → "Connect" button
2. Select "Drivers" → "Node.js"
3. Copy connection string
4. Replace <password> with your password
5. Add database name: ?retryWrites=true&w=majority&appName=triconnect

Final Format:
mongodb+srv://triconnect_user:PASSWORD@cluster.xxxxx.mongodb.net/triconnect?retryWrites=true&w=majority
```

✅ **Database Ready!**

---

## PHASE 2: Prepare Backend for Deployment

### 2.1: Update Backend .env File
Create/Update `triconnect-backend/.env`:

```env
# Database
MONGO_URI=mongodb+srv://triconnect_user:YOUR_PASSWORD@triconnect-cluster.xxxxx.mongodb.net/triconnect?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your_very_long_secret_key_at_least_32_characters_long_use_random_string

# Google OAuth (update later in Phase 5)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twilio (keep as is or leave empty if not configured)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Frontend URL (will update in Phase 4)
FRONTEND_URL=http://localhost:3000
```

### 2.2: Verify CORS Configuration
Check `triconnect-backend/server.js` has:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://triconnect-frontend.vercel.app',  // ADD THIS
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

### 2.3: Verify .gitignore
Ensure `triconnect-backend/.gitignore` has:
```
node_modules/
.env
.env.local
uploads/
dist/
```

### 2.4: Push to GitHub
```bash
cd triconnect-backend
git add .
git commit -m "Prepare backend for production deployment"
git push origin main
```

✅ **Backend Prepared!**

---

## PHASE 3: Deploy Backend to Render

### 3.1: Create Render Account
```
1. Go to https://render.com
2. Click "Sign Up"
3. Select "Sign up with GitHub"
4. Authorize Render to access your repos
```

### 3.2: Create Web Service
```
1. Dashboard → "New +" → "Web Service"
2. Select your GitHub repository
3. Click "Connect"
```

### 3.3: Configure Service
```
Name: triconnect-backend
Region: Choose closest to users
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm run dev (or: node server.js)
```

### 3.4: Add Environment Variables
```
Click "Add Environment Variable" for each:

MONGO_URI = mongodb+srv://triconnect_user:PASSWORD@...
JWT_SECRET = your_secret_key_here
PORT = 5000
NODE_ENV = production
GOOGLE_CLIENT_ID = (update in Phase 5)
GOOGLE_CLIENT_SECRET = (update in Phase 5)
FRONTEND_URL = https://triconnect-frontend.vercel.app
```

### 3.5: Deploy
```
Click "Create Web Service"
Wait for deployment (2-5 minutes)
You'll get a URL like: https://triconnect-backend.onrender.com
COPY THIS URL for frontend setup
```

### 3.6: Verify Backend Works
```bash
curl https://triconnect-backend.onrender.com/api/health
# Should return 200 if health endpoint exists, or 404 if not
```

✅ **Backend Live on Render!**

---

## PHASE 4: Deploy Frontend to Vercel

### 4.1: Create Vercel Account
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel
```

### 4.2: Update Frontend .env
Create `triconnect-frontend/.env.local`:

```env
REACT_APP_API_URL=https://triconnect-backend.onrender.com/api
```

**IMPORTANT**: Replace the URL with your actual Render backend URL!

### 4.3: Push to GitHub
```bash
cd triconnect-frontend
git add .env.local (if not in .gitignore)
# OR create .env.example for reference:
# REACT_APP_API_URL=https://your-backend.onrender.com/api

git commit -m "Add environment variables for production"
git push origin main
```

### 4.4: Deploy on Vercel
```
1. Vercel Dashboard → "Add New" → "Project"
2. Click "Import Git Repository"
3. Select your repository
4. Click "Import"
```

### 4.5: Configure Build Settings
```
Framework: Create React App
Build Command: npm run build
Output Directory: build
Environment Variables:
  - REACT_APP_API_URL = https://triconnect-backend.onrender.com/api
```

### 4.6: Deploy
```
Click "Deploy"
Wait 2-3 minutes for build
You'll get: https://triconnect-frontend.vercel.app
```

✅ **Frontend Live on Vercel!**

---

## PHASE 5: Update Google OAuth

### 5.1: Get Authorized Domains from Vercel
Your frontend is now at: `https://triconnect-frontend.vercel.app`

### 5.2: Update Google Cloud Console
```
1. Go to https://console.cloud.google.com
2. Select your TriConnect project
3. APIs & Services → Credentials
4. Find your OAuth Client ID
5. Click Edit (pencil icon)
```

### 5.3: Add Authorized Origins
Under "Authorized JavaScript origins", add:
```
https://triconnect-frontend.vercel.app
https://www.triconnect-frontend.vercel.app
http://localhost:3000 (keep for local testing)
```

### 5.4: Add Redirect URIs
Under "Authorized redirect URIs", add:
```
https://triconnect-frontend.vercel.app/signin
https://triconnect-frontend.vercel.app/dashboard
http://localhost:3000/signin (keep for testing)
http://localhost:3000/dashboard
```

Click "Save"

### 5.5: Update Backend Environment Variables
```
1. Go to Render Dashboard
2. Select triconnect-backend
3. Click "Environment"
4. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with actual values
5. Click "Save Changes"
6. Service automatically redeploys
```

✅ **Google OAuth Ready!**

---

## PHASE 6: Testing Your Live App

### Test Checklist:
```
1. ✅ Visit https://triconnect-frontend.vercel.app
2. ✅ Sign up with email
3. ✅ Sign in with email
4. ✅ Try Google OAuth sign-in
5. ✅ Toggle dark mode (Profile → Preferences)
6. ✅ Upload profile photo
7. ✅ View dashboard & events
8. ✅ Test event filters
9. ✅ (Admin) Post an event
```

### Verify API Calls:
```
Open browser DevTools (F12)
Go to "Network" tab
Make any API request
Should show: https://triconnect-backend.onrender.com/api/*
(NOT localhost)
```

### Check Backend Logs:
```
Render Dashboard → triconnect-backend → Logs
Should see: "TriConnect backend server running on port 5000"
No connection errors
```

✅ **App is Live and Working!**

---

## PHASE 7: Environment Variables Summary

### Where Each Variable Goes:

**Backend (.env on Render)**
```
MONGO_URI → Connection to MongoDB Atlas
JWT_SECRET → For token encryption
GOOGLE_CLIENT_ID → For Google OAuth
GOOGLE_CLIENT_SECRET → For Google OAuth
FRONTEND_URL → For CORS
```

**Frontend (.env.local on Vercel)**
```
REACT_APP_API_URL → Points to Render backend
```

### How to Update Variables:

**Render**: Dashboard → Service → Environment → Edit → Save (auto-redeploys)
**Vercel**: Settings → Environment Variables → Edit → Redeploy

---

## PHASE 8: Important Notes

### ⚠️ Render Free Tier Limitation
- Services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- This is normal for free tier
- Solution: Pay $7/month for always-on service

### 💾 MongoDB Atlas Backup
```
Auto-enabled on free tier!
Atlas → Backup → Backup Policy
Automatic daily backups included
```

### 🔒 Security Best Practices
- Never commit .env files to Git
- Use strong JWT_SECRET (32+ characters)
- Keep Google secrets safe (never share)
- Rotate secrets every 6 months

### 📊 Monitor Your App
- Render: Dashboard shows CPU/Memory usage
- Vercel: Analytics tab shows page views, errors
- MongoDB Atlas: Charts show usage

---

## PHASE 9: Updating Your Code

### When You Make Changes:

**Backend Changes:**
```bash
cd triconnect-backend
git add .
git commit -m "Your changes"
git push origin main
# Render auto-deploys within 1-2 minutes
```

**Frontend Changes:**
```bash
cd triconnect-frontend
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys within 1-2 minutes
```

Both services auto-deploy on every push to `main`!

---

## PHASE 10: Troubleshooting

### Problem: "Cannot GET /api/..."
**Solution**:
- Check `REACT_APP_API_URL` in Vercel environment
- Verify backend URL is correct in frontend
- Test: `curl https://triconnect-backend.onrender.com`

### Problem: "MongoDB connection failed"
**Solution**:
- Check connection string format in Render
- Verify password has no special characters (or URL-encode them)
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)

### Problem: "Google OAuth not working"
**Solution**:
- Check Authorized Origins in Google Cloud
- Check Redirect URIs match exactly
- Verify CLIENT_ID and SECRET in Render

### Problem: "Images not loading"
**Solution**:
- Check backend has `/uploads` folder
- Verify multer configuration in authRoutes.js
- Backend must serve static files

### Problem: "Render keeps crashing"
**Solution**:
- Check Render logs for error messages
- Verify all environment variables are set
- Check for missing dependencies

### Problem: "Nothing shows up on Vercel"
**Solution**:
- Check Vercel build logs for errors
- Verify `npm run build` works locally
- Check `public/` folder exists

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | 512MB storage | $0 |
| Render | 0.5GB RAM, auto-sleep | $0 |
| Vercel | 100GB bandwidth | $0 |
| **TOTAL** | - | **$0/month** |

**Can upgrade later:**
- Render: $7/month for always-on
- MongoDB: $57/month for shared cluster
- Vercel: $20/month for pro features

---

## Next Steps

1. Follow Phases 1-6 in order
2. Test everything thoroughly
3. Share your live URL with friends!
4. Monitor logs regularly
5. Plan scaling strategy for future

---

## Quick Git Commands Reference

```bash
# Check current branch
git branch

# Make changes and push
git add .
git commit -m "Your message"
git push origin main

# View commit history
git log --oneline

# Revert last commit (if needed)
git revert HEAD
git push origin main
```

---

## Your Live URLs Once Deployed

```
Frontend: https://triconnect-frontend.vercel.app
Backend: https://triconnect-backend.onrender.com
Database: Managed by MongoDB Atlas (no URL needed)
```

---

## Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Troubleshooting: Check service logs in their dashboards

---

## 🎉 Congratulations!

Your TriConnect MERN app is now live on the internet for FREE!

Share your URL and let users discover amazing events!

---
