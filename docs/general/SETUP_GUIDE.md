# 🚀 Setup Guide - AI Roadmap Generation

## ✅ What I've Created For You

I've built a complete AI roadmap generation system that connects your frontend to your backend with OpenAI API.

### Files Created:
1. **Backend:**
   - `backend/src/routes/content.ts` - API endpoint handler
   - `backend/src/services/aiService.ts` - OpenAI integration
   - Updated `backend/src/index.ts` - Added routes
   - Updated `backend/package.json` - Added OpenAI dependency

2. **Frontend:**
   - `frontend/src/services/apiService.ts` - Backend API client
   - Updated `frontend/src/hooks/useDynamicContent.ts` - Now calls Express backend

---

## 📋 Step-by-Step Instructions

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

This will install the OpenAI package (^4.68.0) that was added to package.json.

### Step 2: Verify Your API Keys (Already Done ✅)
Your `.env` file in the backend already has:
- ✅ OPENAI_API_KEY configured
- ✅ GEMINI_API_KEY configured (not used yet)
- ✅ PORT=5000

### Step 3: Start the Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
```

### Step 4: Start the Frontend (In a New Terminal)
```bash
cd frontend
npm run dev
```

You should see something like:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 5: Test the AI Roadmap Generation
1. Open your browser to the frontend URL (usually http://localhost:5173)
2. Log in to your account
3. Navigate to the **Roadmap** page
4. Select a **Field** (e.g., Computer Science)
5. Select a **Specialization** (e.g., Full Stack Development)
6. Wait for the AI to generate your personalized roadmap!

---

## 🔍 How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│ Express API  │────────▶│  OpenAI API │
│   (React)   │         │  (Port 5000) │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                         │                        │
      │                         │                        │
      └──── User selects ──────┘                        │
            field + spec        │                        │
                                │                        │
                        Sends request to:                │
                        POST /api/content/generate       │
                                │                        │
                                V                        │
                        aiService.ts uses                │
                        your OPENAI_API_KEY ─────────────┘
                                │
                                V
                        Returns AI-generated
                        roadmap with:
                        - 5 phases
                        - Real tools & technologies
                        - Actual certifications
                        - Project ideas
                        - Career relevance
```

---

## 🧪 Testing the API Manually

You can test the backend API directly using PowerShell or curl:

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET

# Test roadmap generation
$body = @{
    type = "roadmap"
    fieldId = "computer-science"
    specializationId = "full-stack"
    userProfile = @{
        semester = 3
        careerGoal = "Full Stack Developer"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/content/generate" -Method POST -Body $body -ContentType "application/json"
```

---

## ❗ Troubleshooting

### Problem: "Cannot find module 'openai'"
**Solution:** Run `npm install` in the backend folder

### Problem: Backend won't start
**Solution:** 
1. Check if port 5000 is already in use
2. Verify your .env file has OPENAI_API_KEY
3. Run `npm install` again

### Problem: "Unable to load AI-generated roadmap"
**Solution:**
1. Make sure backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify VITE_API_URL in frontend/.env is "http://localhost:5000"

### Problem: OpenAI API errors
**Solution:**
1. Verify your OpenAI API key is valid
2. Check if you have API credits
3. Look at backend terminal for error messages

---

## 🎯 What Happens Next

When you select a field and specialization:

1. **Frontend** sends request to backend
2. **Backend** receives the request at `/api/content/generate`
3. **aiService.ts** creates a detailed prompt with:
   - Your selected field and specialization
   - Your current semester
   - Your career goal
4. **OpenAI API** generates a custom roadmap with:
   - 5 detailed learning phases
   - Real technologies (React, Node.js, AWS, etc.)
   - Actual certifications (AWS Certified, Google Cloud, etc.)
   - Practical project ideas
   - Career relevance explanations
5. **Backend** sends the roadmap back to frontend
6. **Frontend** displays your personalized AI roadmap!

---

## 🎨 Features You Get

✅ **5-Phase Learning Journey** from beginner to advanced
✅ **Real Industry Technologies** (2024-2026 current)
✅ **Actual Certifications** with provider names
✅ **Portfolio Project Ideas** you can build
✅ **Career Relevance** for each phase
✅ **Caching System** (5-minute cache to save API calls)
✅ **Refresh Button** to regenerate when needed
✅ **Static Fallback** if AI fails

---

## 💰 API Costs

OpenAI API usage is metered:
- **Model Used:** gpt-4o-mini (cost-effective)
- **Estimated Cost:** ~$0.01-0.02 per roadmap generation
- **Cache Duration:** 5 minutes (reduces repeated calls)

Monitor your usage at: https://platform.openai.com/usage

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Your `.env` files contain sensitive API keys
- These files should **NEVER** be committed to Git
- Verify `.env` is in your `.gitignore` file
- If you've already pushed to GitHub, **rotate your API keys immediately**

---

## 📚 Next Steps

After getting basic roadmaps working, you can:
1. Implement other content types (certifications, projects)
2. Switch to Gemini API if you prefer (GEMINI_API_KEY is already configured)
3. Add more customization options
4. Enhance the AI prompts for better results

---

## ✉️ Need Help?

If something doesn't work:
1. Check both terminal windows for error messages
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check browser console (F12) for frontend errors
5. Test the backend API manually first

Good luck! 🚀
