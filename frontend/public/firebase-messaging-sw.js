// Scripts for firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyA1K8bZMyB3xtHOMp2ZFxSBHwaE-aJi694",
  authDomain: "careergrowth-5978d.firebaseapp.com",
  projectId: "careergrowth-5978d",
  storageBucket: "careergrowth-5978d.firebasestorage.app",
  messagingSenderId: "519209088433",
  appId: "1:519209088433:web:20dacb2eb83f6bd2e6b990"
});

const messaging = firebase.messaging();

// ------------------------------------------------------------
// STEP 2: SERVICE WORKER PUSH HANDLER
// ------------------------------------------------------------
self.addEventListener("push", function(event) {
    console.log('[firebase-messaging-sw.js] Push Received.');
    if (!event.data) return;

    let data;
    try {
        data = event.data.json();
    } catch (e) {
        // Fallback for non-JSON data
        console.warn('Non-JSON push received:', event.data.text());
        return;
    }

    // Extract from our custom data-only payload
    const payload = data.data || data;
    const notificationTitle = payload.title || 'Career Update';
    const notificationOptions = {
        body: payload.body || 'New notification received.',
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        data: {
          url: payload.url || "/dashboard"
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

// ------------------------------------------------------------
// STEP 3: NOTIFICATION CLICK HANDLING
// ------------------------------------------------------------
self.addEventListener("notificationclick", function(event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.');
    event.notification.close();

    const targetUrl = event.notification.data.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                // Check if the URL matches (base comparison)
                if (client.url.includes(targetUrl) && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
