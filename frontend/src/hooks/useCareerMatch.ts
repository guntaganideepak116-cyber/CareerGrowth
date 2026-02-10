import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface MatchResult {
    pathId: string;
    pathName: string;
    matchScore: number;
    missingSkills: string[];
    acquiredSkills: string[];
}

export function useCareerMatch() {
    const { profile } = useAuthContext();
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateMatches = async () => {
            if (!profile?.field) {
                setLoading(false);
                return;
            }

            try {
                // Fetch career paths for the field
                const pathsRef = collection(db, 'career_paths');
                const q = query(pathsRef, where('field', '==', profile.field));
                const querySnapshot = await getDocs(q);

                const results: MatchResult[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const requiredSkills: string[] = data.requiredSkills || [];
                    const userSkills: string[] = profile.skills || [];

                    // Simple intersection logic
                    const acquired = requiredSkills.filter(skill =>
                        userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
                    );

                    const missing = requiredSkills.filter(skill =>
                        !userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
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
        };

        calculateMatches();
    }, [profile?.field, profile?.skills]);

    return { matches, loading };
}
