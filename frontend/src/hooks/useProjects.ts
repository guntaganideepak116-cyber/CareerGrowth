
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project, UserPlan } from '@/types/project';

export function useProjects() {
    const { user, profile } = useAuthContext();
    const fieldId = profile?.field;
    const branchId = profile?.branch;

    // Helper to transform static data
    const transformStaticProjects = (staticProjects: any[], fieldId: string): Project[] => {
        return staticProjects.map(p => ({
            id: p.id,
            title: p.name,
            description: p.description,
            fieldId: fieldId,
            difficulty: p.difficulty,
            requiredSkills: p.skills,
            planAccess: p.tier ? p.tier.toLowerCase() as any : 'free',
            industryRelevance: p.realWorldApplication,
            toolsRequired: p.skills,
            estimatedTime: p.estimatedTime,
            resumeStrength: p.resumeStrength,
            careerImpact: p.careerImpact,
            createdAt: new Date().toISOString()
        }));
    };

    return useQuery({
        queryKey: ['projects', fieldId, branchId],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            let projects: Project[] = [];

            try {
                const projectsRef = collection(db, 'projects');

                // Query: fieldId == selectedField
                const q = query(
                    projectsRef,
                    where('fieldId', '==', fieldId)
                );

                const snapshot = await getDocs(q);
                projects = snapshot.docs.map(doc => doc.data() as Project);
            } catch (error) {
                console.error('Error fetching projects from Firestore:', error);
            }

            // Fallback to static data if Firestore is empty or failed
            if (projects.length === 0) {
                console.log('Using static fallback data for projects');
                const { projectsMap } = await import('@/data/projectsData');

                // Try to find projects by branch first, then field
                let staticList = [];
                if (branchId && projectsMap[branchId.toLowerCase()]) {
                    staticList = projectsMap[branchId.toLowerCase()];
                } else if (projectsMap[fieldId.toLowerCase()]) {
                    staticList = projectsMap[fieldId.toLowerCase()];
                } else {
                    // Try mapping common field IDs if direct match fails (e.g. engineering)
                    // But usually fieldId matches keys in projectsMap for non-branch fields
                }

                if (staticList.length > 0) {
                    projects = transformStaticProjects(staticList, fieldId);
                }
            }

            return projects;
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
