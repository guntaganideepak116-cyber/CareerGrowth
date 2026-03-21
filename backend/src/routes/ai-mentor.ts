import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/adminMiddleware';

const router = Router();

// ------------------------------------------------------------
// UNIVERSAL AI CONFIGURATION
// ------------------------------------------------------------
const getGenAI = () => {
    const key = process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenerativeAI(key);
};

const MODEL_NAME = "gemini-1.5-flash";

// ------------------------------------------------------------
// STANDARDIZED CHAT ROUTE (Matches Part 1-6)
// ------------------------------------------------------------
router.post('/chat', verifyToken, async (req: Request, res: Response) => {
    const { message, field, specialization } = req.body;

    console.log("[AI] Request received:", { message, field, specialization });

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const prompt = `You are a career mentor helping students with real-world guidance.
Field: ${field || 'General Engineering'}
Specialization: ${specialization || 'General'}
User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("[AI] Response generated successfully.");
        res.json({ response: text });

    } catch (error: any) {
        console.error("[AI] Error:", error.message);
        
        if (error.message?.includes("not configured")) {
            return res.status(500).json({ 
                error: "Server configuration error", 
                message: "API Key is missing in server environment variables. Please add GEMINI_API_KEY to your Vercel settings." 
            });
        }

        res.status(500).json({ 
            error: "AI service temporarily unavailable",
            details: error.message 
        });
    }
});

// Alias same logic for /stream for backward compatibility to prevent 404s
router.post('/stream', verifyToken, async (req: Request, res: Response) => {
    // We redirect legacy stream calls to regular chat to ensure they work
    const { messages, message } = req.body;
    const content = message || (messages && messages.length > 0 ? messages[messages.length-1].content : "");
    
    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const result = await model.generateContent(content);
        const text = result.response.text();
        
        // Return in same format as /chat
        res.json({ response: text });
    } catch (error: any) {
        res.status(500).json({ error: "AI service error", message: error.message });
    }
});

export default router;
