import express from 'express';
import { db } from '../config/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Field definitions
const ALL_FIELDS = [
    'engineering', 'medical', 'science', 'arts', 'commerce', 'law',
    'education', 'design', 'defense', 'agriculture', 'aviation', 'sports',
    'hospitality', 'architecture', 'social', 'performing', 'journalism',
    'fashion', 'library', 'pharmacy', 'food', 'veterinary'
];

interface CareerPath {
    title: string;
    field: string;
    level: string;
    requiredSkills: string[];
    description?: string;
    salary_range?: string;
    growth_potential?: string;
}

// AI-powered career path generation
async function generateCareerPathsForField(field: string): Promise<CareerPath[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `You are a career counseling AI expert. Generate 5 diverse, realistic career paths for the "${field}" field.

For each career path, provide:
1. Job Title (realistic, industry-standard title)
2. Level (Beginner, Intermediate, or Advanced)
3. Required Skills (5-7 specific skills as an array)
4. Description (1-2 sentences about the role)
5. Salary Range (realistic range in INR/year)
6. Growth Potential (High, Medium, or Low)

Requirements:
- Make titles realistic and specific
- Include mix of Beginner (2), Intermediate (2), Advanced (1) levels
- Skills should be practical and industry-relevant
- Descriptions should be concise and professional
- Salary ranges should be realistic for India market
- Cover diverse specializations within the field

Return ONLY a valid JSON array, no markdown formatting:
[
  {
    "title": "Software Developer",
    "level": "Beginner",
    "requiredSkills": ["JavaScript", "React", "Node.js", "Git", "Problem Solving"],
    "description": "Develops software applications using modern technologies and best practices.",
    "salary_range": "₹4-8 LPA",
    "growth_potential": "High"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Clean response
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/g, '').trim();
        }

        const paths = JSON.parse(cleanedResponse);

        // Add field to each path
        return paths.map((path: any) => ({
            ...path,
            field: field
        }));

    } catch (error) {
        console.error(`Error generating career paths for ${field}:`, error);

        // Fallback: Return basic career paths
        return getFallbackPaths(field);
    }
}

// Fallback career paths if AI fails
function getFallbackPaths(field: string): CareerPath[] {
    const fallbackMap: { [key: string]: CareerPath[] } = {
        'engineering': [
            { title: 'Software Developer', field, level: 'Beginner', requiredSkills: ['JavaScript', 'Python', 'Git', 'HTML/CSS'], description: 'Develops software applications', salary_range: '₹4-8 LPA', growth_potential: 'High' },
            { title: 'Full Stack Engineer', field, level: 'Intermediate', requiredSkills: ['React', 'Node.js', 'MongoDB', 'DevOps'], description: 'Builds complete web applications', salary_range: '₹8-15 LPA', growth_potential: 'High' },
            { title: 'AI/ML Engineer', field, level: 'Advanced', requiredSkills: ['Python', 'TensorFlow', 'Deep Learning', 'Statistics'], description: 'Develops AI and machine learning solutions', salary_range: '₹15-30 LPA', growth_potential: 'High' }
        ],
        'medical': [
            { title: 'General Physician', field, level: 'Beginner', requiredSkills: ['MBBS', 'Clinical Diagnosis', 'Patient Care'], description: 'Provides primary healthcare services', salary_range: '₹6-12 LPA', growth_potential: 'Medium' },
            { title: 'Specialist Doctor', field, level: 'Advanced', requiredSkills: ['MD', 'Specialization', 'Advanced Treatment'], description: 'Provides specialized medical care', salary_range: '₹15-40 LPA', growth_potential: 'High' }
        ]
    };

    return fallbackMap[field] || [
        { title: `${field.charAt(0).toUpperCase() + field.slice(1)} Professional`, field, level: 'Intermediate', requiredSkills: ['Industry Knowledge', 'Communication', 'Problem Solving'], description: `Professional in ${field} field`, salary_range: '₹5-12 LPA', growth_potential: 'Medium' }
    ];
}

// GET: Fetch or generate career paths for a specific field
router.get('/field/:fieldId', async (req, res) => {
    try {
        const { fieldId } = req.params;

        if (!ALL_FIELDS.includes(fieldId)) {
            return res.status(400).json({ error: 'Invalid field ID' });
        }

        // Check if career paths already exist for this field
        const existingPaths = await db.collection('career_paths')
            .where('field', '==', fieldId)
            .get();

        if (!existingPaths.empty) {
            // Return existing paths
            const paths = existingPaths.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return res.json({
                success: true,
                field: fieldId,
                count: paths.length,
                paths: paths,
                generated: false,
                message: 'Fetched existing career paths'
            });
        }

        // Generate new paths using AI
        console.log(`🤖 Generating AI career paths for field: ${fieldId}`);

        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logGeminiRequest();

        const generatedPaths = await generateCareerPathsForField(fieldId);

        // Save to Firestore
        const batch = db.batch();
        const savedPaths: any[] = [];

        for (const path of generatedPaths) {
            const docRef = db.collection('career_paths').doc();
            const pathData = {
                ...path,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                verified: true,
                ai_generated: true
            };

            batch.set(docRef, pathData);
            savedPaths.push({ id: docRef.id, ...pathData });
        }

        await batch.commit();

        console.log(`✅ Generated and saved ${generatedPaths.length} career paths for ${fieldId}`);

        res.json({
            success: true,
            field: fieldId,
            count: savedPaths.length,
            paths: savedPaths,
            generated: true,
            message: `Generated ${savedPaths.length} AI-powered career paths`
        });

    } catch (error: any) {
        console.error('Error fetching/generating career paths:', error);
        res.status(500).json({
            error: 'Failed to fetch/generate career paths',
            details: error.message
        });
    }
});

// POST: Generate career paths for all fields
router.post('/generate-all', async (req, res) => {
    try {
        console.log('🚀 Starting AI generation for all fields...');

        const results: any[] = [];
        let totalGenerated = 0;

        for (const field of ALL_FIELDS) {
            try {
                // Check if paths already exist
                const existing = await db.collection('career_paths')
                    .where('field', '==', field)
                    .get();

                if (!existing.empty) {
                    console.log(`ℹ️ Skipping ${field} - already has ${existing.size} paths`);
                    results.push({
                        field,
                        status: 'skipped',
                        count: existing.size,
                        message: 'Already exists'
                    });
                    continue;
                }

                // Generate paths
                console.log(`🤖 Generating for ${field}...`);

                const { UsageTracker } = await import('../services/usageTracker');
                await UsageTracker.logGeminiRequest();

                const paths = await generateCareerPathsForField(field);

                // Save to Firestore
                const batch = db.batch();
                for (const path of paths) {
                    const docRef = db.collection('career_paths').doc();
                    batch.set(docRef, {
                        ...path,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        verified: true,
                        ai_generated: true
                    });
                }
                await batch.commit();

                totalGenerated += paths.length;
                results.push({
                    field,
                    status: 'success',
                    count: paths.length,
                    message: 'Generated successfully'
                });

                console.log(`✅ Generated ${paths.length} paths for ${field}`);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error: any) {
                console.error(`❌ Failed for ${field}:`, error.message);
                results.push({
                    field,
                    status: 'error',
                    count: 0,
                    message: error.message
                });
            }
        }

        res.json({
            success: true,
            totalGenerated,
            fieldsProcessed: ALL_FIELDS.length,
            results
        });

    } catch (error: any) {
        console.error('Error in generate-all:', error);
        res.status(500).json({
            error: 'Failed to generate all career paths',
            details: error.message
        });
    }
});

// GET: Get career paths with proper filtering (fieldId AND specializationId)
router.get('/', async (req, res) => {
    try {
        const { fieldId, specializationId } = req.query;

        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logFirestoreRead(1);

        console.log(`[CareerPaths] Fetching paths - Field: ${fieldId}, Specialization: ${specializationId}`);

        let query: any = db.collection('career_paths');

        // CRITICAL: Filter by BOTH fieldId and specializationId to avoid duplicates
        if (fieldId && specializationId) {
            query = query
                .where('fieldId', '==', fieldId)
                .where('specializationId', '==', specializationId);
        } else if (fieldId) {
            // If only fieldId provided, return all paths for that field
            query = query.where('fieldId', '==', fieldId);
        } else if (specializationId) {
            // If only specializationId provided
            query = query.where('specializationId', '==', specializationId);
        }

        const snapshot = await query.limit(50).get();

        if (snapshot.empty) {
            return res.json({
                success: true,
                count: 0,
                paths: [],
                message: fieldId
                    ? `No career paths available yet for this ${specializationId ? 'specialization' : 'field'}.`
                    : 'No career paths found.'
            });
        }

        const paths = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`[CareerPaths] Found ${paths.length} paths`);

        res.json({
            success: true,
            count: paths.length,
            paths,
            filters: { fieldId, specializationId }
        });

    } catch (error: any) {
        console.error('Error fetching career paths:', error);
        res.status(500).json({
            error: 'Failed to fetch career paths',
            details: error.message
        });
    }
});

// GET: Structured career paths by field (grouped by specializations)
router.get('/structured/:fieldId', async (req, res) => {
    try {
        const { fieldId } = req.params;

        console.log(`[CareerPaths] Fetching structured data for field: ${fieldId}`);

        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logFirestoreRead(1);

        // 1. Get field info
        const fieldDoc = await db.collection('fields').doc(fieldId).get();
        if (!fieldDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Field not found',
                message: `No field found with ID: ${fieldId}`
            });
        }

        const fieldData = fieldDoc.data();

        // 2. Get all specializations for this field
        const specsSnapshot = await db.collection('specializations')
            .where('fieldId', '==', fieldId)
            .get();

        if (specsSnapshot.empty) {
            return res.json({
                success: true,
                fieldName: fieldData?.fieldName || fieldId,
                fieldId,
                specializations: [],
                totalSpecializations: 0,
                totalCareers: 0
            });
        }

        // 3. Get all career paths for this field
        const careersSnapshot = await db.collection('career_paths')
            .where('fieldId', '==', fieldId)
            .get();

        // 4. Group careers by specialization
        const specializationsMap = new Map();

        specsSnapshot.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
            const specData = doc.data();
            specializationsMap.set(specData.specializationId, {
                specializationId: specData.specializationId,
                specializationName: specData.specializationName,
                description: specData.description,
                careers: []
            });
        });

        // 5. Add careers to their specializations
        careersSnapshot.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
            const careerData = doc.data();
            const specId = careerData.specializationId;

            if (specializationsMap.has(specId)) {
                specializationsMap.get(specId).careers.push({
                    id: doc.id,
                    title: careerData.title,
                    level: careerData.level,
                    salaryRange: careerData.salaryRange,
                    requiredSkills: careerData.requiredSkills || [],
                    growthOutlook: careerData.growthOutlook,
                    industryDemandScore: careerData.industryDemandScore
                });
            }
        });

        // 6. Convert to array and sort
        const specializations = Array.from(specializationsMap.values())
            .filter(spec => spec.careers.length > 0) // Only include specs with careers
            .map(spec => ({
                ...spec,
                careerCount: spec.careers.length
            }));

        const totalCareers = specializations.reduce((sum, spec) => sum + spec.careerCount, 0);

        console.log(`[CareerPaths] Found ${specializations.length} specializations with ${totalCareers} careers`);

        res.json({
            success: true,
            fieldName: fieldData?.fieldName || fieldId,
            fieldId,
            specializations,
            totalSpecializations: specializations.length,
            totalCareers
        });

    } catch (error: any) {
        console.error('[CareerPaths] Error fetching structured data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch career paths',
            details: error.message
        });
    }
});

export default router;
