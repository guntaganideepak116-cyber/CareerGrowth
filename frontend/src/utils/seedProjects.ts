
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { projectsMap } from '@/data/projectsData';
import { fields } from '@/data/fieldsData';
import { Project } from '@/types/project';

// Mappings for branches to fields (if projects are stored under branch keys)
const branchToFieldMap: Record<string, string> = {
    cse: 'engineering',
    ece: 'engineering',
    eee: 'engineering',
    mechanical: 'engineering',
    civil: 'engineering',
};

// Generate placeholders for new fields missing in original data
const generatePlaceholderProjects = (fieldId: string, fieldName: string): Project[] => {
    const tiers: ('free' | 'pro' | 'premium')[] = ['free', 'pro', 'premium'];
    const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    const projects: Project[] = [];

    for (let i = 0; i < 6; i++) {
        const tier = tiers[i % 3];
        const difficulty = difficulties[i % 3];
        projects.push({
            id: `${fieldId}-generated-${i + 1}`,
            title: `${fieldName} Project ${i + 1}: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
            description: `Master ${fieldName} with this ${difficulty} level project. Involves real-world scenarios and extensive tool usage.`,
            fieldId: fieldId,
            specializationId: 'general',
            difficulty: difficulty,
            requiredSkills: ['Fundamentals', 'Analysis', 'Implementation'],
            planAccess: tier,
            industryRelevance: 'High demand in current job market',
            toolsRequired: ['Standard Tools', 'IDE'],
            estimatedTime: '4-6 weeks',
            resumeStrength: 75 + (i * 2),
            careerImpact: i % 2 === 0 ? 'high' : 'medium',
            createdAt: new Date().toISOString()
        });
    }
    return projects;
};

export const seedProjects = async () => {
    console.log('Starting project seeding...');

    let batch = writeBatch(db);
    let operationCount = 0;

    const commitBatch = async () => {
        await batch.commit();
        batch = writeBatch(db);
        operationCount = 0;
    };

    const projectsCollection = collection(db, 'projects');

    // 1. Process existing projects from projectsMap
    for (const [key, projectList] of Object.entries(projectsMap)) {
        let targetFieldId = branchToFieldMap[key] || key;

        // Validate field ID
        const isValidField = fields.some(f => f.id === targetFieldId);
        if (!isValidField) {
            // Try to handle lowercase mismatch or skip
            targetFieldId = targetFieldId.toLowerCase();
        }

        const priceMap: Record<string, 'free' | 'pro' | 'premium'> = {
            'Free': 'free', 'Pro': 'pro', 'Premium': 'premium'
        };

        for (const p of projectList) {
            // Map old structure to new structure
            const projectData: Project = {
                id: p.id,
                title: p.name,
                description: p.description,
                fieldId: targetFieldId,
                specializationId: key !== targetFieldId ? key : undefined,
                difficulty: p.difficulty,
                requiredSkills: p.skills,
                planAccess: p.tier ? priceMap[p.tier] : 'free',
                industryRelevance: p.realWorldApplication,
                toolsRequired: p.skills,
                estimatedTime: p.estimatedTime,
                resumeStrength: p.resumeStrength,
                careerImpact: p.careerImpact,
                createdAt: new Date().toISOString()
            };

            const docRef = doc(projectsCollection, p.id);
            batch.set(docRef, projectData);
            operationCount++;

            if (operationCount >= 450) await commitBatch();
        }
    }

    // 2. Ensure all 22 fields have projects
    const validFieldIds = fields.map(f => f.id);
    // Get fields covered in step 1
    const existingKeys = Object.keys(projectsMap);
    const coveredFieldIds = new Set<string>();
    existingKeys.forEach(k => {
        coveredFieldIds.add(branchToFieldMap[k] || k);
    });

    for (const field of fields) {
        if (!coveredFieldIds.has(field.id)) {
            console.log(`Generating projects for missing field: ${field.name} (${field.id})`);
            const generated = generatePlaceholderProjects(field.id, field.name);
            for (const p of generated) {
                const docRef = doc(projectsCollection, p.id);
                batch.set(docRef, p);
                operationCount++;
                if (operationCount >= 450) await commitBatch();
            }
        }
    }

    if (operationCount > 0) {
        await commitBatch();
    }

    console.log('Seeding complete.');
};
