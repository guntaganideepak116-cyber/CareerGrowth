
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Certification } from '@/types/certification';
import { certificationsMap } from '@/data/certificationsData';

// Helper to generate placeholders on the fly (Shared logic with seeder but safe for frontend use)
const generateFallbackCerts = (fieldId: string): Certification[] => {
    const tiers: ('free' | 'pro' | 'premium')[] = ['free', 'pro', 'premium'];
    const levels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    const certs: Certification[] = [];

    // Format field name for display
    const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1).replace(/-/g, ' ');

    for (let i = 0; i < 6; i++) {
        const tier = tiers[i % 3];
        const level = levels[i % 3];
        certs.push({
            id: `gen-${fieldId}-${i + 1}`,
            title: `${fieldName} ${level.charAt(0).toUpperCase() + level.slice(1)} Professional`,
            provider: `${fieldName} Global Institute`,
            description: `Master essential ${fieldName} skills with this comprehensive ${level}-level certification program designed for industry readiness.`,
            fieldId: fieldId,
            specializationId: 'general',
            level: level,
            planAccess: tier,
            industryRecognitionLevel: 'high',
            validity: 'Lifetime',
            skillsCovered: [fieldName, 'Professional Practice', 'Core Concepts', 'Advanced Techniques'],
            officialLink: `https://www.google.com/search?q=${encodeURIComponent(fieldName + ' ' + level + ' certification ' + (i % 2 === 0 ? 'Coursera' : 'Udemy'))}`,
            createdAt: new Date().toISOString(),
            valueScore: 85 + i,
            timeToComplete: '6-8 weeks',
            cost: tier === 'free' ? 'Free' : '$99',
            rolesUnlocked: [`${fieldName} Specialist`, 'Junior Consultant'],
            salaryRange: '$60k - $120k'
        });
    }
    return certs;
};

export function useCertifications() {
    const { profile } = useAuthContext();
    const fieldId = profile?.field;
    const branchId = profile?.branch;

    return useQuery({
        queryKey: ['certifications', fieldId, branchId],
        queryFn: async (): Promise<Certification[]> => {
            if (!fieldId) return [];

            let certifications: Certification[] = [];

            try {
                // 1. Try Firestore
                const certsRef = collection(db, 'certifications');
                const q = query(certsRef, where('fieldId', '==', fieldId));

                const snapshot = await getDocs(q);
                certifications = snapshot.docs.map(doc => doc.data() as Certification);

                // Filter by branch if applicable (and if we have generic field results that might be mixed)
                if (branchId && certifications.length > 0) {
                    const branchCerts = certifications.filter(c =>
                        c.specializationId === branchId ||
                        c.fieldId === branchId
                    );

                    // Only filter if we actually found matches
                    if (branchCerts.length > 0) {
                        certifications = branchCerts;
                    }
                }
            } catch (error) {
                console.warn('Firestore fetch failed/empty, falling back to static data');
            }

            // 2. Fallback Logic
            if (certifications.length === 0) {
                const fId = fieldId.toLowerCase().trim();
                const bId = branchId?.toLowerCase().trim();

                let staticList: any[] = [];

                // Priority 1: Exact Branch Match (Only for Engineering usually)
                if (fId === 'engineering' && bId && certificationsMap[bId]) {
                    staticList = certificationsMap[bId];
                }
                // Priority 2: Exact Field Match
                else if (certificationsMap[fId]) {
                    staticList = certificationsMap[fId];
                }
                // Priority 3: Fallback Engineering (only if actually engineering)
                else if (fId === 'engineering' && certificationsMap['engineering']) {
                    staticList = certificationsMap['engineering'];
                }

                if (staticList.length > 0) {
                    certifications = staticList.map(c => ({
                        id: c.id,
                        title: c.name,
                        provider: c.provider,
                        description: c.overview,
                        fieldId: fId,
                        specializationId: bId || 'general',
                        level: 'intermediate',
                        planAccess: c.cost === 'Free' || c.cost === '$0' ? 'free' : (parseInt(c.valueScore?.toString() || '0') > 92 ? 'premium' : 'pro'),
                        industryRecognitionLevel: c.industryAcceptance,
                        validity: 'Lifetime',
                        skillsCovered: c.skills,
                        officialLink: c.officialUrl,
                        createdAt: new Date().toISOString(),
                        valueScore: c.valueScore,
                        timeToComplete: c.timeToComplete,
                        cost: c.cost,
                        rolesUnlocked: c.rolesUnlocked,
                        salaryRange: c.salaryRange
                    }));
                } else {
                    // Priority 4: Generate Placeholders (If no map entry exists, e.g. 'medical')
                    // This ensures the user ALWAYS sees something relevant
                    console.log(`Generating fallback certifications for ${fId}`);
                    certifications = generateFallbackCerts(fId);
                }
            }

            return certifications;
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 5 // 5 minutes cache
    });
}
