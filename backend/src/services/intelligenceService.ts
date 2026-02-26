import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export interface CareerPrediction {
    roleName: string;
    matchPercentage: number;
    requiredSkills: string[];
    missingSkills: string[];
    readinessLevel: string;
}

export interface SkillGapAnalysis {
    userId: string;
    specializationId: string;
    currentSkills: string[];
    requiredSkills: string[];
    missingSkills: string[];
    improvementPriority: 'High' | 'Medium' | 'Low';
}

export interface JobReadiness {
    userId: string;
    readinessScore: number;
    readinessLevel: 'Beginner' | 'Intermediate' | 'Job Ready' | 'Industry Ready';
    lastUpdated: string;
}

export class IntelligenceService {
    /**
     * FEATURE 1: CAREER PREDICTION ENGINE
     */
    static async updateCareerPredictions(userId: string): Promise<void> {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return;
            const userData = userDoc.data() || {};
            const fieldId = userData.field;
            const specId = userData.specialization;

            // Fetch user's current progress data
            const [skillsSnap, certsSnap, assessmentsSnap, roadmapSnap] = await Promise.all([
                db.collection('skills_progress').where('userId', '==', userId).where('completed', '==', true).get(),
                db.collection('certifications_progress').where('userId', '==', userId).where('completed', '==', true).get(),
                db.collection('assessments_attempts').where('userId', '==', userId).get(),
                db.collection('roadmap_progress').where('userId', '==', userId).where('completed', '==', true).get()
            ]);

            const userSkills = new Set<string>();
            skillsSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => userSkills.add(doc.data().skillName.toLowerCase()));

            // Add skills from certifications and roadmaps too if available
            certsSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const skills = doc.data().skills || [];
                skills.forEach((s: string) => userSkills.add(s.toLowerCase()));
            });
            roadmapSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const skills = doc.data().skills || [];
                skills.forEach((s: string) => userSkills.add(s.toLowerCase()));
            });

            // Fetch generic career roles for this field/spec
            let rolesQuery = db.collection('career_roles').where('fieldId', '==', fieldId);
            if (specId) {
                rolesQuery = rolesQuery.where('specializationId', '==', specId);
            }
            let rolesSnap = await rolesQuery.get();

            // Fallback: if no roles found, use a default set or career_paths
            if (rolesSnap.empty) {
                const pathsSnap = await db.collection('career_paths').where('fieldId', '==', fieldId).get();
                const predictions: CareerPrediction[] = [];

                pathsSnap.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                    const data = doc.data();
                    const requiredSkills = (data.requiredSkills || []).map((s: string) => s.toLowerCase());
                    const matched = requiredSkills.filter((s: string) => userSkills.has(s));
                    const missing = requiredSkills.filter((s: string) => !userSkills.has(s));
                    const matchPercentage = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 0;

                    predictions.push({
                        roleName: data.title,
                        matchPercentage,
                        requiredSkills: data.requiredSkills || [],
                        missingSkills: missing.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
                        readinessLevel: matchPercentage > 80 ? 'High' : matchPercentage > 50 ? 'Medium' : 'Low'
                    });
                });

                await db.collection('career_predictions').doc(userId).set({
                    userId,
                    predictedRoles: predictions.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5),
                    generatedAt: new Date().toISOString()
                });
                return;
            }

            const predictions: CareerPrediction[] = [];
            rolesSnap.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const data = doc.data();
                const requiredSkills = (data.requiredSkills || []).map((s: string) => s.toLowerCase());
                const matched = requiredSkills.filter((s: string) => userSkills.has(s));
                const missing = requiredSkills.filter((s: string) => !userSkills.has(s));
                const matchPercentage = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 0;

                predictions.push({
                    roleName: data.roleName,
                    matchPercentage,
                    requiredSkills: data.requiredSkills || [],
                    missingSkills: missing.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
                    readinessLevel: matchPercentage > 80 ? 'High' : matchPercentage > 50 ? 'Medium' : 'Low'
                });
            });

            await db.collection('career_predictions').doc(userId).set({
                userId,
                predictedRoles: predictions.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5),
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error('[Intelligence] Career Prediction Error:', error);
        }
    }

    /**
     * FEATURE 2: SKILL GAP ANALYSIS ENGINE
     */
    static async updateSkillGapAnalysis(userId: string): Promise<void> {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return;
            const userData = userDoc.data() || {};
            const fieldId = userData.field;
            const specId = userData.specialization;

            // 1. Get current completed skills
            const skillsSnap = await db.collection('skills_progress')
                .where('userId', '==', userId)
                .where('completed', '==', true)
                .get();
            const currentSkills = skillsSnap.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => doc.data().skillName);

            // 2. Get required skills for this specialization from career_paths or specializations
            const requiredSkillsSet = new Set<string>();
            const pathsSnap = await db.collection('career_paths')
                .where('fieldId', '==', fieldId)
                .where('specializationId', '==', specId || 'general')
                .get();

            pathsSnap.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const skills = doc.data().requiredSkills || [];
                skills.forEach((s: string) => requiredSkillsSet.add(s));
            });

            const requiredSkills = Array.from(requiredSkillsSet);
            const missingSkills = requiredSkills.filter(s => !currentSkills.includes(s));

            const gapPercentage = requiredSkills.length > 0 ? (missingSkills.length / requiredSkills.length) : 0;
            const improvementPriority = gapPercentage > 0.6 ? 'High' : gapPercentage > 0.3 ? 'Medium' : 'Low';

            await db.collection('skill_gap_analysis').doc(userId).set({
                userId,
                specializationId: specId || 'general',
                currentSkills,
                requiredSkills,
                missingSkills,
                improvementPriority,
                lastUpdated: new Date().toISOString()
            });

        } catch (error) {
            console.error('[Intelligence] Skill Gap Analysis Error:', error);
        }
    }

    /**
     * FEATURE 3: JOB READINESS SCORE SYSTEM
     */
    static async updateJobReadinessScore(userId: string): Promise<void> {
        try {
            const [roadmapProgress, skillsSnap, certsSnap, assessmentsSnap] = await Promise.all([
                db.collection('roadmap_progress').where('userId', '==', userId).where('completed', '==', true).get(),
                db.collection('skills_progress').where('userId', '==', userId).where('completed', '==', true).get(),
                db.collection('certifications_progress').where('userId', '==', userId).where('completed', '==', true).get(),
                db.collection('assessments_attempts').where('userId', '==', userId).get()
            ]);

            // roadmapProgress (max 8 semesters, or 20 steps as per analytics.ts)
            // Using 20 as per existing analytics logic
            const roadmapPct = Math.min(Math.round((roadmapProgress.size / 20) * 100), 100);

            // skillsCompletion (target 20 skills)
            const skillCompletion = Math.min(Math.round((skillsSnap.size / 20) * 100), 100);

            // certificationCompletion (target 5 certifications for 100%)
            const certificationCompletion = Math.min(Math.round((certsSnap.size / 5) * 100), 100);

            // assessmentScore (average)
            let totalAssessmentScore = 0;
            assessmentsSnap.forEach((doc: admin.firestore.QueryDocumentSnapshot) => totalAssessmentScore += (doc.data().percentage || 0));
            const avgAssessmentScore = assessmentsSnap.size > 0 ? (totalAssessmentScore / assessmentsSnap.size) : 0;


            /**
             * Formula:
             * jobReadinessScore = (roadmapProgress * 0.30 + skillCompletion * 0.30 + certificationCompletion * 0.20 + assessmentScore * 0.20)
             */
            const readinessScore = Math.round(
                (roadmapPct * 0.30) +
                (skillCompletion * 0.30) +
                (certificationCompletion * 0.20) +
                (avgAssessmentScore * 0.20)
            );

            let readinessLevel: 'Beginner' | 'Intermediate' | 'Job Ready' | 'Industry Ready';
            if (readinessScore <= 30) readinessLevel = 'Beginner';
            else if (readinessScore <= 60) readinessLevel = 'Intermediate';
            else if (readinessScore <= 80) readinessLevel = 'Job Ready';
            else readinessLevel = 'Industry Ready';

            await db.collection('job_readiness').doc(userId).set({
                userId,
                readinessScore,
                readinessLevel,
                lastUpdated: new Date().toISOString()
            });

            // Update user portfolio readiness score as well
            await db.collection('user_portfolios').doc(userId).set({
                readinessScore,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            // Update user_progress for Dashboard sync
            await db.collection('user_progress').doc(userId).set({
                overallProgress: readinessScore,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error('[Intelligence] Job Readiness Error:', error);
        }
    }

    /**
     * Helper to sync all intelligence features for a user
     */
    static async syncAllIntelligence(userId: string): Promise<void> {
        console.log(`[Intelligence] Syncing advanced features for user ${userId}...`);
        await Promise.all([
            this.updateCareerPredictions(userId),
            this.updateSkillGapAnalysis(userId),
            this.updateJobReadinessScore(userId)
        ]);
        console.log(`[Intelligence] Sync complete for ${userId}`);
    }
}
