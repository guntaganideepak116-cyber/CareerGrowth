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

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'CareerGrowth Update';
  const notificationOptions = {
    body: payload.notification.body || 'Check out the latest update on your dashboard.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data // Contains the URL
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click 
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
