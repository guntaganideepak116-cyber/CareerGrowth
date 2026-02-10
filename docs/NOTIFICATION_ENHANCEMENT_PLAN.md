# Dynamic Daily Notifications Enhancement Plan

## Overview
Enhance the existing notification system to generate fresh notifications daily with proper read/unread tracking, following real-world application standards.

## Current System Analysis

### Frontend (Supabase)
- ✅ `useNotifications` hook with read/unread tracking
- ✅ Notifications UI with filtering and display
- ✅ Supabase tables: `notifications` and `user_notification_reads`
- ✅ Mark as read, mark all as read functionality

### Backend (Firestore)
- ✅ Daily cron job (6:00 AM) for notification generation
- ✅ AI-powered notifications using Gemini 2.0
- ✅ 22 career fields supported
- ✅ Weekly cleanup of old notifications

### Issue
Frontend uses Supabase, backend uses Firestore - need to align!

## Implementation Strategy

### Phase 1: Database Schema (Supabase)
Create proper Supabase tables to replace Firestore:

```sql
-- notifications table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  field_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('skill', 'trend', 'warning', 'certification', 'update', 'opportunity')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT,
  action_text TEXT,
  action_url TEXT,
  action_required BOOLEAN DEFAULT false,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes
CREATE INDEX idx_notifications_field ON notifications(field_id);
CREATE INDEX idx_notifications_date ON notifications(generated_date DESC);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- user_notification_reads table
CREATE TABLE user_notification_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_id TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, notification_id)
);

-- Indexes
CREATE INDEX idx_user_reads_user ON user_notification_reads(user_id);
CREATE INDEX idx_user_reads_notif ON user_notification_reads(notification_id);
```

### Phase 2: Backend Updates
1. **Switch from Firestore to Supabase**
   - Update `notifications.ts` to use Supabase client
   - Keep the same API endpoints
   - Maintain Gemini AI generation

2. **Daily Notification Generation**
   - Keep cron job at 6:00 AM
   - Add `generated_date` field to track daily batches
   - Ensure unique IDs per day per field

3. **Smart Generation Logic**
   ```typescript
   - Check if notifications already exist for today
   - Only generate if today's batch doesn't exist
   - Store with generated_date = CURRENT_DATE
   ```

### Phase 3: Frontend Updates
**NO UI CHANGES - only logic updates!**

1. **useNotifications Hook**
   - ✅ Already has proper read/unread tracking
   - ✅ Already fetches from Supabase
   - ➕ Add date filtering to show recent notifications first
   - ➕ Ensure proper merging of read status

2. **Notifications Page**
   - ✅ Existing UI stays the same
   - ➕ Group by date (Today, Yesterday, This Week, Older)
   - ➕ Show unread count badge
   - ➕ Highlight unread notifications visually

### Phase 4: Read/Unread Logic
1. **Mark as Read**
   - ✅ Already implemented
   - Insert into `user_notification_reads`
   - Update local state

2. **Mark All as Read**
   - ✅ Already implemented
   - Bulk insert unread notifications
   - Don't delete any data

3. **Daily Behavior**
   - New day → New notifications appear as unread
   - Previous notifications → Keep their read status
   - Unread count → Only count unread notifications

## Key Features

### ✅ Daily Generation
- New notifications every day at 6:00 AM
- Different content each day (AI-generated)
- Personalized to career fields

### ✅ Read/Unread Tracking
- Per-user read status
- Persistent across sessions
- Visual highlighting

### ✅ Notification History
- Keep 30 days of notifications
- Weekly cleanup (Sundays 2:00 AM)
- Show recent first

### ✅ Smart Filtering
- Filter by field, priority, category
- Search functionality
- Date grouping

## Testing Checklist

- [ ] Generate notifications for today
- [ ] Mark notifications as read
- [ ] Verify read notifications don't reappear
- [ ] Next day: new notifications appear
- [ ] Previous notifications still visible
- [ ] Unread count is accurate
- [ ] Mark all as read works correctly
- [ ] Cleanup removes old notifications (30+ days)
- [ ] UI remains unchanged
- [ ] Performance is good (100+ notifications)

## Migration Path

1. Create Supabase tables
2. Update backend to use Supabase
3. Test notification generation
4. Test read/unread tracking
5. Deploy changes
6. Monitor for 24 hours
7. Verify daily generation works

## Success Criteria

✅ Notifications generated daily automatically
✅ Each day has unique content
✅ Read/unread status persists correctly
✅ Unread count is accurate
✅ No UI/UX changes
✅ Performance remains good
✅ History is maintained for 30 days
