// Check what's in the database
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkDatabase() {
    console.log('🔍 Checking database content...\n');

    try {
        // Check career_paths
        const pathsSnapshot = await db.collection('career_paths').get();
        console.log(`📊 Career Paths: ${pathsSnapshot.size} items`);

        if (pathsSnapshot.size > 0) {
            console.log('\nSample career paths:');
            pathsSnapshot.docs.slice(0, 5).forEach(doc => {
                const data = doc.data();
                console.log(`  - ${data.title} (${data.fieldId} / ${data.specializationId || 'N/A'})`);
            });
        }

        // Check projects
        const projSnapshot = await db.collection('projects').get();
        console.log(`\n📊 Projects: ${projSnapshot.size} items`);

        // Check certifications
        const certsSnapshot = await db.collection('certifications').get();
        console.log(`📊 Certifications: ${certsSnapshot.size} items`);

        // Check roadmaps
        const roadmapsSnapshot = await db.collection('roadmaps').get();
        console.log(`📊 Roadmaps: ${roadmapsSnapshot.size} items`);

        console.log('\n' + '='.repeat(50));

        if (pathsSnapshot.size === 0) {
            console.log('\n⚠️  DATABASE IS EMPTY!');
            console.log('This is why you\'re seeing the same AI-generated content.');
            console.log('\nSolution: Run seedRealCareerPaths.js to populate with REAL data.');
        } else {
            console.log('\n✅ Database has content');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDatabase();
