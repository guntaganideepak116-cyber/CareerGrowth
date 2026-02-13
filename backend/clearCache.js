// Enhanced cache clearing script
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearAllCache() {
    console.log('🗑️  CLEARING ALL AI CACHE...\n');

    try {
        const snapshot = await db.collection('ai_generated_content').get();

        if (snapshot.empty) {
            console.log('✅ Cache is already empty!');
            process.exit(0);
        }

        console.log(`📊 Found ${snapshot.size} cached items:\n`);

        // Group by type
        const byType = {};
        snapshot.docs.forEach(doc => {
            const type = doc.id.split('_')[0];
            byType[type] = (byType[type] || 0) + 1;
        });

        Object.entries(byType).forEach(([type, count]) => {
            console.log(`   ${type}: ${count} items`);
        });

        console.log('\n🔥 Deleting all cached content...\n');

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
            console.log(`   ✓ Deleted: ${doc.id}`);
        });

        await batch.commit();

        console.log('\n✅ ALL CACHE CLEARED SUCCESSFULLY!');
        console.log('\n💡 Next steps:');
        console.log('   1. Refresh your website');
        console.log('   2. Select a field + specialization');
        console.log('   3. Wait 10 seconds for AI to generate NEW, SPECIFIC content');
        console.log('   4. You should see:');
        console.log('      - FREE certifications (4+)');
        console.log('      - Specialization-specific roadmaps');
        console.log('      - Unique projects for each specialization');
        console.log('      - Different content for different specializations\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        process.exit(1);
    }
}

clearAllCache();
