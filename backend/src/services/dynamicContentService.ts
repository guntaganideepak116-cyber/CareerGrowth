import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    return `You are an expert career advisor. Generate a detailed 5-phase learning roadmap for ${fieldId} - ${specializationId}.

Student Context:
- Current Semester: ${userProfile?.semester || 1}
- Career Goal: ${userProfile?.careerGoal || 'Not specified'}

Requirements:
1. Generate exactly 5 phases (Beginner to Advanced)
2. Each phase should be 2-4 months
3. Include REAL 2024-2025 technologies and tools
4. Include actual certifications (AWS, Google Cloud, Microsoft, etc.)
5. Include specific project ideas for portfolio

Return ONLY valid JSON with this structure:
{
  "phases": [
    {
      "id": 1,
      "title": "Foundation Phase",
      "duration": "2-3 months",
      "focus": "Core fundamentals",
      "skills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"],
      "projects": ["project1", "project2"],
      "certifications": ["cert1", "cert2"],
      "careerRelevance": "Why this matters"
    }
  ]
}`;
}

function createProjectsPrompt(fieldId: string, specializationId: string): string {
    return `Generate 6 real-world portfolio projects for ${fieldId} - ${specializationId}.

Requirements:
1. Mix of beginner (2), intermediate (3), and advanced (1) difficulty
2. Use current 2024-2025 tech stacks
3. Projects should be resume-worthy
4. Include real-world applications

Return ONLY valid JSON array:
[
  {
    "id": "proj1",
    "name": "Project Name",
    "description": "Brief description",
    "difficulty": "intermediate",
    "techStack": ["React", "Node.js"],
    "estimatedTime": "2-3 weeks",
    "skills": ["skill1", "skill2"],
    "careerImpact": "high",
    "realWorldApplication": "How this is used in industry"
  }
]`;
}

function createCertificationsPrompt(fieldId: string, specializationId: string): string {
    return `You are an expert career advisor with access to real-time web search. Generate 8 valuable certifications for ${fieldId} - ${specializationId}.

IMPORTANT: Use Google Search to verify:
- Current certification names and availability
- Official URLs (must be real and working)
- Current pricing (2024-2025)
- Provider information

Requirements:
1. **MUST include at least 4 FREE certifications** (from Coursera, edX, Google, Microsoft, etc.)
2. Include 2-3 affordable paid certifications ($50-$200)
3. Include 1-2 premium certifications ($200+)
4. Only real certifications from known providers (Google, AWS, Microsoft, Coursera, Udacity, edX, FreeCodeCamp, etc.)
5. Verify official URLs are current and working
6. Use real current pricing
7. Specify difficulty levels accurately (beginner, intermediate, advanced)

Return ONLY valid JSON array:
[
  {
    "id": "cert1",
    "name": "Certification Name",
    "provider": "Google/AWS/Microsoft/Coursera/edX",
    "cost": "Free" or "$299",
    "timeToComplete": "2-3 months",
    "difficulty": "beginner",
    "skills": ["skill1", "skill2"],
    "industryValue": "high",
    "officialUrl": "https://...",
    "prerequisites": ["prereq1"],
    "salaryImpact": "+15%"
  }
]`;
}

function createSpecializationsPrompt(fieldId: string): string {
    return `Generate 8 career specializations within the ${fieldId} field.

Requirements:
1. Mix of core, emerging, and hybrid specializations
2. Include market demand scores (0-100)
3. Realistic growth potential
4. Current 2024-2025 market trends

Return ONLY valid JSON array:
[
  {
    "id": "spec1",
    "name": "Specialization Name",
    "type": "core" or "emerging" or "hybrid",
    "description": "Brief description",
    "marketDemand": 85,
    "growthPotential": "high",
    "riskLevel": "low",
    "skills": ["skill1", "skill2"],
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
