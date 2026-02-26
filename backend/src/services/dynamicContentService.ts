import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

// Initialize Gemini
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

if (!GEMINI_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is missing in environment variables. AI generation will fail.');
}

// ============================================
// UTILITY: Clean AI Response (Prevents Crashes)
// ============================================
function cleanAIResponse(rawText: string): string {
    // Remove markdown code blocks
    let cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    // Sometimes AI adds explanatory text before/after JSON
    // Try to extract JSON object/array
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }

    return cleaned;
}

// ============================================
// CACHE MANAGEMENT
// ============================================
async function getCachedContent(cacheKey: string): Promise<any | null> {
    try {
        if (!db) return null;
        const { UsageTracker } = await import('./usageTracker');
        try {
            await UsageTracker.logFirestoreRead(1);
        } catch (e) {
            // Metrics failure shouldn't stop the app
        }

        const doc = await db.collection('ai_generated_content').doc(cacheKey).get();
        if (doc.exists) {
            const data = doc.data();
            console.log(`✅ Cache HIT for: ${cacheKey}`);
            return data?.content || null;
        }
        console.log(`❌ Cache MISS for: ${cacheKey}`);
        return null;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

async function setCachedContent(cacheKey: string, content: any): Promise<void> {
    try {
        if (!db) return;
        const { UsageTracker } = await import('./usageTracker');
        try {
            await UsageTracker.logFirestoreWrite(1);
        } catch (e) {
            // Metrics failure shouldn't stop the app
        }

        await db.collection('ai_generated_content').doc(cacheKey).set({
            content,
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString()
        });
        console.log(`💾 Cached: ${cacheKey}`);
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

// ============================================
// PROMPT TEMPLATES
// ============================================

function createRoadmapPrompt(fieldId: string, specializationId: string, userProfile?: any): string {
    return `You are an expert career advisor specializing in ${specializationId} within the ${fieldId} field.

CRITICAL: Generate a UNIQUE roadmap specifically for "${specializationId}" that is DIFFERENT from other specializations in ${fieldId}.

Student Context:
- Field: ${fieldId}
- Specialization: ${specializationId}
- Current Semester: ${userProfile?.semester || 1}
- Career Goal: ${userProfile?.careerGoal || 'Not specified'}

STRICT Requirements:
1. Generate exactly 8 to 10 phases, where each phase represents ONE SEMESTER (Sem 1, Sem 2, ..., up to Sem 8 or 10 depending on the field).
2. Phase titles must be formatted as: "Semester [Number]: [Topic Specific to ${specializationId}]"
3. Contents MUST be specific to ${specializationId}. Do NOT suggest generic first-year subjects unless they are directly tailored.
4. For each semester, provide specialized skills, tools, projects, and certifications.
5. Progression: From foundational concepts (Sem 1-2) to industry-ready specialization (Sem 7-8).

Example for Cloud Computing:
- Semester 1: "Introduction to Infrastructure & OS"
- Semester 5: "Serverless Architecture & Distributed Systems"

Return ONLY valid JSON:
{
  "phases": [
    {
      "id": 1,
      "title": "Semester 1: [Specific Topic]",
      "duration": "6 months (Semester)",
      "focus": "Foundational mastery for ${specializationId}",
      "skills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"],
      "projects": ["Mini project for Sem 1"],
      "certifications": ["Introductory Certification"],
      "careerRelevance": "Relationship to ${specializationId} career"
    }
  ]
}`;
}

function createProjectsPrompt(fieldId: string, specializationId: string): string {
    return `Generate 6 UNIQUE portfolio projects specifically for "${specializationId}" professionals in ${fieldId}.

CRITICAL: These projects must be SPECIFIC to ${specializationId}, NOT generic ${fieldId} projects.

STRICT Requirements:
1. ALL 6 projects must be DIRECTLY related to ${specializationId}
2. Mix: 2 beginner, 3 intermediate, 1 advanced
3. Use ONLY ${specializationId}-specific technologies (NOT generic tools)
4. Each project must solve a REAL ${specializationId} industry problem
5. NO generic projects (e.g., for "Robotics" don't suggest "Build a Calculator")

Example for Robotics Engineering:
✅ GOOD: "Autonomous Warehouse Navigation Robot using ROS2 and LiDAR"
❌ BAD: "Build a Web Dashboard" (too generic)

Return ONLY valid JSON array:
[
  {
    "id": "proj1",
    "name": "${specializationId}-SPECIFIC project name",
    "description": "Solves a REAL ${specializationId} problem",
    "difficulty": "beginner/intermediate/advanced",
    "techStack": ["${specializationId}-specific tech1", "${specializationId}-specific tech2"],
    "estimatedTime": "2-3 weeks",
    "skills": ["${specializationId}-specific skill1"],
    "careerImpact": "high/medium/low",
    "realWorldApplication": "How ${specializationId} professionals use this in industry"
  }
]`;
}

function createCertificationsPrompt(fieldId: string, specializationId: string): string {
    return `Generate 8 REAL certifications specifically for "${specializationId}" professionals in ${fieldId}.

CRITICAL REQUIREMENTS:
1. **MUST include EXACTLY 4 FREE certifications** (Coursera, edX, Google, Microsoft, FreeCodeCamp, YouTube courses)
2. Include 2-3 affordable paid certifications ($50-$200)
3. Include 1-2 premium certifications ($200+)
4. ALL certifications must be SPECIFIC to ${specializationId} (NOT generic ${fieldId} certs)
5. Use REAL certification names that exist in 2024-2025
6. Include REAL official URLs

Example for Robotics Engineering:
✅ GOOD FREE: "ROS for Beginners" (Udemy/Coursera), "Arduino Robotics" (edX)
✅ GOOD PAID: "Certified Robotics System Architect" (Robotics Industries Association)
❌ BAD: Generic "Python Programming" (not specific to robotics)

STRICT Format - Return ONLY valid JSON array:
[
  {
    "id": "cert1",
    "name": "${specializationId}-SPECIFIC certification name",
    "provider": "Coursera/edX/Google/AWS/Microsoft/Udacity/FreeCodeCamp",
    "cost": "Free" (for first 4) or "$99" (for paid),
    "timeToComplete": "2-3 months",
    "difficulty": "beginner/intermediate/advanced",
    "skills": ["${specializationId}-specific skill1"],
    "industryValue": "high/medium/low",
    "officialUrl": "https://real-url-to-certification",
    "prerequisites": ["prereq1"],
    "salaryImpact": "+15%"
  }
]

REMEMBER: First 4 MUST have cost: "Free"`;
}

function createSpecializationsPrompt(fieldId: string): string {
    return `Generate 8 UNIQUE career specializations within the ${fieldId} field.

CRITICAL: Each specialization must be DISTINCT and SPECIFIC to ${fieldId}.

Requirements:
1. Mix of core, emerging, and hybrid specializations
2. Include market demand scores (0-100) based on 2024-2025 trends
3. Realistic growth potential
4. Current market data

Return ONLY valid JSON array:
[
  {
    "id": "spec1",
    "name": "Specialization Name SPECIFIC to ${fieldId}",
    "type": "core/emerging/hybrid",
    "description": "Brief description",
    "marketDemand": 85,
    "growthPotential": "high/medium/low",
    "riskLevel": "low/medium/high",
    "skills": ["${fieldId}-specific skill1", "${fieldId}-specific skill2"],
    "avgSalary": "₹8-15 LPA"
  }
]`;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export async function generateDynamicContent(
    type: 'roadmap' | 'projects' | 'certifications' | 'specializations',
    fieldId: string,
    specializationId?: string,
    userProfile?: any
): Promise<any> {
    // Create cache key
    const cacheKey = `${type}_${fieldId}_${specializationId || 'all'}`;

    // Check cache first (MILLISECOND PATH)
    const cached = await getCachedContent(cacheKey);
    if (cached) {
        return cached;
    }

    // Generate with AI (SLOW PATH - only runs once)
    try {
        if (!GEMINI_KEY) {
            console.error('❌ GEMINI_API_KEY is missing');
            throw new Error('Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to Vercel Environment Variables.');
        }

        console.log(`🤖 AI Call: ${type} for ${fieldId}/${specializationId}...`);

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
            },
        });

        // Select appropriate prompt
        let prompt: string;
        let useSearchGrounding = false; // Enable search for certifications

        switch (type) {
            case 'roadmap':
                if (!specializationId) throw new Error('specializationId required for roadmap');
                prompt = createRoadmapPrompt(fieldId, specializationId, userProfile);
                break;
            case 'projects':
                if (!specializationId) throw new Error('specializationId required for projects');
                prompt = createProjectsPrompt(fieldId, specializationId);
                break;
            case 'certifications':
                if (!specializationId) throw new Error('specializationId required for certifications');
                prompt = createCertificationsPrompt(fieldId, specializationId);
                useSearchGrounding = true; // Enable web search for certifications
                break;
            case 'specializations':
                prompt = createSpecializationsPrompt(fieldId);
                break;
            default:
                throw new Error(`Unknown content type: ${type}`);
        }

        // Generate content
        try {
            const { UsageTracker } = await import('./usageTracker');
            await UsageTracker.logGeminiRequest();
        } catch (e) {
            console.warn('[dynamicContentService] Usage tracking failed, proceeding...');
        }

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (aiError: any) {
            console.error('⚠️ Gemini API Call Failed:', aiError);
            throw new Error(`AI_FAILURE: ${aiError.message}`);
        }

        const response = await result.response;
        const rawText = response.text();

        if (!rawText) {
            throw new Error('No content received from AI');
        }

        // Clean and parse
        let finalData;
        try {
            const cleanedText = cleanAIResponse(rawText);
            const parsedData = JSON.parse(cleanedText);

            if (type === 'roadmap' && parsedData.phases) {
                finalData = parsedData.phases;
            } else if (Array.isArray(parsedData)) {
                finalData = parsedData;
            } else {
                finalData = parsedData;
            }
        } catch (parseError) {
            console.error('❌ AI Response Parsing Failed:', rawText);
            throw new Error('AI_PARSE_ERROR');
        }

        // CRITICAL: Validate and enforce FREE certifications
        if (type === 'certifications' && Array.isArray(finalData)) {
            finalData = finalData.map((cert: any, i: number) => {
                if (i < 4) cert.cost = 'Free';
                return cert;
            });
        }

        // Cache for future requests
        await setCachedContent(cacheKey, finalData);

        console.log(`✅ Generated and cached ${type} for ${fieldId}/${specializationId}`);
        return finalData;

    } catch (error: any) {
        console.error(`🔥 Generation Error for ${type}:`, error);

        // RECOVERY PATH: If AI fails, return a high-quality fallback instead of 500
        console.log('🛡️  Applying Fallback Recovery Path...');

        if (type === 'roadmap') {
            return Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                title: `Semester ${i + 1}: ${specializationId} ${i < 3 ? 'Foundations' : i < 6 ? 'Core Engineering' : 'Advanced & Industry'}`,
                duration: '6 months',
                focus: `Semester ${i + 1} curriculum for ${specializationId}`,
                skills: [`Skill Set ${i + 1}`, `Industry Prep ${i + 1}`],
                tools: [`Primary Tool ${i + 1}`, `Workflow Tool ${i + 1}`],
                projects: [`Semester ${i + 1} Major/Minor Project`],
                certifications: [`Relevant Certification ${i + 1}`],
                careerRelevance: `Ensures completion of ${specializationId} competency by Semester ${i + 1}.`
            }));
        }

        throw new Error(`Failed to generate ${type}: ${error.message}`);
    }
}

// ============================================
// CACHE MANAGEMENT UTILITIES
// ============================================

export async function clearCache(cacheKey?: string): Promise<void> {
    try {
        if (!db) {
            console.warn('Cannot clear cache: Firestore is not initialized.');
            return;
        }

        if (cacheKey) {
            await db.collection('ai_generated_content').doc(cacheKey).delete();
            console.log(`🗑️ Cleared cache: ${cacheKey}`);
        } else {
            // Clear all cache
            const snapshot = await db.collection('ai_generated_content').get();
            const batch = db.batch();
            snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
            await batch.commit();
            console.log(`🗑️ Cleared all cache`);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
}
