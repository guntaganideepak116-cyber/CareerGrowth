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
        const progressRef = doc(db, 'user_progress', userId);

        // Listen for real-time progress updates
        const unsubscribe = onSnapshot(progressRef, async (progressDoc) => {
            setLoading(true);
            try {
                const progressData = progressDoc.exists() ? progressDoc.data() as UserProgress : null;

                // Priority 1: Field from Real-time Progress, Priority 2: Field from Profile
                const activeField = progressData?.selectedField || profile?.field;

                if (!activeField) {
                    setMatches([]);
                    setLoading(false);
                    return;
                }

                // Find the correct fieldId (it might be the name or ID)
                const fieldId = fields.find(f =>
                    f.id.toLowerCase() === activeField.toLowerCase() ||
                    f.name.toLowerCase() === activeField.toLowerCase()
                )?.id || activeField.toLowerCase();

                // Fetch career paths for the field
                const pathsRef = collection(db, 'career_paths');
                const q = query(pathsRef, where('fieldId', '==', fieldId.trim()));
                const querySnapshot = await getDocs(q);

                const userSkills: string[] = [
                    ...(progressData?.completedSkills || []),
                    ...(profile?.skills || [])
                ].filter((v, i, a) => a.indexOf(v) === i); // Unique skills

                const results: MatchResult[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const requiredSkills: string[] = data.requiredSkills || [];

                    // Simple intersection logic
                    const acquired = requiredSkills.filter(skill =>
                        userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
                    );

                    const missing = requiredSkills.filter(skill =>
                        !userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
                    );

                    const score = requiredSkills.length > 0
                        ? Math.round((acquired.length / requiredSkills.length) * 100)
                        : 0;

                    return {
                        pathId: doc.id,
                        pathName: data.title || 'Unknown Role',
                        matchScore: score,
                        missingSkills: missing,
                        acquiredSkills: acquired
                    };
                });

                // Sort by match score descending
                results.sort((a, b) => b.matchScore - a.matchScore);
                setMatches(results);
            } catch (error) {
                console.error('Error calculating matches:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [user?.uid, profile?.field, profile?.skills]);

    return { matches, loading };
}
