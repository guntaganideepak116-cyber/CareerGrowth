import admin from 'firebase-admin';
import { careerPathsSeedData } from './data/careerPathsSeedData';

// Initialize Firebase Admin
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function populateCareerPaths() {
    console.log('🚀 Starting to populate career paths...');
    console.log(`📊 Total career paths to add: ${careerPathsSeedData.length}`);

    try {
        const batch = db.batch();
        const collectionRef = db.collection('career_paths');

        let count = 0;
        const fieldCounts: { [key: string]: number } = {};

        for (const pathData of careerPathsSeedData) {
            const docRef = collectionRef.doc();

            batch.set(docRef, {
                ...pathData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                verified: true
            });

            // Count paths per field
            if (!fieldCounts[pathData.field]) {
                fieldCounts[pathData.field] = 0;
            }
            fieldCounts[pathData.field]++;
            count++;

            // Firestore batch limit is 500, commit if we reach that
            if (count % 500 === 0) {
                await batch.commit();
                console.log(`✅ Committed batch of ${count} paths`);
            }
        }

        // Commit remaining paths
        if (count % 500 !== 0) {
            await batch.commit();
        }

        console.log('\n✅ Successfully populated all career paths!');
        console.log(`📈 Total paths added: ${count}`);
        console.log('\n📊 Breakdown by field:');

        // Sort fields alphabetically and display
        Object.keys(fieldCounts).sort().forEach(field => {
            console.log(`   ${field.padEnd(20)}: ${fieldCounts[field]} paths`);
        });

        console.log('\n🎉 Career paths population complete!');

    } catch (error) {
        console.error('❌ Error populating career paths:', error);
        throw error;
    } finally {
        // Close the admin instance
        await admin.app().delete();
    }
}

// Run the population script
populateCareerPaths()
    .then(() => {
        console.log('\n✨ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
