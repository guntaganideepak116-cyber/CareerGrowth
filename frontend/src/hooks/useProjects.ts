
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project } from '@/types/project';
import { projectsMap } from '@/data/projectsData';
import { generateContent } from '@/services/apiService';

interface DynamicProject {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    techStack: string[];
    estimatedTime: string;
    skills: string[];
    careerImpact: 'high' | 'medium' | 'low';
    realWorldApplication: string;
    resumeStrength?: number;
}

export function useProjects() {
    const { profile } = useAuthContext();
    const fieldId = profile?.field;
    const branchId = profile?.branch;
    const specializationId = branchId || 'general';

    return useQuery({
        queryKey: ['projects', fieldId, specializationId],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            let projects: Project[] = [];

            // PRIORITY 1: Try AI-Generated Content (NEW!)
            if (fieldId && specializationId) {
                try {
                    console.log(`🤖 Fetching AI projects for ${fieldId}/${specializationId}...`);
                    const dynamicProjects = await generateContent<DynamicProject[]>({
                        type: 'projects',
                        fieldId,
                        specializationId,
                    });

                    if (dynamicProjects && dynamicProjects.length > 0) {
                        console.log(`✅ Got ${dynamicProjects.length} AI-generated projects`);
                        projects = dynamicProjects.map((p, index) => ({
                            id: p.id || `ai-proj-${index}`,
                            title: p.name,
                            description: p.description,
                            fieldId: fieldId,
                            specializationId: specializationId,
                            difficulty: p.difficulty,
                            requiredSkills: p.skills || p.techStack || [],
                            planAccess: 'free', // AI projects are free by default
                            industryRelevance: p.realWorldApplication,
                            toolsRequired: p.techStack || [],
                            estimatedTime: p.estimatedTime,
                            resumeStrength: p.resumeStrength || 85,
                            careerImpact: p.careerImpact,
                            createdAt: new Date().toISOString()
                        }));

                        return projects; // Return immediately if AI succeeded
                    }
                } catch (error) {
                    console.warn('AI generation failed, falling back to Firestore:', error);
                }
            }

            // PRIORITY 2: Try Firestore
            try {
                const projectsRef = collection(db, 'projects');
                const q = query(projectsRef, where('fieldId', '==', fieldId));

                const snapshot = await getDocs(q);
                projects = snapshot.docs.map(doc => doc.data() as Project);

                // Filter by branch if applicable
                if (branchId && projects.length > 0) {
                    const branchProjects = projects.filter(p =>
                        p.specializationId === branchId ||
                        p.fieldId === branchId
                    );

                    if (branchProjects.length > 0) {
                        projects = branchProjects;
                    }
                }

                if (projects.length > 0) {
                    return projects; // Return if Firestore has data
                }
            } catch (error) {
                console.warn('Firestore fetch failed, falling back to static data:', error);
            }

            // PRIORITY 3: Fallback to Static Data
            const fId = fieldId.toLowerCase().trim();
            const bId = branchId?.toLowerCase().trim();

            let staticList: any[] = [];

            if (fId === 'engineering') {
                if (bId && projectsMap[bId]) {
                    staticList = projectsMap[bId];
                } else if (projectsMap['engineering']) {
                    staticList = projectsMap['engineering'];
                }
            } else {
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

            return projects;
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 30 // 30 minutes cache (longer since AI content is expensive)
    });
}
