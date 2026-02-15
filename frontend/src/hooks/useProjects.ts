import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project } from '@/types/project';
import { getProjects } from '@/services/apiService';

export function useProjects() {
    const { profile } = useAuthContext();
    const fieldId = profile?.field;
    const specializationId = profile?.specialization || profile?.branch;

    return useQuery({
        queryKey: ['projects', fieldId, specializationId],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            try {
                const projects = await getProjects({
                    field: fieldId,
                    specialization: profile?.specialization || profile?.branch || ''
                });

                if (projects && projects.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return projects.map((p: any) => ({
                        id: p.id,
                        title: p.title || p.name,
                        description: p.description,
                        fieldId: p.fieldId || p.field,
                        specializationId: p.specializationId || p.specialization,
                        difficulty: (p.level || p.difficulty || 'intermediate').toLowerCase(),
                        requiredSkills: p.technologies || p.requiredSkills || [],
                        planAccess: p.planAccess || 'free',
                        industryRelevance: p.realWorldUseCase || p.industryTag || 'High',
                        toolsRequired: p.technologies || [],
                        estimatedTime: p.estimatedDuration || p.estimatedTime || '4 weeks',
                        resumeStrength: p.difficultyScore ? p.difficultyScore * 10 : 80,
                        careerImpact: 'high',
                        thumbnailUrl: p.thumbnailUrl,
                        createdAt: p.createdAt
                    })) as Project[];
                }

                return [];
            } catch (error) {
                console.error('Error in useProjects hook:', error);
                return [];
            }
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 10 // 10 minutes cache
    });
}
