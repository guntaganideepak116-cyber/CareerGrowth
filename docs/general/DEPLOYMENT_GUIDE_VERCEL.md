# 🚀 Deployment Guide: Frontend (Vercel) & Backend (Render)

This guide explains how to deploy your "Career Growth" platform securely.
Because your backend uses **Cron Jobs** (for notifications) and **Websockets/Long-polling**, it requires a persistent server. Vercel is great for the frontend, but **Render** is recommended for the backend.

---

## 🔒 1. Prepare Environment Variables
Use the `.env.deployment.example` file in the root directory as a template.
1. Copy or rename it to `.env.production` locally (do NOT commit this file).
2. Fill in your real API keys and secrets.
3. You will copy-paste these values into Vercel and Render dashboards later.

---

## 🌐 2. Deploy Frontend to Vercel

1. **Push Code to GitHub**:
   - Ensure you are pushed to a GitHub repository.
   - *Note: `backend/serviceAccountKey.json` and `.env` files are ignored for security.*

2. **Import Project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New..." -> "Project".
   - Select your GitHub repository.

3. **Configure Project**:
   - **Framework Preset**: Vercel should auto-detect "Vite".
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)

4. **Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add all keys starting with `VITE_` from your `.env.deployment.example`.
   - **Crucially**: Set `VITE_API_URL` to your *future* backend URL (e.g., `https://career-growth-backend.onrender.com`).
     - *If you haven't deployed backend yet, you can leave it blank or update it later.*

5. **Deploy**:
   - Click **Deploy**. Vercel will build and host your frontend.

---

## ⚙️ 3. Deploy Backend to Render

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Click "New +" -> "Web Service".
   - Connect your GitHub repository.

2. **Configure Service**:
   - **Name**: `career-growth-backend` (or similar).
   - **Root Directory**: `backend`.
   - **Runtime**: Node.
   - **Build Command**: `npm install && npm run build` (Installs dependencies and compiles TypeScript).
   - **Start Command**: `npm start` (Runs the compiled JS).

3. **Environment Variables**:
   - Scroll down to "Environment Variables".
   - Add keys from the **Backend Configuration** section of `.env.deployment.example`:
     - `PORT`: `10000` (Render default) or `5000`.
     - `OPENAI_API_KEY`, `GEMINI_API_KEY`.
     - `ADMIN_EMAIL`.
     - `FIREBASE_SERVICE_ACCOUNT_JSON`: **Important!**
       - Open your local `serviceAccountKey.json`.
       - Copy the ENTIRE content.
       - Paste it into a [JSON Minifier](https://jsonminifier.com) to make it one line (optional but safer).
       - Paste the result as the value for `FIREBASE_SERVICE_ACCOUNT_JSON`.

4. **Deploy**:
   - Click **Create Web Service**.
   - Render will build and start your backend.
   - *Note: The free tier spins down after 15 mins of inactivity. The first request will take ~30s to wake it up.*

---

## 🔗 4. Connect Frontend & Backend

1. **Get Backend URL**:
   - Once Render finishes deploying, copy the service URL (e.g., `https://career-growth-backend.onrender.com`).
   - *Ensure it does not have a trailing slash.*

2. **Update Frontend**:
   - Go back to your Vercel Project Settings -> Environment Variables.
   - Edit `VITE_API_URL` and paste the Render URL.
   - Go to **Deployments** tab and **Redeploy** the latest commit for changes to take effect.

---

## ✅ Deployment Complete!
Your app is now live.
- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Admin**: Accessible via the defined `ADMIN_EMAIL`.
