import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Load env explicitly
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Verify credentials (assuming standard setup or already initialized)
// Or just initialize directly
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function setAdmin(email: string) {
    try {
        console.log(`🔍 Looking for user with email: ${email}...`);

        // Find user by email in Auth
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            const uid = userRecord.uid;
            console.log(`✅ Found Auth User: ${uid}`);

            // Update user_profiles
            const profileRef = db.collection('user_profiles').doc(uid);
            await profileRef.set({
                role: 'admin',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log(`✅ Successfully promoted ${email} to ADMIN in user_profiles.`);

            // Optional: Set Custom Claim (better security)
            await admin.auth().setCustomUserClaims(uid, { admin: true });
            console.log(`✅ Set Custom Claim { admin: true } for user.`);

        } catch (authError) {
            console.error(`❌ User not found in Auth:`, authError);
        }

    } catch (error) {
        console.error('Error setting admin:', error);
    } finally {
        process.exit();
    }
}

const targetEmail = process.argv[2] || 'guntaganideepak1234@gmail.com';
setAdmin(targetEmail);
