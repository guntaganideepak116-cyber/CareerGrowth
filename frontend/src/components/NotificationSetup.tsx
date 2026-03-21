import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const NotificationSetup = () => {
  useEffect(() => {
    // 1. Setup foreground listener
    const unsubscribeFCM = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast(payload.notification?.title || 'New Notification', {
            description: payload.notification?.body,
            duration: 5000,
            action: payload.data?.url ? {
                label: 'View',
                onClick: () => window.open(payload.data?.url, '_blank')
            } : undefined
        });
    });

    const setupNotifications = async (user: User) => {
      if (!user) return;

      try {
        // 1. Request Permission
        console.log('[NotificationSetup] Requesting notification permission...');
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
            console.warn('[NotificationSetup] Permission denied by user');
            return;
        }

        // 2. Explicitly register and wait for service worker to be READY
        console.log('[NotificationSetup] Registering service worker...');
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
        });
        
        // Wait for it to be actually ready
        await navigator.serviceWorker.ready;
        console.log('[NotificationSetup] Service Worker is READY:', registration);

        // 3. Get FCM Token
        try {
            const currentToken = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (currentToken) {
                console.log('[NotificationSetup] Successfully generated Device Token:', currentToken);
                
                // 4. Store Token in Firestore (Optimized)
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
    } catch (err) {
      console.error('[NotificationSetup] Outer setup error:', err);
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
