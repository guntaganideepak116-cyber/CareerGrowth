import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';
import axios from 'axios';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// All 22 fields
const ALL_FIELDS = [
    { id: 'engineering', name: 'Engineering & Technology' },
    { id: 'medical', name: 'Medical & Health Sciences' },
    { id: 'science', name: 'Science & Research' },
    { id: 'arts', name: 'Arts, Humanities & Degree' },
    { id: 'commerce', name: 'Commerce, Business & Management' },
    { id: 'law', name: 'Law & Public Services' },
    { id: 'education', name: 'Education & Teaching' },
    { id: 'design', name: 'Design, Media & Creative Arts' },
    { id: 'defense', name: 'Defense, Security & Physical Services' },
    { id: 'agriculture', name: 'Agriculture & Environmental Studies' },
    { id: 'hospitality', name: 'Hospitality, Travel & Tourism' },
    { id: 'sports', name: 'Sports, Fitness & Lifestyle' },
    { id: 'vocational', name: 'Skill-Based & Vocational Fields' },
    { id: 'cloud-computing', name: 'Cloud Computing' },
    { id: 'devops-sre', name: 'DevOps & Site Reliability Engineering' },
    { id: 'blockchain-web3', name: 'Blockchain & Web3' },
    { id: 'ar-vr-mr', name: 'AR / VR / Mixed Reality' },
    { id: 'quantum-computing', name: 'Quantum Computing' },
    { id: 'robotics-automation', name: 'Robotics & Automation' },
    { id: 'bioinformatics-compbio', name: 'Bioinformatics & Computational Biology' },
    { id: 'product-management', name: 'Product Management & Tech Leadership' },
    { id: 'uiux-hci', name: 'UI/UX & Human–Computer Interaction' },
];

/**
 * Generate notifications for a specific field using Gemini AI
 */
async function generateFieldNotifications(fieldId: string, fieldName: string, date: string): Promise<any[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

        const prompt = `You are an AI career advisor generating daily notifications for students in the ${fieldName} field.

Generate exactly 3 diverse notifications for ${date}. Include:
1. One industry trend/news notification (type: "trend")
2. One skill/learning opportunity (type: "skill")
3. One career tip or opportunity (type: "opportunity")

For each notification, provide:
- title: Catchy, concise title (max 60 characters)
- message: Detailed, actionable message (100-150 characters)
- priority: "high", "medium", or "low"
- category: "Industry Update", "Skill Development", "Career Opportunity", "Upcoming Event", or "Learning Resource"
- actionText: Clear call-to-action (e.g., "Learn More", "Explore Now", "Take Action")
- actionUrl: Relevant external link (real, working URLs only)

Return ONLY valid JSON in this exact format:
[
  {
    "title": "...",
    "message": "...",
    "type": "trend/skill/opportunity",
    "priority": "high/medium/low",
    "category": "...",
    "actionText": "...",
    "actionUrl": "https://..."
  }
]

Make notifications:
- Specific to ${fieldName}
- Current (based on 2026 industry trends)
- Actionable and valuable
- Professional and motivating
- Unique content for each day`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const notifications = JSON.parse(jsonMatch[0]);

        // Add metadata with unique timestamps
        // Base timestamp from server (UTC)
        const baseTimestamp = Date.now();


        // Calculate IST Date
        const istDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const todayIST = new Date(istDate);

        return notifications.map((notif: any, index: number) => {
            const uniqueTimestamp = baseTimestamp + (index * 1000);

            return {
                id: `${fieldId}-${uniqueTimestamp}-${index}`,
                fieldId: fieldId, // Updated per spec
                fieldName: fieldName,
                title: notif.title,
                message: notif.message,
                category: notif.category || 'General',
                createdAt: new Date(uniqueTimestamp).toISOString(), // ISO string, can be parsed as IST on frontend
                dateKey: date, // YYYY-MM-DD
                readBy: [], // Initialize empty array for read tracking

                // Legacy/Extra fields if needed by existing UI logic, but prioritizing spec
                type: notif.type || 'update',
                priority: notif.priority || 'medium',
                actionText: notif.actionText,
                actionUrl: notif.actionUrl,
                timestamp: uniqueTimestamp
            };
        });
    } catch (error) {
        console.error(`Error generating notifications for ${fieldName}:`, error);
        // Return fallback notification
        const timestamp = Date.now();
        const createdAtUTC = new Date(timestamp).toISOString();

        return [{
            id: `${fieldId}-${timestamp}-fallback`,
            fieldId: fieldId,
            fieldName: fieldName,
            title: `${fieldName} Daily Update`,
            message: 'Stay updated with the latest trends and opportunities in your field',
            category: 'Industry Update',
            createdAt: new Date(timestamp).toISOString(),
            dateKey: date,
            readBy: [],

            type: 'update',
            priority: 'medium',
            actionText: 'Explore',
            actionUrl: '#',
            timestamp: timestamp
        }];
    }
}

/**
 * Check if notifications already exist for a specific date
 */
/**
 * Check if notifications already exist for a specific field and date
 */
async function notificationsExistForFieldAndDate(fieldId: string, date: string): Promise<boolean> {
    try {
        const notificationsRef = db.collection('notifications');
        const snapshot = await notificationsRef
            .where('dateKey', '==', date)
            .where('fieldId', '==', fieldId)
            .limit(1)
            .get();

        return !snapshot.empty;
    } catch (error) {
        console.error(`Error checking existing notifications for ${fieldId}:`, error);
        return false;
    }
}

/**
 * POST /api/notifications/generate-daily
 * Generate notifications for all fields (called by cron job)
 */
router.post('/generate-daily', async (req: Request, res: Response) => {
    try {
        const { force } = req.query;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        console.log(`🔄 Starting daily notification generation for ${today}${force === 'true' ? ' (FORCED)' : ''}...`);

        const allNotifications: any[] = [];
        let skippedCount = 0;

        // Generate notifications for each field
        for (const field of ALL_FIELDS) {
            // Check if notifications already exist for this field today (unless forced)
            if (force !== 'true') {
                const fieldExists = await notificationsExistForFieldAndDate(field.id, today);

                if (fieldExists) {
                    console.log(`ℹ️ Notifications for ${field.name} (${today}) already exist. Skipping.`);
                    skippedCount++;
                    continue;
                }
            }

            console.log(`📝 Generating notifications for ${field.name}...`);
            const notifications = await generateFieldNotifications(field.id, field.name, today);
            allNotifications.push(...notifications);

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Save to Firestore using batch
        const batch = db.batch();
        const notificationsRef = db.collection('notifications');

        for (const notification of allNotifications) {
            const docRef = notificationsRef.doc(notification.id);
            batch.set(docRef, notification);
        }

        await batch.commit();

        console.log(`✅ Generated ${allNotifications.length} notifications for ${ALL_FIELDS.length} fields`);

        res.json({
            success: true,
            message: `Generated ${allNotifications.length} notifications for ${today}`,
            count: allNotifications.length,
            fields: ALL_FIELDS.length,
            date: today,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error generating daily notifications:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate notifications',
        });
    }
});


/**
 * POST /api/notifications/generate-hourly
 * Generate AI Insights hourly
 */
router.post('/generate-hourly', async (req: Request, res: Response) => {
    try {
        const { force } = req.query;
        const now = new Date();
        const dateKey = now.toISOString().split('T')[0];

        console.log(`🔄 Starting Hourly AI Insight generation...`);

        // Check if generated recently (within last 50 mins) unless forced
        if (force !== 'true') {
            const fiftyMinsAgo = new Date(Date.now() - 50 * 60 * 1000).toISOString();
            const recentCheck = await db.collection('notifications')
                .where('category', '==', 'AI Insight')
                .where('createdAt', '>=', fiftyMinsAgo)
                .limit(1)
                .get();

            if (!recentCheck.empty) {
                console.log('Skipping hourly generation: Already ran recently.');
                return res.json({ success: true, message: 'Skipped: Recently generated' });
            }
        }

        const updates: any[] = [];
        const baseTimestamp = Date.now();

        // Loop through all fields (limit to 5 random if too many, or all)
        // For scalability, we'll do all but proceed sequentially
        for (const field of ALL_FIELDS) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
                const prompt = `Generate 1 short, real-world "AI Insight" or "Future Trend" update for the field: ${field.name}.
                Make it relevant to 2026.
                Return JSON: { "title": "...", "message": "...", "actionUrl": "..." }`;

                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) continue;

                const json = JSON.parse(jsonMatch[0]);

                if (json.title) {
                    updates.push({
                        id: `ai-${field.id}-${baseTimestamp}`,
                        fieldId: field.id,
                        fieldName: field.name,
                        title: json.title,
                        message: json.message,
                        category: 'AI Insight',
                        source: 'AI Analysis',
                        type: 'trend',
                        priority: 'medium',
                        actionText: 'Learn More',
                        actionUrl: json.actionUrl || '#',
                        createdAt: new Date().toISOString(),
                        dateKey,
                        readBy: [],
                        timestamp: Date.now()
                    });
                }
            } catch (e) {
                console.error(`Failed to generate AI insight for ${field.name}`);
            }
            // Small delay
            await new Promise(r => setTimeout(r, 200));
        }

        if (updates.length > 0) {
            const batch = db.batch();
            updates.forEach(u => batch.set(db.collection('notifications').doc(u.id), u));
            await batch.commit();
        }

        console.log(`✅ Generated ${updates.length} AI insights.`);
        res.json({ success: true, count: updates.length });
    } catch (error) {
        console.error('Hourly generation error:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * POST /api/notifications/fetch-news
 * Fetch Live News every 10 mins
 */
router.post('/fetch-news', async (req: Request, res: Response) => {
    try {
        console.log('📰 Fetching Live News...');
        const RSS_URL = 'https://news.google.com/rss/search?q=career+technology+future+skills&hl=en-IN&gl=IN&ceid=IN:en';

        const response = await axios.get(RSS_URL);
        const xml = response.data;

        // Regex parse XML
        const itemRegex = /<item>[\s\S]*?<\/item>/g;
        const items = xml.match(itemRegex) || [];

        const newNotifications: any[] = [];
        const validItems = items.slice(0, 5);

        for (const itemStr of validItems) {
            const titleMatch = itemStr.match(/<title>(.*?)<\/title>/);
            const linkMatch = itemStr.match(/<link>(.*?)<\/link>/);

            const title = titleMatch ? titleMatch[1].replace('<![CDATA[', '').replace(']]>', '') : '';
            const link = linkMatch ? linkMatch[1] : '';

            if (!title) continue;

            const exists = await db.collection('notifications').where('title', '==', title).limit(1).get();
            if (!exists.empty) continue;

            newNotifications.push({
                id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                fieldId: 'general',
                fieldName: 'Global News',
                title: title,
                message: 'Latest update from Google News',
                category: 'Live News',
                source: 'Google News',
                type: 'update',
                priority: 'medium',
                actionText: 'Read Article',
                actionUrl: link,
                createdAt: new Date().toISOString(),
                dateKey: new Date().toISOString().split('T')[0],
                readBy: [],
                timestamp: Date.now()
            });
        }

        if (newNotifications.length > 0) {
            const batch = db.batch();
            // Use set with merge true just in case ID collision (unlikely)
            newNotifications.forEach(n => batch.set(db.collection('notifications').doc(n.id), n));
            await batch.commit();
        }

        console.log(`✅ Fetched ${newNotifications.length} news items.`);
        res.json({ success: true, count: newNotifications.length });

    } catch (error) {
        console.error('News fetch error:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/field/:fieldId
 * Get notifications for a specific field
 */
router.get('/field/:fieldId', async (req: Request, res: Response) => {
    try {
        const { fieldId } = req.params;
        const { limit = 20 } = req.query;

        const notificationsRef = db.collection('notifications');
        const snapshot = await notificationsRef
            .where('fieldId', '==', fieldId)
            .orderBy('timestamp', 'desc')
            .limit(Number(limit))
            .get();

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({
            success: true,
            notifications,
            count: notifications.length,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        });
    }
});

/**
 * GET /api/notifications/all
 * Get all recent notifications across all fields
 */
router.get('/all', async (req: Request, res: Response) => {
    try {
        const { limit = 50 } = req.query;

        const notificationsRef = db.collection('notifications');
        const snapshot = await notificationsRef
            .orderBy('timestamp', 'desc')
            .limit(Number(limit))
            .get();

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({
            success: true,
            notifications,
            count: notifications.length,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        });
    }
});

/**
 * DELETE /api/notifications/old
 * Clean up notifications older than 30 days
 */
router.delete('/old', async (req: Request, res: Response) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

        const notificationsRef = db.collection('notifications');
        const snapshot = await notificationsRef
            .where('generated_date', '<', cutoffDate)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        const deletedCount = snapshot.size;

        console.log(`🧹 Cleaned up ${deletedCount} notifications older than ${cutoffDate}`);

        res.json({
            success: true,
            message: `Deleted ${deletedCount} old notifications`,
            deletedCount,
            cutoffDate,
        });
    } catch (error) {
        console.error('Error deleting old notifications:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete old notifications',
        });
    }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const notificationsRef = db.collection('notifications');

        // Get total count
        const totalSnapshot = await notificationsRef.get();
        const totalCount = totalSnapshot.size;

        // Get recent (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

        const recentSnapshot = await notificationsRef
            .where('generated_date', '>=', cutoffDate)
            .get();

        // Group by date
        const byDate: Record<string, number> = {};
        recentSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.generated_date || '';
            byDate[date] = (byDate[date] || 0) + 1;
        });

        res.json({
            success: true,
            stats: {
                total: totalCount,
                last7Days: recentSnapshot.size,
                byDate,
            },
        });
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
        });
    }
});

/**
 * PUT /read/:id
 * Mark notification as read by user
 */
router.put('/read/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        const notificationRef = db.collection('notifications').doc(id);
        const doc = await notificationRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        const data = doc.data();
        const readBy = data?.readBy || [];

        if (!readBy.includes(userId)) {
            await notificationRef.update({
                readBy: [...readBy, userId]
            });
        }

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update notification',
        });
    }
});


/**
 * PUT /read/:id
 * Mark notification as read by user
 */
router.put('/read/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        const notificationRef = db.collection('notifications').doc(id);
        const doc = await notificationRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        const data = doc.data();
        const readBy = data?.readBy || [];

        if (!readBy.includes(userId)) {
            await notificationRef.update({
                readBy: [...readBy, userId]
            });
        }

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update notification',
        });
    }
});

export default router;
