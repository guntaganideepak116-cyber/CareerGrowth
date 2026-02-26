import express from 'express';
import * as admin from 'firebase-admin';

import { db } from '../config/firebase';
import { verifyToken } from '../middleware/adminMiddleware';
import { FieldValue } from 'firebase-admin/firestore';
import { IntelligenceService } from '../services/intelligenceService';


const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SkillItem { name: string; level: number; category: string; }
interface ProjectItem { id: string; name: string; description: string; technologies: string[]; difficulty: string; status: string; }
interface ExperienceItem { title: string; type: string; duration: string; outcomes: string[]; }

interface PortfolioData {
    userId: string;
    theme: 'modern' | 'minimal' | 'professional';
    about: { visible: boolean; name: string; headline: string; summary: string; field: string; };
    skills: { visible: boolean; title: string; items: SkillItem[]; };
    projects: { visible: boolean; title: string; items: ProjectItem[]; };
    experience: { visible: boolean; title: string; items: ExperienceItem[]; };
    services: { visible: boolean; title: string; items: string[]; };
    contact: { visible: boolean; title: string; email: string; linkedin?: string; github?: string; twitter?: string; website?: string; };
    readinessScore?: number;
    lastSyncedAt?: string;
    updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract a readable date string from a Firestore field value */
function extractDateStr(raw: any): string {
    if (!raw) return new Date().toISOString();
    if (typeof raw === 'object' && typeof raw.toDate === 'function') return raw.toDate().toISOString();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Merge new skills into existing list without duplicates (case-insensitive) */
function mergeSkills(existing: SkillItem[], incoming: SkillItem[]): SkillItem[] {
    const map = new Map<string, SkillItem>();
    for (const s of existing) map.set(s.name.toLowerCase(), s);
    for (const s of incoming) {
        const key = s.name.toLowerCase();
        if (!map.has(key)) map.set(key, s);
        else {
            // Update level if better score
            const current = map.get(key)!;
            if (s.level > current.level) map.set(key, { ...current, level: s.level });
        }
    }
    return Array.from(map.values());
}

/** Merge projects without duplicates by name */
function mergeProjects(existing: ProjectItem[], incoming: ProjectItem[]): ProjectItem[] {
    const map = new Map<string, ProjectItem>();
    for (const p of existing) map.set(p.name.toLowerCase(), p);
    for (const p of incoming) {
        const key = p.name.toLowerCase();
        if (!map.has(key)) map.set(key, p);
    }
    return Array.from(map.values());
}

/** Merge experience without duplicates by title */
function mergeExperience(existing: ExperienceItem[], incoming: ExperienceItem[]): ExperienceItem[] {
    const map = new Map<string, ExperienceItem>();
    for (const e of existing) map.set(e.title.toLowerCase(), e);
    for (const e of incoming) {
        const key = e.title.toLowerCase();
        if (!map.has(key)) map.set(key, e);
    }
    return Array.from(map.values());
}

/** Merge services (string[]) without duplicates */
function mergeServices(existing: string[], incoming: string[]): string[] {
    const set = new Set(existing.map(s => s.toLowerCase()));
    const result = [...existing];
    for (const s of incoming) {
        if (!set.has(s.toLowerCase())) { set.add(s.toLowerCase()); result.push(s); }
    }
    return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core sync function — aggregates all progress data into PortfolioData shape
// Called on page load and after every completion event
// ─────────────────────────────────────────────────────────────────────────────
async function syncPortfolioForUser(userId: string): Promise<PortfolioData> {
    const portfolioRef = db.collection('user_portfolios').doc(userId);

    // 1. Fetch existing portfolio and user profile in parallel
    const [portfolioSnap, userSnap] = await Promise.all([
        portfolioRef.get(),
        db.collection('users').doc(userId).get(),
    ]);

    const existing = portfolioSnap.exists ? (portfolioSnap.data() as PortfolioData) : null;
    const user = userSnap.data() || {};

    // 2. Fetch all progress sources in parallel
    const [
        roadmapSnap,
        skillsSnap,
        certsProgressSnap,
        assessmentsSnap,
        userActivitySnap,
    ] = await Promise.all([
        db.collection('roadmap_progress').where('userId', '==', userId).get(),
        db.collection('skills_progress').where('userId', '==', userId).where('completed', '==', true).get(),
        db.collection('certifications_progress').where('userId', '==', userId).where('completed', '==', true).get(),
        db.collection('assessments_attempts').where('userId', '==', userId).orderBy('createdAt', 'desc').limit(10).get(),
        db.collection('user_activity_log').where('userId', '==', userId).where('type', '==', 'ROADMAP_SEMESTER_COMPLETED').get(),
    ]);

    // ── Skills from roadmap phases ────────────────────────────────
    const autoSkills: SkillItem[] = [];

    roadmapSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        const skills: string[] = data.skills || [];
        skills.forEach(skill => {
            if (skill && skill.trim()) {
                autoSkills.push({ name: skill.trim(), level: data.completed ? 75 : 40, category: 'Technical' });
            }
        });
    });

    // Skills from skills_progress collection
    skillsSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        if (data.skillName) {
            autoSkills.push({ name: data.skillName, level: 80, category: data.category || 'Technical' });
        }
    });

    // Skills from user profile (pre-existing)
    const profileSkills: string[] = user.skills || [];
    profileSkills.forEach(skill => {
        if (skill) autoSkills.push({ name: skill, level: 60, category: 'Technical' });
    });

    // ── Projects from roadmap phases ──────────────────────────────
    const autoProjects: ProjectItem[] = [];
    const completedProjectIds: string[] = user.completed_projects || [];

    roadmapSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        if (!data.completed) return;
        const projects: string[] = data.projects || [];
        projects.forEach((projectName, idx) => {
            if (projectName && projectName.trim()) {
                autoProjects.push({
                    id: `roadmap-${doc.id}-${idx}`,
                    name: projectName.trim(),
                    description: `Project completed as part of ${data.fieldId || 'learning'} roadmap — Phase ${data.phaseId || ''}`.trim(),
                    technologies: data.tools || [],
                    difficulty: data.phaseId <= 2 ? 'Beginner' : data.phaseId <= 4 ? 'Intermediate' : 'Advanced',
                    status: 'Completed',
                });
            }
        });
    });

    // ── Experience from career phase ──────────────────────────────
    const autoExperience: ExperienceItem[] = [];
    const careerPhase: string = user.career_phase || 'student';
    const experienceYears: number = user.experience_years || 0;

    if (careerPhase === 'professional' || experienceYears > 0) {
        const field = user.field || 'Technology';
        const spec = user.specialization || '';
        autoExperience.push({
            title: `${spec ? spec + ' ' : ''}Professional`,
            type: 'Full-time',
            duration: experienceYears > 0 ? `${experienceYears} year${experienceYears !== 1 ? 's' : ''}` : 'Current',
            outcomes: profileSkills.slice(0, 4),
        });
    } else if (careerPhase === 'fresher') {
        autoExperience.push({
            title: 'Career Starter',
            type: 'Fresher',
            duration: '2024 - Present',
            outcomes: ['Ready for entry-level positions', 'Platform-certified skills', 'Completed industry roadmap'],
        });
    }

    // Platform learning experience (always add)
    if (roadmapSnap.size > 0 || skillsSnap.size > 0) {
        const completedPhaseCount = roadmapSnap.docs.filter((d: admin.firestore.QueryDocumentSnapshot) => d.data().completed).length;
        autoExperience.push({
            title: 'CareerGrowth Platform Learner',
            type: 'Self-directed Learning',
            duration: '2024 - Present',
            outcomes: [
                `Completed ${completedPhaseCount} roadmap phases`,
                `${skillsSnap.size} skills tracked and verified`,
                `${certsProgressSnap.size} certifications completed`,
                assessmentsSnap.size > 0 ? `${assessmentsSnap.size} assessments passed` : 'Ongoing assessments',
            ].filter(Boolean),
        });
    }

    // ── Services from specialization ──────────────────────────────
    const autoServices: string[] = [];
    if (user.specialization) {
        const specLabel = user.specialization.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        autoServices.push(`${specLabel} Consulting`);
    }
    if (user.field === 'engineering') {
        autoServices.push('Software Development', 'Technical Consulting', 'Code Review');
    } else if (user.field === 'data-science') {
        autoServices.push('Data Analysis', 'ML Model Development', 'Data Visualization');
    } else if (user.field === 'design') {
        autoServices.push('UI/UX Design', 'Prototyping', 'Design Systems');
    }

    // ── Readiness score ───────────────────────────────────────────
    let totalScore = 0;
    let scoreCount = 0;
    assessmentsSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        const pct = doc.data().percentage;
        if (typeof pct === 'number') { totalScore += pct; scoreCount++; }
    });
    const completedPhaseCount = roadmapSnap.docs.filter((d: admin.firestore.QueryDocumentSnapshot) => d.data().completed).length;
    const roadmapPct = Math.min(Math.round((completedPhaseCount / 8) * 100), 100);
    const avgAssessment = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const readinessScore = Math.round((avgAssessment * 0.5) + (roadmapPct * 0.3) + (Math.min(certsProgressSnap.size * 10, 20)));

    // ── Build new PortfolioData (merging with existing manual edits) ──
    const field = user.field || 'General';
    const fullName = user.full_name || user.email?.split('@')[0] || 'Your Name';
    const specLabel = user.specialization
        ? user.specialization.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
        : null;

    const portfolio: PortfolioData = {
        userId,
        theme: existing?.theme || 'modern',

        about: {
            visible: existing?.about?.visible ?? true,
            name: existing?.about?.name || fullName,
            headline: existing?.about?.headline || `${specLabel || field} ${careerPhase === 'professional' ? 'Professional' : 'Developer'}`,
            summary: existing?.about?.summary ||
                `${careerPhase === 'student' ? 'Aspiring' : 'Experienced'} ${specLabel || field} professional with a focus on ${profileSkills.slice(0, 3).join(', ') || 'continuous learning'}. Tracking academic and career growth through CareerGrowth platform.`,
            field: existing?.about?.field || field,
        },

        skills: {
            visible: existing?.skills?.visible ?? true,
            title: existing?.skills?.title || 'Skills',
            // Merge: existing manual skills + auto-generated, deduplicated
            items: mergeSkills(existing?.skills?.items || [], autoSkills),
        },

        projects: {
            visible: existing?.projects?.visible ?? true,
            title: existing?.projects?.title || 'Projects',
            items: mergeProjects(existing?.projects?.items || [], autoProjects),
        },

        experience: {
            visible: existing?.experience?.visible ?? true,
            title: existing?.experience?.title || 'Experience',
            items: mergeExperience(existing?.experience?.items || [], autoExperience),
        },

        services: {
            visible: existing?.services?.visible ?? true,
            title: existing?.services?.title || 'Services',
            items: mergeServices(existing?.services?.items || [], autoServices),
        },

        contact: {
            visible: existing?.contact?.visible ?? true,
            title: existing?.contact?.title || 'Contact',
            email: existing?.contact?.email || user.email || '',
            linkedin: existing?.contact?.linkedin || user.linkedin_url || '',
            github: existing?.contact?.github || user.github_url || '',
            twitter: existing?.contact?.twitter || user.twitter_url || '',
            website: existing?.contact?.website || user.website_url || '',
        },

        readinessScore,
        lastSyncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // 3. Write back to Firestore (merge to preserve any other fields)
    await portfolioRef.set(portfolio, { merge: true });

    return portfolio;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/portfolio
// Returns existing portfolio data (Firestore read only — fast path)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const docRef = db.collection('user_portfolios').doc(userId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            // Auto-create on first visit — no "new user" screen needed
            const portfolio = await syncPortfolioForUser(userId);
            return res.json({ success: true, data: portfolio, autoGenerated: true });
        }

        res.json({ success: true, data: docSnap.data() });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/portfolio/sync
// Re-aggregates progress data and updates the portfolio collection
// Called automatically on page load and after completions
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sync', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const portfolio = await syncPortfolioForUser(userId);

        // Update intelligence features
        IntelligenceService.syncAllIntelligence(userId).catch(err =>
            console.error('[Intelligence] Sync error:', err)
        );

        res.json({ success: true, data: portfolio, message: 'Portfolio synced from progress data' });
    } catch (error) {
        console.error('Error syncing portfolio:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/portfolio
// Manual save (user edits via Edit mode) — preserves manual overrides
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const portfolioData = req.body;

        if (!portfolioData) {
            return res.status(400).json({ error: 'No data provided' });
        }

        const cleanData = {
            ...portfolioData,
            userId,
            updatedAt: new Date().toISOString(),
        };

        await db.collection('user_portfolios').doc(userId).set(cleanData, { merge: true });

        res.json({ success: true, message: 'Portfolio updated successfully', data: cleanData });
    } catch (error) {
        console.error('Error saving portfolio:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/portfolio/trigger
// Called by other routes when user completes something (roadmap, cert, skill)
// Lightweight endpoint that queues a background sync
// ─────────────────────────────────────────────────────────────────────────────
router.post('/trigger', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const { event } = req.body; // 'roadmap_phase' | 'project' | 'certification' | 'skill' | 'assessment'

        console.log(`[Portfolio] Auto-trigger: ${event} for user ${userId}`);

        // Run sync in background — respond immediately so UI isn't blocked
        syncPortfolioForUser(userId).catch(err =>
            console.error('[Portfolio] Background sync error:', err)
        );

        // Run intelligence sync in background
        IntelligenceService.syncAllIntelligence(userId).catch(err =>
            console.error('[Intelligence] Background sync error:', err)
        );

        res.json({ success: true, message: `Portfolio update queued for event: ${event}` });
    } catch (error) {
        console.error('Error triggering portfolio sync:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
