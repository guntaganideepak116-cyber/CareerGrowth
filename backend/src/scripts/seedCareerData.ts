import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Firebase
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// --- Data ---
const fields = [
    { id: 'engineering', name: 'Engineering & Technology', description: 'Build the future with technology and innovation' },
    { id: 'medical', name: 'Medical & Health Sciences', description: 'Healthcare, wellness, and life sciences careers' },
    { id: 'science', name: 'Science & Research', description: 'Research, discovery, and scientific innovation' },
    { id: 'arts', name: 'Arts, Humanities & Degree', description: 'Liberal arts, humanities, and social sciences' },
    { id: 'commerce', name: 'Commerce, Business & Management', description: 'Business, finance, and entrepreneurship' },
    { id: 'law', name: 'Law & Public Services', description: 'Legal profession and public administration' },
    { id: 'education', name: 'Education & Teaching', description: 'Teaching, training, and educational leadership' },
    { id: 'design', name: 'Design, Media & Creative Arts', description: 'Visual design, media production, and creativity' },
    { id: 'defense', name: 'Defense, Security & Physical Services', description: 'Armed forces, security, and emergency services' },
    { id: 'agriculture', name: 'Agriculture & Environmental Studies', description: 'Farming, sustainability, and environmental science' },
    { id: 'hospitality', name: 'Hospitality, Travel & Tourism', description: 'Hotels, travel, events, and tourism management' },
    { id: 'sports', name: 'Sports, Fitness & Lifestyle', description: 'Sports science, fitness, and wellness coaching' },
    { id: 'vocational', name: 'Skill-Based & Vocational Fields', description: 'Technical trades, certifications, and practical skills' },
    { id: 'cloud-computing', name: 'Cloud Computing', description: 'Cloud infrastructure, platforms, and services' },
    { id: 'devops-sre', name: 'DevOps & Site Reliability Engineering', description: 'Automation, CI/CD, and system reliability' },
    { id: 'blockchain-web3', name: 'Blockchain & Web3', description: 'Decentralized applications and smart contracts' },
    { id: 'ar-vr-mr', name: 'AR / VR / Mixed Reality', description: 'Immersive experiences and spatial computing' },
    { id: 'quantum-computing', name: 'Quantum Computing', description: 'Quantum algorithms and quantum information science' },
    { id: 'robotics-automation', name: 'Robotics & Automation', description: 'Industrial robots, autonomous systems, and automation' },
    { id: 'bioinformatics-compbio', name: 'Bioinformatics & Computational Biology', description: 'Genomics, proteomics, and computational life sciences' },
    { id: 'product-management', name: 'Product Management & Tech Leadership', description: 'Product strategy, roadmapping, and tech leadership' },
    { id: 'uiux-hci', name: 'UI/UX & Human–Computer Interaction', description: 'User experience design and human-centered computing' }
];

const specializationsMap: Record<string, any[]> = {
    engineering: [
        { id: 'cse-software-dev', name: 'Software Development & Programming', description: 'Master programming fundamentals' },
        { id: 'cse-data-science', name: 'Data Science & Big Data', description: 'Extract insights from massive datasets' },
        { id: 'cse-cybersecurity', name: 'Cybersecurity & Ethical Hacking', description: 'Protect systems and networks' },
        { id: 'cse-cloud', name: 'Cloud Computing & DevOps', description: 'Scalable cloud infrastructure' },
        { id: 'ece-vlsi', name: 'VLSI Design', description: 'Chip design and engineering' },
        { id: 'civil-structural', name: 'Structural Engineering', description: 'Design buildings and bridges' },
        { id: 'mech-robotics', name: 'Robotics & Automation', description: 'Design robotic systems' }
    ],
    medical: [
        { id: 'clinical-research', name: 'Clinical Research', description: 'Manage clinical trials' },
        { id: 'public-health', name: 'Public Health', description: 'Improve population health' },
        { id: 'health-informatics', name: 'Health Informatics', description: 'Healthcare IT systems' }
    ],
    commerce: [
        { id: 'financial-analysis', name: 'Financial Analysis', description: 'Analyze markets and investments' },
        { id: 'business-analytics', name: 'Business Analytics', description: 'Data-driven business decisions' },
        { id: 'digital-marketing', name: 'Digital Marketing', description: 'Online marketing strategies' }
    ],
    'cloud-computing': [
        { id: 'cloud-architecture', name: 'Cloud Architecture', description: 'Design enterprise cloud solutions' },
        { id: 'cloud-security', name: 'Cloud Security', description: 'Secure cloud environments' },
        { id: 'serverless', name: 'Serverless Computing', description: 'Build serverless apps' }
    ],
    'devops-sre': [
        { id: 'ci-cd', name: 'CI/CD Pipelines', description: 'Automate build and deployment' },
        { id: 'k8s', name: 'Kubernetes & Containers', description: 'Container orchestration' }
    ],
    // Fallback handled logic below
};

function generateCareerPaths(spec: any, fieldId: string) {
    const roles = [];
    const name = spec.name;
    const base = name.split(' ')[0];

    // Role Logic
    let titles = [];
    if (name.match(/Software|Development/i)) titles = ['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'];
    else if (name.match(/Data|Analytics/i)) titles = ['Data Analyst', 'Data Engineer', 'Data Scientist', 'Senior Data Scientist', 'Head of Data'];
    else if (name.match(/Security|Cyber/i)) titles = ['Security Analyst', 'Pen Tester', 'Security Engineer', 'Security Architect', 'CISO'];
    else if (name.match(/Cloud/i)) titles = ['Cloud Associate', 'Cloud Engineer', 'Cloud Architect', 'Senior Architect', 'Director of Cloud'];
    else if (name.match(/Product/i)) titles = ['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP Product'];
    else if (name.match(/Design|UI/i)) titles = ['UI Designer', 'Product Designer', 'Senior Designer', 'Design Lead', 'Creative Director'];
    else if (name.match(/Health|Medical/i)) titles = ['Research Assistant', 'Clinical Specialist', 'Health Analyst', 'Senior Consultant', 'Director'];
    else titles = [`Junior ${base} Specialist`, `${base} Specialist`, `Senior ${base} Specialist`, `${base} Consultant`, `${base} Lead`];

    const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead Level', 'Executive Level'];
    const salaries = ['$50k - $80k', '$80k - $120k', '$120k - $160k', '$160k - $200k', '$200k+'];
    const growth = ['Steady', 'High', 'Very High', 'Stable', 'Growing'];

    return titles.map((title, i) => ({
        fieldId,
        specializationId: spec.id,
        title,
        level: levels[i],
        salaryRange: salaries[i],
        requiredSkills: [`${base} Basics`, 'Project Mgmt', 'Communication', 'Problem Solving'],
        growthOutlook: growth[i],
        industryDemandScore: 85 + (i * 2),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }));
}

async function seed() {
    console.log('🌱 Starting Career Data Seed (Fields, Specs, Paths)...');

    try {
        // 1. Delete Old Data
        console.log('🧹 Cleaning old data...');
        const collections = ['fields', 'specializations', 'career_paths'];
        for (const col of collections) {
            const snap = await db.collection(col).get();
            if (!snap.empty) {
                const batch = db.batch();
                snap.docs.forEach(d => batch.delete(d.ref));
                await batch.commit();
                console.log(`Deleted ${snap.size} docs from ${col}`);
            }
        }

        // 2. Prepare Batches
        let batch = db.batch();
        let batchCount = 0;
        let totalDocs = 0;

        for (const field of fields) {
            // Add Field
            batch.set(db.collection('fields').doc(field.id), field);
            batchCount++; totalDocs++;

            // Get Specs
            const specs = specializationsMap[field.id] || [
                { id: `${field.id}-general`, name: `${field.name} Generalist`, description: `General path in ${field.name}` },
                { id: `${field.id}-specialist`, name: `${field.name} Specialist`, description: `Specialized path in ${field.name}` }
            ];

            for (const spec of specs) {
                // Add Spec
                batch.set(db.collection('specializations').doc(spec.id), { ...spec, fieldId: field.id });
                batchCount++; totalDocs++;

                // Add Paths
                const paths = generateCareerPaths(spec, field.id);
                for (const pathData of paths) {
                    batch.set(db.collection('career_paths').doc(), pathData);
                    batchCount++; totalDocs++;

                    if (batchCount >= 400) {
                        await batch.commit();
                        console.log(`...Committed batch of 400 docs...`);
                        batch = db.batch();
                        batchCount = 0;
                    }
                }
            }
        }

        if (batchCount > 0) {
            await batch.commit();
            console.log(`...Committed final batch of ${batchCount} docs...`);
        }

        console.log(`✅ Successfully seeded ${totalDocs} documents.`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seed();
