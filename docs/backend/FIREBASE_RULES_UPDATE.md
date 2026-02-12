# 🚨 CRITICAL FIREBASE RULES UPDATE REQUIRED

Your app is failing to save assessment results because the **Firebase Security Rules** are blocking access. Since your project is connected to a live Firebase instance (not an emulator), you MUST update these rules in the Firebase Console manually.

## 1. Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project (**career-growth**)
3. Go to **Build** -> **Firestore Database**
4. Click the **Rules** tab

## 2. Replace Current Rules with These
Copy and paste the code below completely, replacing whatever is currently there:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user is logged in
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper: Check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // ==================================
    // 1. NOTIFICATIONS
    // ==================================
    match /notifications/{notificationId} {
      allow read: if true;  // Everyone can read system notifications
      allow write: if false; // Only backend service can write (use Admin SDK)
    }
    
    match /user_notification_reads/{readId} {
      // User can read/write their own read-receipts
      allow read: if isAuthenticated() && resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.user_id == request.auth.uid;
      allow update, delete: if false;
    }
    
    // ==================================
    // 2. USERS & ASSESSMENTS (CRITICAL FIX)
    // ==================================
    match /users/{userId} {
      allow read, update: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // ✅ THIS ALLOWS SAVING ASSESSMENT RESULTS
      match /assessments/{assessmentId} {
        allow read, write: if isOwner(userId);
      }
      
      // Allow any other user subcollections
      match /{document=**} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // ==================================
    // 3. OTHER COLLECTIONS
    // ==================================
    match /profiles/{profileId} {
      allow read, update: if isAuthenticated() && resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.user_id == request.auth.uid;
    }

    match /portfolios/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Default deny for everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 3. Publish
Click the **Publish** button to apply the changes immediately.

## 4. Verify Fix
1. Refresh your app.
2. The "Missing or insufficient permissions" error should disappear.
3. Submitting the assessment will now successfully save to the database.
