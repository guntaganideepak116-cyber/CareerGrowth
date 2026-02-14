const fs = require('fs');
const path = require('path');

// Load converted data from tmp_data
const { careerPathsMap } = require('./tmp_data/careerPathsData');
const { projectsMap } = require('./tmp_data/projectsData');
const { certificationsMap } = require('./tmp_data/certificationsData');
const { fields, specializationsMap } = require('./tmp_data/fieldsData');

// Load the "morning data" (realWorldData.js)
const { REAL_WORLD_DATA } = require('./realWorldData');

const data = {};

// Helper to slugify names for matching
const slugify = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const LOGO_MAPPING = {
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
    'AWS': 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
    'Amazon': 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
    'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
    'Meta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/512px-Meta_Platforms_Inc._logo.svg.png',
    'IBM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/512px-IBM_logo.svg.png',
    'Cisco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/512px-Cisco_logo_blue_2016.svg.png',
    'Oracle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/512px-Oracle_logo.svg.png',
    'Coursera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/512px-Coursera-Logo_600x600.svg.png',
    'edX': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/EdX.png/512px-EdX.png',
    'Harvard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/512px-Harvard_University_logo.svg.png',
    'Stanford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_University_logo.svg/512px-Stanford_University_logo.svg.png',
    'MIT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/512px-MIT_logo.svg.png',
    'Unity': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/512px-Unity_Technologies_logo.svg.png',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png'
};

const URL_MAPPING = {
    'Google': 'https://grow.google/certificates/',
    'AWS': 'https://aws.amazon.com/training/',
    'Microsoft': 'https://learn.microsoft.com/en-us/certifications/',
    'Meta': 'https://www.coursera.org/meta',
    'IBM': 'https://www.ibm.com/training/certification',
    'Cisco': 'https://www.netacad.com/',
    'Oracle': 'https://education.oracle.com/',
    'Harvard': 'https://online-learning.harvard.edu/',
    'Stanford': 'https://online.stanford.edu/',
    'MIT': 'https://openlearning.mit.edu/',
    'freeCodeCamp': 'https://www.freecodecamp.org/learn'
};

const getLogo = (name) => {
    for (const key in LOGO_MAPPING) {
        if (name.includes(key)) return LOGO_MAPPING[key];
    }
    return 'https://cdn-icons-png.flaticon.com/512/3135/3135661.png'; // Default
};

const getUrl = (name) => {
    for (const key in URL_MAPPING) {
        if (name.includes(key)) return URL_MAPPING[key];
    }
    return 'https://www.coursera.org/search?query=' + encodeURIComponent(name);
};

// Helper to get professional fallbacks
const getProfessionalProjects = (specName, fieldId, specId) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const res = { beginner: [], intermediate: [], advanced: [] };

    levels.forEach(level => {
        const orgs = level === 'Beginner' ? ['Harvard', 'Google', 'MIT'] : (level === 'Intermediate' ? ['Coursera', 'Microsoft', 'IBM'] : ['AWS', 'Stanford', 'Oracle']);
        orgs.forEach((org, i) => {
            const title = `${org} ${level} Project: ${specName} Case Study #${i + 1}`;
            res[level.toLowerCase()].push({
                id: `proj-${specId}-${level.toLowerCase()}-${i}`,
                title: title,
                description: `A comprehensive ${level.toLowerCase()} project designed by ${org} to master ${specName} fundamentals in real-world scenarios.`,
                level: level,
                field: fieldId,
                specialization: specId,
                technologies: ['React', 'Node.js', 'Cloud Services'],
                difficultyScore: level === 'Beginner' ? 3 : (level === 'Intermediate' ? 6 : 9),
                estimatedDuration: level === 'Beginner' ? '2 weeks' : (level === 'Intermediate' ? '4 weeks' : '2-3 months'),
                industryTag: 'Technology',
                companyRelevance: [org, 'Tech Giants'],
                realWorldUseCase: `Implementing ${specName} for enterprise scalability and performance optimization.`,
                thumbnailUrl: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop`
            });
        });
    });
    return res;
};

const getProfessionalCerts = (specName, fieldId, specId) => {
    const levels = ['Free', 'Pro', 'Premium'];
    const res = { free: [], pro: [], premium: [] };

    levels.forEach(level => {
        const orgs = level === 'Free' ? ['Google', 'freeCodeCamp', 'MIT'] : (level === 'Pro' ? ['Meta', 'Microsoft', 'IBM'] : ['AWS', 'Stanford', 'Harvard']);
        orgs.forEach((org, i) => {
            const title = `${org} Certified ${specName} ${level === 'Premium' ? 'Expert' : 'Practitioner'}`;
            res[level.toLowerCase()].push({
                id: `cert-${specId}-${level.toLowerCase()}-${i}`,
                title: title,
                organization: org,
                provider: level === 'Free' ? 'Official' : 'Coursera/edX',
                logoUrl: getLogo(org),
                officialUrl: getUrl(title),
                level: level,
                field: fieldId,
                specialization: specId,
                skillsCovered: [specName, 'Problem Solving', 'Design Patterns'],
                duration: level === 'Free' ? '20 hours' : (level === 'Pro' ? '3 months' : '6 months'),
                difficultyLevel: level === 'Free' ? 'Basic' : (level === 'Pro' ? 'Intermediate' : 'Advanced'),
                certificationType: 'Industry',
                description: `Official ${level.toLowerCase()} certification by ${org} covering the latest ${specName} industry standards.`,
                eligibility: 'Open to all learners'
            });
        });
    });
    return res;
};

// Iterate through all fields defined in the frontend
fields.forEach(field => {
    const fieldId = field.id;

    if (!data[fieldId]) {
        data[fieldId] = {
            displayName: field.name,
            specializations: {}
        };
    }

    const specializations = specializationsMap[fieldId] || [];

    specializations.forEach(spec => {
        const specId = spec.id;
        const specName = spec.name;
        const branch = spec.branch || null;

        // --- STEP 1: Check for "Morning Data" match ---
        let morningData = null;
        if (REAL_WORLD_DATA[fieldId] && REAL_WORLD_DATA[fieldId].specializations) {
            morningData = REAL_WORLD_DATA[fieldId].specializations[specId] || REAL_WORLD_DATA[fieldId].specializations[slugify(specName)];
        }

        // --- STEP 2: Career Paths ---
        let careerPaths = [];
        if (morningData && morningData.careerPaths) {
            careerPaths = morningData.careerPaths.map(p => typeof p === 'string' ? p : p.title);
        } else {
            careerPaths = (careerPathsMap[specId] || []).map(p => typeof p === 'string' ? p : p.name);
        }
        if (careerPaths.length === 0) careerPaths = [`Senior ${specName} Specialist`, `${specName} Consultant`];

        // --- STEP 3: Projects & Certifications (Professional Generation) ---
        const profProjects = getProfessionalProjects(specName, fieldId, specId);
        const profCerts = getProfessionalCerts(specName, fieldId, specId);

        // If morning data exists, override specific ones but keep structure
        if (morningData) {
            if (morningData.projects) {
                // Convert morning data strings to objects
                ['beginner', 'intermediate', 'advanced'].forEach(lvl => {
                    if (morningData.projects[lvl]) {
                        profProjects[lvl] = morningData.projects[lvl].map((pName, i) => ({
                            id: `proj-${specId}-${lvl}-${i}`,
                            title: pName,
                            description: `Industry-standard project: ${pName}`,
                            level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
                            field: fieldId,
                            specialization: specId,
                            technologies: ['React', 'Node.js'],
                            difficultyScore: lvl === 'beginner' ? 3 : (lvl === 'intermediate' ? 6 : 9),
                            estimatedDuration: lvl === 'beginner' ? '2 weeks' : '1 month',
                            realWorldUseCase: `Implementation of ${pName} in professional environment.`
                        }));
                    }
                });
            }
            if (morningData.certifications) {
                ['free', 'pro', 'premium'].forEach(lvl => {
                    if (morningData.certifications[lvl]) {
                        profCerts[lvl] = morningData.certifications[lvl].map((cName, i) => {
                            const org = cName.split(' ')[0]; // Basic org detection
                            return {
                                id: `cert-${specId}-${lvl}-${i}`,
                                title: cName,
                                organization: org,
                                provider: lvl === 'free' ? 'Various' : 'Coursera',
                                logoUrl: getLogo(cName),
                                officialUrl: getUrl(cName),
                                level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
                                field: fieldId,
                                specialization: specId,
                                skillsCovered: [specName],
                                description: `Global certification: ${cName}`
                            };
                        });
                    }
                });
            }
        }

        // Add to result
        data[fieldId].specializations[specId] = {
            displayName: specName,
            branch: branch,
            careerPaths: careerPaths,
            projects: profProjects,
            certifications: profCerts
        };
    });
});

const outputContent = 'const COMPLETE_REAL_WORLD_DATA = ' + JSON.stringify(data, null, 4) + ';\n\nmodule.exports = { COMPLETE_REAL_WORLD_DATA };\n';
fs.writeFileSync('allFieldsData.js', outputContent);

console.log('✅ Successfully generated allFieldsData.js with rich object-based data');
console.log(`📊 Total fields: ${Object.keys(data).length}`);
console.log(`📊 Total specializations: ${Object.values(data).reduce((acc, f) => acc + Object.keys(f.specializations).length, 0)}`);
