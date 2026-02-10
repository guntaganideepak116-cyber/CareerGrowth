import express from 'express';
import { db } from '../config/firebase';
import { verifyToken } from '../middleware/adminMiddleware';

const router = express.Router();

// Helper to get diverse stats
const getCollectionCount = async (collection: string, userId: string, completedOnly = false) => {
    let query = db.collection(collection).where('userId', '==', userId);
    if (completedOnly) {
        query = query.where('completed', '==', true);
    }
    const snap = await query.get();
    return snap.size;
};

// Helper: Standardize date extraction
const extractDate = (data: any): Date | null => {
    const raw = data.createdAt || data.timestamp || data.attemptedAt || data.completedAt || data.date;
    if (!raw) return null;
    // Handle Firestore Timestamp
    if (typeof raw === 'object' && 'toDate' in raw) return raw.toDate();
    // Handle string/number
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
};

/**
 * GET /api/analytics/dashboard-analytics
 * Fetch real-time analytics for the user dashboard (Summary View)
 */
router.get('/dashboard-analytics', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data() || {};
        const fieldId = userData.field;

        // 1. Assessments
        let totalScore = 0;
        let assessmentCount = 0;
        const assessmentsRef = db.collection('assessments_attempts');
        const attemptsQuery = await assessmentsRef.where('userId', '==', userId).get();

        if (!attemptsQuery.empty) {
            attemptsQuery.forEach(doc => {
                const data = doc.data();
                if (typeof data.percentage === 'number') {
                    totalScore += data.percentage;
                    assessmentCount++;
                }
            });
        }

        // Fallback
        if (assessmentCount === 0) {
            const subAssessments = await db.collection('users').doc(userId).collection('assessments').get();
            subAssessments.forEach(doc => {
                const data = doc.data();
                if (typeof data.score === 'number') {
                    totalScore += data.score;
                    assessmentCount++;
                }
            });
        }

        const avgAssessmentScore = assessmentCount > 0 ? (totalScore / assessmentCount) : 0;

        // 2. Roadmap
        const completedSteps = await getCollectionCount('roadmap_progress', userId, true);
        const TOTAL_ROADMAP_STEPS = 20;
        const roadmapCompletion = Math.min(Math.round((completedSteps / TOTAL_ROADMAP_STEPS) * 100), 100);

        const readinessScore = Math.round((avgAssessmentScore + roadmapCompletion) / 2);

        // 3. Skills
        const skillsCompleted = await getCollectionCount('skills_progress', userId, true);
        let totalSkills = 20;
        if (fieldId) {
            const pathsQuery = await db.collection('career_paths').where('field', '==', fieldId).get();
            const skillsSet = new Set();
            pathsQuery.forEach(doc => {
                (doc.data().requiredSkills || []).forEach((s: any) => skillsSet.add(s));
            });
            if (skillsSet.size > 0) totalSkills = skillsSet.size;
        }

        // 4. AI Confidence
        const interactionCount = await getCollectionCount('ai_usage_logs', userId);
        const interactionScore = Math.min((interactionCount / 20) * 100, 100);
        let aiConfidence = 0;
        if (assessmentCount > 0 || interactionCount > 0) {
            aiConfidence = Math.round((avgAssessmentScore * 0.6) + (interactionScore * 0.4));
        }

        // 5. Market Alignment
        const certCount = await getCollectionCount('certifications_progress', userId, true);
        const skillsWeight = (skillsCompleted / totalSkills) * 80;
        const certBonus = Math.min(certCount * 10, 20);
        let marketAlignment = 0;
        if (fieldId) {
            marketAlignment = Math.min(Math.round(skillsWeight + certBonus), 100);
        }

        res.json({
            readinessScore: readinessScore || 0,
            marketAlignment: marketAlignment || 0,
            aiConfidence: aiConfidence || 0,
            skillsCompleted: skillsCompleted || 0,
            totalSkills: totalSkills || 0,
            hasActivity: (assessmentCount > 0 || completedSteps > 0 || skillsCompleted > 0 || interactionCount > 0),
            fieldId: fieldId || null
        });

    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * GET /api/analytics/user-progress
 * Detailed analytics for Progress Analytics page
 */
router.get('/user-progress', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;

        // Fetch all relevant collections concurrently
        const [assessmentsSnap, skillsSnap, certsSnap, logsSnap, roadmapSnap] = await Promise.all([
            db.collection('assessments_attempts').where('userId', '==', userId).get(),
            db.collection('skills_progress').where('userId', '==', userId).where('completed', '==', true).get(),
            db.collection('certifications_progress').where('userId', '==', userId).where('completed', '==', true).get(),
            db.collection('ai_usage_logs').where('userId', '==', userId).get(),
            db.collection('roadmap_progress').where('userId', '==', userId).where('completed', '==', true).get()
        ]);

        // --- Scores ---
        let totalScore = 0;
        assessmentsSnap.forEach(doc => totalScore += (doc.data().percentage || 0));
        const avgScore = assessmentsSnap.size > 0 ? Math.round(totalScore / assessmentsSnap.size) : 0;

        // --- Activity Analysis ---
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        let weeklyActivityCount = 0;
        let previousWeekActivityCount = 0;

        // Consolidate all activities
        const processDoc = (doc: any) => {
            const date = extractDate(doc.data());
            if (date) {
                if (date >= oneWeekAgo) weeklyActivityCount++;
                else if (date >= twoWeeksAgo && date < oneWeekAgo) previousWeekActivityCount++;
            }
        };

        assessmentsSnap.forEach(processDoc);
        skillsSnap.forEach(processDoc);
        certsSnap.forEach(processDoc);
        logsSnap.forEach(processDoc);
        roadmapSnap.forEach(processDoc);

        const monthlyGrowthRate = previousWeekActivityCount === 0 ?
            (weeklyActivityCount > 0 ? 100 : 0) :
            Math.round(((weeklyActivityCount - previousWeekActivityCount) / previousWeekActivityCount) * 100);

        // --- Engagement Score ---
        // Formula: Base 30 + (assessments * 5) + (skills * 3) + (weeklyActivity * 2) + (logs * 1)
        // Capped at 100
        const engagementScore = Math.min(
            30 +
            (assessmentsSnap.size * 5) +
            (skillsSnap.size * 3) +
            (weeklyActivityCount * 2) +
            (logsSnap.size * 1),
            100
        );

        // --- Hours Learned Estimate ---
        const hoursLearned = Math.round(
            (assessmentsSnap.size * 0.5) +
            (skillsSnap.size * 2) +
            (certsSnap.size * 10) +
            (logsSnap.size * 0.1) +
            (roadmapSnap.size * 1)
        );

        // --- Percentile (Dynamic Simulation) ---
        const percentile = engagementScore > 85 ? 95 :
            engagementScore > 65 ? 80 :
                engagementScore > 40 ? 60 : 25;

        res.json({
            totalSkillsCompleted: skillsSnap.size,
            totalAssessmentsTaken: assessmentsSnap.size,
            avgScore,
            totalCertificationsCompleted: certsSnap.size,
            weeklyActivityCount, // Consolidated count
            monthlyGrowthRate,
            engagementScore,

            // Derived/Legacy
            percentile,
            hoursLearned,
            roadmapCompletion: Math.min(Math.round((roadmapSnap.size / 20) * 100), 100)
        });

    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
