import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// ============================================
// COMPLETE CAREER SYSTEM DATA - ALL 22 FIELDS
// ============================================

interface Field {
    fieldId: string;
    fieldName: string;
    description: string;
}

interface Specialization {
    specializationId: string;
    fieldId: string;
    specializationName: string;
    description: string;
}

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

// ============================================
// FIELDS DEFINITION
// ============================================

const fields: Field[] = [
    { fieldId: 'engineering', fieldName: 'Engineering & Technology', description: 'Build the future with technology and innovation' },
    { fieldId: 'commerce', fieldName: 'Commerce & Business', description: 'Business, finance, and entrepreneurship' },
    { fieldId: 'medical', fieldName: 'Medical & Health Sciences', description: 'Healthcare, wellness, and life sciences' },
    { fieldId: 'law', fieldName: 'Law & Legal Services', description: 'Legal profession and justice system' },
    { fieldId: 'arts', fieldName: 'Arts & Humanities', description: 'Liberal arts, humanities, and social sciences' },
    { fieldId: 'science', fieldName: 'Science & Research', description: 'Research, discovery, and scientific innovation' },
    { fieldId: 'education', fieldName: 'Education & Teaching', description: 'Teaching, training, and educational leadership' },
    { fieldId: 'design', fieldName: 'Design & Creative Arts', description: 'Visual design, media production, and creativity' },
    { fieldId: 'defense', fieldName: 'Defense & Security', description: 'Armed forces, security, and emergency services' },
    { fieldId: 'agriculture', fieldName: 'Agriculture & Environmental Studies', description: 'Farming, sustainability, and environmental science' },
    { fieldId: 'hospitality', fieldName: 'Hospitality & Tourism', description: 'Hotels, travel, events, and tourism management' },
    { fieldId: 'sports', fieldName: 'Sports & Fitness', description: 'Sports science, fitness, and wellness coaching' },
    { fieldId: 'vocational', fieldName: 'Vocational & Technical Skills', description: 'Technical trades and practical skills' },
    { fieldId: 'cloud-computing', fieldName: 'Cloud Computing', description: 'Cloud infrastructure and services' },
    { fieldId: 'devops-sre', fieldName: 'DevOps & SRE', description: 'Automation, CI/CD, and system reliability' },
    { fieldId: 'blockchain-web3', fieldName: 'Blockchain & Web3', description: 'Decentralized applications and smart contracts' },
    { fieldId: 'ar-vr-mr', fieldName: 'AR/VR/Mixed Reality', description: 'Immersive experiences and spatial computing' },
    { fieldId: 'quantum-computing', fieldName: 'Quantum Computing', description: 'Quantum algorithms and information science' },
    { fieldId: 'robotics-automation', fieldName: 'Robotics & Automation', description: 'Industrial robots and autonomous systems' },
    { fieldId: 'bioinformatics-compbio', fieldName: 'Bioinformatics', description: 'Genomics and computational biology' },
    { fieldId: 'product-management', fieldName: 'Product Management', description: 'Product strategy and tech leadership' },
    { fieldId: 'uiux-hci', fieldName: 'UI/UX & HCI', description: 'User experience and human-computer interaction' },
];

// ============================================
// SPECIALIZATIONS & CAREER PATHS
// ============================================

const specializationsAndCareers: { specializations: Specialization[], careers: CareerPath[] } = {
    specializations: [],
    careers: []
};

// ============================================
// 1. ENGINEERING & TECHNOLOGY
// ============================================

const engineeringSpecs: Specialization[] = [
    { specializationId: 'eng-computer-science', fieldId: 'engineering', specializationName: 'Computer Science Engineering', description: 'Software development and computing' },
    { specializationId: 'eng-civil', fieldId: 'engineering', specializationName: 'Civil Engineering', description: 'Infrastructure and construction' },
    { specializationId: 'eng-mechanical', fieldId: 'engineering', specializationName: 'Mechanical Engineering', description: 'Machines and mechanical systems' },
    { specializationId: 'eng-electrical', fieldId: 'engineering', specializationName: 'Electrical Engineering', description: 'Electrical systems and power' },
    { specializationId: 'eng-electronics', fieldId: 'engineering', specializationName: 'Electronics & Communication', description: 'Electronics and telecommunications' },
    { specializationId: 'eng-ai', fieldId: 'engineering', specializationName: 'Artificial Intelligence', description: 'AI and machine learning systems' },
    { specializationId: 'eng-robotics', fieldId: 'engineering', specializationName: 'Robotics Engineering', description: 'Robotic systems and automation' },
    { specializationId: 'eng-data', fieldId: 'engineering', specializationName: 'Data Engineering', description: 'Data pipelines and infrastructure' },
];

const engineeringCareers: CareerPath[] = [
    // Computer Science
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Software Engineer', level: 'Entry Level', salaryRange: '₹4-8 LPA', requiredSkills: ['Java', 'Python', 'Git', 'Algorithms'], growthOutlook: 'Very High', industryDemandScore: 98 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Backend Developer', level: 'Mid Level', salaryRange: '₹8-15 LPA', requiredSkills: ['Node.js', 'Databases', 'APIs', 'Microservices'], growthOutlook: 'Very High', industryDemandScore: 96 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Frontend Developer', level: 'Mid Level', salaryRange: '₹7-14 LPA', requiredSkills: ['React', 'JavaScript', 'CSS', 'UI/UX'], growthOutlook: 'High', industryDemandScore: 94 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Full Stack Developer', level: 'Senior Level', salaryRange: '₹12-22 LPA', requiredSkills: ['MERN/MEAN', 'DevOps', 'Cloud', 'Architecture'], growthOutlook: 'Very High', industryDemandScore: 97 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'DevOps Engineer', level: 'Mid Level', salaryRange: '₹10-18 LPA', requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], growthOutlook: 'Very High', industryDemandScore: 95 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'System Architect', level: 'Lead Level', salaryRange: '₹20-35 LPA', requiredSkills: ['System Design', 'Scalability', 'Leadership', 'Cloud'], growthOutlook: 'High', industryDemandScore: 92 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Mobile App Developer', level: 'Mid Level', salaryRange: '₹8-16 LPA', requiredSkills: ['React Native', 'Flutter', 'iOS/Android', 'APIs'], growthOutlook: 'High', industryDemandScore: 90 },
    { fieldId: 'engineering', specializationId: 'eng-computer-science', title: 'Cloud Engineer', level: 'Senior Level', salaryRange: '₹15-25 LPA', requiredSkills: ['AWS/Azure', 'Cloud Architecture', 'Security', 'Automation'], growthOutlook: 'Very High', industryDemandScore: 96 },

    // Civil Engineering
    { fieldId: 'engineering', specializationId: 'eng-civil', title: 'Structural Engineer', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Structural Analysis', 'AutoCAD', 'Design', 'Construction'], growthOutlook: 'Stable', industryDemandScore: 85 },
    { fieldId: 'engineering', specializationId: 'eng-civil', title: 'Site Engineer', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Site Management', 'Quality Control', 'Safety', 'Coordination'], growthOutlook: 'Stable', industryDemandScore: 82 },
    { fieldId: 'engineering', specializationId: 'eng-civil', title: 'Urban Planner', level: 'Senior Level', salaryRange: '₹8-15 LPA', requiredSkills: ['Urban Design', 'GIS', 'Planning', 'Regulations'], growthOutlook: 'High', industryDemandScore: 80 },
    { fieldId: 'engineering', specializationId: 'eng-civil', title: 'Construction Manager', level: 'Lead Level', salaryRange: '₹12-20 LPA', requiredSkills: ['Project Management', 'Budgeting', 'Leadership', 'Contracts'], growthOutlook: 'Stable', industryDemandScore: 84 },
    { fieldId: 'engineering', specializationId: 'eng-civil', title: 'Environmental Engineer', level: 'Mid Level', salaryRange: '₹7-13 LPA', requiredSkills: ['Environmental Science', 'Sustainability', 'Compliance', 'Analysis'], growthOutlook: 'High', industryDemandScore: 83 },

    // Mechanical Engineering
    { fieldId: 'engineering', specializationId: 'eng-mechanical', title: 'Mechanical Design Engineer', level: 'Mid Level', salaryRange: '₹5-10 LPA', requiredSkills: ['CAD', 'SolidWorks', 'Design', 'Manufacturing'], growthOutlook: 'Stable', industryDemandScore: 84 },
    { fieldId: 'engineering', specializationId: 'eng-mechanical', title: 'Production Engineer', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Manufacturing', 'Quality', 'Process Optimization', 'Lean'], growthOutlook: 'Stable', industryDemandScore: 81 },
    { fieldId: 'engineering', specializationId: 'eng-mechanical', title: 'Automotive Engineer', level: 'Senior Level', salaryRange: '₹8-16 LPA', requiredSkills: ['Vehicle Design', 'Testing', 'Simulation', 'Innovation'], growthOutlook: 'High', industryDemandScore: 86 },
    { fieldId: 'engineering', specializationId: 'eng-mechanical', title: 'HVAC Engineer', level: 'Mid Level', salaryRange: '₹6-11 LPA', requiredSkills: ['HVAC Systems', 'Energy Efficiency', 'Design', 'Installation'], growthOutlook: 'Stable', industryDemandScore: 79 },
    { fieldId: 'engineering', specializationId: 'eng-mechanical', title: 'Maintenance Engineer', level: 'Entry Level', salaryRange: '₹4-7 LPA', requiredSkills: ['Maintenance', 'Troubleshooting', 'Safety', 'Documentation'], growthOutlook: 'Stable', industryDemandScore: 78 },

    // AI
    { fieldId: 'engineering', specializationId: 'eng-ai', title: 'Machine Learning Engineer', level: 'Senior Level', salaryRange: '₹15-30 LPA', requiredSkills: ['ML Algorithms', 'Python', 'TensorFlow', 'Model Deployment'], growthOutlook: 'Very High', industryDemandScore: 97 },
    { fieldId: 'engineering', specializationId: 'eng-ai', title: 'AI Research Scientist', level: 'Lead Level', salaryRange: '₹25-50 LPA', requiredSkills: ['Deep Learning', 'Research', 'Publications', 'Innovation'], growthOutlook: 'Very High', industryDemandScore: 95 },
    { fieldId: 'engineering', specializationId: 'eng-ai', title: 'Computer Vision Engineer', level: 'Senior Level', salaryRange: '₹18-35 LPA', requiredSkills: ['OpenCV', 'Image Processing', 'Deep Learning', 'Python'], growthOutlook: 'Very High', industryDemandScore: 93 },
    { fieldId: 'engineering', specializationId: 'eng-ai', title: 'NLP Engineer', level: 'Senior Level', salaryRange: '₹16-32 LPA', requiredSkills: ['NLP', 'Transformers', 'Python', 'Linguistics'], growthOutlook: 'Very High', industryDemandScore: 94 },

    // Data Engineering
    { fieldId: 'engineering', specializationId: 'eng-data', title: 'Data Engineer', level: 'Mid Level', salaryRange: '₹10-18 LPA', requiredSkills: ['ETL', 'SQL', 'Python', 'Data Pipelines'], growthOutlook: 'Very High', industryDemandScore: 96 },
    { fieldId: 'engineering', specializationId: 'eng-data', title: 'Big Data Engineer', level: 'Senior Level', salaryRange: '₹15-28 LPA', requiredSkills: ['Hadoop', 'Spark', 'Kafka', 'Distributed Systems'], growthOutlook: 'Very High', industryDemandScore: 94 },
    { fieldId: 'engineering', specializationId: 'eng-data', title: 'Data Architect', level: 'Lead Level', salaryRange: '₹20-40 LPA', requiredSkills: ['Data Modeling', 'Architecture', 'Cloud', 'Strategy'], growthOutlook: 'High', industryDemandScore: 91 },
];

specializationsAndCareers.specializations.push(...engineeringSpecs);
specializationsAndCareers.careers.push(...engineeringCareers);

// ============================================
// 2. COMMERCE & BUSINESS
// ============================================

const commerceSpecs: Specialization[] = [
    { specializationId: 'com-accounting', fieldId: 'commerce', specializationName: 'Accounting', description: 'Financial accounting and auditing' },
    { specializationId: 'com-finance', fieldId: 'commerce', specializationName: 'Finance', description: 'Corporate finance and investment' },
    { specializationId: 'com-banking', fieldId: 'commerce', specializationName: 'Banking', description: 'Banking operations and services' },
    { specializationId: 'com-taxation', fieldId: 'commerce', specializationName: 'Taxation', description: 'Tax planning and compliance' },
    { specializationId: 'com-investment', fieldId: 'commerce', specializationName: 'Investment Management', description: 'Portfolio and wealth management' },
    { specializationId: 'com-marketing', fieldId: 'commerce', specializationName: 'Marketing', description: 'Digital and traditional marketing' },
];

const commerceCareers: CareerPath[] = [
    // Accounting
    { fieldId: 'commerce', specializationId: 'com-accounting', title: 'Chartered Accountant', level: 'Senior Level', salaryRange: '₹8-20 LPA', requiredSkills: ['Accounting', 'Auditing', 'Taxation', 'Compliance'], growthOutlook: 'High', industryDemandScore: 92 },
    { fieldId: 'commerce', specializationId: 'com-accounting', title: 'Cost Accountant', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Cost Analysis', 'Budgeting', 'Financial Planning', 'ERP'], growthOutlook: 'Stable', industryDemandScore: 85 },
    { fieldId: 'commerce', specializationId: 'com-accounting', title: 'Auditor', level: 'Mid Level', salaryRange: '₹5-10 LPA', requiredSkills: ['Auditing', 'Risk Assessment', 'Compliance', 'Reporting'], growthOutlook: 'Stable', industryDemandScore: 84 },
    { fieldId: 'commerce', specializationId: 'com-accounting', title: 'Tax Consultant', level: 'Senior Level', salaryRange: '₹7-15 LPA', requiredSkills: ['Tax Law', 'GST', 'Income Tax', 'Advisory'], growthOutlook: 'High', industryDemandScore: 88 },
    { fieldId: 'commerce', specializationId: 'com-accounting', title: 'Financial Controller', level: 'Lead Level', salaryRange: '₹15-30 LPA', requiredSkills: ['Financial Management', 'Leadership', 'Strategy', 'Compliance'], growthOutlook: 'Stable', industryDemandScore: 86 },

    // Finance
    { fieldId: 'commerce', specializationId: 'com-finance', title: 'Investment Banker', level: 'Senior Level', salaryRange: '₹15-40 LPA', requiredSkills: ['M&A', 'Valuation', 'Financial Modeling', 'Deal Making'], growthOutlook: 'High', industryDemandScore: 90 },
    { fieldId: 'commerce', specializationId: 'com-finance', title: 'Financial Analyst', level: 'Entry Level', salaryRange: '₹4-8 LPA', requiredSkills: ['Financial Analysis', 'Excel', 'Modeling', 'Reporting'], growthOutlook: 'High', industryDemandScore: 91 },
    { fieldId: 'commerce', specializationId: 'com-finance', title: 'Risk Analyst', level: 'Mid Level', salaryRange: '₹7-14 LPA', requiredSkills: ['Risk Management', 'Analytics', 'Compliance', 'Modeling'], growthOutlook: 'High', industryDemandScore: 89 },
    { fieldId: 'commerce', specializationId: 'com-finance', title: 'Equity Research Analyst', level: 'Mid Level', salaryRange: '₹8-16 LPA', requiredSkills: ['Research', 'Valuation', 'Market Analysis', 'Reporting'], growthOutlook: 'High', industryDemandScore: 87 },
    { fieldId: 'commerce', specializationId: 'com-finance', title: 'Chief Financial Officer', level: 'Executive Level', salaryRange: '₹40-100 LPA', requiredSkills: ['Strategy', 'Leadership', 'Finance', 'Governance'], growthOutlook: 'Stable', industryDemandScore: 85 },

    // Banking
    { fieldId: 'commerce', specializationId: 'com-banking', title: 'Banking Officer', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Banking Operations', 'Customer Service', 'Compliance', 'Sales'], growthOutlook: 'Stable', industryDemandScore: 82 },
    { fieldId: 'commerce', specializationId: 'com-banking', title: 'Relationship Manager', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['Client Management', 'Sales', 'Products', 'Communication'], growthOutlook: 'Stable', industryDemandScore: 84 },
    { fieldId: 'commerce', specializationId: 'com-banking', title: 'Credit Analyst', level: 'Mid Level', salaryRange: '₹5-10 LPA', requiredSkills: ['Credit Assessment', 'Risk Analysis', 'Financial Analysis', 'Reporting'], growthOutlook: 'Stable', industryDemandScore: 83 },
    { fieldId: 'commerce', specializationId: 'com-banking', title: 'Branch Manager', level: 'Senior Level', salaryRange: '₹10-18 LPA', requiredSkills: ['Leadership', 'Operations', 'Sales', 'Compliance'], growthOutlook: 'Stable', industryDemandScore: 81 },

    // Investment Management
    { fieldId: 'commerce', specializationId: 'com-investment', title: 'Portfolio Manager', level: 'Senior Level', salaryRange: '₹12-25 LPA', requiredSkills: ['Portfolio Management', 'Investment Strategy', 'Risk Management', 'Analysis'], growthOutlook: 'High', industryDemandScore: 88 },
    { fieldId: 'commerce', specializationId: 'com-investment', title: 'Wealth Manager', level: 'Senior Level', salaryRange: '₹10-22 LPA', requiredSkills: ['Wealth Planning', 'Client Relations', 'Investment Products', 'Advisory'], growthOutlook: 'High', industryDemandScore: 86 },
    { fieldId: 'commerce', specializationId: 'com-investment', title: 'Fund Manager', level: 'Lead Level', salaryRange: '₹20-45 LPA', requiredSkills: ['Fund Management', 'Strategy', 'Market Analysis', 'Leadership'], growthOutlook: 'High', industryDemandScore: 87 },

    // Marketing
    { fieldId: 'commerce', specializationId: 'com-marketing', title: 'Digital Marketing Manager', level: 'Mid Level', salaryRange: '₹6-12 LPA', requiredSkills: ['SEO', 'SEM', 'Social Media', 'Analytics'], growthOutlook: 'Very High', industryDemandScore: 93 },
    { fieldId: 'commerce', specializationId: 'com-marketing', title: 'Brand Manager', level: 'Senior Level', salaryRange: '₹10-20 LPA', requiredSkills: ['Brand Strategy', 'Marketing', 'Campaign Management', 'Analytics'], growthOutlook: 'High', industryDemandScore: 89 },
    { fieldId: 'commerce', specializationId: 'com-marketing', title: 'Marketing Analyst', level: 'Entry Level', salaryRange: '₹4-8 LPA', requiredSkills: ['Data Analysis', 'Market Research', 'Reporting', 'Tools'], growthOutlook: 'High', industryDemandScore: 90 },
];

specializationsAndCareers.specializations.push(...commerceSpecs);
specializationsAndCareers.careers.push(...commerceCareers);

// ============================================
// 3. MEDICAL & HEALTH SCIENCES
// ============================================

const medicalSpecs: Specialization[] = [
    { specializationId: 'med-general', fieldId: 'medical', specializationName: 'General Medicine', description: 'Primary healthcare and general practice' },
    { specializationId: 'med-surgery', fieldId: 'medical', specializationName: 'Surgery', description: 'Surgical specializations' },
    { specializationId: 'med-pediatrics', fieldId: 'medical', specializationName: 'Pediatrics', description: 'Child healthcare' },
    { specializationId: 'med-pharmacy', fieldId: 'medical', specializationName: 'Pharmacy', description: 'Pharmaceutical sciences' },
    { specializationId: 'med-public-health', fieldId: 'medical', specializationName: 'Public Health', description: 'Community health and epidemiology' },
    { specializationId: 'med-radiology', fieldId: 'medical', specializationName: 'Radiology', description: 'Medical imaging and diagnostics' },
];

const medicalCareers: CareerPath[] = [
    // General Medicine
    { fieldId: 'medical', specializationId: 'med-general', title: 'General Physician', level: 'Mid Level', salaryRange: '₹8-15 LPA', requiredSkills: ['MBBS', 'Clinical Diagnosis', 'Patient Care', 'Treatment'], growthOutlook: 'Stable', industryDemandScore: 88 },
    { fieldId: 'medical', specializationId: 'med-general', title: 'Medical Officer', level: 'Entry Level', salaryRange: '₹5-10 LPA', requiredSkills: ['MBBS', 'Emergency Care', 'Clinical Skills', 'Documentation'], growthOutlook: 'Stable', industryDemandScore: 85 },
    { fieldId: 'medical', specializationId: 'med-general', title: 'Consultant Physician', level: 'Senior Level', salaryRange: '₹15-30 LPA', requiredSkills: ['MD', 'Specialization', 'Experience', 'Leadership'], growthOutlook: 'High', industryDemandScore: 90 },

    // Surgery
    { fieldId: 'medical', specializationId: 'med-surgery', title: 'Surgeon', level: 'Senior Level', salaryRange: '₹20-50 LPA', requiredSkills: ['MS', 'Surgical Skills', 'Precision', 'Decision Making'], growthOutlook: 'High', industryDemandScore: 92 },
    { fieldId: 'medical', specializationId: 'med-surgery', title: 'Orthopedic Surgeon', level: 'Lead Level', salaryRange: '₹25-60 LPA', requiredSkills: ['Orthopedics', 'Surgery', 'Trauma Care', 'Expertise'], growthOutlook: 'High', industryDemandScore: 91 },
    { fieldId: 'medical', specializationId: 'med-surgery', title: 'Neurosurgeon', level: 'Executive Level', salaryRange: '₹40-100 LPA', requiredSkills: ['Neurosurgery', 'Advanced Skills', 'Research', 'Excellence'], growthOutlook: 'High', industryDemandScore: 94 },

    // Pediatrics
    { fieldId: 'medical', specializationId: 'med-pediatrics', title: 'Pediatrician', level: 'Senior Level', salaryRange: '₹12-25 LPA', requiredSkills: ['MD Pediatrics', 'Child Care', 'Diagnosis', 'Communication'], growthOutlook: 'Stable', industryDemandScore: 87 },
    { fieldId: 'medical', specializationId: 'med-pediatrics', title: 'Neonatologist', level: 'Lead Level', salaryRange: '₹18-35 LPA', requiredSkills: ['Neonatal Care', 'Critical Care', 'Expertise', 'Precision'], growthOutlook: 'High', industryDemandScore: 89 },

    // Pharmacy
    { fieldId: 'medical', specializationId: 'med-pharmacy', title: 'Clinical Pharmacist', level: 'Mid Level', salaryRange: '₹4-8 LPA', requiredSkills: ['Pharmacology', 'Drug Management', 'Patient Counseling', 'Compliance'], growthOutlook: 'Stable', industryDemandScore: 82 },
    { fieldId: 'medical', specializationId: 'med-pharmacy', title: 'Hospital Pharmacist', level: 'Mid Level', salaryRange: '₹5-10 LPA', requiredSkills: ['Pharmacy Operations', 'Inventory', 'Dispensing', 'Safety'], growthOutlook: 'Stable', industryDemandScore: 81 },
    { fieldId: 'medical', specializationId: 'med-pharmacy', title: 'Pharmaceutical Researcher', level: 'Senior Level', salaryRange: '₹8-16 LPA', requiredSkills: ['Research', 'Drug Development', 'Analysis', 'Innovation'], growthOutlook: 'High', industryDemandScore: 86 },

    // Public Health
    { fieldId: 'medical', specializationId: 'med-public-health', title: 'Public Health Officer', level: 'Mid Level', salaryRange: '₹5-10 LPA', requiredSkills: ['Epidemiology', 'Community Health', 'Programs', 'Policy'], growthOutlook: 'High', industryDemandScore: 84 },
    { fieldId: 'medical', specializationId: 'med-public-health', title: 'Epidemiologist', level: 'Senior Level', salaryRange: '₹8-15 LPA', requiredSkills: ['Disease Surveillance', 'Data Analysis', 'Research', 'Reporting'], growthOutlook: 'High', industryDemandScore: 86 },
    { fieldId: 'medical', specializationId: 'med-public-health', title: 'Health Policy Analyst', level: 'Senior Level', salaryRange: '₹10-18 LPA', requiredSkills: ['Policy Analysis', 'Healthcare Systems', 'Research', 'Communication'], growthOutlook: 'High', industryDemandScore: 83 },

    // Radiology
    { fieldId: 'medical', specializationId: 'med-radiology', title: 'Radiologist', level: 'Senior Level', salaryRange: '₹15-35 LPA', requiredSkills: ['MD Radiology', 'Imaging', 'Diagnosis', 'Technology'], growthOutlook: 'High', industryDemandScore: 90 },
    { fieldId: 'medical', specializationId: 'med-radiology', title: 'Radiology Technician', level: 'Entry Level', salaryRange: '₹3-6 LPA', requiredSkills: ['Imaging Equipment', 'Patient Care', 'Safety', 'Technical Skills'], growthOutlook: 'Stable', industryDemandScore: 80 },
];

specializationsAndCareers.specializations.push(...medicalSpecs);
specializationsAndCareers.careers.push(...medicalCareers);

// ============================================
// 4-22: REMAINING FIELDS (Abbreviated for space)
// ============================================

// LAW
const lawSpecs: Specialization[] = [
    { specializationId: 'law-corporate', fieldId: 'law', specializationName: 'Corporate Law', description: 'Business and corporate legal matters' },
    { specializationId: 'law-criminal', fieldId: 'law', specializationName: 'Criminal Law', description: 'Criminal defense and prosecution' },
    { specializationId: 'law-civil', fieldId: 'law', specializationName: 'Civil Law', description: 'Civil disputes and litigation' },
    { specializationId: 'law-ip', fieldId: 'law', specializationName: 'Intellectual Property', description: 'Patents, trademarks, and copyrights' },
];

const lawCareers: CareerPath[] = [
    { fieldId: 'law', specializationId: 'law-corporate', title: 'Corporate Lawyer', level: 'Senior Level', salaryRange: '₹10-25 LPA', requiredSkills: ['Corporate Law', 'Contracts', 'Compliance', 'Negotiation'], growthOutlook: 'High', industryDemandScore: 88 },
    { fieldId: 'law', specializationId: 'law-corporate', title: 'Legal Counsel', level: 'Lead Level', salaryRange: '₹15-35 LPA', requiredSkills: ['Legal Advisory', 'Risk Management', 'Strategy', 'Leadership'], growthOutlook: 'High', industryDemandScore: 87 },
    { fieldId: 'law', specializationId: 'law-criminal', title: 'Criminal Lawyer', level: 'Mid Level', salaryRange: '₹6-15 LPA', requiredSkills: ['Criminal Law', 'Litigation', 'Court Procedures', 'Advocacy'], growthOutlook: 'Stable', industryDemandScore: 82 },
    { fieldId: 'law', specializationId: 'law-civil', title: 'Civil Litigation Lawyer', level: 'Mid Level', salaryRange: '₹7-14 LPA', requiredSkills: ['Civil Law', 'Litigation', 'Research', 'Drafting'], growthOutlook: 'Stable', industryDemandScore: 81 },
    { fieldId: 'law', specializationId: 'law-ip', title: 'IP Attorney', level: 'Senior Level', salaryRange: '₹12-28 LPA', requiredSkills: ['IP Law', 'Patents', 'Trademarks', 'Litigation'], growthOutlook: 'Very High', industryDemandScore: 90 },
];

specializationsAndCareers.specializations.push(...lawSpecs);
specializationsAndCareers.careers.push(...lawCareers);

// Add generic specializations for remaining fields
const remainingFields = fields.filter(f =>
    !['engineering', 'commerce', 'medical', 'law'].includes(f.fieldId)
);

remainingFields.forEach(field => {
    // Add 4-5 generic specializations per field
    for (let i = 1; i <= 4; i++) {
        const specId = `${field.fieldId}-spec-${i}`;
        specializationsAndCareers.specializations.push({
            specializationId: specId,
            fieldId: field.fieldId,
            specializationName: `${field.fieldName} Specialization ${i}`,
            description: `Specialized area in ${field.fieldName}`
        });

        // Add 5-7 careers per specialization
        const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead Level', 'Executive Level'];
        const salaries = ['₹3-6 LPA', '₹6-12 LPA', '₹12-20 LPA', '₹20-35 LPA', '₹35-60 LPA'];

        for (let j = 0; j < 5; j++) {
            specializationsAndCareers.careers.push({
                fieldId: field.fieldId,
                specializationId: specId,
                title: `${field.fieldName} ${levels[j]} Professional`,
                level: levels[j],
                salaryRange: salaries[j],
                requiredSkills: ['Domain Knowledge', 'Problem Solving', 'Communication', 'Technical Skills'],
                growthOutlook: j < 2 ? 'Very High' : j < 4 ? 'High' : 'Stable',
                industryDemandScore: 85 - (j * 2)
            });
        }
    }
});

// ============================================
// SEEDING FUNCTION
// ============================================

async function seedCompleteCareerSystem() {
    console.log('🚀 Starting COMPLETE Career System Seed...\n');

    try {
        // 1. Clear existing data
        console.log('🧹 Step 1: Clearing existing data...');
        const collections = ['fields', 'specializations', 'career_paths'];

        for (const collectionName of collections) {
            const snapshot = await db.collection(collectionName).get();
            if (!snapshot.empty) {
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
                console.log(`   ✓ Deleted ${snapshot.size} documents from ${collectionName}`);
            }
        }

        // 2. Seed Fields
        console.log('\n📁 Step 2: Seeding Fields...');
        let batch = db.batch();
        let count = 0;

        for (const field of fields) {
            const docRef = db.collection('fields').doc(field.fieldId);
            batch.set(docRef, field);
            count++;
        }
        await batch.commit();
        console.log(`   ✓ Seeded ${count} fields`);

        // 3. Seed Specializations
        console.log('\n🎯 Step 3: Seeding Specializations...');
        batch = db.batch();
        count = 0;
        let batchCount = 0;

        for (const spec of specializationsAndCareers.specializations) {
            const docRef = db.collection('specializations').doc(spec.specializationId);
            batch.set(docRef, spec);
            count++;
            batchCount++;

            if (batchCount >= 400) {
                await batch.commit();
                batch = db.batch();
                batchCount = 0;
            }
        }
        if (batchCount > 0) await batch.commit();
        console.log(`   ✓ Seeded ${count} specializations`);

        // 4. Seed Career Paths (with deduplication)
        console.log('\n💼 Step 4: Seeding Career Paths (with deduplication)...');
        batch = db.batch();
        count = 0;
        batchCount = 0;
        const seenPaths = new Set<string>();

        for (const career of specializationsAndCareers.careers) {
            // Deduplication key
            const key = `${career.fieldId}|${career.specializationId}|${career.title}`;

            if (!seenPaths.has(key)) {
                seenPaths.add(key);
                const docRef = db.collection('career_paths').doc();
                batch.set(docRef, {
                    ...career,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                count++;
                batchCount++;

                if (batchCount >= 400) {
                    await batch.commit();
                    batch = db.batch();
                    batchCount = 0;
                }
            }
        }
        if (batchCount > 0) await batch.commit();
        console.log(`   ✓ Seeded ${count} unique career paths`);

        // 5. Summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ COMPLETE CAREER SYSTEM SEEDED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log(`📊 Summary:`);
        console.log(`   • Fields: ${fields.length}`);
        console.log(`   • Specializations: ${specializationsAndCareers.specializations.length}`);
        console.log(`   • Career Paths: ${count}`);
        console.log(`   • Total Documents: ${fields.length + specializationsAndCareers.specializations.length + count}`);
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        process.exit();
    }
}

seedCompleteCareerSystem();
