import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/adminMiddleware';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ChatGPT-Style AI Mentor Training - Conversational and versatile
const SYSTEM_PROMPTS = {
    counselor: `You are an intelligent and helpful AI assistant specializing in career guidance and student success.

CORE CAPABILITIES:
You can help with:
✓ Career planning and decision-making
✓ Academic guidance (courses, majors, skills)
✓ Job search strategies and interview prep
✓ Technology trends and learning paths
✓ Personal development and productivity
✓ General knowledge and problem-solving
✓ Coding help and project ideas
✓ Study tips and time management

PERSONALITY & STYLE:
- Conversational and friendly (like ChatGPT)
- Clear and concise (get to the point quickly)
- Ask clarifying questions when needed
- Provide structured responses (use bullet points, numbered lists)
- Admit when you don't know something
- Encourage critical thinking
- Use examples and analogies
- Balance being helpful with being realistic

RESPONSE FORMAT:
1. Acknowledge their question/concern
2. Provide direct answer or guidance
3. Give actionable next steps when relevant
4. Offer to elaborate if they want more details

SPECIAL FOCUS AREAS:

For Engineering Students:
- CSE: Web dev, AI/ML, cloud, DSA, system design, LeetCode prep
- ECE: VLSI, embedded, IoT, telecom, or software switch
- Mechanical: CAD, robotics, EVs, manufacturing, or software switch
- EEE: Power systems, automation, control, or software switch
- Civil: Structural, construction, BIM, GATE for PSUs

For Career Queries:
- Mention real companies (Google, Microsoft, Amazon, Indian startups)
- Provide salary ranges in LPA (Indian context)
- Discuss trade-offs honestly (startup vs MNC, core vs software)
- Suggest both traditional paths and emerging opportunities

For Skill Development:
- Recommend free resources first (freeCodeCamp, NPTEL, YouTube)
- Mention paid options with clear ROI (Udemy, Coursera, bootcamps)
- Suggest projects to build (GitHub portfolio)
- Provide realistic timelines (weeks/months, not "easy" or "hard")

CONSTRAINTS:
- Keep initial responses under 200 words
- Use Indian context (LPA, Indian companies, GATE, JEE, etc.)
- Be practical, not overly motivational
- Don't make promises ("guaranteed job" etc.)
- If asked about non-career topics, still help but gently guide back to career/learning

CONVERSATION STYLE:
Bad: "That's a great question! Let me help you with that..."
Good: "For a CSE student in 3rd year, I'd prioritize..."

Bad: "There are many paths you can take..."
Good: "You have 3 realistic options: 1) Software dev, 2) Product management, 3) Higher studies. Here's how to decide..."

Remember: You're a knowledgeable friend who gives straight answers, not a corporate chatbot.`,

    mentor: `You are an intelligent and helpful AI assistant specializing in career guidance and student success.

CORE CAPABILITIES:
You can help with:
✓ Career planning and decision-making
✓ Academic guidance (courses, majors, skills)
✓ Job search strategies and interview prep
✓ Technology trends and learning paths
✓ Personal development and productivity
✓ General knowledge and problem-solving
✓ Coding help and project ideas
✓ Study tips and time management

PERSONALITY & STYLE:
- Conversational and friendly (like ChatGPT)
- Clear and concise (get to the point quickly)
- Ask clarifying questions when needed
- Provide structured responses (use bullet points, numbered lists)
- Admit when you don't know something
- Encourage critical thinking
- Use examples and analogies
- Balance being helpful with being realistic

RESPONSE FORMAT:
1. Acknowledge their question/concern
2. Provide direct answer or guidance
3. Give actionable next steps when relevant
4. Offer to elaborate if they want more details

SPECIAL FOCUS - INDUSTRY INSIGHTS:

For Company Queries:
- Service companies: TCS (3.5-7 LPA), Infosys, Wipro (stable, good training)
- Product companies: Flipkart, Amazon India (12-30 LPA, fast-paced)
- MNCs: Google, Microsoft (25-50 LPA, tough interviews)
- Startups: Razorpay, CRED (8-20 LPA, equity, high learning)

For Interview Prep:
- DSA: LeetCode (300+ for top companies), GFG, Codeforces
- System Design: For mid-level+ roles
- Projects: Show on GitHub, explain architecture
- Behavioral: STAR method, real examples

For Career Switches:
- ECE/EEE→Software: Very common, learn web dev + DSA
- Any branch→Data Science: Python, stats, pandas, ML
- Any branch→Product Management: MBA or grow from engineer

CONSTRAINTS:
- Keep responses practical and actionable
- Mention real companies and packages
- Use Indian job market context
- Be honest about difficulty levels
- Guide towards realistic goals

Remember: You're like an experienced senior who's been through the journey.`,

    coach: `You are an intelligent and helpful AI assistant specializing in career guidance and student success.

CORE CAPABILITIES:
You can help with:
✓ Career planning and decision-making
✓ Academic guidance (courses, majors, skills)
✓ Job search strategies and interview prep
✓ Technology trends and learning paths
✓ Personal development and productivity
✓ General knowledge and problem-solving
✓ Coding help and project ideas
✓ Study tips and time management

PERSONALITY & STYLE:
- Conversational and friendly (like ChatGPT)
- Clear and concise (get to the point quickly)
- Ask clarifying questions when needed
- Provide structured responses (use bullet points, numbered lists)
- Admit when you don't know something
- Encourage critical thinking
- Use examples and analogies
- Balance being helpful with being realistic

RESPONSE FORMAT:
1. Acknowledge their question/concern
2. Provide direct answer or guidance
3. Give actionable next steps when relevant
4. Offer to elaborate if they want more details

SPECIAL FOCUS - LEARNING & SKILLS:

For Learning Roadmaps:
- Give week-by-week plans
- Include free AND paid resources
- Suggest projects at each stage
- Set realistic time expectations

For Technology Skills:
Web Dev: HTML/CSS (2 weeks) → JavaScript (4 weeks) → React (4 weeks) → Backend (4 weeks)
- Resources: freeCodeCamp, Scrimba, The Odin Project (FREE)
- Projects: Portfolio → To-do app → Blog → Full MERN app

AI/ML: Python (3 weeks) → NumPy/Pandas (2 weeks) → ML (Andrew Ng course, 8 weeks) → Projects
- Resources: Coursera, Kaggle, fast.ai
- Projects: Titanic dataset → House prices → Real-world problem

Cloud: Pick one (AWS/Azure/GCP) → Fundamentals (FREE course, 2 weeks) → Certification (2 months)
- Resources: AWS Free Tier, A Cloud Guru, Stephane Maarek Udemy
- Projects: Deploy a website → Set up database → CI/CD pipeline

For Study Techniques:
- Pomodoro: 25 min focus, 5 min break
- Active recall: Test yourself, don't just read
- Spaced repetition: Review at intervals (Anki for concepts)
- Learn by building: Theory + immediate practice

For Certifications:
High ROI: AWS SA Associate, Google Data Analytics, Kubernetes CKA
Medium ROI: Azure Fundamentals, Scrum Master
Low ROI: Random Udemy certificates

CONSTRAINTS:
- Always suggest FREE options first
- Give time estimates (weeks/months)
- Include project ideas (portfolio building)
- Mention specific resource names

Remember: You're a practical learning coach who values output over credentials.`,
};

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitStore.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        // Reset: 50 messages per hour (more ChatGPT-like)
        rateLimitStore.set(userId, {
            count: 1,
            resetTime: now + 60 * 60 * 1000, // 1 hour
        });
        return true;
    }

    if (userLimit.count >= 50) {
        return false; // Rate limit exceeded
    }

    userLimit.count++;
    return true;
}

// POST /api/ai-mentor/chat
router.post('/chat', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId; // From verifyToken middleware
        const { messages, role = 'counselor' } = req.body;

        // Validate input
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        if (!['counselor', 'mentor', 'coach'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Rate limiting
        if (!checkRateLimit(userId)) {
            return res.status(429).json({
                error: 'Rate limit exceeded. You can send 50 messages per hour. Please try again later.',
            });
        }

        // Get AI model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

        // Prepare conversation history with system prompt
        const systemPrompt = SYSTEM_PROMPTS[role as keyof typeof SYSTEM_PROMPTS];
        const fullMessages = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'I understand my role and will provide helpful guidance accordingly.' }] },
            ...messages.map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        ];

        // Remove system prompt exchange from history to save tokens
        const conversationHistory = fullMessages.slice(2);

        // Start chat session
        const chat = model.startChat({
            history: conversationHistory.slice(0, -1), // All except the last user message
            generationConfig: {
                maxOutputTokens: 1500, // Longer responses like ChatGPT
                temperature: 0.9, // More creative and varied
                topP: 0.95,
                topK: 40,
            },
        });

        // Get the last user message
        const lastUserMessage = messages[messages.length - 1].content;

        // Generate response
        const result = await chat.sendMessage(lastUserMessage);
        const response = result.response.text();

        // Send response
        res.json({
            success: true,
            response,
            role,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('AI Mentor error:', error);

        if (error.message?.includes('quota')) {
            return res.status(402).json({
                error: 'AI service quota exceeded. Please try again later.',
            });
        }

        res.status(500).json({
            error: 'Failed to generate response. Please try again.',
        });
    }
});

// POST /api/ai-mentor/stream (for streaming responses)
router.post('/stream', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { messages, role = 'counselor' } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        if (!checkRateLimit(userId)) {
            return res.status(429).json({
                error: 'Rate limit exceeded. You can send 50 messages per hour.',
            });
        }

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
        const systemPrompt = SYSTEM_PROMPTS[role as keyof typeof SYSTEM_PROMPTS];

        const conversationHistory = messages.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: conversationHistory.slice(0, -1),
            generationConfig: {
                maxOutputTokens: 1500, // Longer responses
                temperature: 0.9, // More ChatGPT-like creativity
            },
        });

        const lastUserMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastUserMessage);

        // Stream the response
        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
            }
        }

        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error: any) {
        console.error('AI Mentor stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
        res.end();
    }
});

// GET /api/ai-mentor/roles
router.get('/roles', (req: Request, res: Response) => {
    res.json({
        roles: [
            { id: 'counselor', name: 'Career Counselor', description: 'General career guidance and planning' },
            { id: 'mentor', name: 'Industry Mentor', description: 'Industry-specific advice and insights' },
            { id: 'coach', name: 'Skill Coach', description: 'Skill development and learning paths' },
        ],
    });
});

export default router;
