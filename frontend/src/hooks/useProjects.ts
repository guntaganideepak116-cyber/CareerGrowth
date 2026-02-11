
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project, UserPlan } from '@/types/project';

export function useProjects() {
    const { user, profile } = useAuthContext();
    const fieldId = profile?.field;

    // We fetch all projects for the field to allow upselling (users see locked projects).
    // Locking logic is handled in the UI/Page component.

    return useQuery({
        queryKey: ['projects', fieldId],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            try {
                const projectsRef = collection(db, 'projects');

                // Query: fieldId == selectedField
                // We fetch all tiers (Free, Pro, Premium) so users can see what's available.
                const q = query(
                    projectsRef,
                    where('fieldId', '==', fieldId)
                    // orderBy('resumeStrength', 'desc') // Example sort, requires index
                );

                const snapshot = await getDocs(q);
                const projects = snapshot.docs.map(doc => doc.data() as Project);

                return projects;
            } catch (error) {
                console.error('Error fetching projects:', error);
                return [];
            }
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
