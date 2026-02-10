import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Ensure Firebase is only initialized once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

import { enableIndexedDbPersistence, terminate } from 'firebase/firestore';

// Enable multi-tab offline persistence for Firestore
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db, { forceOwnership: false })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Firestore Persistence: Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('Firestore Persistence: The current browser does not support persistence.');
            }
        });
}

// Enable tab-level persistence
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("✅ Firebase Auth: Tab-level session persistence enabled");
    })
    .catch((error) => {
        console.error("❌ Failed to enable tab-level persistence:", error);
    });

console.log("Firebase initialized successfully");
