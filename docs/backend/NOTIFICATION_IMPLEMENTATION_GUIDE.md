# Dynamic Daily Notifications - Implementation Guide

## 🎯 Overview

This guide explains how to implement and test the enhanced notification system with daily generation and proper read/unread tracking.

## 📋 Prerequisites

- ✅ Supabase project set up
- ✅ Backend server running
- ✅ Frontend connected to Supabase
- ✅ Gemini API key configured

## 🚀 Step-by-Step Implementation

### Step 1: Set Up Database Schema

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**

2. **Run the schema file**
   - Open `database/notifications_schema.sql`
   - Copy and paste the entire content
   - Click **Run**

3. **Verify tables created**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('notifications', 'user_notification_reads');
   ```

   Should return:
   - notifications
   - user_notification_reads

### Step 2: Configure Backend Environment

1. **Add Supabase credentials** to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

2. **Install Supabase client**:
   ```bash
   cd backend
   npm install @supabase/supabase-js
   ```

3. **Restart backend server**:
   ```bash
   npm run dev
   ```

### Step 3: Test Notification Generation

#### Manual Test (Recommended First)
```bash
# Trigger notification generation manually
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

#### Verify in Database
```sql
-- Check notifications were created
SELECT 
    generated_date,
    field_name,
    COUNT(*) as count
FROM notifications
GROUP BY generated_date, field_name
ORDER BY generated_date DESC, field_name;
```

#### Check if running again prevents duplicates
```bash
# Run again - should skip generation
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

### Step 4: Test Read/Unread Tracking

1. **Open the frontend** and log in
2. **Navigate to Notifications page**
3. **Verify notifications appear**
   - Should see today's generated notifications
   - All should be marked as "unread" (highlighted)
   - Unread count badge should be visible

4. **Mark one notification as read**
   - Click on a notification
   - Verify it's now marked as read
   - Unread count should decrease by 1

5. **Verify persistence**
   - Refresh the page
   - Notification should still be marked as read
   - Unread count should remain the same

6. **Test "Mark All as Read"**
   - Click "Mark All as Read" button
   - All notifications should be marked as read
   - Unread count should be 0

### Step 5: Test Daily Behavior

#### Simulate Next Day

1. **Manually create tomorrow's notifications**:
   ```sql
   -- Insert notifications for tomorrow
   INSERT INTO notifications (
       id, field_id, field_name, type, title, message, 
       priority, category, generated_date
   ) VALUES (
       'test-tomorrow-1',
       'engineering',
       'Engineering & Technology',
       'trend',
       'Tomorrow''s Notification',
       'This is a test notification for tomorrow',
       'high',
       'Industry Update',
       CURRENT_DATE + INTERVAL '1 day'
   );
   ```

2. **Change your system date** to tomorrow (or wait 24 hours)

3. **Refresh the notifications page**
   - Tomorrow's notifications should appear
   - They should be marked as **unread**
   - Previous (today's) notifications should **still show their read status**

4. **Verify accumulated notifications**
   - You should see both today's and tomorrow's notifications
   - Only tomorrow's should be unread
   - Unread count = tomorrow's notifications only

### Step 6: Test Cron Job

The cron job runs daily at 6:00 AM. To verify it's working:

1. **Check backend logs** at 6:00 AM:
   ```
   📅 Notification scheduler initialized
   🔔 [2026-02-03T06:00:00.000Z] Running daily notification generation...
   📝 Generating notifications for Engineering & Technology...
   ✅ Generated 66 notifications for 22 fields
   ```

2. **Or manually test the scheduler**:
   ```javascript
   // In backend/src/server.ts, temporarily change cron schedule:
   cron.schedule('* * * * *', async () => { // Run every minute
       // ... notification generation code
   });
   ```

### Step 7: Test Cleanup

1. **Create old notifications** (30+ days):
   ```sql
   INSERT INTO notifications (
       id, field_id, field_name, type, title, message,
       priority, category, generated_date
   ) VALUES (
       'old-notif-1',
       'engineering',
       'Engineering & Technology',
       'update',
       'Old Notification',
       'This should be deleted',
       'low',
       'Update',
       CURRENT_DATE - INTERVAL '31 days'
   );
   ```

2. **Run cleanup**:
   ```bash
   curl -X DELETE http://localhost:5000/api/notifications/old
   ```

3. **Verify old notifications deleted**:
   ```sql
   SELECT COUNT(*) 
   FROM notifications 
   WHERE generated_date < CURRENT_DATE - INTERVAL '30 days';
   -- Should return 0
   ```

## ✅ Testing Checklist

### Basic Functionality
- [ ] Database schema created successfully
- [ ] Backend can connect to Supabase
- [ ] Manual notification generation works
- [ ] Notifications appear in frontend
- [ ] Can mark single notification as read
- [ ] Can mark all notifications as read
- [ ] Read status persists across page refresh

### Daily Generation
- [ ] Notifications generated daily at 6:00 AM
- [ ] Each day has unique content (AI-generated)
- [ ] Duplicate prevention works (no double generation)
- [ ] Notifications are field-specific

### Read/Unread Logic
- [ ] New notifications appear as unread
- [ ] Unread count is accurate
- [ ] Read notifications don't count toward unread
- [ ] Mark all as read works correctly
- [ ] Read status is per-user

### History & Cleanup
- [ ] Can view notifications from previous days
- [ ] Notifications older than 30 days are cleaned up
- [ ] Cleanup runs weekly (Sundays 2:00 AM)

### Performance
- [ ] Page loads quickly with 100+ notifications
- [ ] Marking as read is instant
- [ ] Filtering works smoothly
- [ ] No memory leaks

### Edge Cases
- [ ] Works with no notifications
- [ ] Works with 100+ notifications
- [ ] Works offline (shows cached data)
- [ ] Handles API errors gracefully
- [ ] Handles duplicate read attempts

## 🐛 Troubleshooting

### Issue: Notifications not appearing

**Check:**
1. Are notifications in the database?
   ```sql
   SELECT COUNT(*) FROM notifications;
   ```
2. Is the frontend connected to the correct Supabase project?
3. Are RLS policies enabled and correct?

**Fix:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

### Issue: Read status not saving

**Check:**
1. Is user authenticated?
2. Does user_notification_reads table exist?
3. Are there unique constraint violations?

**Fix:**
```sql
-- Check for duplicate inserts
SELECT user_id, notification_id, COUNT(*) 
FROM user_notification_reads 
GROUP BY user_id, notification_id 
HAVING COUNT(*) > 1;
```

### Issue: Duplicate notifications generated

**Check:**
1. Is the date check working?
2. Are there multiple cron jobs running?

**Fix:**
```sql
-- Clear today's notifications and regenerate
DELETE FROM notifications WHERE generated_date = CURRENT_DATE;
```

### Issue: Cron job not running

**Check:**
1. Is the backend server running?
2. Is the cron schedule correct?
3. Check backend logs

**Fix:**
```bash
# Test cron manually
curl -X POST http://localhost:5000/api/notifications/generate-daily
```

## 📊 Monitoring

### Daily Checks
```bash
# Check notification stats
curl http://localhost:5000/api/notifications/stats
```

### Weekly Checks
```sql
-- Notifications generated per day (last 7 days)
SELECT 
    generated_date,
    COUNT(*) as total,
    COUNT(DISTINCT field_id) as fields
FROM notifications
WHERE generated_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY generated_date
ORDER BY generated_date DESC;
```

### Monthly Checks
```sql
-- Read rate per user
SELECT 
    u.user_id,
    COUNT(DISTINCT r.notification_id) as read_count,
    (SELECT COUNT(*) FROM notifications) as total_notifications,
    ROUND(COUNT(DISTINCT r.notification_id)::numeric / (SELECT COUNT(*) FROM notifications) * 100, 2) as read_percentage
FROM user_notification_reads r
JOIN (SELECT DISTINCT user_id FROM user_notification_reads) u ON u.user_id = r.user_id
GROUP BY u.user_id
ORDER BY read_percentage DESC;
```

## 🎉 Success Criteria

✅ Notifications are generated daily automatically
✅ Each day has unique, AI-generated content
✅ Read/unread status persists correctly
✅ Unread count is always accurate
✅ No UI/UX changes (looks the same)
✅ Performance is excellent
✅ History is maintained for 30 days
✅ Users receive personalized notifications

## 📚 Additional Resources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review backend logs
3. Check Supabase logs
4. Verify environment variables
5. Test with manual API calls

---

**Last Updated:** 2026-02-02
**Version:** 1.0.0
