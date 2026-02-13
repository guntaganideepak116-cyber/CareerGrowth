
import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc,
    onSnapshot,
    serverTimestamp,
    increment,
    query,
    orderBy,
    limit,
    where,
    arrayUnion
} from 'firebase/firestore';

// Types
export type ActionType =
    | 'ASSESSMENT_COMPLETED'
    | 'ROADMAP_SEMESTER_COMPLETED'
    | 'PROJECT_COMPLETED'
    | 'CERTIFICATION_ENROLLED'
    | 'CERTIFICATION_COMPLETED'
    | 'SKILL_MARKED_COMPLETE'
    | 'PORTFOLIO_UPDATED'
    | 'PLAN_UPGRADED'
    | 'ONBOARDING_COMPLETED'
    | 'FIELD_SELECTED'
    | 'SPECIALIZATION_SELECTED';

export interface UserActivityLog {
    id?: string;
    userId: string;
    actionType: ActionType;
    fieldId?: string;
    relatedId?: string; // id of project, certificate, skill, etc.
    metadata?: any;
    timestamp: any;
}

export interface UserProgress {
    userId: string;
    selectedField?: string;
    selectedSpecialization?: string;
    completedSemesters: number[];
    completedProjects: string[]; // project IDs
    completedCertifications: string[];
    completedSkills: string[];
    assessmentScore: {
        lastScore: number;
        attempts: number;
        history: { score: number; date: string }[];
    };
    planType: 'free' | 'pro' | 'premium';
    lastUpdated: any;

    // Computed Metrics (Updated by Cloud Functions ideally, but we'll do client-side for now as requested)
    overallProgress: number; // 0-100
    skillGrowth: number; // count
    engagementScore: number; // 0-100
}

const COLLECTION_LOGS = 'user_activity_logs';
const COLLECTION_PROGRESS = 'user_progress';
const COLLECTION_ANALYTICS = 'user_analytics'; // Storing computed summaries here if needed

/**
 * Log a user activity and auto-update progress
 */
export const logUserActivity = async (
    userId: string,
    actionType: ActionType,
    payload: { fieldId?: string; relatedId?: string; metadata?: any }
) => {
    try {
        // 1. Add Log
        await addDoc(collection(db, COLLECTION_LOGS), {
            userId,
            actionType,
            fieldId: payload.fieldId || null,
            relatedId: payload.relatedId || null,
            metadata: payload.metadata || {},
            timestamp: serverTimestamp()
        });

        // 2. Update User Progress Aggregates based on action
        const progressRef = doc(db, COLLECTION_PROGRESS, userId);
        const progressSnap = await getDoc(progressRef);

        // Initialize if not exists
        if (!progressSnap.exists()) {
            await setDoc(progressRef, {
                userId,
                completedSemesters: [],
                completedProjects: [],
                completedCertifications: [],
                completedSkills: [],
                assessmentScore: { lastScore: 0, attempts: 0, history: [] },
                planType: 'free',
                lastUpdated: serverTimestamp(),
                overallProgress: 0,
                skillGrowth: 0,
                engagementScore: 0
            });
        }

        const updates: any = {
            lastUpdated: serverTimestamp(),
            engagementScore: increment(5) // +5 per action
        };

        switch (actionType) {
            case 'PROJECT_COMPLETED':
                if (payload.relatedId) {
                    updates.completedProjects = arrayUnion(payload.relatedId);
                }
                if (payload.fieldId) {
                    updates.selectedField = payload.fieldId;
                }
                break;
            case 'SKILL_MARKED_COMPLETE':
                if (payload.relatedId) {
                    updates.completedSkills = arrayUnion(payload.relatedId);
                }
                if (payload.fieldId) {
                    updates.selectedField = payload.fieldId;
                }
                break;
            case 'CERTIFICATION_COMPLETED':
                if (payload.relatedId) {
                    updates.completedCertifications = arrayUnion(payload.relatedId);
                }
                if (payload.fieldId) {
                    updates.selectedField = payload.fieldId;
                }
                break;
            case 'ROADMAP_SEMESTER_COMPLETED':
                if (payload.metadata?.phaseId) {
                    updates.completedSemesters = arrayUnion(payload.metadata.phaseId);
                }
                if (payload.fieldId) {
                    updates.selectedField = payload.fieldId;
                }
                break;
            case 'ASSESSMENT_COMPLETED':
                if (payload.metadata?.score !== undefined) {
                    // Update assessment history and last score
                    updates['assessmentScore.lastScore'] = payload.metadata.score;
                    updates['assessmentScore.attempts'] = increment(1);
                    updates['assessmentScore.history'] = arrayUnion({
                        score: payload.metadata.score,
                        date: new Date().toISOString()
                    });
                }
                if (payload.fieldId) {
                    updates.selectedField = payload.fieldId;
                }
                break;
        }

        await updateDoc(progressRef, updates);

    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

/**
 * Update specific fields in user progress
 */
export const updateUserProgress = async (userId: string, updates: Partial<UserProgress>) => {
    try {
        const progressRef = doc(db, COLLECTION_PROGRESS, userId);
        await setDoc(progressRef, { ...updates, lastUpdated: serverTimestamp() }, { merge: true });
    } catch (error) {
        console.error("Error updating progress:", error);
    }
};

/**
 * Subscribe to User Progress for Real-Time Updates
 */
export const subscribeToUserProgress = (userId: string, callback: (data: UserProgress | null) => void) => {
    const progressRef = doc(db, COLLECTION_PROGRESS, userId);
    return onSnapshot(progressRef,
        (doc) => {
            if (doc.exists()) {
                callback(doc.data() as UserProgress);
            } else {
                // Return null if document doesn't exist yet (user hasn't performed tracked actions)
                callback(null);
            }
        },
        (error) => {
            console.error("Error subscribing to user progress:", error);
            // Ensure UI doesn't hang on loading
            callback(null);
        }
    );
};

/**
 * Sync pre-existing data into user_progress (One-time migration helper)
 */
export const syncUserProgress = async (userId: string) => {
    try {
        const progressRef = doc(db, COLLECTION_PROGRESS, userId);
        const progressSnap = await getDoc(progressRef);

        // Even if it exists, we might want to check for missing assessments
        // Fetch assessments from subcollection
        const assessmentsRef = collection(db, 'users', userId, 'assessments');
        const q = query(assessmentsRef);
        const qSnap = await import('firebase/firestore').then(mod => mod.getDocs(q));

        const assessmentsData: any[] = [];
        let totalScore = 0;
        let attempts = 0;

        qSnap.forEach(doc => {
            const data = doc.data();
            assessmentsData.push({ score: data.score, date: data.attemptDate?.toDate()?.toISOString() || new Date().toISOString() });
            totalScore = Math.max(totalScore, data.score); // Keep highest score as lastScore for now or most recent
            attempts++;
        });

        const updates: any = {
            userId,
            lastUpdated: serverTimestamp(),
        };

        // Sync field if available in local state/context (caller can pass it or we fetch it)
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.field) {
                updates.selectedField = userData.field;
            }
            if (userData.skills && Array.isArray(userData.skills)) {
                updates.completedSkills = arrayUnion(...userData.skills);
            }
        }

        if (attempts > 0) {
            updates['assessmentScore.attempts'] = attempts;
            updates['assessmentScore.lastScore'] = totalScore;
            // history merge logic could be added here if needed
        }

        await setDoc(progressRef, updates, { merge: true });
        console.log("Synced user progress for", userId);
    } catch (e) {
        console.error("Critical: Sync failed", e);
    }
};

/**
 * Subscribe to recent Activity Logs
 */
export const subscribeToActivityLogs = (userId: string, callback: (logs: UserActivityLog[]) => void) => {
    try {
        const q = query(
            collection(db, COLLECTION_LOGS),
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        return onSnapshot(q,
            (snapshot) => {
                const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserActivityLog));
                callback(logs);
            },
            (error) => {
                console.error("Error subscribing to activity logs (check indexes):", error);
                callback([]);
            }
        );
    } catch (e) {
        console.error("Error setup activity logs subscription:", e);
        callback([]);
        return () => { };
    }
};

/**
 * Calculate Analytics Summary (Client-side implementation of constraints)
 */
export const calculateAnalytics = (progress: UserProgress | null) => {
    if (!progress) return {
        overallProgress: 0,
        skillGrowth: 0,
        projectCount: 0,
        certificationCount: 0,
        engagementScore: 0
    };

    const totalMilestones = 100; // Hypothetical max score
    // Simple calculation logic
    const roadmapScore = (progress.completedSemesters?.length || 0) * 10;
    const projectScore = (progress.completedProjects?.length || 0) * 15;
    const skillScore = (progress.completedSkills?.length || 0) * 2;

    let calculatedProgress = Math.min(100, roadmapScore + projectScore + skillScore);

    return {
        overallProgress: calculatedProgress,
        skillGrowth: progress.completedSkills?.length || 0,
        projectCount: progress.completedProjects?.length || 0,
        certificationCount: progress.completedCertifications?.length || 0,
        engagementScore: progress.engagementScore || 0
    };
};
