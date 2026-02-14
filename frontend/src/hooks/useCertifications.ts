import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { Certification } from '@/types/certification';
import { getCertifications } from '@/services/apiService';

export function useCertifications() {
    const { profile } = useAuthContext();
    const fieldId = profile?.field;
    const specializationId = profile?.specialization || profile?.branch;

    return useQuery({
        queryKey: ['certifications', fieldId, specializationId],
        queryFn: async (): Promise<Certification[]> => {
            if (!fieldId) return [];

            try {
                const certs = await getCertifications({
                    field: fieldId,
                    specialization: profile?.specialization || profile?.branch || ''
                });

                if (certs && certs.length > 0) {
                    return certs.map((c: any) => ({
                        id: c.id,
                        title: c.title || c.name,
                        provider: c.organization || c.provider,
                        description: c.description || c.overview,
                        fieldId: c.fieldId || c.field,
                        specializationId: c.specializationId || c.specialization,
                        level: (c.difficultyLevel || c.level || 'intermediate').toLowerCase(),
                        planAccess: (c.level || 'free').toLowerCase(),
                        industryRecognitionLevel: (c.industryValue || c.industryRecognitionLevel || 'high').toLowerCase(),
                        validity: c.validity || 'Lifetime',
                        skillsCovered: c.skillsCovered || c.skills || [],
                        officialUrl: c.officialUrl || c.officialLink,
                        logoUrl: c.logoUrl,
                        duration: c.duration || c.timeToComplete,
                        cost: c.cost,
                        salaryImpact: c.salaryImpact || '+15%',
                        certificationType: c.certificationType || 'Professional',
                        eligibility: c.eligibility,
                        createdAt: c.createdAt
                    })) as Certification[];
                }

                return [];
            } catch (error) {
                console.error('Error in useCertifications hook:', error);
                return [];
            }
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 10
    });
}
