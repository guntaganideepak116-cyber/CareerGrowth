# Firebase/Firestore Dynamic Notifications - Implementation Guide

## 🎯 Overview

Complete Firebase/Firestore-based notification system with daily generation and per-user read/unread tracking.
**NO SUPABASE** - Everything uses Firebase!

## 📋 Architecture

```
Frontend (React)
├─ useNotifications Hook (Firestore)
├─ Firebase SDK
└─ Real-time sync

Backend (Node.js/Express)
├─ Notification Generation (Gemini AI)
├─ Firebase Admin SDK
└─ Cron Jobs (daily/weekly)

Database (Firestore)
├─ notifications collection
└─ user_notification_reads collection
```

## 🗄️ Firestore Collections

### 1. `notifications` Collection

```typescript
{
  id: string,                    // Auto-generated ID (field-timestamp-index)
  field_id: string,              // e.g., 'engineering', 'medical'
  field_name: string,            // e.g., 'Engineering & Technology'
  type: string,                  // 'skill' | 'trend' | 'opportunity' | 'update'
  title: string,                 // Notification title (max 60 chars)
  message: string,               // Notification message (100-150 chars)
  priority: string,              // 'high' | 'medium' | 'low'
  category: string,              // 'Industry Update', 'Skill Development', etc.
  actionText: string,            // 'Learn More', 'Explore Now', etc.
  actionUrl: string,             // External link
  action_required: boolean,      // true if high priority
  generated_date: string,        // 'YYYY-MM-DD' (for daily batches)
  date: string,                  // ISO timestamp
  timestamp: number,             // Unix timestamp (for sorting)
  read: boolean                  // Global read flag (not used per-user)
}
```

### 2. `user_notification_reads` Collection

```typescript
{
  user_id: string,               // Firebase Auth UID
  notification_id: string,       // Reference to notification doc ID
  read_at: timestamp             // Server timestamp when marked as read
}
```

## 🚀 Quick Start

### Step 1: Deploy Firestore Rules & Indexes

1. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

3. **Or manually add via Firebase Console:**
   - Go to Firestore Database → Indexes
   - Create composite indexes from `firestore.indexes.json`

### Step 2: Environment Setup

**Backend `.env`:**
```env
# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=5000
```

**Frontend `.env`:**
```env
# Firebase Web SDK
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API
VITE_API_URL=http://localhost:5000
```

### Step 3: Install Dependencies

**Backend:**
```bash
cd backend
npm install firebase-admin @google/generative-ai node-cron
```

**Frontend:**
```bash
cd frontend
npm install firebase
```

### Step 4: Start Services

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## ✅ Testing

### Test 1: Generate Notifications

```bash
# Generate notifications for today
curl -X POST http://localhost:5000/api/notifications/generate-daily
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Generated 66 notifications for 2026-02-02",
  "count": 66,
  "fields": 22,
  "date": "2026-02-02",
  "timestamp": "2026-02-02T14:30:00.000Z"
}
```

### Test 2: View Notifications in Frontend

1. Log in to the app
2. Navigate to **Notifications** page
3. Should see 66 notifications (all unread)
4. Unread count badge should show "66"

### Test 3: Mark as Read

1. Click on a notification
2. It should lose the "unread" highlight
3. Unread count should decrease to "65"
4. Refresh page → notification still read

### Test 4: Mark All as Read

1. Click "Mark All as Read" button
2. All notifications lose highlight
3. Unread count becomes "0"
4. Refresh → all still read

### Test 5: Duplicate Prevention

```bash
# Try to generate again for same day
curl -X POST http://localhost:5000/api/notifications/generate-daily
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notifications for 2026-02-02 already exist",
  "alreadyExists": true,
  "date": "2026-02-02"
}
```

### Test 6: Daily Behavior (Simulate Next Day)

**Via Firestore Console:**
1. Go to Firestore Database
2. Create a notification manually with:
   - `generated_date`: "2026-02-03" (tomorrow)
   - `timestamp`: `Date.now()`
   - Other required fields

3. Refresh notifications page
4. Should see tomorrow's notification as **unread**
5. Today's notifications still show their read status

### Test 7: Cleanup Old Notifications

```bash
# Delete notifications older than 30 days
curl -X DELETE http://localhost:5000/api/notifications/old
```

## 📊 Data Flow

### Daily Generation Flow

```
6:00 AM Cron Job
    ↓
Check: Notifications exist for today?
    ├─ Yes → Skip generation
    └─ No → Continue
         ↓
For each of 22 fields:
    ↓
Call Gemini API
    ↓
Generate 3 notifications (trend, skill, opportunity)
    ↓
Add metadata (id, timestamp, generated_date)
    ↓
Save to Firestore batch
    ↓
Commit batch
    ↓
✅ 66 notifications created
```

### Read Tracking Flow

```
User clicks notification
    ↓
markAsRead(notificationId)
    ↓
Check: Already read?
    ├─ Yes → Skip
    └─ No → Continue
         ↓
Add document to user_notification_reads
    {
      user_id: "user123",
      notification_id: "notif456",
      read_at: serverTimestamp()
    }
    ↓
Update local state (is_read: true)
    ↓
Unread count decreases
```

### Fetch Flow

```
Frontend: fetchNotifications()
    ↓
Query notifications (last 100, sorted by timestamp)
    ↓
Query user_notification_reads (for current user)
    ↓
Create Set of read notification IDs
    ↓
Merge: notifications + read status
    ↓
Return merged array
    ↓
Display in UI (highlight unread)
```

## 🔒 Security Rules

### Notifications

- ✅ **Read**: Anyone (public)
- ❌ **Write**: Only backend service account

### User Notification Reads

- ✅ **Read**: Only own records
- ✅ **Create**: Only own user_id
- ❌ **Update/Delete**: Disabled

## 📈 Performance Optimizations

### Indexes Created

1. **notifications by field + timestamp**
   - For filtering by career field

2. **notifications by generated_date + timestamp**
   - For daily batches and history

3. **user_notification_reads by user_id + notification_id**
   - For fast read status lookups

4. **user_notification_reads by user_id + read_at**
   - For read history tracking

### Batch Operations

- **Mark all as read**: Uses Firestore batch writes (up to 500 ops)
- **Daily generation**: Uses batch commits for atomic writes
- **Cleanup**: Batch deletes for efficiency

## 🛠️ Firestore Console Commands

### View All Notifications

```
Firestore → notifications → View documents
```

### View User Reads

```
Firestore → user_notification_reads → Filter by user_id
```

### Manually Create Test Notification

```javascript
{
  id: "test-" + Date.now(),
  field_id: "engineering",
  field_name: "Engineering & Technology",
  type: "trend",
  title: "Test Notification",
  message: "This is a test",
  priority: "high",
  category: "Industry Update",
  actionText: "Learn More",
  actionUrl: "https://example.com",
  action_required: true,
  generated_date: "2026-02-02",
  date: new Date().toISOString(),
  timestamp: Date.now(),
  read: false
}
```

### Delete All Notifications (Reset)

⚠️ **Warning:** This deletes all data!

```bash
# Via backend API
curl -X DELETE http://localhost:5000/api/notifications/old?days=0
```

## 🐛 Troubleshooting

### Issue: Notifications not appearing

**Check:**
```javascript
// In browser console
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const snap = await getDocs(collection(db, 'notifications'));
console.log('Notification count:', snap.size);
console.log('Documents:', snap.docs.map(d => d.data()));
```

**Fix:**
- Verify Firestore rules allow read access
- Check Firebase project ID matches
- Ensure notifications were generated

### Issue: Read status not saving

**Check:**
```javascript
// Check if write succeeds
const readsRef = collection(db, 'user_notification_reads');
const testDoc = await addDoc(readsRef, {
  user_id: user.id,
  notification_id: 'test-123',
  read_at: serverTimestamp()
});
console.log('Write succeeded:', testDoc.id);
```

**Fix:**
- Verify Firestore rules allow create on user_notification_reads
- Check user is authenticated
- Ensure user.id is correct

### Issue: Duplicate notifications

**Check:**
```javascript
// Check generated_date field
const today = new Date().toISOString().split('T')[0];
const snap = await getDocs(
  query(
    collection(db, 'notifications'),
    where('generated_date', '==', today)
  )
);
console.log(`Notifications for ${today}:`, snap.size);
```

**Fix:**
- Delete duplicates via Firestore console
- Restart backend server
- Check cron job isn't running multiple times

### Issue: CORS errors

**Fix:**
```typescript
// backend/src/server.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## 📝 Cron Job Schedule

```javascript
// Daily generation: 6:00 AM
cron.schedule('0 6 * * *', generateDaily);

// Weekly cleanup: Sunday 2:00 AM
cron.schedule('0 2 * * 0', cleanupOld);
```

**Manual triggers:**
```bash
# Generate notifications now
curl -X POST http://localhost:5000/api/notifications/generate-daily

# Cleanup old notifications
curl -X DELETE http://localhost:5000/api/notifications/old
```

## 🎉 Success Criteria

✅ Notifications generated daily at 6:00 AM
✅ Unique AI-generated content each day
✅ Per-user read/unread tracking
✅ Read status persists across sessions
✅ Unread count is always accurate
✅ Mark all as read works
✅ No duplicate generation
✅ 30-day history maintained
✅ NO SUPABASE - 100% Firebase!

## 📚 Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Gemini API](https://ai.google.dev/gemini-api/docs)

---

**Last Updated:** 2026-02-02
**Version:** 2.0.0 (Firebase Only)
