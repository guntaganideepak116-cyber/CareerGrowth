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

// --- PRODUCTION-READY CAREER PATHS DATA ---

interface CareerPath {
    fieldId: string;
    specializationId: string;
    title: string;
    level: string;
    salaryRange: string;
    requiredSkills: string[];
    growthOutlook: string;
    industryDemandScore: number;
}

// Define career paths for each field
const careerPathsByField: Record<string, CareerPath[]> = {
    'engineering': [
        { fieldId: 'engineering', specializationId: 'cse-software-dev', title: 'Junior Software Developer', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['JavaScript', 'HTML/CSS', 'Git', 'Problem Solving'], growthOutlook: 'High', industryDemandScore: 95 },
        { fieldId: 'engineering', specializationId: 'cse-software-dev', title: 'Software Engineer', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Java/Python', 'Data Structures', 'Algorithms', 'System Design'], growthOutlook: 'Very High', industryDemandScore: 98 },
        { fieldId: 'engineering', specializationId: 'cse-software-dev', title: 'Senior Software Engineer', level: 'Senior Level', salaryRange: '₹12-20 LPA', requiredSkills: ['Architecture', 'Microservices', 'Cloud', 'Leadership'], growthOutlook: 'Very High', industryDemandScore: 96 },
        { fieldId: 'engineering', specializationId: 'cse-software-dev', title: 'Tech Lead', level: 'Lead Level', salaryRange: '₹20-30 LPA', requiredSkills: ['Team Management', 'System Architecture', 'Mentoring', 'Strategic Planning'], growthOutlook: 'High', industryDemandScore: 92 },
        { fieldId: 'engineering', specializationId: 'cse-software-dev', title: 'Engineering Manager', level: 'Executive Level', salaryRange: '₹30-50 LPA', requiredSkills: ['People Management', 'Strategy', 'Budgeting', 'Stakeholder Management'], growthOutlook: 'Stable', industryDemandScore: 88 },

        { fieldId: 'engineering', specializationId: 'cse-data-science', title: 'Data Analyst', level: 'Entry Level', salaryRange: '₹4-7 LPA', requiredSkills: ['SQL', 'Excel', 'Python', 'Statistics'], growthOutlook: 'High', industryDemandScore: 90 },
        { fieldId: 'engineering', specializationId: 'cse-data-science', title: 'Data Scientist', level: 'Mid Level', salaryRange: '₹8-15 LPA', requiredSkills: ['Machine Learning', 'Python/R', 'Statistics', 'Data Visualization'], growthOutlook: 'Very High', industryDemandScore: 94 },
        { fieldId: 'engineering', specializationId: 'cse-data-science', title: 'Senior Data Scientist', level: 'Senior Level', salaryRange: '₹15-25 LPA', requiredSkills: ['Deep Learning', 'Model Deployment', 'Big Data', 'Business Strategy'], growthOutlook: 'Very High', industryDemandScore: 93 },
        { fieldId: 'engineering', specializationId: 'cse-data-science', title: 'ML Engineer', level: 'Lead Level', salaryRange: '₹20-35 LPA', requiredSkills: ['MLOps', 'Production Systems', 'Scalability', 'Cloud Platforms'], growthOutlook: 'Very High', industryDemandScore: 95 },
        { fieldId: 'engineering', specializationId: 'cse-data-science', title: 'Chief Data Officer', level: 'Executive Level', salaryRange: '₹40-80 LPA', requiredSkills: ['Data Strategy', 'Leadership', 'Governance', 'Business Acumen'], growthOutlook: 'Stable', industryDemandScore: 85 },

        { fieldId: 'engineering', specializationId: 'cse-cybersecurity', title: 'Security Analyst', level: 'Entry Level', salaryRange: '₹4-8 LPA', requiredSkills: ['Network Security', 'Threat Analysis', 'Security Tools', 'Incident Response'], growthOutlook: 'Very High', industryDemandScore: 92 },
        { fieldId: 'engineering', specializationId: 'cse-cybersecurity', title: 'Penetration Tester', level: 'Mid Level', salaryRange: '₹8-16 LPA', requiredSkills: ['Ethical Hacking', 'Vulnerability Assessment', 'Security Frameworks', 'Reporting'], growthOutlook: 'Very High', industryDemandScore: 94 },
    ],

    'commerce': [
        { fieldId: 'commerce', specializationId: 'financial-analysis', title: 'Financial Analyst', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Excel', 'Financial Modeling', 'Accounting', 'Data Analysis'], growthOutlook: 'High', industryDemandScore: 88 },
        { fieldId: 'commerce', specializationId: 'financial-analysis', title: 'Senior Financial Analyst', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Forecasting', 'Budgeting', 'Valuation', 'Strategic Planning'], growthOutlook: 'High', industryDemandScore: 90 },
        { fieldId: 'commerce', specializationId: 'financial-analysis', title: 'Finance Manager', level: 'Senior Level', salaryRange: '₹12-20 LPA', requiredSkills: ['Team Leadership', 'Risk Management', 'Compliance', 'Stakeholder Management'], growthOutlook: 'Stable', industryDemandScore: 87 },
        { fieldId: 'commerce', specializationId: 'financial-analysis', title: 'Investment Banker', level: 'Lead Level', salaryRange: '₹20-40 LPA', requiredSkills: ['M&A', 'Capital Markets', 'Deal Structuring', 'Client Relations'], growthOutlook: 'High', industryDemandScore: 85 },
        { fieldId: 'commerce', specializationId: 'financial-analysis', title: 'Chief Financial Officer', level: 'Executive Level', salaryRange: '₹40-100 LPA', requiredSkills: ['Corporate Finance', 'Strategy', 'Leadership', 'Governance'], growthOutlook: 'Stable', industryDemandScore: 82 },

        { fieldId: 'commerce', specializationId: 'business-analytics', title: 'Business Analyst', level: 'Entry Level', salaryRange: '₹4-7 LPA', requiredSkills: ['Data Analysis', 'SQL', 'Business Intelligence', 'Communication'], growthOutlook: 'High', industryDemandScore: 91 },
        { fieldId: 'commerce', specializationId: 'business-analytics', title: 'Senior Business Analyst', level: 'Mid Level', salaryRange: '₹8-14 LPA', requiredSkills: ['Advanced Analytics', 'Tableau/Power BI', 'Process Optimization', 'Stakeholder Management'], growthOutlook: 'High', industryDemandScore: 89 },
        { fieldId: 'commerce', specializationId: 'business-analytics', title: 'Analytics Manager', level: 'Senior Level', salaryRange: '₹14-22 LPA', requiredSkills: ['Team Management', 'Strategy', 'Advanced Statistics', 'Business Acumen'], growthOutlook: 'High', industryDemandScore: 88 },

        { fieldId: 'commerce', specializationId: 'digital-marketing', title: 'Digital Marketing Executive', level: 'Entry Level', salaryRange: '₹3-5 LPA', requiredSkills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'], growthOutlook: 'Very High', industryDemandScore: 93 },
        { fieldId: 'commerce', specializationId: 'digital-marketing', title: 'Digital Marketing Manager', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Campaign Management', 'PPC', 'Marketing Automation', 'Strategy'], growthOutlook: 'Very High', industryDemandScore: 92 },
        { fieldId: 'commerce', specializationId: 'digital-marketing', title: 'Head of Digital Marketing', level: 'Senior Level', salaryRange: '₹15-30 LPA', requiredSkills: ['Leadership', 'Brand Strategy', 'Budget Management', 'Team Building'], growthOutlook: 'High', industryDemandScore: 87 },
    ],

    'medical': [
        { fieldId: 'medical', specializationId: 'clinical-research', title: 'Clinical Research Coordinator', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Research Protocols', 'Data Collection', 'Regulatory Compliance', 'Communication'], growthOutlook: 'High', industryDemandScore: 86 },
        { fieldId: 'medical', specializationId: 'clinical-research', title: 'Clinical Research Associate', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['GCP', 'Monitoring', 'Data Analysis', 'Report Writing'], growthOutlook: 'High', industryDemandScore: 88 },
        { fieldId: 'medical', specializationId: 'clinical-research', title: 'Senior Clinical Research Manager', level: 'Senior Level', salaryRange: '₹12-20 LPA', requiredSkills: ['Trial Management', 'Team Leadership', 'Regulatory Affairs', 'Strategic Planning'], growthOutlook: 'Stable', industryDemandScore: 84 },

        { fieldId: 'medical', specializationId: 'public-health', title: 'Public Health Officer', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Epidemiology', 'Health Education', 'Community Outreach', 'Data Analysis'], growthOutlook: 'High', industryDemandScore: 85 },
        { fieldId: 'medical', specializationId: 'public-health', title: 'Epidemiologist', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Disease Surveillance', 'Statistical Analysis', 'Research Methods', 'Policy Development'], growthOutlook: 'High', industryDemandScore: 87 },
        { fieldId: 'medical', specializationId: 'public-health', title: 'Public Health Director', level: 'Senior Level', salaryRange: '₹15-25 LPA', requiredSkills: ['Leadership', 'Program Management', 'Policy Making', 'Stakeholder Engagement'], growthOutlook: 'Stable', industryDemandScore: 83 },

        { fieldId: 'medical', specializationId: 'health-informatics', title: 'Health Data Analyst', level: 'Entry Level', salaryRange: '₹4-7 LPA', requiredSkills: ['Healthcare Data', 'SQL', 'Analytics Tools', 'Medical Terminology'], growthOutlook: 'Very High', industryDemandScore: 90 },
        { fieldId: 'medical', specializationId: 'health-informatics', title: 'Health Informatics Specialist', level: 'Mid Level', salaryRange: '₹8-14 LPA', requiredSkills: ['EHR Systems', 'Data Integration', 'Healthcare IT', 'Project Management'], growthOutlook: 'Very High', industryDemandScore: 91 },
        { fieldId: 'medical', specializationId: 'health-informatics', title: 'Chief Medical Information Officer', level: 'Executive Level', salaryRange: '₹25-50 LPA', requiredSkills: ['Healthcare Strategy', 'IT Leadership', 'Clinical Knowledge', 'Change Management'], growthOutlook: 'High', industryDemandScore: 86 },
    ],
};

// Generate generic paths for remaining fields
const allFieldIds = [
    'engineering', 'medical', 'science', 'arts', 'commerce', 'law', 'education', 'design',
    'defense', 'agriculture', 'hospitality', 'sports', 'vocational', 'cloud-computing',
    'devops-sre', 'blockchain-web3', 'ar-vr-mr', 'quantum-computing', 'robotics-automation',
    'bioinformatics-compbio', 'product-management', 'uiux-hci'
];

// Add generic paths for fields not yet defined
allFieldIds.forEach(fieldId => {
    if (!careerPathsByField[fieldId]) {
        const fieldName = fieldId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        careerPathsByField[fieldId] = [
            { fieldId, specializationId: `${fieldId}-general`, title: `Junior ${fieldName} Specialist`, level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Fundamentals', 'Communication', 'Problem Solving'], growthOutlook: 'High', industryDemandScore: 85 },
            { fieldId, specializationId: `${fieldId}-general`, title: `${fieldName} Specialist`, level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Advanced Skills', 'Project Management', 'Team Collaboration'], growthOutlook: 'High', industryDemandScore: 87 },
            { fieldId, specializationId: `${fieldId}-general`, title: `Senior ${fieldName} Specialist`, level: 'Senior Level', salaryRange: '₹12-20 LPA', requiredSkills: ['Expertise', 'Leadership', 'Strategic Thinking'], growthOutlook: 'Stable', industryDemandScore: 84 },
            { fieldId, specializationId: `${fieldId}-general`, title: `${fieldName} Consultant`, level: 'Lead Level', salaryRange: '₹18-30 LPA', requiredSkills: ['Consulting', 'Client Management', 'Industry Knowledge'], growthOutlook: 'Stable', industryDemandScore: 82 },
            { fieldId, specializationId: `${fieldId}-general`, title: `${fieldName} Director`, level: 'Executive Level', salaryRange: '₹30-60 LPA', requiredSkills: ['Executive Leadership', 'Strategy', 'Business Development'], growthOutlook: 'Stable', industryDemandScore: 80 },
        ];
    }
});

async function seed() {
    console.log('🌱 Seeding PRODUCTION-READY career paths...');

    try {
        // 1. Clear old career paths
        console.log('🧹 Clearing old career paths...');
        const snapshot = await db.collection('career_paths').get();
        if (snapshot.size > 0) {
            const deleteBatch = db.batch();
            snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
            await deleteBatch.commit();
            console.log(`Deleted ${snapshot.size} old career paths.`);
        }

        // 2. Insert new career paths
        let batch = db.batch();
        let batchCount = 0;
        let totalCount = 0;

        for (const [fieldId, paths] of Object.entries(careerPathsByField)) {
            for (const path of paths) {
                const docRef = db.collection('career_paths').doc();

                batch.set(docRef, {
                    ...path,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                batchCount++;
                totalCount++;

                if (batchCount >= 400) {
                    await batch.commit();
                    console.log(`...committed ${totalCount} career paths...`);
                    batch = db.batch();
                    batchCount = 0;
                }
            }
        }

        if (batchCount > 0) {
            await batch.commit();
        }

        console.log(`✅ Successfully seeded ${totalCount} production-ready career paths!`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seed();
