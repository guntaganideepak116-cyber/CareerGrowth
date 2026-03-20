# ⚡ Quick Start - 3 Simple Steps

## After pasting your API keys, follow these steps:

### 1️⃣ Start Backend Server
```bash
cd backend
npm run dev
```
✅ You should see: "Server is running on port 5000"

---

### 2️⃣ Start Frontend (New Terminal)
```bash
cd frontend  
npm run dev
```
✅ You should see: "Local: http://localhost:5173/"

---

### 3️⃣ Use the App
1. Open **http://localhost:5173** in your browser
2. Log in to your account
3. Go to **Roadmap** page
4. Select **Field** and **Specialization**
5. ✨ Watch AI generate your personalized roadmap!

---

## 🔥 Example Files Created

### Backend API Route (`backend/src/routes/content.ts`)
```typescript
// Handles POST /api/content/generate
router.post('/generate', async (req, res) => {
  const roadmapData = await generateRoadmap(
    request.fieldId,
    request.specializationId,
    request.userProfile
  );
  return res.json({ success: true, data: roadmapData });
});
```

### AI Service (`backend/src/services/aiService.ts`)
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRoadmap(...) {
  // Creates detailed prompt
  // Calls OpenAI GPT-4o-mini
  // Returns structured roadmap
}
```

### Frontend API Client (`frontend/src/services/apiService.ts`)
```typescript
const API_URL = 'http://localhost:5000';

export async function generateContent(request) {
  const response = await fetch(`${API_URL}/api/content/generate`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return result.data;
}
```

---

## 🎯 What You Get

Your AI roadmap includes:
- **5 Learning Phases** (Beginner → Advanced)
- **Real Technologies** (React, AWS, Docker, etc.)
- **Actual Certifications** (AWS Certified, Google Cloud, etc.)
- **Project Ideas** for your portfolio
- **Career Relevance** for each skill

---

## ✅ Checklist

- [x] API keys pasted in `backend/.env`
- [x] Dependencies installed (`npm install` - DONE ✅)
- [x] Backend files created
- [x] Frontend files updated
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Tested roadmap generation

---

## 💡 Pro Tips

1. **Cache System:** Roadmaps are cached for 5 minutes to save API costs
2. **Refresh Button:** Click to regenerate with fresh AI content
3. **Static Fallback:** If AI fails, shows pre-built roadmap
4. **AI Toggle:** Switch between AI and static content anytime

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module 'openai'" | Run `npm install` in backend |
| Backend won't start | Check if port 5000 is in use |
| No AI roadmap | Verify backend is running |
| OpenAI errors | Check API key & credits |

---

## 📊 Cost Estimate

- **Model:** GPT-4o-mini (cheapest GPT-4 variant)
- **Per Request:** ~$0.01-0.02
- **With Cache:** Even less (5-min cache)

Monitor at: https://platform.openai.com/usage

---

Ready to go! 🚀
