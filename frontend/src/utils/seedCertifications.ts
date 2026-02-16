
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { certificationsMap } from '@/data/certificationsData';
import { fields } from '@/data/fieldsData';
import { Certification } from '@/types/certification';

// Mappings for branches to fields (if certifications are stored under branch keys)
const branchToFieldMap: Record<string, string> = {
    cse: 'engineering',
    ece: 'engineering',
    eee: 'engineering',
    mechanical: 'engineering',
    civil: 'engineering',
};

// Generate placeholders for new fields missing in original data
const generatePlaceholderCertifications = (fieldId: string, fieldName: string): Certification[] => {
    const tiers: ('free' | 'pro' | 'premium')[] = ['free', 'pro', 'premium'];
    const levels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    const certs: Certification[] = [];

    for (let i = 0; i < 6; i++) {
        const tier = tiers[i % 3];
        const level = levels[i % 3];
        certs.push({
            id: `${fieldId}-cert-${i + 1}`,
            title: `${fieldName} ${level.charAt(0).toUpperCase() + level.slice(1)} Certification`,
            provider: `${fieldName} Institute of Technology`,
            description: `A comprehensive ${level} certification in ${fieldName} covering essential skills and industry practices.`,
            fieldId: fieldId,
            field: fieldId, // Mandatory property
            specializationId: 'general',
            specialization: 'general', // Mandatory property
            level: level,
            planAccess: tier,
            industryRecognitionLevel: 'high',
            validity: 'Lifetime',
            skillsCovered: [fieldName, 'Analysis', 'Professional Practice'],
            officialUrl: `https://www.google.com/search?q=${encodeURIComponent(fieldName + ' ' + level + ' certification')}`,
            createdAt: new Date().toISOString(),
            // Mapped fields
            valueScore: 80 + i,
            timeToComplete: '4-8 weeks',
            cost: tier === 'free' ? 'Free' : '$49-$99',
            rolesUnlocked: [`${fieldName} Specialist`],
            salaryRange: '$60k-$100k'
        } as Certification & { field: string; specialization: string });
    }
    return certs;
};

export const seedCertifications = async () => {
    console.log('Starting certification seeding...');

    let batch = writeBatch(db);
    let operationCount = 0;

    const commitBatch = async () => {
        await batch.commit();
        batch = writeBatch(db);
        operationCount = 0;
    };

    const certsCollection = collection(db, 'certifications');

    // 1. Process existing certifications from certificationsMap
    for (const [key, certList] of Object.entries(certificationsMap)) {
        const targetFieldId = branchToFieldMap[key] || key;

        // Validate field ID
        const isValidField = fields.some(f => f.id === targetFieldId);
        if (!isValidField) {
            // Keep as is if valid? Or try lowercase?
            // Assuming map keys are mostly correct or branches
            if (!branchToFieldMap[key]) {
                // If not a known branch and not a known field, skipping or treating as field
                // e.g. "engineering" key in map
            }
        }

        for (const c of certList) {
            // Map old structure to new structure
            const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
                'High': 'advanced', 'Medium': 'intermediate', 'Low': 'beginner'
            };

            const certData: Record<string, unknown> = {
                id: c.id,
                title: c.name,
                provider: c.provider,
                description: c.overview,
                fieldId: targetFieldId,
                field: targetFieldId, // Mandatory property
                specializationId: key !== targetFieldId ? key : 'general',
                specialization: key !== targetFieldId ? key : 'general', // Mandatory property
                level: 'intermediate', // Default or derive
                planAccess: c.cost === 'Free' || c.cost === '$0' ? 'free' : (parseInt(c.valueScore.toString()) > 90 ? 'premium' : 'pro'), // Infer plan from cost/value
                officialLink: c.officialUrl,
                officialUrl: c.officialUrl, // Save as both for safety
                industryRecognitionLevel: c.industryAcceptance,
                validity: 'Lifetime', // Default
                skillsCovered: c.skills,
                createdAt: new Date().toISOString(),

                valueScore: c.valueScore,
                timeToComplete: c.timeToComplete,
                cost: c.cost,
                rolesUnlocked: c.rolesUnlocked,
                salaryRange: c.salaryRange
            };

            const docRef = doc(certsCollection, c.id);
            batch.set(docRef, certData);
            operationCount++;

            if (operationCount >= 450) await commitBatch();
        }
    }

    // 2. Ensure all 22 fields have certifications
    const existingKeys = Object.keys(certificationsMap);
    const coveredFieldIds = new Set<string>();
    existingKeys.forEach(k => {
        coveredFieldIds.add(branchToFieldMap[k] || k);
    });

    for (const field of fields) {
        if (!coveredFieldIds.has(field.id)) {
            console.log(`Generating certifications for missing field: ${field.name} (${field.id})`);
            const generated = generatePlaceholderCertifications(field.id, field.name);
            for (const c of generated) {
                const docRef = doc(certsCollection, c.id);
                batch.set(docRef, c);
                operationCount++;
                if (operationCount >= 450) await commitBatch();
            }
        }
    }

    if (operationCount > 0) {
        await commitBatch();
    }

    console.log('Certification seeding complete.');
};
