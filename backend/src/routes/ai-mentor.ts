import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/adminMiddleware';

const router = Router();

// ------------------------------------------------------------
// UNIVERSAL AI CONFIGURATION (WITH AUTO-FALLBACK)
// ------------------------------------------------------------
const getGenAI = () => {
    const key = process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error("SERVER_CONFIG_ERROR: GEMINI_API_KEY is missing in environment variables. Please check Vercel settings.");
    }
    return new GoogleGenerativeAI(key);
};

// We will try these models in order
const MODELS_TO_TRY = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"];

const handleAIChat = async (req: Request, res: Response) => {
    const { message, field, specialization } = req.body;

    if (!message) {
        return res.status(400).json({ error: "No user message provided." });
    }

    const genAI = getGenAI();
    let lastError = null;

    // --- AUTO-FALLBACK LOOP ---
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[AI] Attempting response with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `You are a career mentor helping students with real-world guidance.
Context:
Field: ${field || 'General Engineering'}
Specialization: ${specialization || 'General'}
User Question: ${message}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            console.log(`[AI] SUCCESS: Responded using ${modelName}`);
            
            // If we succeed, return immediately and stop the loop
            return res.json({ 
                success: true,
                response: text,
                model: modelName
            });

        } catch (error: any) {
            console.error(`[AI] FAILED with ${modelName}:`, error.message);
            lastError = error;
            // Continue to the next model in the loop...
        }
    }

    // --- FINAL FAILURE IF ALL MODELS FAIL ---
    console.error("[AI] CRITICAL ERROR: All models failed.");
    
    // Provide a clear error message back to the UI
    res.status(500).json({ 
        error: "AI service temporarily unavailable", 
        message: lastError?.message || "All AI models returned an error."
    });
};

router.post('/chat', verifyToken, handleAIChat);

// Legacy /stream support redirected to the same logic
router.post('/stream', verifyToken, async (req: Request, res: Response) => {
    // Forward to /chat logic internally or just reuse the logic
    const { message, messages } = req.body;
    const content = message || (messages && messages.length > 0 ? messages[messages.length-1].content : "");
    req.body.message = content;
    
    // Call our own handler
    return handleAIChat(req, res);
});

export default router;
