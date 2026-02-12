# Daily Notification System - Complete Guide

## Overview
The CareerGrowth platform features a **professional-grade notification system** that generates fresh notifications daily, tracks read/unread status per user, and maintains notification history—just like LinkedIn, Gmail, and other real-world applications.

## ✅ Key Features

### 1. **Daily Automatic Generation**
- **Schedule**: Every day at **6:00 AM IST** (12:30 AM UTC)
- **Scope**: 3 notifications per field × 22 fields = **66 new notifications daily**
- **Content**: AI-generated using Gemini 2.0 Flash
  - Industry trends and updates
  - Skill development opportunities
  - Career opportunities
  - Learning resources
  - Upcoming events

### 2. **Per-User Read Tracking**
- Each user has **independent read/unread status**
- Read status stored in `user_notification_reads` collection
- Marking as read **does NOT delete** notifications
- Notifications remain accessible as **history**

### 3. **Day-Wise Accumulation**
```
Day 1 (Feb 6):  66 notifications generated → All unread
User marks 30 as read → 36 unread remain

Day 2 (Feb 7):  66 NEW notifications generated → 66 unread
Previous 66:    36 still unread + 30 already read
Total visible:  132 notifications (102 unread, 30 read)

Day 3 (Feb 8):  66 NEW notifications generated → 66 unread
Total visible:  198 notifications (varies by read status)
```

### 4. **Visual Distinction**

#### **Unread Notifications** (New):
- ✨ **Animated blue dot** in top-right corner
- 🎨 **Subtle blue background tint**
- 🔵 **Border**: Primary color (blue)
- 📝 **Text**: Bold, high contrast
- 🏷️ **Badge**: "(New)" label next to title
- 💬 **Message**: Full contrast text

#### **Read Notifications** (History):
- ⚪ **No indicator dot**
- 🎨 **Normal background**
- ⚫ **Border**: Transparent
- 📝 **Text**: Muted gray color
- 🔇 **Opacity**: 75% (subtle appearance)
- 💬 **Message**: Muted text

### 5. **Unread Count Badge**
- **Sidebar**: Red badge on "Notifications" menu item
- **Count Display**: Shows up to 99, then "99+"
- **Header Stats**: Real-time unread count
- **Responsive**: Updates immediately after marking as read

### 6. **Mark All as Read**
- Updates **read status only**
- Does **NOT** delete notifications
- Notifications **remain visible in history**
- Future daily notifications still appear as **unread**

## 🔧 Technical Architecture

### Backend Structure

#### **Notifications Collection** (Firestore)
```typescript
{
  id: "engineering-1738823892000-0",
  field_id: "engineering",
  field_name: "Engineering & Technology",
  type: "trend" | "skill" | "opportunity" | "update",
  title: "AI-Powered Development Tools",
  message: "GitHub Copilot X now integrates...",
  priority: "high" | "medium" | "low",
  category: "Industry Update",
  actionText: "Learn More",
  actionUrl: "https://...",
  action_required: false,
  generated_date: "2026-02-06", // YYYY-MM-DD
  created_at: "2026-02-06T06:18:12.000Z", // UTC ISO 8601
  timestamp: 1738823892000, // Unix timestamp for sorting
  read: false // NOT USED (kept for backwards compatibility)
}
```

#### **User Notification Reads Collection** (Firestore)
```typescript
{
  user_id: "abc123xyz",
  notification_id: "engineering-1738823892000-0",
  read_at: Timestamp(2026-02-06T08:30:00Z)
}
```

### Frontend Logic

#### **useNotifications Hook**
```typescript
const {
  notifications,      // All notifications (read + unread)
  loading,           // Loading state
  error,            // Error message
  unreadCount,      // Count of unread notifications
  markAsRead,       // Mark single notification as read
  markAllAsRead,    // Mark all as read
  refresh,          // Refresh notification list
} = useNotifications();
```

#### **Read Status Merging**
1. Fetch all notifications from `notifications` collection
2. Fetch user's read IDs from `user_notification_reads`
3. Merge: Set `is_read: true` if notification ID exists in user's reads
4. Return merged list

## 📅 Daily Generation Flow

### Automatic Schedule (Production)
```
12:30 AM UTC = 6:00 AM IST
├── Cron job triggers
├── POST /api/notifications/generate-daily
├── Check if notifications exist for today (prevent duplicates)
├── Generate 3 notifications per field (AI-powered)
├── Store in Firestore
└── Notifications available immediately for all users
```

### Manual Trigger (Development/Testing)
```bash
# Force generate today's notifications (ignores existing check)
curl -X POST http://localhost:5000/api/notifications/generate-daily?force=true

# Generate for specific field only
curl -X POST http://localhost:5000/api/notifications/field/engineering/generate
```

## 🎯 User Experience

### Scenario 1: Daily Active User
```
Feb 6, 9:00 AM:
- User logs in
- Sees 66 new notifications (from 6:00 AM generation)
- Unread badge: 66

User reads 40 notifications:
- Unread badge: 26
- Read notifications appear muted
- Unread remain highlighted

Feb 7, 9:00 AM:
- User logs in
- Sees 66 NEW notifications (from today's 6:00 AM)
- Plus yesterday's 26 unread
- Plus yesterday's 40 read (in history)
- Total: 132 notifications
- Unread badge: 92
```

### Scenario 2: Weekend User (Doesn't log in for 3 days)
```
Feb 6: 66 notifications generated
Feb 7: 66 notifications generated
Feb 8: 66 notifications generated

User logs in Feb 8 evening:
- Total: 198 notifications
- All unread (since user hasn't marked any)
- Unread badge: 198
- Notifications sorted by timestamp (newest first)
```

### Scenario 3: Mark All as Read
```
User has:
- 150 total notifications
- 80 unread

User clicks "Mark All as Read":
- Backend creates 80 read records
- All 150 notifications remain visible
- All appear muted (read style)
- Unread badge: 0

Next day (Feb 9):
- 66 NEW notifications generated
- Previous 150: All read
- Unread badge: 66 (only new ones)
```

## 🎨 UI Components

### Notification Card Structure
```tsx
<div className={unread ? "highlighted" : "muted"}>
  {unread && <AnimatedDot />} {/* Blue pinging dot */}
  
  <Icon />
  
  <div>
    <h3>{title} {unread && "(New)"}</h3>
    
    <div className="metadata">
      <span>{category}</span>
      <span>{field_name}</span>
      <span><Clock /> {formatRelativeIST(created_at)}</span>
    </div>
    
    <p>{message}</p>
    
    <div className="actions">
      <Button href={actionUrl}>Learn More</Button>
      {unread && <Button onClick={markAsRead}>Mark as read</Button>}
      <Button onClick={dismiss}>×</Button>
    </div>
  </div>
</div>
```

### Sidebar Badge
```tsx
<Link to="/notifications">
  <Bell />
  Notifications
  {unreadCount > 0 && (
    <span className="badge">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )}
</Link>
```

## 🔄 Data Sync & Real-Time Behavior

### On Login/Page Refresh
1. ✅ Fetch all notifications (last 100)
2. ✅ Fetch user's read IDs
3. ✅ Merge and display
4. ✅ Calculate unread count
5. ✅ Update badge

### On Mark as Read
1. ✅ Create read record in Firestore
2. ✅ Update local state (optimistic update)
3. ✅ Update unread count
4. ✅ Update badge immediately

### On New Day
1. ✅ Notifications auto-generated at 6:00 AM
2. ✅ User sees new notifications on next refresh
3. ✅ Previous notifications remain visible
4. ✅ Only NEW notifications are unread

## 📊 Statistics & Analytics

### Notification Page Header
```
┌─────────────────────────────────────────┐
│ Total: 198    Unread: 92    Read: 106  │
└─────────────────────────────────────────┘
```

### Filters
- **All** / **Unread** tabs
- **Priority**: All, High, Medium, Low
- **Field**: Filter by specific field

### Sorting
- **Default**: Newest first (timestamp DESC)
- **Grouped by date**: Today, Yesterday, This Week, Older

## 🧹 Automatic Cleanup

### Weekly Cleanup (Sunday 2:00 AM)
```
Deletes notifications older than 30 days
├── Keeps recent history (30 days)
├── Prevents database bloat
├── Read records also cleaned up
└── Runs automatically every Sunday
```

## 🚀 Deployment Checklist

### Environment Variables
```bash
GEMINI_API_KEY=your_api_key          # For AI generation
NODE_ENV=production                   # Enable cron jobs
API_URL=https://your-api.com         # For scheduler
```

### Firestore Indexes
```
Collection: notifications
├── Index: timestamp (DESC)
└── Composite: generated_date + field_id

Collection: user_notification_reads
├── Index: user_id
└── Composite: user_id + notification_id
```

### Cron Job Verification
```bash
# Check if scheduler is running
curl http://localhost:5000/api/notifications/stats

# Manually trigger generation
curl -X POST http://localhost:5000/api/notifications/generate-daily?force=true

# Check count
curl http://localhost:5000/api/notifications/all?limit=10
```

## 🎓 For Expo Demo

### Talking Points

**"Our notification system operates like LinkedIn:"**

1. **Daily Updates**: "AI generates 66 personalized notifications daily at 6 AM using Gemini 2.0, covering all 22 career fields."

2. **Smart Tracking**: "Each user's read status is tracked independently. Marking notifications as read doesn't delete them—they remain accessible as history."

3. **Visual Clarity**: "Unread notifications are clearly highlighted with animated indicators and badges, just like professional platforms."

4. **Accumulation**: "If you don't log in for a few days, notifications accumulate day by day. The system shows exactly when each was created with IST timestamps."

5. **Professional UX**: "Our badge counters, filters, and sorting provide the same experience you'd expect from Gmail or LinkedIn."

### Live Demo Flow

1. **Show unread badge** on sidebar (e.g., 43)
2. **Open Notifications page** → Show stats (Total, Unread, Read)
3. **Point out visual distinction** → Animated dot, highlighting, "(New)" label
4. **Show timestamps** → "Today • 11:48 AM IST"
5. **Mark one as read** → Watch it fade, badge updates
6. **Click "Mark All as Read"** → Badge goes to 0, all notifications stay visible (muted)
7. **Explain daily generation** → "Tomorrow at 6 AM, 66 new notifications will appear"

## 📋 Summary

✅ **Daily Generation**: 6:00 AM IST (automatic)  
✅ **Per-User Tracking**: Independent read status  
✅ **Day-Wise Accumulation**: Notifications stack up  
✅ **Visual Distinction**: Unread = highlighted, Read = muted  
✅ **Mark All as Read**: Updates status, keeps history  
✅ **Real-Time Badges**: Sidebar + Header counters  
✅ **IST Timestamps**: Precise, relative time display  
✅ **Auto Cleanup**: 30-day retention  

This system provides a **production-ready, professional-grade** notification experience! 🎉
