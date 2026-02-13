
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Certification } from '@/types/certification';
import { certificationsMap } from '@/data/certificationsData';
import { generateContent } from '@/services/apiService';

interface DynamicCertification {
    id: string;
    name: string;
    provider: string;
    cost: string;
    timeToComplete: string;
    difficulty: string;
    skills: string[];
    industryValue: string;
    officialUrl: string;
    prerequisites: string[];
    salaryImpact: string;
}

// Helper to generate placeholders on the fly
const generateFallbackCerts = (fieldId: string): Certification[] => {
    const tiers: ('free' | 'pro' | 'premium')[] = ['free', 'pro', 'premium'];
    const levels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    const certs: Certification[] = [];

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
            officialLink: `https://www.google.com/search?q=${encodeURIComponent(fieldName + ' ' + level + ' certification')}`,
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
    const specializationId = branchId || 'general';

    return useQuery({
        queryKey: ['certifications', fieldId, specializationId],
        queryFn: async (): Promise<Certification[]> => {
            if (!fieldId) return [];

            let certifications: Certification[] = [];

            // PRIORITY 1: Try AI-Generated Content with Search Verification (NEW!)
            if (fieldId && specializationId) {
                try {
                    console.log(`🤖 Fetching AI certifications for ${fieldId}/${specializationId}...`);
                    const dynamicCerts = await generateContent<DynamicCertification[]>({
                        type: 'certifications',
                        fieldId,
                        specializationId,
                    });

                    if (dynamicCerts && dynamicCerts.length > 0) {
                        console.log(`✅ Got ${dynamicCerts.length} AI-generated certifications`);
                        certifications = dynamicCerts.map((c, index) => ({
                            id: c.id || `ai-cert-${index}`,
                            title: c.name,
                            provider: c.provider,
                            description: `Industry-recognized certification for ${specializationId} professionals.`,
                            fieldId: fieldId,
                            specializationId: specializationId,
                            level: (c.difficulty?.toLowerCase() as any) || 'intermediate',
                            planAccess: 'free', // AI certs are free by default
                            industryRecognitionLevel: c.industryValue?.toLowerCase() as any || 'high',
                            validity: 'Lifetime',
                            skillsCovered: c.skills || [],
                            officialLink: c.officialUrl,
                            createdAt: new Date().toISOString(),
                            valueScore: 90,
                            timeToComplete: c.timeToComplete,
                            cost: c.cost,
                            rolesUnlocked: [`${specializationId} Specialist`],
                            salaryRange: c.salaryImpact || '+15%'
                        }));

                        return certifications; // Return immediately if AI succeeded
                    }
                } catch (error) {
                    console.warn('AI generation failed, falling back to Firestore:', error);
                }
            }

            // PRIORITY 2: Try Firestore
            try {
                const certsRef = collection(db, 'certifications');
                const q = query(certsRef, where('fieldId', '==', fieldId));

                const snapshot = await getDocs(q);
                certifications = snapshot.docs.map(doc => doc.data() as Certification);

                // Filter by branch if applicable
                if (branchId && certifications.length > 0) {
                    const branchCerts = certifications.filter(c =>
                        c.specializationId === branchId ||
                        c.fieldId === branchId
                    );

                    if (branchCerts.length > 0) {
                        certifications = branchCerts;
                    }
                }

                if (certifications.length > 0) {
                    return certifications; // Return if Firestore has data
                }
            } catch (error) {
                console.warn('Firestore fetch failed, falling back to static data:', error);
            }

            // PRIORITY 3: Fallback to Static Data
            const fId = fieldId.toLowerCase().trim();
            const bId = branchId?.toLowerCase().trim();

            let staticList: any[] = [];

            if (fId === 'engineering' && bId && certificationsMap[bId]) {
                staticList = certificationsMap[bId];
            } else if (certificationsMap[fId]) {
                staticList = certificationsMap[fId];
            } else if (fId === 'engineering' && certificationsMap['engineering']) {
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
                // PRIORITY 4: Generate Placeholders
                console.log(`Generating fallback certifications for ${fId}`);
                certifications = generateFallbackCerts(fId);
            }

            return certifications;
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 30 // 30 minutes cache (longer since AI content is expensive)
    });
}
