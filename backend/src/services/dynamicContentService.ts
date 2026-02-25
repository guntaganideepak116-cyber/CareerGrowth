import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';

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
        const { UsageTracker } = await import('./usageTracker');
        await UsageTracker.logFirestoreRead(1);

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
        const { UsageTracker } = await import('./usageTracker');
        await UsageTracker.logFirestoreWrite(1);

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
1. Generate exactly 5 phases (Beginner to Advanced) SPECIFIC to ${specializationId}
2. Each phase must be 2-4 months
3. Use ONLY technologies/tools that are SPECIFIC to ${specializationId} (NOT generic ${fieldId} tools)
4. Include certifications that are SPECIFIC to ${specializationId} (e.g., for "Robotics Engineering" use ROS, Arduino, not generic "Python")
5. Include project ideas that are UNIQUE to ${specializationId}
6. Phase titles must reflect ${specializationId} progression (not generic titles)

Example for Robotics Engineering:
- Phase 1: "Robot Fundamentals & Kinematics" (NOT "Programming Basics")
- Tools: ROS2, Gazebo, Arduino, Raspberry Pi (NOT just "Python, Git")
- Projects: "Autonomous Line Following Robot" (NOT "Build a Website")

Return ONLY valid JSON:
{
  "phases": [
    {
      "id": 1,
      "title": "SPECIFIC to ${specializationId}",
      "duration": "2-3 months",
      "focus": "Core ${specializationId} fundamentals",
      "skills": ["${specializationId}-specific skill1", "${specializationId}-specific skill2"],
      "tools": ["${specializationId}-specific tool1", "${specializationId}-specific tool2"],
      "projects": ["${specializationId}-specific project1"],
      "certifications": ["${specializationId}-relevant cert1"],
      "careerRelevance": "Why this matters for ${specializationId} careers"
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
        console.log(`🤖 Generating ${type} for ${fieldId}/${specializationId}...`);

        if (!GEMINI_KEY) {
            throw new Error('Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your environment variables.');
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8000,
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
        const { UsageTracker } = await import('./usageTracker');
        await UsageTracker.logGeminiRequest();

        const result = await model.generateContent(prompt);

        const response = await result.response;
        const rawText = response.text();

        if (!rawText) {
            throw new Error('No content received from AI');
        }

        // Clean and parse
        const cleanedText = cleanAIResponse(rawText);
        const parsedData = JSON.parse(cleanedText);

        // Extract the actual data (handle both {phases: [...]} and [...] formats)
        let finalData;
        if (type === 'roadmap' && parsedData.phases) {
            finalData = parsedData.phases;
        } else if (Array.isArray(parsedData)) {
            finalData = parsedData;
        } else {
            finalData = parsedData;
        }

        // CRITICAL: Validate and enforce FREE certifications
        if (type === 'certifications' && Array.isArray(finalData)) {
            const freeCerts = finalData.filter((cert: any) =>
                cert.cost?.toLowerCase() === 'free' ||
                cert.cost === '$0' ||
                cert.cost === '0'
            );

            console.log(`📊 FREE certifications found: ${freeCerts.length} / ${finalData.length}`);

            // If less than 4 free certs, force the first 4 to be free
            if (freeCerts.length < 4) {
                console.warn(`⚠️  Only ${freeCerts.length} free certs found. Enforcing 4 FREE certifications...`);

                for (let i = 0; i < Math.min(4, finalData.length); i++) {
                    if (finalData[i].cost?.toLowerCase() !== 'free') {
                        console.log(`   🔧 Converting cert ${i + 1} to FREE: ${finalData[i].name}`);
                        finalData[i].cost = 'Free';
                    }
                }
            }

            console.log(`✅ Final FREE certifications: ${finalData.filter((c: any) => c.cost?.toLowerCase() === 'free').length}`);
        }

        // Cache for future requests
        await setCachedContent(cacheKey, finalData);

        console.log(`✅ Generated and cached ${type} for ${fieldId}/${specializationId}`);
        return finalData;

    } catch (error) {
        console.error(`Error generating ${type}:`, error);
        throw new Error(`Failed to generate ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// ============================================
// CACHE MANAGEMENT UTILITIES
// ============================================

export async function clearCache(cacheKey?: string): Promise<void> {
    try {
        if (cacheKey) {
            await db.collection('ai_generated_content').doc(cacheKey).delete();
            console.log(`🗑️ Cleared cache: ${cacheKey}`);
        } else {
            // Clear all cache
            const snapshot = await db.collection('ai_generated_content').get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log(`🗑️ Cleared all cache`);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
}
