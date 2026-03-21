import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { verifyToken } from '../middleware/adminMiddleware';
import { db } from '../config/firebase';
import admin from 'firebase-admin';

const router = Router();

// ------------------------------------------------------------
// UNIVERSAL AI CONFIGURATION (WITH AUTO-FALLBACK)
// ------------------------------------------------------------
// Initialize Groq at top level for efficiency
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY || ''
});

// We will try these Groq models in order
const MODELS_TO_TRY = ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama3-8b-8192"];

const handleAIChat = async (req: Request, res: Response) => {
    const { message, field, specialization, roleId } = req.body;
    const userId = (req as any).userId;

    if (!message) {
        return res.status(400).json({ error: "No user message provided." });
    }

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    if (!process.env.GROQ_API_KEY) {
        console.error("[GROQ-AI] CRITICAL ERROR: GROQ_API_KEY is missing in environment variables.");
        return res.status(500).json({ error: "Server configuration error: Missing Groq API Key" });
    }

    let lastError = null;

    // --- AUTO-FALLBACK LOOP ---
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[GROQ-AI] Attempting response with model: ${modelName}`);
            
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a career mentor helping students with real-world guidance. Context: Field: ${field || 'General Engineering'}, Specialization: ${specialization || 'General'}. Focus on practical advice, industry trends, and specific next steps.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                model: modelName,
                temperature: 0.7,
                max_tokens: 2048,
            });

            const text = completion.choices[0]?.message?.content || "";

            if (!text) {
                throw new Error("No response content from model.");
            }

            console.log(`[GROQ-AI] SUCCESS: Responded using ${modelName}`);
            
            // Save to Firestore for persistence
            try {
                const chatRef = db.collection('users').doc(userId)
                    .collection('ai_mentor_chats').doc(roleId || 'default')
                    .collection('messages');

                // Save User Message
                await chatRef.add({
                    role: 'user',
                    content: message,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });

                // Save Assistant Message
                await chatRef.add({
                    role: 'assistant',
                    content: text,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (fsError) {
                console.error("[GROQ-AI] Firestore save error:", fsError);
                // Continue anyway, don't block the user's response
            }

            // If we succeed, return immediately and stop the loop
            return res.json({ 
                success: true,
                response: text,
                model: modelName
            });

        } catch (error: any) {
            console.error(`[GROQ-AI] FAILED with ${modelName}:`, error.message);
            lastError = error;
        }
    }

    // --- FINAL FAILURE IF ALL MODELS FAIL ---
    console.error("[GROQ-AI] CRITICAL ERROR: All models failed. Last error:", lastError?.message);
    
    // Provide a clear error message back to the UI
    res.status(500).json({ 
        error: "AI service temporarily unavailable", 
        message: lastError?.message || "All AI models returned an error."
    });
};

router.post('/chat', verifyToken, handleAIChat);

// New endpoint to fetch history
router.get('/history', verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { roleId } = req.query;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const snapshot = await db.collection('users').doc(userId)
            .collection('ai_mentor_chats').doc(roleId as string || 'default')
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .limit(50)
            .get();

        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        res.json({ success: true, messages });
    } catch (error: any) {
        console.error("[GROQ-AI] History fetch error:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

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
