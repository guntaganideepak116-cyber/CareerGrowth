/**
 * INTELLIGENT DATA MIGRATION SCRIPT
 * Parses user-provided data and migrates to Firestore
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// ============================================
// STEP 1: BACKUP EXISTING DATABASE
// ============================================

async function backupDatabase() {
    console.log('📦 STEP 1: Backing up existing database...');
    const collections = ['career_paths', 'projects', 'certifications', 'roadmaps'];
    const backup = {};

    for (const col of collections) {
        const snapshot = await db.collection(col).get();
        backup[col] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`✅ Backed up ${col}: ${backup[col].length} documents`);
    }

    const filename = `./backup_${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    console.log(`\n💾 Backup saved to: ${filename}\n`);
    return backup;
}

// ============================================
// STEP 2: CLEAR OLD DATA
// ============================================

async function clearOldData() {
    console.log('\n🗑️  STEP 2: Clearing old data...\n');
    const collections = ['career_paths', 'projects', 'certifications'];

    for (const col of collections) {
        const snapshot = await db.collection(col).get();
        if (snapshot.empty) continue;

        console.log(`🔥 Deleting ${snapshot.size} documents from ${col}...`);
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`✅ ${col}: Cleared`);
    }
}

// ============================================
// STEP 3: MIGRATE REAL-WORLD DATA
// ============================================

async function migrateCareerPaths(fieldId, specializationId, branch, careerPaths) {
    const batch = db.batch();

    careerPaths.forEach(path => {
        const docRef = db.collection('career_paths').doc();
        const title = typeof path === 'string' ? path : (path.title || path.name);

        batch.set(docRef, {
            title: title,
            field: fieldId,
            fieldId: fieldId,
            specializationId: specializationId,
            branch: branch || null,
            level: path.level || 'Intermediate',
            requiredSkills: path.requiredSkills || [],
            industryValue: 'high',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    await batch.commit();
}

async function migrateProjects(fieldId, specializationId, branch, projects) {
    const batch = db.batch();
    const levels = ['beginner', 'intermediate', 'advanced'];

    levels.forEach(level => {
        projects[level]?.forEach(proj => {
            const docRef = db.collection('projects').doc();
            const projectData = typeof proj === 'string' ? { title: proj } : proj;

            batch.set(docRef, {
                title: projectData.title || projectData.name,
                description: projectData.description || `Industry-standard project for ${specializationId}`,
                level: (projectData.level || level).charAt(0).toUpperCase() + (projectData.level || level).slice(1),
                field: fieldId,
                fieldId: fieldId,
                specializationId: specializationId,
                branch: branch || null,
                technologies: projectData.technologies || [],
                difficultyScore: projectData.difficultyScore || (level === 'beginner' ? 3 : (level === 'intermediate' ? 6 : 9)),
                estimatedDuration: projectData.estimatedDuration || '1 month',
                industryTag: projectData.industryTag || 'Technology',
                companyRelevance: projectData.companyRelevance || [],
                realWorldUseCase: projectData.realWorldUseCase || '',
                thumbnailUrl: projectData.thumbnailUrl || '',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });
    });

    await batch.commit();
}

async function migrateCertifications(fieldId, specializationId, branch, certifications) {
    const batchWrite = db.batch();
    const levels = ['free', 'pro', 'premium'];

    levels.forEach(level => {
        certifications[level]?.forEach(cert => {
            const docRef = db.collection('certifications').doc();
            const certData = typeof cert === 'string' ? { title: cert } : cert;

            batchWrite.set(docRef, {
                title: certData.title || certData.name,
                organization: certData.organization || 'Various',
                provider: certData.provider || 'Global',
                logoUrl: certData.logoUrl || '',
                officialUrl: certData.officialUrl || '#',
                level: (certData.level || level).charAt(0).toUpperCase() + (certData.level || level).slice(1),
                field: fieldId,
                fieldId: fieldId,
                specializationId: specializationId,
                branch: branch || null,
                skillsCovered: certData.skillsCovered || [],
                duration: certData.duration || '40 hours',
                difficultyLevel: certData.difficultyLevel || 'Intermediate',
                certificationType: certData.certificationType || 'Industry',
                description: certData.description || `Global certification for ${specializationId}`,
                eligibility: certData.eligibility || 'Open to all',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });
    });

    await batchWrite.commit();
}

// ============================================
// STEP 4: MAIN MIGRATION FUNCTION
// ============================================

async function runMigration() {
    console.log('\n🚀 STARTING ENHANCED DATA MIGRATION\n');
    console.log('='.repeat(60));

    try {
        await backupDatabase();
        await clearOldData();

        console.log('\n📥 STEP 3: Migrating new data...\n');
        const { COMPLETE_REAL_WORLD_DATA: COMPLETE_DATA } = require('./allFieldsData.js');

        for (const [fieldId, fieldData] of Object.entries(COMPLETE_DATA)) {
            console.log(`\n📁 Field: ${fieldData.displayName || fieldId}`);

            for (const [specId, specData] of Object.entries(fieldData.specializations)) {
                console.log(`   📂 Spec: ${specData.displayName || specId}`);

                if (specData.careerPaths?.length > 0) {
                    await migrateCareerPaths(fieldId, specId, specData.branch, specData.careerPaths);
                }
                if (specData.projects) {
                    await migrateProjects(fieldId, specId, specData.branch, specData.projects);
                }
                if (specData.certifications) {
                    await migrateCertifications(fieldId, specId, specData.branch, specData.certifications);
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ MIGRATION COMPLETE!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ MIGRATION FAILED:', error);
        process.exit(1);
    }
}

runMigration();
