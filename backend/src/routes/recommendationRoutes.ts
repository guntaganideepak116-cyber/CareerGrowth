import express from 'express';
import { db } from '../config/firebase';
import { verifyToken } from '../middleware/adminMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createNotification } from '../services/notificationService';

dotenv.config();

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface OnboardingData {
    stream: string;
    strongSubjects: string[];
    weakSubjects?: string[];
    interests: string[];
    skillRatings: {
        logical: number;
        communication: number;
    };
    careerPreference: string;
    openToNewSkills: boolean;
}

router.post('/generate', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const data: OnboardingData = req.body;

        if (!data || !data.stream || !data.strongSubjects || !data.interests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Store User Profile
        const profileData = {
            userId,
            ...data,
            onboardingCompleted: true, // Mark as completed locally, though user selection confirms it
            createdAt: new Date().toISOString()
        };

        await db.collection('user_profiles').doc(userId).set(profileData);

        // 2. Generate Recommendations via Gemini
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
            Act as a career counselor. Based on the following student profile, recommend top 3 suitable career fields.
            
            Profile:
            - Academic Stream: ${data.stream}
            - Strong Subjects: ${data.strongSubjects.join(', ')}
            - Interests: ${data.interests.join(', ')}
            - Skill Ratings (1-5): Logical: ${data.skillRatings.logical}, Communication: ${data.skillRatings.communication}
            - Career Preference: ${data.careerPreference}
            - Open to Learning New Skills: ${data.openToNewSkills ? 'Yes' : 'No'}

            Task:
            Return a JSON array of exactly 3 objects. Each object must have:
            - "fieldName": string (Name of the career field)
            - "matchScore": number (0-100)
            - "reason": string (Short explanation why this fits)
            - "growthOutlook": string (e.g., "High", "Stable", "Emerging")

            Do not include any markdown formatting or explanations outside the JSON.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup and parse JSON
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const recommendations = JSON.parse(jsonStr);

            // 3. Store Recommendations
            await db.collection('career_recommendations').doc(userId).set({
                userId,
                recommendedFields: recommendations,
                generatedAt: new Date().toISOString()
            });

            // TRIGGER NOTIFICATION
            await createNotification(
                userId,
                'AI Career Recommendations Ready',
                'Your personalized career recommendations are ready! Check them out now to discover your path.',
                'recommendation',
                '/onboarding'
            );

            res.json({ success: true, recommendations });

        } catch (aiError) {
            console.error('AI Generation failed, falling back to rule-based logic:', aiError);

            // Fallback Logic
            const fallbackRecs = getFallbackRecommendations(data);

            await db.collection('career_recommendations').doc(userId).set({
                userId,
                recommendedFields: fallbackRecs,
                generatedAt: new Date().toISOString(),
                isFallback: true
            });

            // TRIGGER NOTIFICATION (Fallback)
            await createNotification(
                userId,
                'Career Recommendations Available',
                'We have generated career recommendations based on your profile.',
                'recommendation',
                '/onboarding'
            );

            res.json({ success: true, recommendations: fallbackRecs, warning: 'AI service unavailable, using valid fallbacks.' });
        }

    } catch (error) {
        console.error('Error in recommendation engine:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

// Helper for fallback logic
function getFallbackRecommendations(data: OnboardingData) {
    // Simple logic based on Stream and Interests
    const recs = [];
    const stream = data.stream?.toUpperCase() || '';

    if (stream.includes('MPC') || data.interests.includes('Technology')) {
        recs.push({
            fieldName: 'Computer Science & Engineering',
            matchScore: 90,
            reason: 'Matches strong analytical background (MPC) and interest in Tech.',
            growthOutlook: 'High'
        });
        recs.push({
            fieldName: 'Data Science',
            matchScore: 85,
            reason: 'Requires strong logical and mathematical skills.',
            growthOutlook: 'Very High'
        });
    }

    if (stream.includes('BIPC') || data.interests.includes('Medicine')) {
        recs.push({
            fieldName: 'Medicine & Healthcare',
            matchScore: 95,
            reason: 'Directly aligns with BiPC background.',
            growthOutlook: 'Stable'
        });
    }

    if (data.interests.includes('Business') || data.interests.includes('Entrepreneurship')) {
        recs.push({
            fieldName: 'Business Administration (MBA)',
            matchScore: 80,
            reason: 'Aligns with your interest in business.',
            growthOutlook: 'High'
        });
    }

    // Fill up to 3 if needed
    if (recs.length < 3) {
        recs.push({
            fieldName: 'Digital Marketing',
            matchScore: 70,
            reason: 'Accessible field with creative and analytical mix.',
            growthOutlook: 'Growing'
        });
    }
    if (recs.length < 3) {
        recs.push({
            fieldName: 'Software Development',
            matchScore: 65,
            reason: 'General tech demand makes this a viable option.',
            growthOutlook: 'High'
        });
    }

    return recs.slice(0, 3);
}

export default router;
