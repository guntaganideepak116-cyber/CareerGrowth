const fs = require('fs');
const path = require('path');

// Load converted data
const { careerPathsMap } = require('./tmp_data/careerPathsData');
const { projectsMap } = require('./tmp_data/projectsData');
const { certificationsMap } = require('./tmp_data/certificationsData');
const { fields, specializationsMap, branchesMap } = require('./tmp_data/fieldsData');

const data = {};

// Iterate through all fields defined in the frontend
fields.forEach(field => {
    const fieldId = field.id;

    if (!data[fieldId]) {
        data[fieldId] = {
            displayName: field.name,
            specializations: {}
        };
    }

    // Get specializations for this field
    const specializations = specializationsMap[fieldId] || [];

    specializations.forEach(spec => {
        const specId = spec.id;

        // 1. Get Career Paths
        // Priority: specId match in careerPathsMap
        let paths = careerPathsMap[specId] || [];

        // If no paths found, try some common mappings for legacy IDs
        if (paths.length === 0) {
            if (specId === 'cse-ai-ml') paths = careerPathsMap['ai-ml'] || [];
            if (specId === 'cse-software-dev') paths = careerPathsMap['fullstack'] || [];
            if (specId === 'cloud-devops') paths = careerPathsMap['devops'] || [];
        }

        // Convert objects to titles if necessary
        const careerPathTitles = paths.map(p => typeof p === 'string' ? p : p.name);

        // Fallback for career paths
        if (careerPathTitles.length === 0) {
            const name = spec.name || specId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            careerPathTitles.push(`Senior ${name} Specialist`, `${name} Consultant`, `Lead ${name} Engineer`);
        }

        // 2. Get Projects
        // Priority: specId match in projectsMap, then fieldId match
        let projects = projectsMap[specId];

        // If not found by specId, try fieldId (which is common in projectsData.ts)
        if (!projects) {
            // Check for branch mapping (e.g. cse, ece)
            if (spec.branch && projectsMap[spec.branch]) {
                projects = projectsMap[spec.branch];
            } else if (projectsMap[fieldId]) {
                projects = projectsMap[fieldId];
            }
        }

        // Format projects into beginner/intermediate/advanced
        let formattedProjects = {
            beginner: [],
            intermediate: [],
            advanced: []
        };

        if (Array.isArray(projects)) {
            projects.forEach(p => {
                const diff = (p.difficulty || 'intermediate').toLowerCase();
                if (diff === 'beginner') formattedProjects.beginner.push(p.name);
                else if (diff === 'advanced') formattedProjects.advanced.push(p.name);
                else formattedProjects.intermediate.push(p.name);
            });
        }

        // Fallback for projects if empty
        if (formattedProjects.beginner.length === 0 && formattedProjects.intermediate.length === 0 && formattedProjects.advanced.length === 0) {
            const name = spec.name || specId;
            formattedProjects = {
                beginner: [`Basic ${name} Project`, `${name} Starter Kit`, `Introduction to ${name}`],
                intermediate: [`Advanced ${name} Implementation`, `${name} Integration Service`, `${name} Analytics Suite`],
                advanced: [`Enterprise ${name} Solution`, `High-Performance ${name} System`, `Global ${name} Architecture`]
            };
        }

        // 3. Get Certifications
        // Priority: specId, then branchId, then fieldId
        let certs = certificationsMap[specId];
        if (!certs && spec.branch && certificationsMap[spec.branch]) {
            certs = certificationsMap[spec.branch];
        }
        if (!certs && certificationsMap[fieldId]) {
            certs = certificationsMap[fieldId];
        }
        // Handle DevOps alias
        if (!certs && (specId.includes('devops') || fieldId === 'devops')) {
            certs = certificationsMap['devops-sre'];
        }

        // If still no certs, use a default set or keep empty
        certs = certs || [];

        // Format certifications into free/pro/premium
        let formattedCerts = {
            free: [],
            pro: [],
            premium: []
        };

        if (Array.isArray(certs)) {
            certs.forEach(c => {
                const decision = (c.aiDecision || 'do-later').toLowerCase();
                if (decision === 'do-now') formattedCerts.free.push(c.name);
                else if (decision === 'skip') formattedCerts.premium.push(c.name);
                else formattedCerts.pro.push(c.name);
            });
        }

        // Fallback for certs if empty
        if (formattedCerts.free.length === 0 && formattedCerts.pro.length === 0 && formattedCerts.premium.length === 0) {
            const name = spec.name || specId;
            formattedCerts = {
                free: [`${name} Foundations (Free)`, `Google ${name} Intro`],
                pro: [`Professional ${name} Certificate`, `Microsoft Certified: ${name}`],
                premium: [`Advanced ${name} Expert`, `Enterprise ${name} Professional`]
            };
        }

        // Add to result
        data[fieldId].specializations[specId] = {
            displayName: spec.name,
            branch: spec.branch || null,
            careerPaths: careerPathTitles,
            projects: formattedProjects,
            certifications: formattedCerts
        };
    });
});

const outputContent = 'const COMPLETE_REAL_WORLD_DATA = ' + JSON.stringify(data, null, 4) + ';\n\nmodule.exports = { COMPLETE_REAL_WORLD_DATA };\n';
fs.writeFileSync('allFieldsData.js', outputContent);

console.log('✅ Successfully generated allFieldsData.js');
console.log(`📊 Total fields processed: ${Object.keys(data).length}`);
let totalSpecs = 0;
Object.keys(data).forEach(f => totalSpecs += Object.keys(data[f].specializations).length);
console.log(`📊 Total specializations processed: ${totalSpecs}`);
