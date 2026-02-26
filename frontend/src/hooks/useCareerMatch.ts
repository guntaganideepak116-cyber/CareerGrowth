import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
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

        // 1. Listen for backend-calculated predictions (ADVANCED INTELLIGENCE)
        const predictionRef = doc(db, 'career_predictions', userId);
        const unsubsPredictions = onSnapshot(predictionRef, (predDoc) => {
            if (predDoc.exists()) {
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
            }
        });

        // 2. Original fallback/real-time logic listener
        const progressRef = doc(db, 'user_progress', userId);
        const unsubscribe = onSnapshot(progressRef, async (progressDoc) => {
            // Only run client-side calculation if backend predictions don't exist yet
            const careerPredDoc = await getDocs(query(collection(db, 'career_predictions'), where('userId', '==', userId)));
            if (!careerPredDoc.empty) return;

            setLoading(true);
            try {
                const progressData = progressDoc.exists() ? progressDoc.data() as UserProgress : null;
                const activeField = progressData?.selectedField || profile?.field;

                if (!activeField) {
                    setMatches([]);
                    setLoading(false);
                    return;
                }

                // ... rest of the existing client-side logic stays the same as fallback ...
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
                console.error('Error calculating matches:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => {
            unsubsPredictions();
            unsubscribe();
        };
    }, [user?.uid, profile?.field, profile?.skills]);

    return { matches, loading };
}
