import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/adminMiddleware';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY || '');

// ------------------------------------------------------------
// STEP 2: BACKEND API ROUTE
// ------------------------------------------------------------
router.post('/chat', verifyToken, async (req: Request, res: Response) => {
    const { message, field, specialization } = req.body;

    // ------------------------------------------------------------
    // STEP 8: DEBUGGING LOGS
    // ------------------------------------------------------------
    console.log("User Message:", message);
    console.log("Context:", { field, specialization });

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // ------------------------------------------------------------
        // STEP 4: GEMINI IMPLEMENTATION
        // ------------------------------------------------------------
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        
        // Construct a prompt using the field and specialization context
        const prompt = `You are a career mentor helping students with real-world guidance.
Context: 
Field: ${field || 'General Engineering'}
Specialization: ${specialization || 'General'}

User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("AI Response:", text);
        
        // Return text as requested in Step 4
        res.json({ response: text });

    } catch (error: any) {
        // ------------------------------------------------------------
        // STEP 5: ERROR HANDLING
        // ------------------------------------------------------------
        console.error("AI service error:", error);
        
        // Check for common errors
        if (error.status === 429 || error.message?.includes('429')) {
             return res.status(429).json({ 
                error: "AI service temporarily unavailable",
                message: "I'm currently receiving too many requests. Please wait about 30 seconds and try again!"
             });
        }

        res.status(500).json({ 
            error: "AI service temporarily unavailable" 
        });
    }
});

export default router;
