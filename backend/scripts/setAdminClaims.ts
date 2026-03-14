import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccountJson))
        });
    } else {
        console.error('FIREBASE_SERVICE_ACCOUNT_JSON is missing from .env');
        process.exit(1);
    }
}

async function setAdminClaimsByEmail(email: string) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
        console.log(`✅ Successfully set admin claims for user: ${email}`);

        // Update user document too
        await admin.firestore().collection('users').doc(user.uid).update({
            role: 'admin'
        });
        console.log('✅ Updated user document in Firestore');
    } catch (error) {
        console.error('❌ Error setting admin claims:', error);
    }
}

const adminEmail = process.env.ADMIN_EMAIL || 'guntaganideepak1234@gmail.com';
setAdminClaimsByEmail(adminEmail);
