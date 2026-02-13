// Check specialization IDs in database
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkSpecializations() {
    console.log('🔍 Checking specialization IDs in career_paths...\n');

    try {
        const snapshot = await db.collection('career_paths').get();

        // Group by field and specialization
        const byField = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const field = (data.fieldId || 'unknown').toLowerCase();
            const spec = (data.specializationId || 'unknown').toLowerCase();

            if (!byField[field]) {
                byField[field] = {};
            }

            if (!byField[field][spec]) {
                byField[field][spec] = 0;
            }

            byField[field][spec]++;
        });

        // Print results
        Object.keys(byField).sort().forEach(field => {
            console.log(`\n📁 ${field.toUpperCase()}:`);
            const specs = byField[field];
            Object.keys(specs).sort().forEach(spec => {
                console.log(`   - ${spec}: ${specs[spec]} career paths`);
            });
        });

        console.log('\n' + '='.repeat(60));
        console.log('\n💡 To see career paths for a specialization:');
        console.log('   1. Select the EXACT field (e.g., "engineering")');
        console.log('   2. Select the EXACT specialization (e.g., "cse")');
        console.log('   3. The specializationId in database MUST match exactly');
        console.log('\nExample:');
        console.log('   User selects: Engineering → CSE');
        console.log('   Database must have: fieldId="engineering", specializationId="cse"');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkSpecializations();
