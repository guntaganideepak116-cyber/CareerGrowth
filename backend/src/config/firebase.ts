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

// Export services with crash protection
const createProxy = (name: string) => {
    return new Proxy({}, {
        get: (target, prop) => {
            return (...args: any[]) => {
                console.warn(`⚠️ Firebase ${name} called but not initialized. Action: ${String(prop)}`);
                // Return a "fake" chainable object for common Firestore/Auth patterns
                return createProxy(name);
            };
        }
    });
};

export const db: admin.firestore.Firestore = (() => {
    try {
        if (!admin.apps.length) return createProxy('Firestore') as any;
        return admin.firestore();
    } catch (e) {
        return createProxy('Firestore') as any;
    }
})();

export const auth: admin.auth.Auth = (() => {
    try {
        if (!admin.apps.length) return createProxy('Auth') as any;
        return admin.auth();
    } catch (e) {
        return createProxy('Auth') as any;
    }
})();
