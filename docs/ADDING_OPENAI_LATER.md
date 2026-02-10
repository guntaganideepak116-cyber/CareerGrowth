# 🔮 Future: Adding OpenAI for AI Roadmaps

When you're ready to add AI-powered roadmaps, follow this guide!

---

## 📋 Prerequisites

Before you start, you'll need:
- ✅ OpenAI account
- ✅ Credit card for billing
- ✅ $5-$10 to add to your account

---

## 🚀 Step-by-Step Guide

### **Step 1: Add OpenAI Credits**

1. Go to: https://platform.openai.com/settings/organization/billing
2. Click **"Add payment method"**
3. Enter your credit card details
4. Click **"Add to credit balance"**
5. Add **$5** or **$10**
6. Confirm payment

✅ Your credits are now available!

---

### **Step 2: Verify Your API Key Works**

Test your API key:
1. Go to: https://platform.openai.com/usage
2. Check that you have credits available
3. Your existing API key should now work

---

### **Step 3: Switch Backend to OpenAI**

Open: `backend/src/services/aiService.ts`

**Replace the entire file with:**

```typescript
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface UserProfile {
    semester?: number;
    skills?: string[];
    careerGoal?: string;
}

interface RoadmapPhase {
    id: number;
    title: string;
    duration: string;
    focus: string;
    skills: string[];
    tools: string[];
    projects: string[];
    certifications: string[];
    careerRelevance: string;
}

export async function generateRoadmap(
    fieldId: string,
    specializationId: string,
    userProfile?: UserProfile
): Promise<RoadmapPhase[]> {
    try {
        const prompt = createRoadmapPrompt(fieldId, specializationId, userProfile);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career advisor and curriculum designer. Generate detailed, practical, and industry-relevant learning roadmaps for students. Focus on real-world technologies, certifications, and projects that employers actually look for. Provide responses in valid JSON format only.`,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const parsed = JSON.parse(content);
        return parsed.phases || [];
    } catch (error) {
        console.error('Error generating roadmap with OpenAI:', error);
        throw new Error('Failed to generate roadmap with AI');
    }
}

function createRoadmapPrompt(
    fieldId: string,
    specializationId: string,
    userProfile?: UserProfile
): string {
    const fieldMap: Record<string, string> = {
        'computer-science': 'Computer Science',
        'data-science': 'Data Science',
        'artificial-intelligence': 'Artificial Intelligence',
        'cybersecurity': 'Cybersecurity',
        'web-development': 'Web Development',
        'mobile-development': 'Mobile Development',
    };

    const specializationMap: Record<string, string> = {
        'full-stack': 'Full Stack Development',
        'frontend': 'Frontend Development',
        'backend': 'Backend Development',
        'devops': 'DevOps Engineering',
        'machine-learning': 'Machine Learning',
        'data-engineering': 'Data Engineering',
        'cloud-computing': 'Cloud Computing',
        'blockchain': 'Blockchain Development',
        'game-development': 'Game Development',
        'mobile-ios': 'iOS Development',
        'mobile-android': 'Android Development',
        'ai-nlp': 'Natural Language Processing',
        'ai-cv': 'Computer Vision',
        'network-security': 'Network Security',
        'ethical-hacking': 'Ethical Hacking',
    };

    const field = fieldMap[fieldId] || fieldId;
    const specialization = specializationMap[specializationId] || specializationId;
    const semester = userProfile?.semester || 1;
    const careerGoal = userProfile?.careerGoal || '';

    return `Create a detailed 5-phase learning roadmap for a student in ${field}, specializing in ${specialization}.

Student Context:
- Current Semester: ${semester}
- Career Goal: ${careerGoal || 'Not specified'}

Requirements:
1. Generate exactly 5 phases covering beginner to advanced levels
2. Each phase should be practical and achievable within 2-4 months
3. Include REAL and CURRENT technologies, tools, and certifications (2024-2026)
4. Focus on industry-relevant skills that employers actually seek
5. Include specific project ideas that can be added to a portfolio
6. Mention specific certifications with actual provider names (e.g., AWS Certified Solutions Architect, Google Cloud Professional, etc.)

Return a JSON object with this exact structure:
{
  "phases": [
    {
      "id": 1,
      "title": "Phase name",
      "duration": "2-3 months",
      "focus": "Main learning focus",
      "skills": ["skill1", "skill2", "skill3"],
      "tools": ["tool1", "tool2", "tool3"],
      "projects": ["project1", "project2"],
      "certifications": ["certification1", "certification2"],
      "careerRelevance": "Why this phase matters for career"
    }
  ]
}

Make it practical, current (2024-2026), and career-focused. Use real technology names and actual certifications.`;
}
```

---

### **Step 4: Update package.json**

Open: `backend/package.json`

Change the dependencies section to:

```json
"dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "firebase-admin": "^12.1.0",
    "openai": "^4.68.0"
},
```

---

### **Step 5: Reinstall Dependencies**

```bash
cd backend
npm install
```

---

### **Step 6: Restart Backend**

```bash
npm run dev
```

✅ Backend should start without errors

---

### **Step 7: Test It!**

1. Open your app
2. Go to Roadmap page
3. Click the **"AI"** toggle button (switch from Static to AI)
4. Select field and specialization
5. Watch AI generate your custom roadmap! 🎉

---

## 💰 Costs

**OpenAI GPT-4o-mini pricing:**
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

**Typical roadmap generation:**
- Input: ~500 tokens
- Output: ~1000 tokens
- **Cost: ~$0.01 per roadmap**

**Your $5 will get you:** ~500 AI-generated roadmaps!

---

## 🐛 Troubleshooting

**Error: "Failed to generate roadmap"**
- Check backend terminal for errors
- Verify API key has credits
- Check https://platform.openai.com/usage

**Error: "401 Unauthorized"**
- API key may be invalid
- Regenerate key at https://platform.openai.com/api-keys

**Error: "429 Rate Limit"**
- You've exceeded the rate limit
- Wait a moment and try again

---

## ✅ Success Checklist

- [ ] Added billing to OpenAI account
- [ ] Have at least $5 in credits
- [ ] Updated `aiService.ts` to use OpenAI
- [ ] Updated `package.json`
- [ ] Ran `npm install`
- [ ] Restarted backend server
- [ ] Clicked "AI" toggle in app
- [ ] Generated first AI roadmap!

---

## 📞 Need Help?

If you run into issues when adding OpenAI:
1. Check the backend terminal for error messages
2. Verify your .env file has OPENAI_API_KEY
3. Test with: `node test-openai.js` in backend folder

---

**Enjoy your AI-powered career planning app! 🚀**
