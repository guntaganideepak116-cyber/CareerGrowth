
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project } from '@/types/project';
import { projectsMap } from '@/data/projectsData';

export function useProjects() {
    const { profile } = useAuthContext();
    const fieldId = profile?.field;
    const branchId = profile?.branch;

    return useQuery({
        queryKey: ['projects', fieldId, branchId],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            let projects: Project[] = [];

            try {
                // 1. Try Firestore
                const projectsRef = collection(db, 'projects');
                // Query by fieldId (fetching all tiers)
                const q = query(projectsRef, where('fieldId', '==', fieldId));

                const snapshot = await getDocs(q);
                projects = snapshot.docs.map(doc => doc.data() as Project);

                // Filter by branch if applicable (only for engineering usually, or if specializationId matches)
                if (branchId && projects.length > 0) {
                    // Check if specialization matches branch directly
                    const branchProjects = projects.filter(p =>
                        p.specializationId === branchId ||
                        p.fieldId === branchId // Handle case where branch is stored as fieldId in old seed
                    );

                    // Only filter if we actually found matches, otherwise keep field-level projects
                    // (This prevents showing empty list if specId missing)
                    if (branchProjects.length > 0) {
                        projects = branchProjects;
                    }
                }
            } catch (error) {
                console.warn('Firestore fetch failed/empty, falling back to static data');
            }

            // 2. Fallback to Static Data
            if (projects.length === 0) {
                const fId = fieldId.toLowerCase().trim();
                const bId = branchId?.toLowerCase().trim();

                let staticList: any[] = [];

                // Strict Logic to prevent Stale Branch Issues:
                // Only look at Branch ID if Field is Engineering. 
                // For all other fields (Medical, Arts, etc.), ignore Branch ID.

                if (fId === 'engineering') {
                    // Priority 1: Specific Branch (CSE, ECE, etc.)
                    if (bId && projectsMap[bId]) {
                        staticList = projectsMap[bId];
                    }
                    // Priority 2: Generic Engineering
                    else if (projectsMap['engineering']) {
                        staticList = projectsMap['engineering'];
                    }
                } else {
                    // Non-Engineering: Use Field ID directly
                    if (projectsMap[fId]) {
                        staticList = projectsMap[fId];
                    }
                }

                if (staticList.length > 0) {
                    projects = staticList.map(p => ({
                        id: p.id,
                        title: p.name,
                        description: p.description,
                        fieldId: fId,
                        specializationId: bId || 'general',
                        difficulty: p.difficulty || 'intermediate',
                        requiredSkills: p.skills || [],
                        planAccess: (p.tier?.toLowerCase() as any) || 'free',
                        industryRelevance: p.realWorldApplication || 'High industry demand',
                        toolsRequired: p.skills || [],
                        estimatedTime: p.estimatedTime || '4 weeks',
                        resumeStrength: p.resumeStrength || 80,
                        careerImpact: p.careerImpact || 'high',
                        createdAt: new Date().toISOString()
                    }));
                }
            }

            return projects;
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 5 // 5 minutes cache
    });
}
