import express, { Request, Response } from 'express';
import { db } from '../config/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * ============================================================
 * CANONICAL 22 FIELDS (Synced with Frontend)
 * ============================================================
 */
const ALL_FIELDS = [
    'engineering', 'medical', 'science', 'arts', 'commerce', 'law',
    'education', 'design', 'defense', 'agriculture', 'hospitality', 'sports',
    'vocational', 'cloud-computing', 'devops', 'blockchain-web3', 'ar-vr',
    'quantum', 'robotics-automation', 'bioinformatics', 'product-management', 'ui-ux'
];

interface CareerPath {
    title: string;
    fieldId: string;
    specializationId?: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    requiredSkills: string[];
    description: string;
    salaryRange: string;
    growthOutlook: 'High' | 'Medium' | 'Low';
    industryDemandScore: number;
}

/**
 * ============================================================
 * CORE GENERATION LOGIC
 * ============================================================
 */

async function generateCareerPaths(fieldId: string, specId?: string): Promise<CareerPath[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const target = specId ? `specialization "${specId}"` : `field "${fieldId}"`;

        const prompt = `You are a career counseling expert. Generate 5 diverse, professional career paths for the ${target}.
        
Return ONLY a valid JSON array of objects with these exact keys:
- title: string (professional job title)
- level: "Beginner" | "Intermediate" | "Advanced"
- requiredSkills: string[] (5 specific skills)
- description: string (1-2 sentences)
- salaryRange: string (typical INR range per year, e.g., "₹6-10 LPA")
- growthOutlook: "High" | "Medium" | "Low"
- industryDemandScore: number (1-100)

Progression Mix: 2 Beginner, 2 Intermediate, 1 Advanced.
Make descriptions concise and titles realistic for the 2026 market.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Invalid AI format');

        const paths = JSON.parse(jsonMatch[0]);

        return paths.map((p: any) => ({
            ...p,
            fieldId,
            specializationId: specId || 'general',
            growthOutlook: p.growthOutlook || p.growth_potential || 'Medium'
        }));

    } catch (error) {
        console.error(`[AI Error] ${fieldId}:`, error);
        return getFallbackPaths(fieldId, specId);
    }
}

function getFallbackPaths(fieldId: string, specId?: string): CareerPath[] {
    // Basic fallback to ensure UI never breaks
    return [
        {
            title: `${specId || fieldId} Specialist`,
            fieldId,
            specializationId: specId || 'general',
            level: 'Intermediate',
            requiredSkills: ['Critical Thinking', 'Problem Solving', 'Communication', 'Industry Knowledge'],
            description: `A vital role in the ${fieldId} sector focusing on specialized solutions and implementation.`,
            salaryRange: '₹6-12 LPA',
            growthOutlook: 'High',
            industryDemandScore: 85
        },
        {
            title: `Junior ${specId || fieldId} Associate`,
            fieldId,
            specializationId: specId || 'general',
            level: 'Beginner',
            requiredSkills: ['Learning Agility', 'Basic Tools', 'Teamwork'],
            description: `Entry-level position providing foundational support and learning opportunities.`,
            salaryRange: '₹4-7 LPA',
            growthOutlook: 'Medium',
            industryDemandScore: 80
        }
    ];
}

/**
 * ============================================================
 * ROUTES
 * ============================================================
 */

// Universal Fetch Route (Primary)
router.get('/', async (req: Request, res: Response) => {
    try {
        const fieldId = req.query.fieldId as string;
        const specId = req.query.specializationId as string;

        if (!fieldId) {
            return res.status(400).json({ success: false, error: 'fieldId is required' });
        }

        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logFirestoreRead(1);

        // Check cache first
        const snapshot = await db.collection('career_paths')
            .where('fieldId', '==', fieldId)
            .where('specializationId', '==', specId || 'general')
            .limit(10)
            .get();

        if (!snapshot.empty) {
            return res.json({
                success: true,
                count: snapshot.size,
                paths: snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() })),
                source: 'cache'
            });
        }

        // Generate and save if missing
        console.log(`🤖 Generating new career paths for: ${fieldId}${specId ? '/' + specId : ''}`);
        await UsageTracker.logGeminiRequest();

        const paths = await generateCareerPaths(fieldId, specId);

        const batch = db.batch();
        const savedPaths: any[] = [];

        for (const p of paths) {
            const docRef = db.collection('career_paths').doc();
            const data = { ...p, createdAt: new Date().toISOString() };
            batch.set(docRef, data);
            savedPaths.push({ id: docRef.id, ...data });
        }

        await batch.commit();

        res.json({
            success: true,
            count: savedPaths.length,
            paths: savedPaths,
            source: 'ai'
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin Route: Pre-generate for all 22 fields
router.post('/seed-all', async (_req: Request, res: Response) => {
    try {
        let total = 0;
        for (const fieldId of ALL_FIELDS) {
            const paths = await generateCareerPaths(fieldId);
            const batch = db.batch();
            paths.forEach(p => batch.set(db.collection('career_paths').doc(), { ...p, createdAt: new Date().toISOString() }));
            await batch.commit();
            total += paths.length;
            await new Promise(r => setTimeout(r, 1000)); // Rate limit safety
        }
        res.json({ success: true, seeded: total });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

