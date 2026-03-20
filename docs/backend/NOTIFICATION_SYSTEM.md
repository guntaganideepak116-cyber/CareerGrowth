# Notification System Documentation

## Overview
The Intelligence Career platform features an AI-powered notification system that generates personalized, field-specific career updates, learning opportunities, and industry trends for students.

## Features
- **AI-Generated Content**: Uses Google's Gemini AI to create relevant, actionable notifications
- **22 Career Fields Covered**: Generates notifications for Engineering, Medical, Science, Arts, Commerce, Law, and 16 other specialized fields
- **Automated Scheduling**: Runs daily at 6:00 AM automatically
- **Manual Triggering**: Admin can generate notifications on-demand
- **Field-Specific**: Each field gets 3 tailored notifications daily (trend, skill, opportunity)
- **Automatic Cleanup**: Removes notifications older than 30 days every Sunday

## Architecture

### Backend Components
1. **`/routes/notifications.ts`** - API endpoints for notification management
2. **`/services/notificationScheduler.ts`** - Cron jobs for automation
3. **Firebase Firestore** - Database storage for notifications

### Frontend Components
1. **`/pages/admin/NotificationsControl.tsx`** - Admin dashboard for managing notifications
2. **Notification display components** - (To be implemented in user dashboard)

## API Endpoints

### Generate Daily Notifications
```
POST /api/notifications/generate-daily
```
Generates 3 notifications for each of the 22 fields using AI.

**Response:**
```json
{
  "success": true,
  "message": "Generated X notifications",
  "count": 66,
  "fields": 22,
  "timestamp": "2026-01-31T09:42:00Z"
}
```

### Get All Recent Notifications
```
GET /api/notifications/all?limit=50
```
Retrieves recent notifications across all fields.

**Query Parameters:**
- `limit` (optional): Number of notifications to retrieve (default: 50)

### Get Field-Specific Notifications
```
GET /api/notifications/field/:fieldId?limit=20
```
Retrieves notifications for a specific career field.

**Parameters:**
- `fieldId`: Field identifier (e.g., 'engineering', 'medical', 'cloud-computing')
- `limit` (optional): Number of notifications (default: 20)

### Cleanup Old Notifications
```
DELETE /api/notifications/old
```
Deletes all notifications older than 30 days.

## Supported Career Fields

### Traditional Fields (13)
1. Engineering & Technology
2. Medical & Health Sciences
3. Science & Research
4. Arts, Humanities & Degree
5. Commerce, Business & Management
6. Law & Public Services
7. Education & Teaching
8. Design, Media & Creative Arts
9. Defense, Security & Physical Services
10. Agriculture & Environmental Studies
11. Hospitality, Travel & Tourism
12. Sports, Fitness & Lifestyle
13. Skill-Based & Vocational Fields

### Emerging Tech Fields (9)
14. Cloud Computing
15. DevOps & Site Reliability Engineering
16. Blockchain & Web3
17. AR / VR / Mixed Reality
18. Quantum Computing
19. Robotics & Automation
20. Bioinformatics & Computational Biology
21. Product Management & Tech Leadership
22. UI/UX & Human–Computer Interaction

## Notification Structure

Each notification contains:
```typescript
{
  id: string;              // Unique identifier
  field_id: string;        // Field identifier
  field_name: string;      // Human-readable field name
  title: string;           // Notification title (max 60 chars)
  message: string;         // Detailed message (100-150 chars)
  priority: 'high' | 'medium' | 'low';
  category: string;        // Industry Update, Skill Development, etc.
  date: string;            // ISO timestamp
  timestamp: number;       // Unix timestamp
  read: boolean;           // Read status (for user tracking)
  actionText?: string;     // CTA button text
  actionUrl?: string;      // External resource link
}
```

## Notification Categories
- **Industry Update** - Latest trends and news
- **Skill Development** - Learning opportunities
- **Career Opportunity** - Job openings, internships
- **Upcoming Event** - Conferences, webinars
- **Learning Resource** - Courses, tutorials, books

## Automation Schedule

### Daily Generation (6:00 AM)
```javascript
cron.schedule('0 6 * * *', async () => {
  // Generates notifications for all 22 fields
});
```

### Weekly Cleanup (Sunday 2:00 AM)
```javascript
cron.schedule('0 2 * * 0', async () => {
  // Removes notifications older than 30 days
});
```

## How to Use

### For Admins

#### Option 1: Admin Dashboard (Recommended)
1. Navigate to **Admin Dashboard → Notifications Control**
2. Click **"Generate Daily Notifications"** button
3. Wait 30-60 seconds for AI generation
4. View generated notifications in the preview section
5. Monitor statistics (total count, fields covered, latest generation date)

#### Option 2: PowerShell Script
```powershell
cd backend
./trigger-notifications.ps1
```

#### Option 3: API Call
```bash
curl -X POST http://localhost:5000/api/notifications/generate-daily
```

### For Developers

#### Manual Trigger (Development Mode)
```javascript
// In your backend console or API client
fetch('http://localhost:5000/api/notifications/generate-daily', {
  method: 'POST'
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Fetch Notifications for Display
```javascript
// Get notifications for a specific field
fetch('http://localhost:5000/api/notifications/field/engineering?limit=10')
  .then(res => res.json())
  .then(data => {
    console.log(data.notifications);
  });
```

## Environment Configuration

Required environment variables in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
API_URL=http://localhost:5000  # For scheduler to call itself
```

## Firestore Indexes

The system requires these indexes for efficient querying:
```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "fields": [
        { "fieldPath": "field_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Error Handling

### Fallback Mechanism
If AI generation fails for any field, the system automatically creates a fallback notification:
```javascript
{
  title: `${fieldName} Daily Update`,
  message: 'Stay updated with the latest trends and opportunities in your field',
  priority: 'medium',
  category: 'Industry Update'
}
```

### Rate Limiting
1-second delay between field generations to avoid API rate limits.

## Future Enhancements

### Planned Features
- [ ] **User-Specific Preferences** - Filter by user interests
- [ ] **Push Notifications** - Real-time browser/mobile alerts
- [ ] **Email Digests** - Weekly summary emails
- [ ] **Notification Read Tracking** - Mark as read, archive
- [ ] **Advanced Filters** - By priority, category, date range
- [ ] **Analytics** - Engagement metrics, click-through rates
- [ ] **Custom Notifications** - Admin-created manual notifications
- [ ] **Localization** - Multi-language support

## Troubleshooting

### Notifications Not Generating
1. **Check backend is running**: `npm run dev` in backend folder
2. **Verify Gemini API key**: Check `.env` file
3. **Check logs**: Look for errors in backend console
4. **Manual trigger**: Use admin dashboard or PowerShell script
5. **Check Firebase connection**: Ensure Firestore is accessible

### No Notifications Displayed
1. **Firestore indexes**: Deploy `firestore.indexes.json`
2. **Check API endpoint**: Verify `/api/notifications/all` returns data
3. **Browser console**: Check for CORS or network errors
4. **Database**: Verify notifications collection exists in Firestore

### Scheduler Not Working
1. **Time zone**: Scheduler uses server time (6:00 AM server time)
2. **Backend uptime**: Server must be running continuously
3. **Environment**: Check `NODE_ENV` and `API_URL` settings

## Performance Considerations

### Generation Time
- **Single field**: ~1-3 seconds
- **All 22 fields**: ~30-60 seconds (with 1s delay between calls)
- **Total notifications per run**: 66 (3 per field × 22 fields)

### Storage
- **Retention**: 30 days automatic cleanup
- **Estimated monthly storage**: ~2000 notifications (66/day × 30 days)
- **Average size per notification**: ~500 bytes
- **Total monthly storage**: ~1 MB

## Support

For issues or feature requests:
1. Check backend logs for error messages
2. Verify Firestore has proper indexes deployed
3. Ensure Gemini API key has sufficient quota
4. Review this documentation for configuration steps

---

**Last Updated**: January 31, 2026  
**Version**: 1.0  
**Status**: ✅ Active and Operational
