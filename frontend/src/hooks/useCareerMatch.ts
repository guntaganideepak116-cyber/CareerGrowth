import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { UserProgress } from '@/services/userAnalyticsService';
import { fields } from '@/data/fieldsData';

export interface MatchResult {
    pathId: string;
    pathName: string;
    matchScore: number;
    missingSkills: string[];
    acquiredSkills: string[];
}

export function useCareerMatch() {
    const { user, profile } = useAuthContext();
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const userId = user.uid;

        // Listen to BOTH career_predictions AND user_progress for real-time intelligence
        const predictionRef = doc(db, 'career_predictions', userId);
        const progressRef = doc(db, 'user_progress', userId);

        let isBackendAvailable = false;

        const unsubscribePredictions = onSnapshot(predictionRef, (predDoc) => {
            if (predDoc.exists()) {
                isBackendAvailable = true;
                const predData = predDoc.data();
                const backendMatches: MatchResult[] = (predData.predictedRoles || []).map((role: any) => ({
                    pathId: role.roleName.replace(/\s+/g, '-').toLowerCase(),
                    pathName: role.roleName,
                    matchScore: role.matchPercentage,
                    missingSkills: role.missingSkills,
                    acquiredSkills: role.requiredSkills.filter((s: string) => !role.missingSkills.includes(s))
                }));
                setMatches(backendMatches);
                setLoading(false);
            } else {
                isBackendAvailable = false;
                // If backend doc doesn't exist, we don't set loading false yet, 
                // we let the progress listener handle the calculation.
            }
        }, (err) => {
            console.error("Prediction Listener Error:", err);
            isBackendAvailable = false;
        });

        const unsubscribeProgress = onSnapshot(progressRef, async (progressDoc) => {
            // If backend data already arrived, skip client-side calc
            if (isBackendAvailable) {
                setLoading(false);
                return;
            }

            // Double check if backend doc exists before running heavy client logic
            try {
                const predSnap = await getDoc(predictionRef);
                if (predSnap.exists()) {
                    isBackendAvailable = true;
                    // The other listener will handle the data
                    return;
                }
            } catch (e) {
                console.warn("Failed to check backend prediction, falling back to client logic", e);
            }

            // Fallback: Client-side calculation
            try {
                const progressData = progressDoc.exists() ? progressDoc.data() as UserProgress : null;
                const activeField = progressData?.selectedField || profile?.field;

                if (!activeField) {
                    setMatches([]);
                    setLoading(false);
                    return;
                }

                const fieldId = fields.find(f =>
                    f.id.toLowerCase() === activeField.toLowerCase() ||
                    f.name.toLowerCase() === activeField.toLowerCase()
                )?.id || activeField.toLowerCase();

                const pathsRef = collection(db, 'career_paths');
                const q = query(pathsRef, where('fieldId', '==', fieldId.trim()));
                const querySnapshot = await getDocs(q);

                const userSkills: string[] = [
                    ...(progressData?.completedSkills || []),
                    ...(profile?.skills || [])
                ].filter((v, i, a) => a.indexOf(v) === i);

                const results: MatchResult[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const requiredSkills: string[] = data.requiredSkills || [];
                    const acquired = requiredSkills.filter(skill =>
                        userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
                    );
                    const missing = requiredSkills.filter(skill =>
                        !userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
                    );
                    const score = requiredSkills.length > 0 ? Math.round((acquired.length / requiredSkills.length) * 100) : 0;

                    return {
                        pathId: doc.id,
                        pathName: data.title || 'Unknown Role',
                        matchScore: score,
                        missingSkills: missing,
                        acquiredSkills: acquired
                    };
                });
                results.sort((a, b) => b.matchScore - a.matchScore);
                setMatches(results);
            } catch (error) {
                console.error('Error calculating client-side matches:', error);
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error("Progress Listener Error:", err);
            setLoading(false);
        });

        return () => {
            unsubscribePredictions();
            unsubscribeProgress();
        };
    }, [user?.uid, profile?.field, profile?.skills]);

    return { matches, loading };
}
