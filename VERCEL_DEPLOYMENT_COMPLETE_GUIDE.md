# 🚀 Complete Vercel Deployment Guide - Step by Step

## 📋 Overview

This guide will help you deploy your **Career Growth** platform to production.

**Deployment Options:**
1. **Option A (Recommended):** Frontend on Vercel + Backend on Vercel
2. **Option B:** Frontend on Vercel + Backend on Render (for long-running processes)

---

## 🎯 Prerequisites Checklist

Before starting, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (free tier is fine)
- [ ] Code pushed to GitHub repository
- [ ] Firebase project configured
- [ ] All environment variables ready
- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (`npm run build`)

---

## 📦 STEP 1: Prepare Your Project

### 1.1 Check Project Structure

Your project should look like this:
```
Career Growth/
├── frontend/          # React + Vite app
├── backend/           # Express + TypeScript API
├── firestore.rules    # Firebase rules
├── .gitignore         # Git ignore file
└── README.md
```

### 1.2 Verify .gitignore

Make sure these are in your `.gitignore`:
```
# Environment files
.env
.env.local
.env.production
*.env

# Service account
serviceAccountKey.json
backend/serviceAccountKey.json

# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
*/dist/
build/
*/build/

# Logs
*.log
```

### 1.3 Test Local Builds

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Should complete without errors ✅
```

**Backend:**
```bash
cd backend
npm install
npm run build
# Should create dist/ folder ✅
```

---

## 🔐 STEP 2: Prepare Environment Variables

### 2.1 Frontend Environment Variables

Create a list of your frontend env vars:

```env
# Frontend (.env for Vercel)
VITE_API_URL=https://your-backend-url.vercel.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Where to find these:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" → Select Web app
5. Copy all the config values

### 2.2 Backend Environment Variables

Create a list of your backend env vars:

```env
# Backend (.env for Vercel)
PORT=5000
NODE_ENV=production

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# Admin Configuration
ADMIN_EMAIL=your-admin@email.com

# AI APIs (Optional)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**How to get Firebase Service Account JSON:**
1. Firebase Console → ⚙️ Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **Minify it:** Go to https://jsonminifier.com
5. Paste the JSON content
6. Copy the minified (one-line) version
7. This is your `FIREBASE_SERVICE_ACCOUNT_JSON` value

---

## 🌐 STEP 3: Push to GitHub

### 3.1 Initialize Git (if not already)

```bash
cd "C:\Users\DELL\OneDrive\Desktop\Career Growth"
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 3.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `career-growth-platform` (or your choice)
3. **Private** or Public (your choice)
4. **Don't** initialize with README (you already have one)
5. Click "Create repository"

### 3.3 Push to GitHub

```bash
# Add remote (replace with YOUR GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/career-growth-platform.git

# Push code
git branch -M main
git push -u origin main
```

**Verify:** Go to your GitHub repo URL and confirm files are there ✅

---

## 🎨 STEP 4: Deploy Frontend to Vercel

### 4.1 Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" (or "Login")
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### 4.2 Import Project

1. Click "Add New..." → "Project"
2. Find your `career-growth-platform` repository
3. Click "Import"

### 4.3 Configure Frontend Deployment

**Framework Preset:**
- Vercel should auto-detect "Vite" ✅

**Root Directory:**
- Click "Edit" next to Root Directory
- Select `frontend`
- Click "Continue"

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `dist` (default)
- Install Command: `npm install` (default)

### 4.4 Add Environment Variables

Click "Environment Variables" section:

Add each variable one by one:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend.vercel.app` (we'll update this later) | Production |
| `VITE_FIREBASE_API_KEY` | Your Firebase API key | Production |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com | Production |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id | Production |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com | Production |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Production |
| `VITE_FIREBASE_APP_ID` | Your app ID | Production |
| `VITE_FIREBASE_MEASUREMENT_ID` | Your measurement ID | Production |

**Note:** Leave `VITE_API_URL` as a placeholder for now. We'll update it after deploying the backend.

### 4.5 Deploy Frontend

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. You'll see "Congratulations! 🎉" when done
4. Copy your frontend URL: `https://your-project.vercel.app`

**Test:** Visit the URL and verify the site loads ✅

---

## ⚙️ STEP 5: Deploy Backend to Vercel

### 5.1 Create New Project for Backend

1. Go back to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Select the SAME repository (`career-growth-platform`)
4. Click "Import"

### 5.2 Configure Backend Deployment

**Framework Preset:**
- Select "Other" (Express.js)

**Root Directory:**
- Click "Edit"
- Select `backend`
- Click "Continue"

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist` (leave default)
- Install Command: `npm install`

### 5.3 Add Backend Environment Variables

Click "Environment Variables":

| Key | Value | Environment |
|-----|-------|-------------|
| `PORT` | `5000` | Production |
| `NODE_ENV` | `production` | Production |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Your minified JSON (from Step 2.2) | Production |
| `ADMIN_EMAIL` | your-admin@email.com | Production |
| `OPENAI_API_KEY` | sk-... (if you have one) | Production |
| `GEMINI_API_KEY` | Your Gemini key (if you have one) | Production |
| `EMAIL_USER` | your-email@gmail.com (optional) | Production |
| `EMAIL_PASS` | your-app-password (optional) | Production |

**Important for `FIREBASE_SERVICE_ACCOUNT_JSON`:**
- Must be a single-line minified JSON string
- Example: `{"type":"service_account","project_id":"your-id",...}`
- No line breaks!

### 5.4 Configure vercel.json for Backend

Before deploying, we need to create a `vercel.json` file in the `backend` folder.

**Create:** `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

**Commit and push this file:**
```bash
git add backend/vercel.json
git commit -m "Add Vercel config for backend"
git push
```

### 5.5 Deploy Backend

1. Click "Deploy"
2. Wait for build (3-7 minutes)
3. Copy your backend URL: `https://your-backend.vercel.app`

**Test:** Visit `https://your-backend.vercel.app/api/health` (should return status)

---

## 🔗 STEP 6: Connect Frontend to Backend

### 6.1 Update Frontend Environment Variable

1. Go to Vercel Dashboard
2. Select your **FRONTEND** project
3. Go to "Settings" → "Environment Variables"
4. Find `VITE_API_URL`
5. Click "Edit"
6. Change value to your backend URL: `https://your-backend.vercel.app`
7. Click "Save"

### 6.2 Redeploy Frontend

1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Wait for redeployment to complete

**Test:** Visit your frontend URL and try logging in ✅

---

## 🔥 STEP 7: Configure Firebase for Production

### 7.1 Add Production Domain to Firebase

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to "Authentication" → "Settings" → "Authorized domains"
4. Click "Add domain"
5. Add your Vercel frontend URL: `your-project.vercel.app`
6. Click "Add"

### 7.2 Update CORS Settings (Backend)

Make sure your backend allows requests from your frontend domain.

**Check:** `backend/src/index.ts` should have:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app'  // Add your production URL
  ],
  credentials: true
}));
```

If you need to update this, commit and push:
```bash
git add backend/src/index.ts
git commit -m "Update CORS for production"
git push
```

Vercel will auto-redeploy the backend.

---

## ✅ STEP 8: Final Testing

### 8.1 Test Checklist

Visit your production frontend URL and test:

- [ ] Homepage loads
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Profile page works
- [ ] Firebase data loads (career paths, fields, etc.)
- [ ] No console errors (F12)
- [ ] Mobile responsive (test with DevTools)
- [ ] Admin login works (with ADMIN_EMAIL)
- [ ] Admin dashboard accessible

### 8.2 Check Backend Health

Visit: `https://your-backend.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T..."
}
```

### 8.3 Monitor Logs

**Frontend Logs:**
1. Vercel Dashboard → Your frontend project
2. Click "Deployments"
3. Click latest deployment
4. Click "View Function Logs"

**Backend Logs:**
1. Vercel Dashboard → Your backend project
2. Click "Deployments"
3. Click latest deployment
4. Click "View Function Logs"

---

## 🎉 SUCCESS!

Your application is now live!

**URLs:**
- 🌐 **Frontend:** https://your-project.vercel.app
- ⚙️ **Backend:** https://your-backend.vercel.app
- 🔥 **Firebase:** https://console.firebase.google.com

---

## 🔧 Common Issues & Solutions

### Issue 1: "Failed to fetch" errors

**Cause:** CORS or wrong API URL

**Solution:**
1. Check `VITE_API_URL` in frontend env vars
2. Ensure backend CORS includes frontend domain
3. Redeploy both frontend and backend

### Issue 2: Firebase authentication not working

**Cause:** Domain not authorized

**Solution:**
1. Firebase Console → Authentication → Settings
2. Add your Vercel domain to authorized domains

### Issue 3: Backend returns 500 errors

**Cause:** Missing environment variables

**Solution:**
1. Check backend env vars in Vercel
2. Ensure `FIREBASE_SERVICE_ACCOUNT_JSON` is properly formatted
3. Check backend logs for specific errors

### Issue 4: Build fails

**Cause:** Dependencies or TypeScript errors

**Solution:**
1. Test build locally first: `npm run build`
2. Fix any errors
3. Commit and push
4. Redeploy

### Issue 5: "Module not found" errors

**Cause:** Missing dependencies in package.json

**Solution:**
1. Ensure all dependencies are in `package.json`
2. Run `npm install` locally
3. Commit `package.json` and `package-lock.json`
4. Push and redeploy

---

## 🚀 Next Steps

### Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Vercel Dashboard → Your project → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (5-30 minutes)

### Environment-Specific Configs

For staging vs production:
1. Create separate Vercel projects for staging
2. Use different environment variables
3. Deploy from different branches (e.g., `staging` branch)

### Continuous Deployment

Vercel automatically redeploys when you push to GitHub:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys ✅
```

---

## 📊 Deployment Summary

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | https://your-project.vercel.app |
| Backend | Vercel | https://your-backend.vercel.app |
| Database | Firebase | Firestore |
| Auth | Firebase | Firebase Auth |
| Storage | Firebase | Firebase Storage |

**Status:** ✅ Production Ready

**Cost:** $0/month (Free tier)

**Performance:**
- Frontend: Global CDN, instant loading
- Backend: Serverless functions, auto-scaling
- Database: Firebase, globally distributed

---

## 🎯 Quick Reference Commands

```bash
# Local development
cd frontend && npm run dev
cd backend && npm run dev

# Build for production
cd frontend && npm run build
cd backend && npm run build

# Deploy (automatic via GitHub)
git add .
git commit -m "Update"
git push

# View logs
vercel logs <deployment-url>
```

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Vite Docs:** https://vitejs.dev
- **Express Docs:** https://expressjs.com

---

**Congratulations! Your Career Growth platform is now live! 🎉🚀**
