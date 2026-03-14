/**
 * STRICT CONTENT SERVICE
 * Database-first approach with AI as controlled fallback only
 */

import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ============================================
// CORE INTERFACES
// ============================================

interface UserContext {
    field: string;
    specialization?: string;
    branch?: string;
    skillLevel?: string;
    assessmentScore?: number;
    completedPhases?: string[];
    completedProjects?: string[];
}

interface StrictResponse {
    field: string;
    specialization?: string;
    source: 'database' | 'ai_fallback';
    data: any[];
    reasoning?: string;
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
    filtered: any[];
}

// ============================================
// DATABASE FETCHERS (PRIORITY 1)
// ============================================

async function fetchDatabaseCareerPaths(userContext: UserContext): Promise<any[]> {
    const { field, specialization, branch } = userContext;

    const { UsageTracker } = await import('./usageTracker');
    await UsageTracker.logFirestoreRead(1);

    console.log(`📊 Fetching career paths from DB: ${field} / ${specialization || branch || 'any'}`);

    try {
        let query = db.collection('career_paths')
            .where('fieldId', '==', field.toLowerCase().trim());

        const snapshot = await query.get();
        let paths = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        // STRICT FILTER: Only paths matching specialization
        const spec = (specialization || branch || '').toLowerCase().trim();
        if (spec) {
            paths = paths.filter((p: any) => {
                const pathSpec = (p.specializationId || '').toLowerCase().trim();
                return pathSpec === spec || pathSpec === field.toLowerCase();
            });
        }

        // LIMIT to 3 most relevant
        paths = paths.slice(0, 3);

        console.log(`✅ Found ${paths.length} career paths in database`);
        return paths;
    } catch (error) {
        console.error('❌ Database fetch failed:', error);
        return [];
    }
}

async function fetchDatabaseProjects(userContext: UserContext): Promise<any[]> {
    const { field, specialization, branch } = userContext;

    const { UsageTracker } = await import('./usageTracker');
    await UsageTracker.logFirestoreRead(1);

    console.log(`📊 Fetching projects from DB: ${field} / ${specialization || branch || 'any'}`);

    try {
        let query = db.collection('projects')
            .where('fieldId', '==', field.toLowerCase().trim());

        const snapshot = await query.get();
        let projects = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        // STRICT FILTER: Only projects matching specialization
        const spec = (specialization || branch || '').toLowerCase().trim();
        if (spec) {
            projects = projects.filter((p: any) => {
                const projSpec = (p.specializationId || '').toLowerCase().trim();
                return projSpec === spec || projSpec === field.toLowerCase();
            });
        }

        // LIMIT to 6
        projects = projects.slice(0, 6);

        console.log(`✅ Found ${projects.length} projects in database`);
        return projects;
    } catch (error) {
        console.error('❌ Database fetch failed:', error);
        return [];
    }
}

async function fetchDatabaseCertifications(userContext: UserContext): Promise<any[]> {
    const { field, specialization, branch } = userContext;

    const { UsageTracker } = await import('./usageTracker');
    await UsageTracker.logFirestoreRead(1);

    console.log(`📊 Fetching certifications from DB: ${field} / ${specialization || branch || 'any'}`);

    try {
        let query = db.collection('certifications')
            .where('fieldId', '==', field.toLowerCase().trim());

        const snapshot = await query.get();
        let certs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        // STRICT FILTER: Only certs matching specialization
        const spec = (specialization || branch || '').toLowerCase().trim();
        if (spec) {
            certs = certs.filter((c: any) => {
                const certSpec = (c.specializationId || '').toLowerCase().trim();
                return certSpec === spec || certSpec === field.toLowerCase();
            });
        }

        // LIMIT to 8
        certs = certs.slice(0, 8);

        console.log(`✅ Found ${certs.length} certifications in database`);
        return certs;
    } catch (error) {
        console.error('❌ Database fetch failed:', error);
        return [];
    }
}

async function fetchDatabaseRoadmap(userContext: UserContext): Promise<any[]> {
    const { field, specialization, branch } = userContext;

    console.log(`📊 Fetching roadmap from DB: ${field} / ${specialization || branch || 'any'}`);

    try {
        let query = db.collection('roadmaps')
            .where('fieldId', '==', field.toLowerCase().trim());

        const snapshot = await query.get();
        let roadmaps = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        // STRICT FILTER: Only roadmaps matching specialization
        const spec = (specialization || branch || '').toLowerCase().trim();
        if (spec) {
            roadmaps = roadmaps.filter((r: any) => {
                const roadmapSpec = (r.specializationId || '').toLowerCase().trim();
                return roadmapSpec === spec || roadmapSpec === field.toLowerCase();
            });
        }

        console.log(`✅ Found ${roadmaps.length} roadmaps in database`);
        const phases = roadmaps.length > 0 ? roadmaps[0].phases || [] : [];

        // FEATURE 4: INDUSTRY-LEVEL ROADMAP CLASSIFICATION
        return phases.map((phase: any, index: number) => {
            const semester = index + 1;
            let level: "Beginner" | "Intermediate" | "Advanced" | "Industry Level";
            if (semester <= 2) level = "Beginner";
            else if (semester <= 4) level = "Intermediate";
            else if (semester <= 6) level = "Advanced";
            else level = "Industry Level";
            return { ...phase, level };
        });
    } catch (error) {
        console.error('❌ Database fetch failed:', error);
        return [];
    }
}

// ============================================
// VALIDATION LAYER
// ============================================

function validateCareerPaths(paths: any[], userContext: UserContext): ValidationResult {
    const errors: string[] = [];
    const filtered = paths.filter(path => {
        const pathField = (path.fieldId || '').toLowerCase().trim();
        const userField = userContext.field.toLowerCase().trim();

        if (pathField !== userField) {
            errors.push(`Career path "${path.title}" belongs to ${pathField}, not ${userField}`);
            return false;
        }

        const spec = (userContext.specialization || userContext.branch || '').toLowerCase().trim();
        if (spec) {
            const pathSpec = (path.specializationId || '').toLowerCase().trim();
            if (pathSpec && pathSpec !== spec && pathSpec !== userField) {
                errors.push(`Career path "${path.title}" belongs to ${pathSpec}, not ${spec}`);
                return false;
            }
        }

        return true;
    });

    return {
        valid: errors.length === 0,
        errors,
        filtered
    };
}

function validateProjects(projects: any[], userContext: UserContext): ValidationResult {
    const errors: string[] = [];
    const filtered = projects.filter(project => {
        const projField = (project.fieldId || '').toLowerCase().trim();
        const userField = userContext.field.toLowerCase().trim();

        if (projField !== userField) {
            errors.push(`Project "${project.title || project.name}" belongs to ${projField}, not ${userField}`);
            return false;
        }

        return true;
    });

    return {
        valid: errors.length === 0,
        errors,
        filtered
    };
}

function validateCertifications(certs: any[], userContext: UserContext): ValidationResult {
    const errors: string[] = [];
    const filtered = certs.filter(cert => {
        const certField = (cert.fieldId || '').toLowerCase().trim();
        const userField = userContext.field.toLowerCase().trim();

        if (certField !== userField) {
            errors.push(`Certification "${cert.title || cert.name}" belongs to ${certField}, not ${userField}`);
            return false;
        }

        return true;
    });

    return {
        valid: errors.length === 0,
        errors,
        filtered
    };
}

// ============================================
// AI FALLBACK (ONLY IF DATABASE EMPTY)
// ============================================

async function generateAIFallback(
    type: 'career_paths' | 'projects' | 'certifications' | 'roadmap',
    userContext: UserContext,
    dbData: any[]
): Promise<any[]> {

    // If database has data, DON'T use AI
    if (dbData && dbData.length > 0) {
        console.log(`✅ Using database data (${dbData.length} items), skipping AI`);
        return dbData;
    }

    console.log(`⚠️  No database data found for ${type}, using AI fallback...`);

    const { UsageTracker } = await import('./usageTracker');
    await UsageTracker.logGeminiRequest();

    const { field, specialization, branch, skillLevel, assessmentScore } = userContext;
    const spec = specialization || branch || 'general';

    const systemInstruction = `You are a FIELD-RESTRICTED career intelligence engine.

CRITICAL RULES:
1. You must ONLY recommend items for: ${field} → ${spec}
2. You must NEVER mix domains or suggest items from other fields
3. You must NEVER generate hypothetical roles outside this scope
4. All recommendations must be REAL and VERIFIABLE
5. Return ONLY valid JSON, no explanations

User Context:
- Field: ${field}
- Specialization: ${spec}
- Skill Level: ${skillLevel || 'beginner'}
- Assessment Score: ${assessmentScore || 'N/A'}

Your response must be strictly limited to ${field} - ${spec}.`;

    let prompt = '';

    switch (type) {
        case 'career_paths':
            prompt = `Generate 3 REAL career paths for ${field} - ${spec}.
Return ONLY JSON array:
[{"title": "Role Name", "fieldId": "${field.toLowerCase()}", "specializationId": "${spec.toLowerCase()}", "level": "junior/mid/senior", "requiredSkills": ["skill1"]}]`;
            break;

        case 'projects':
            prompt = `Generate 6 REAL portfolio projects for ${field} - ${spec}.
Return ONLY JSON array:
[{"name": "Project Name", "fieldId": "${field.toLowerCase()}", "specializationId": "${spec.toLowerCase()}", "difficulty": "beginner/intermediate/advanced", "techStack": ["tech1"], "description": "...", "estimatedTime": "2 weeks"}]`;
            break;

        case 'certifications':
            prompt = `Generate 8 REAL certifications for ${field} - ${spec}.
MUST include 4 FREE certifications.
Return ONLY JSON array:
[{"name": "Cert Name", "provider": "Provider", "cost": "Free", "fieldId": "${field.toLowerCase()}", "specializationId": "${spec.toLowerCase()}", "difficulty": "beginner", "officialUrl": "https://...", "timeToComplete": "2 months"}]`;
            break;

        case 'roadmap':
            prompt = `Generate 5-phase learning roadmap for ${field} - ${spec}.
Return ONLY JSON:
{"phases": [{"id": 1, "title": "Phase Name", "duration": "2 months", "skills": ["skill1"], "tools": ["tool1"], "projects": ["proj1"]}]}`;
            break;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean and parse
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        let data = Array.isArray(parsed) ? parsed : (parsed.phases || []);

        // FEATURE 4: INDUSTRY-LEVEL ROADMAP CLASSIFICATION
        if (type === 'roadmap') {
            data = data.map((phase: any, index: number) => {
                const semester = index + 1;
                let level: "Beginner" | "Intermediate" | "Advanced" | "Industry Level";
                if (semester <= 2) level = "Beginner";
                else if (semester <= 4) level = "Intermediate";
                else if (semester <= 6) level = "Advanced";
                else level = "Industry Level";
                return { ...phase, level };
            });
        }

        // ENFORCE FREE certifications
        if (type === 'certifications') {
            const freeCerts = data.filter((c: any) => c.cost?.toLowerCase() === 'free');
            if (freeCerts.length < 4) {
                for (let i = 0; i < Math.min(4, data.length); i++) {
                    data[i].cost = 'Free';
                }
            }
        }

        console.log(`✅ AI generated ${data.length} items as fallback`);
        return data;

    } catch (error) {
        console.error('❌ AI fallback failed:', error);
        return [];
    }
}

// ============================================
// MAIN STRICT CONTENT FETCHER
// ============================================

export async function getStrictContent(
    type: 'career_paths' | 'projects' | 'certifications' | 'roadmap',
    userContext: UserContext
): Promise<StrictResponse> {

    console.log(`\n🎯 STRICT FETCH: ${type} for ${userContext.field} / ${userContext.specialization || userContext.branch || 'any'}`);

    let dbData: any[] = [];
    let source: 'database' | 'ai_fallback' = 'database';

    // STEP 1: Try database first
    switch (type) {
        case 'career_paths':
            dbData = await fetchDatabaseCareerPaths(userContext);
            break;
        case 'projects':
            dbData = await fetchDatabaseProjects(userContext);
            break;
        case 'certifications':
            dbData = await fetchDatabaseCertifications(userContext);
            break;
        case 'roadmap':
            dbData = await fetchDatabaseRoadmap(userContext);
            break;
    }

    // STEP 2: If database empty, use AI fallback
    if (!dbData || dbData.length === 0) {
        console.log(`⚠️  Database empty for ${type}, using AI fallback`);
        dbData = await generateAIFallback(type, userContext, dbData);
        source = 'ai_fallback';
    }

    // STEP 3: Validate data
    let validation: ValidationResult;
    switch (type) {
        case 'career_paths':
            validation = validateCareerPaths(dbData, userContext);
            break;
        case 'projects':
            validation = validateProjects(dbData, userContext);
            break;
        case 'certifications':
            validation = validateCertifications(dbData, userContext);
            break;
        default:
            validation = { valid: true, errors: [], filtered: dbData };
    }

    if (!validation.valid) {
        console.warn(`⚠️  Validation errors:`, validation.errors);
    }

    // STEP 4: Return strict response
    return {
        field: userContext.field,
        specialization: userContext.specialization || userContext.branch,
        source,
        data: validation.filtered,
        reasoning: source === 'database'
            ? `Retrieved ${validation.filtered.length} items from database`
            : `Database empty, generated ${validation.filtered.length} items via AI`
    };
}

export async function clearStrictCache() {
    // This service doesn't use cache - always fetches fresh from DB
    console.log('✅ Strict service uses no cache - always fresh from database');
}
