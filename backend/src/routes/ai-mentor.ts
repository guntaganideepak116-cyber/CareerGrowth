import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/adminMiddleware';

const router = Router();

// ------------------------------------------------------------
// UNIVERSAL AI CONFIGURATION (WITH AUTO-FALLBACK)
// ------------------------------------------------------------
// Initialize Gemini at top level for efficiency
const genAI = new GoogleGenerativeAI(process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY || '');

// We will try these models in order. 
// Note: As of March 2026, Gemini 3.1 is the latest stable series.
const MODELS_TO_TRY = [
    "gemini-1.5-flash",      // Known to work in other parts of this project
    "gemini-3.1-flash-lite", // Latest performance model
    "gemini-3.1-flash",      // Latest stable flash
    "gemini-1.5-pro",        // Legacy pro (may be 404 in some regions)
    "gemini-pro"             // Ultra-stable fallback (Gemini 1.0 Pro)
];

const handleAIChat = async (req: Request, res: Response) => {
    const { message, field, specialization } = req.body;

    if (!message) {
        return res.status(400).json({ error: "No user message provided." });
    }

    if (!process.env.GEMINI_MENTOR_KEY && !process.env.GEMINI_API_KEY) {
        console.error("[AI] CRITICAL ERROR: No API key found in environment variables.");
        return res.status(500).json({ error: "Server configuration error: Missing API Key" });
    }

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
            
            // If the error is not a "model not found" (404), maybe it's a rate limit (429) or invalid key (403)
            // In case of 403 or 429, trying another model might not help, but we'll try anyway just in case.
        }
    }

    // --- FINAL FAILURE IF ALL MODELS FAIL ---
    console.error("[AI] CRITICAL ERROR: All models failed. Last error:", lastError?.message);
    
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
