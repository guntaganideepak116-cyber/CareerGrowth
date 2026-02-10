import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const initializeFirebase = () => {
    try {
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        if (serviceAccountJson) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(serviceAccountJson))
                });
                console.log('Firebase initialized with FIREBASE_SERVICE_ACCOUNT_JSON');
            }
        } else if (serviceAccountPath) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault()
                });
                console.log('Firebase initialized with Application Default Credentials');
            }
        } else {
            // Development fallback
            try {
                const serviceAccount = require('../../serviceAccountKey.json');
                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                    console.log('Firebase initialized with local serviceAccountKey.json');
                }
            } catch (e) {
                console.warn('Local serviceAccountKey.json not found. Firebase features may fail.');
            }
        }

    } catch (error) {
        console.warn('Firebase initialization failed.');
        console.error(error);
    }
};

// Run initialization immediately
initializeFirebase();

export const db = admin.firestore();
export const auth = admin.auth();
