import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging, db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const NotificationSetup = () => {
  useEffect(() => {
    const setupNotifications = async (user: any) => {
      if (!user) return;

      try {
        // 1. Request Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return;
        }

        // 2. Get FCM Token
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY
        });

        if (currentToken) {
          console.log('FCM Token received:', currentToken);
          
          // 3. Store Token in Firestore
          // Fetch user profile to get field and specialization
          const userProfileRef = doc(db, 'user_profiles', user.uid);
          const userProfileSnap = await getDoc(userProfileRef);
          
          let field = 'general';
          let specialization = '';
          
          if (userProfileSnap.exists()) {
              const data = userProfileSnap.data();
              field = data.field || 'general';
              specialization = data.specialization || '';
          }

          // Generate a unique ID for this token storage (userId + some token hash or just use token)
          // To avoid duplicates, we check if this token already exists
          const tokenId = btoa(currentToken).substring(0, 50); // Simple hash-like string

          await setDoc(doc(db, 'user_tokens', tokenId), {
              userId: user.uid,
              token: currentToken,
              field: field.toLowerCase(),
              specialization: specialization.toLowerCase(),
              lastActive: new Date().toISOString(),
              deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              createdAt: new Date().toISOString()
          }, { merge: true });

          console.log('FCM Token saved to Firestore');
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setupNotifications(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // This is a logic-only component
};
