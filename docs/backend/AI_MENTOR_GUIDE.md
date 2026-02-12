# AI Mentor System - Complete Guide

## 🎯 Overview

The AI Mentor is a sophisticated chatbot system that provides personalized career guidance to logged-in users. It uses Google's Gemini AI with custom training through system prompts.

---

## 📋 Table of Contents

1. [How It Works](#how-it-works)
2. [Login Process](#login-process)
3. [Training the AI](#training-the-ai)
4. [Customization Guide](#customization-guide)
5. [Testing & Usage](#testing--usage)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 How It Works

### Architecture Flow

```
User Login (Firebase) 
  ↓
Firebase Token Generated
  ↓
Frontend sends chat message + token
  ↓
Backend verifies token (middleware)
  ↓
If valid → Gemini AI processes with system prompt
  ↓
AI response sent back to user
```

### Components

1. **Frontend**: `AIMentor.tsx` - Chat interface
2. **Backend**: `ai-mentor.ts` - API routes with AI logic
3. **Training**: System prompts in `SYSTEM_PROMPTS` object
4. **Auth**: Firebase authentication middleware

---

## 🔐 Login Process

### Step-by-Step User Flow

**1. User Signs Up/Logs In**
```
- Navigate to /signup or /login
- Enter email & password (or use Google Sign-In)
- Firebase creates account and generates auth token
- User is redirected to dashboard
```

**2. Accessing AI Mentor**
```
- Click "AI Mentor" in sidebar or dashboard
- Frontend automatically includes Firebase auth token in requests
- Backend verifies token using verifyToken middleware
- If valid → Chat works
- If invalid → "Please log in" error
```

### Authentication Code Flow

**Frontend (ai-chat.ts):**
```typescript
// Get user's Firebase session token
const { data: { session } } = await supabase.auth.getSession();

// Send token in Authorization header
headers: {
  'Authorization': `Bearer ${session.access_token}`
}
```

**Backend (adminMiddleware.ts):**
```typescript
export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.userId = decodedToken.uid; // Attach user ID
  next(); // Allow access
}
```

---

## 🧠 Training the AI

### What is "Training"?

In this system, "training" means writing **system prompts** that tell the AI how to behave, what personality to have, and what expertise to provide.

### System Prompt Structure

Located in `backend/src/routes/ai-mentor.ts`:

```typescript
const SYSTEM_PROMPTS = {
    counselor: `...instructions for career counselor role...`,
    mentor: `...instructions for industry mentor role...`,
    coach: `...instructions for skill coach role...`,
};
```

### Example: Current Counselor Prompt

```
You are an expert Career Counselor with 15 years of experience.

Your expertise includes:
- Career path exploration
- Educational planning
- Understanding individual strengths

Personality: Warm, empathetic, and supportive.

Guidelines:
- Always be encouraging
- Ask follow-up questions
- Provide actionable advice
- Keep responses concise (2-3 paragraphs max)
```

---

## 🎨 Customization Guide

### 1. Modify Existing Roles

Edit `backend/src/routes/ai-mentor.ts`:

```typescript
const SYSTEM_PROMPTS = {
    counselor: `You are a specialized Engineering Career Counselor.
    
Focus on:
- CSE, ECE, EEE, Mechanical, Civil career paths
- Top companies in India (TCS, Infosys, Wipro, etc.)
- Government jobs (ISRO, DRDO, PSUs)
- Startup culture vs corporate
- Higher education (MS, MBA, MTech)

Personality: Practical and India-focused.

Guidelines:
- Mention Indian companies and opportunities
- Discuss placement preparation
- Consider branch-specific advice
- Recommend Indian certifications (NPTEL, etc.)`,

    // ... other roles
};
```

### 2. Add New AI Roles

**Step 1:** Add to SYSTEM_PROMPTS in `ai-mentor.ts`:

```typescript
const SYSTEM_PROMPTS = {
    counselor: `...`,
    mentor: `...`,
    coach: `...`,
    
    // NEW ROLE
    entrepreneur: `You are a Startup and Entrepreneurship Advisor.
    
Your expertise:
- Starting a tech startup
- Business model development
- Funding and investors
- Product-market fit
- Team building

Personality: Innovative, risk-aware, motivating.

Guidelines:
- Share startup success stories
- Discuss funding options (bootstrapping, VC, etc.)
- Warn about common pitfalls
- Provide actionable next steps`,
};
```

**Step 2:** Add to frontend `AIMentor.tsx`:

```typescript
const aiRoles: AIRole[] = [
  { id: 'counselor', name: 'Career Counselor', icon: GraduationCap, description: '...' },
  { id: 'mentor', name: 'Industry Mentor', icon: Briefcase, description: '...' },
  { id: 'coach', name: 'Skill Coach', icon: Target, description: '...' },
  
  // NEW ROLE
  { id: 'entrepreneur', name: 'Startup Advisor', icon: Rocket, description: 'Entrepreneurship and startups' },
];
```

**Step 3:** Import icon (if new):

```typescript
import { Rocket } from 'lucide-react'; // Add to imports
```

### 3. Branch-Specific Customization

Create specialized prompts for each engineering branch:

```typescript
const BRANCH_SPECIFIC_PROMPTS = {
    cse: `Focus on: Web Dev, AI/ML, Cloud, DSA, Competitive Programming
Top companies: Google, Microsoft, Amazon, Meta
Skills: React, Python, AWS, System Design`,

    ece: `Focus on: VLSI, Embedded Systems, IoT, Signal Processing
Top companies: Intel, Qualcomm, Samsung, Broadcom
Skills: Verilog, MATLAB, ARM, FPGA`,

    mechanical: `Focus on: CAD, Robotics, Manufacturing, Automotive
Top companies: Tesla, TATA Motors, Mahindra, Bosch, L&T
Skills: SolidWorks, ANSYS, AutoCAD, Python`,
};

// Then in the API, modify the system prompt based on user's branch:
const userBranch = getUserBranchFromDB(userId);
const branchContext = BRANCH_SPECIFIC_PROMPTS[userBranch];
const finalPrompt = systemPrompt + "\n\n" + branchContext;
```

### 4. Add Context from User Profile

Make AI responses more personalized by including user data:

```typescript
router.post('/chat', verifyToken, async (req, res) => {
    const userId = req.userId;
    
    // Fetch user profile from Firebase
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    // Add user context to system prompt
    const userContext = `
Context about this user:
- Branch: ${userData.branch}
- Year: ${userData.year}
- Interests: ${userData.interests?.join(', ')}
- Career goals: ${userData.career_goals}

Tailor your advice based on this information.`;
    
    const finalSystemPrompt = SYSTEM_PROMPTS[role] + "\n\n" + userContext;
    
    // ... rest of chat logic
});
```

---

## 📝 Training Examples

### Example 1: More Technical Counselor

```typescript
counselor: `You are a highly technical Career Counselor specializing in engineering students.

MUST MENTION when relevant:
- Specific technologies (React, Python, AWS, TensorFlow, etc.)
- Real GitHub project ideas
- LeetCode/CodeChef/HackerRank for coding prep
- Open source contribution opportunities
- Hackathons and competitions

Response format:
1. Direct answer to their question
2. Specific actionable steps (numbered list)
3. Resources (courses, websites, tools)
4. Timeline (if applicable)

Example response structure:
"For a CSE student interested in AI:

1. Start with Python fundamentals (2-3 weeks)
2. Learn NumPy, Pandas (1 week)
3. Take Andrew Ng's ML course on Coursera
4. Build 2-3 projects (Kaggle datasets)
5. Apply to AI internships

Resources: Coursera, fast.ai, Kaggle
Timeline: 3-4 months to job-ready"`,
```

### Example 2: India-Focused Mentor

```typescript
mentor: `You are an Industry Mentor with 20 years experience in the Indian tech ecosystem.

Indian company knowledge:
- Service companies: TCS, Infosys, Wipro, HCL (good for freshers, structured training)
- Product companies: Flipkart, Zomato, Swiggy, Razorpay (fast-paced, ownership)
- MNCs: Google Bangalore, Microsoft Hyderabad, Amazon (high pay, global exposure)
- Startups: Unacademy, BYJU'S, CRED (equity, risk, high learning)

Salary insights:
- Fresher (CSE): 3.5-6 LPA service, 8-15 LPA product, 20-45 LPA top MNCs
- With 3-5 years: 8-15 LPA average, 20-40 LPA top performers

Always mention:
- CTC breakdown (base vs variable vs stocks)
- Work-life balance differences
- Career growth trajectory
- City-specific opportunities (Bangalore, Hyderabad, Pune, NCR)`,
```

### Example 3: Certification-Focused Coach

```typescript
coach: `You are a Certification Strategist. You recommend certifications based on ROI and career goals.

Top certifications by field:

CLOUD:
- AWS Solutions Architect (most demanded, $$$)
- Google Cloud Associate ($, good for freshers)
- Azure Fundamentals (easy start)

DATA:
- Google Data Analytics Certificate (beginner-friendly)
- Databricks Spark (advanced, $$)
- Tableau Desktop Specialist

CYBERSECURITY:
- CompTIA Security+ (entry-level)
- CEH (intermediate)
- CISSP (senior-level, $$$$)

Always provide:
1. Certification name
2. Prerequisites
3. Cost estimate
4. Study time needed
5. Job market demand
6. Best preparation resources`,
```

---

## 🧪 Testing & Usage

### Local Testing Steps

**1. Start Backend:**
```bash
cd backend
npm run dev
```

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```

**3. Create Test Account:**
```
- Go to http://localhost:5173/signup
- Email: test@example.com
- Password: TestPass123!
- Complete profile with branch selection
```

**4. Go to AI Mentor:**
```
- Dashboard → AI Mentor (or /ai-mentor)
- Select role (Counselor, Mentor, or Coach)
- Type: "I'm a CSE student in 3rd year. Should I learn AI or Web Dev?"
```

**5. Check Response:**
```
- Should get personalized advice based on the role
- Response should follow system prompt guidelines
- Check console for any errors
```

### Test Questions by Role

**Counselor:**
- "I'm confused between pursuing MS or getting a job. What should I do?"
- "How do I choose between CSE and ECE?"
- "What's the best career path for an average student?"

**Mentor:**
- "Which companies should I target as a fresher ECE student?"
- "What's the difference between working at a startup vs MNC?"
- "How do I prepare for Google interviews?"

**Coach:**
- "What certifications should I get for cloud computing?"
- "Create a 6-month learning plan for becoming a full-stack developer"
- "Which skills are most in-demand for mechanical engineers?"

---

## 🔍 Monitoring & Rate Limits

### Current Rate Limits

- **10 messages per hour per user**
- Prevents API abuse
- Stored in-memory (resets on server restart)

### Modify Rate Limits

In `ai-mentor.ts`:

```typescript
// Change from 10 to 50 messages per hour
if (userLimit.count >= 50) {
    return false;
}

// Change time window from 1 hour to 24 hours
resetTime: now + 24 * 60 * 60 * 1000
```

### Production Recommendations

For production, use Redis instead of in-memory:

```typescript
import Redis from 'ioredis';
const redis = new Redis();

async function checkRateLimit(userId: string): Promise<boolean> {
    const key = `ratelimit:${userId}`;
    const count = await redis.incr(key);
    
    if (count === 1) {
        await redis.expire(key, 3600); // 1 hour
    }
    
    return count <= 10;
}
```

---

## 🐛 Troubleshooting

### Issue: "Please log in to use the AI mentor"

**Cause**: No valid Firebase token
**Fix**: 
1. Check if user is logged in (check localStorage for Firebase token)
2. Try logging out and back in
3. Verify Firebase config in `frontend/src/lib/firebase.ts`

### Issue: AI responses are generic/not following prompts

**Cause**: System prompt not being applied correctly
**Fix**:
1. Check `SYSTEM_PROMPTS` object in `ai-mentor.ts`
2. Verify the prompt is being passed to Gemini (add console.log)
3. Try increasing `temperature` for more creative responses

### Issue: Rate limit errors immediately

**Cause**: Server restart cleared in-memory counter
**Fix**: 
- Implement persistent storage (Redis/Database)
- Or increase rate limit temporarily for testing

### Issue: Slow responses

**Cause**: Gemini API latency or large conversation history
**Fix**:
1. Reduce `maxOutputTokens` (currently 800)
2. Limit conversation history to last 10 messages
3. Use streaming endpoint (`/stream`) for better UX

---

## 🚀 Advanced: Real-Time Streaming

To enable typing effect (like ChatGPT), update frontend `ai-chat.ts`:

```typescript
// Change CHAT_URL from Supabase to your backend
const CHAT_URL = 'http://localhost:5000/api/ai-mentor/stream';

// Rest of streamChat function works the same
```

Backend already supports streaming via `/api/ai-mentor/stream` endpoint.

---

## 📊 Analytics & Logging

### Track User Queries

Add logging to understand what users ask:

```typescript
router.post('/chat', verifyToken, async (req, res) => {
    const userId = req.userId;
    const userMessage = messages[messages.length - 1].content;
    
    // Log to Firestore for analytics
    await db.collection('ai_chat_logs').add({
        userId,
        role,
        question: userMessage,
        timestamp: new Date(),
    });
    
    // ... rest of logic
});
```

### Query Analytics Dashboard

```typescript
// Get most common questions
const logsSnapshot = await db.collection('ai_chat_logs')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

const questions = logsSnapshot.docs.map(doc => doc.data().question);
const commonTopics = analyzeTopics(questions); // Use NLP or keywords
```

---

## 📚 Resources

- [Google Gemini AI Docs](https://ai.google.dev/docs)
- [System Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Firebase Auth](https://firebase.google.com/docs/auth)

---

**Last Updated**: January 31, 2026  
**Version**: 1.0  
**Status**: ✅ Ready for Production
