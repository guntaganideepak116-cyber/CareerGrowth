import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase config
if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing! Check your .env file.");
    console.error("Current env:", {
        hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID
    });
}

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistent cache and long-polling for better stability
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true
});

// Enable persistence to maintain auth state across refreshes
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Firebase Auth persistence enabled (local storage)");
    })
    .catch((error) => {
        console.error("❌ Failed to enable Firebase persistence:", error);
    });

console.log("Firebase initialized successfully");
