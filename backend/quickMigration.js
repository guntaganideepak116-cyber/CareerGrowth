/**
 * QUICK MIGRATION SCRIPT
 * 
 * Since we have 2 fields complete (Engineering + Medical) with 23 specializations,
 * let's run a PARTIAL migration first to test the system, then continue with remaining fields.
 * 
 * This allows you to see results immediately while I continue building the rest.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Import the data we have so far
const { COMPLETE_REAL_WORLD_DATA } = require('./allFieldsData.js');

async function quickMigration() {
    console.log('\n🚀 QUICK PARTIAL MIGRATION - Engineering + Medical Fields\n');
    console.log('='.repeat(70));

    try {
        // Clear only career_paths for now
        console.log('\n🗑️  Clearing old career paths...');
        const oldPaths = await db.collection('career_paths').get();
        if (!oldPaths.empty) {
            const batch = db.batch();
            oldPaths.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log(`✅ Deleted ${oldPaths.size} old career paths`);
        }

        let totalAdded = 0;

        // Migrate Engineering + Medical
        for (const [fieldId, fieldData] of Object.entries(COMPLETE_REAL_WORLD_DATA)) {
            console.log(`\n📁 Migrating: ${fieldData.displayName}`);

            for (const [specId, specData] of Object.entries(fieldData.specializations)) {
                console.log(`   📂 ${specData.displayName}`);

                // Add career paths
                for (const careerPath of specData.careerPaths) {
                    await db.collection('career_paths').add({
                        title: careerPath,
                        fieldId: fieldId,
                        specializationId: specId,
                        level: 'mid',
                        requiredSkills: [],
                        industryValue: 'high',
                        salaryImpact: '+15%',
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    totalAdded++;
                }

                console.log(`      ✅ Added ${specData.careerPaths.length} career paths`);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log(`\n✅ PARTIAL MIGRATION COMPLETE!`);
        console.log(`📊 Total Career Paths Added: ${totalAdded}`);
        console.log(`\n💡 You can now test Engineering + Medical fields in your app!`);
        console.log(`💡 Remaining 20 fields will be added next.\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

quickMigration();
