// Quick script to clear AI cache
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearCache() {
    console.log('🗑️ Clearing AI cache...');

    try {
        const snapshot = await db.collection('ai_generated_content').get();

        if (snapshot.empty) {
            console.log('✅ Cache is already empty!');
            process.exit(0);
        }

        console.log(`Found ${snapshot.size} cached items. Deleting...`);

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
            console.log(`  - Deleting: ${doc.id}`);
        });

        await batch.commit();
        console.log('✅ Cache cleared successfully!');
        console.log('💡 Now refresh your Certifications page to see FREE certifications!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        process.exit(1);
    }
}

clearCache();
