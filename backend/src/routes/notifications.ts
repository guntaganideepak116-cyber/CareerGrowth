import { Router, Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/firebase';
import axios from 'axios';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ============================================================
// ALL 22 FIELDS
// ============================================================
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

// ============================================================
// CRON SECRET MIDDLEWARE
// ============================================================
function verifyCronSecret(req: Request, res: Response, next: NextFunction): void {
    const expectedSecret = process.env.CRON_SECRET;
    // If no CRON_SECRET configured, allow all (for initial setup / local dev)
    if (!expectedSecret) {
        next();
        return;
    }
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${expectedSecret}`) {
        res.status(401).json({ error: 'Unauthorized: Invalid cron secret' });
        return;
    }
    next();
}

// ============================================================
// CORE GENERATION FUNCTIONS (standalone — callable from anywhere)
// ============================================================

/**
 * Generate AI notifications for a single field using Gemini
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

Return ONLY valid JSON array in this exact format:
[
  {
    "title": "...",
    "message": "...",
    "type": "trend",
    "priority": "high",
    "category": "Industry Update",
    "actionText": "Learn More",
    "actionUrl": "https://..."
  }
]

Make notifications specific to ${fieldName}, current (2026 trends), actionable, and professional.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Invalid AI response format');

        const notifications = JSON.parse(jsonMatch[0]);
        const baseTimestamp = Date.now();

        return notifications.map((notif: any, index: number) => {
            const uniqueTimestamp = baseTimestamp + (index * 1000);
            return {
                id: `${fieldId}-${date}-${index}`,
                fieldId,
                fieldName,
                title: notif.title || `${fieldName} Update`,
                message: notif.message || 'Stay updated with the latest in your field',
                category: notif.category || 'Industry Update',
                type: notif.type || 'update',
                priority: notif.priority || 'medium',
                actionText: notif.actionText || 'Learn More',
                actionUrl: notif.actionUrl || '#',
                source: 'AI',
                isGlobal: true,
                createdAt: new Date(uniqueTimestamp).toISOString(),
                dateKey: date,
                readBy: [],
                timestamp: uniqueTimestamp,
            };
        });

    } catch (error) {
        console.error(`Error generating notifications for ${fieldName}:`, error);
        // Return a meaningful fallback so the field is never empty
        const ts = Date.now();
        return [{
            id: `${fieldId}-${date}-fallback`,
            fieldId,
            fieldName,
            title: `${fieldName}: Daily Career Update`,
            message: `Stay ahead in ${fieldName} — explore the latest trends and opportunities.`,
            category: 'Industry Update',
            type: 'update',
            priority: 'medium',
            actionText: 'Explore',
            actionUrl: 'https://www.linkedin.com/jobs',
            source: 'AI',
            isGlobal: true,
            createdAt: new Date(ts).toISOString(),
            dateKey: date,
            readBy: [],
            timestamp: ts,
        }];
    }
}

/**
 * Check if notifications already exist for a specific field and date
 */
async function notificationsExistForFieldAndDate(fieldId: string, date: string): Promise<boolean> {
    try {
        const snapshot = await db.collection('notifications')
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

// ============================================================
// EXPORTED CORE RUNNERS (used by scheduler + cron endpoints)
// ============================================================

/**
 * Run daily notification generation for all 22 fields.
 * Exported so it can be called on server startup.
 */
export async function runDailyGeneration(force = false): Promise<{ count: number; fields: number; date: string; skipped: number }> {
    const today = new Date().toISOString().split('T')[0];
    console.log(`\n🔄 Daily notification generation started for ${today} [force=${force}]`);

    const allNotifications: any[] = [];
    let skipped = 0;

    for (const field of ALL_FIELDS) {
        if (!force) {
            const exists = await notificationsExistForFieldAndDate(field.id, today);
            if (exists) {
                console.log(`  ℹ️  Skipping ${field.name} — already generated today`);
                skipped++;
                continue;
            }
        }
        console.log(`  📝 Generating for ${field.name}...`);
        const notifications = await generateFieldNotifications(field.id, field.name, today);
        allNotifications.push(...notifications);
        // Throttle to avoid Gemini rate limits
        await new Promise(r => setTimeout(r, 800));
    }

    if (allNotifications.length > 0) {
        // Save in Firestore batches (max 500 per batch)
        const BATCH_SIZE = 400;
        for (let i = 0; i < allNotifications.length; i += BATCH_SIZE) {
            const chunk = allNotifications.slice(i, i + BATCH_SIZE);
            const batch = db.batch();
            chunk.forEach(n => batch.set(db.collection('notifications').doc(n.id), n));
            await batch.commit();
        }
    }

    console.log(`✅ Daily generation complete: ${allNotifications.length} notifications saved, ${skipped} fields skipped`);
    return { count: allNotifications.length, fields: ALL_FIELDS.length, date: today, skipped };
}

/**
 * Run hourly AI Insight generation (1 insight per field)
 */
export async function runHourlyGeneration(force = false): Promise<{ count: number }> {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];

    if (!force) {
        const fiftyMinsAgo = new Date(Date.now() - 50 * 60 * 1000).toISOString();
        const recentCheck = await db.collection('notifications')
            .where('category', '==', 'AI Insight')
            .where('createdAt', '>=', fiftyMinsAgo)
            .limit(1)
            .get();
        if (!recentCheck.empty) {
            console.log('⏭️  Skipping hourly AI insights — already generated recently');
            return { count: 0 };
        }
    }

    const updates: any[] = [];
    const baseTimestamp = Date.now();

    for (const field of ALL_FIELDS) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
            const prompt = `Generate 1 short AI Insight or Future Trend for the career field: ${field.name}. Make it relevant to 2026. Return ONLY JSON: { "title": "...", "message": "...", "actionUrl": "https://..." }`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) continue;

            const insight = JSON.parse(jsonMatch[0]);
            if (!insight.title) continue;

            const ts = baseTimestamp + updates.length * 500;
            updates.push({
                id: `ai-insight-${field.id}-${ts}`,
                fieldId: field.id,
                fieldName: field.name,
                title: insight.title,
                message: insight.message || '',
                category: 'AI Insight',
                source: 'AI Analysis',
                type: 'trend',
                priority: 'medium',
                actionText: 'Learn More',
                actionUrl: insight.actionUrl || '#',
                isGlobal: true,
                createdAt: new Date(ts).toISOString(),
                dateKey,
                readBy: [],
                timestamp: ts,
            });
        } catch {
            console.error(`Failed AI insight for ${field.name}`);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    if (updates.length > 0) {
        const batch = db.batch();
        updates.forEach(u => batch.set(db.collection('notifications').doc(u.id), u));
        await batch.commit();
    }

    console.log(`✅ Hourly AI insights: ${updates.length} generated`);
    return { count: updates.length };
}

/**
 * Fetch live news from Google News RSS (every 30 min)
 */
export async function runNewsFetch(): Promise<{ count: number }> {
    try {
        const RSS_URL = 'https://news.google.com/rss/search?q=career+technology+future+skills+2026&hl=en-IN&gl=IN&ceid=IN:en';
        const response = await axios.get(RSS_URL, { timeout: 10000 });
        const xml = response.data as string;

        const itemRegex = /<item>[\s\S]*?<\/item>/g;
        const items = xml.match(itemRegex) || [];
        const validItems = items.slice(0, 8);

        const newNotifs: any[] = [];

        for (const itemStr of validItems) {
            const titleMatch = itemStr.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                itemStr.match(/<title>(.*?)<\/title>/);
            const linkMatch = itemStr.match(/<link>(.*?)<\/link>/);

            const title = titleMatch?.[1]?.trim() || '';
            const link = linkMatch?.[1]?.trim() || '';

            if (!title || title.length < 5) continue;

            // Dedup check
            const existing = await db.collection('notifications')
                .where('title', '==', title)
                .limit(1)
                .get();
            if (!existing.empty) continue;

            const ts = Date.now() + newNotifs.length * 100;
            newNotifs.push({
                id: `news-${ts}-${Math.random().toString(36).slice(2, 8)}`,
                fieldId: 'general',
                fieldName: 'Global News',
                title: title.slice(0, 100),
                message: 'Latest career & tech update from Google News',
                category: 'Live News',
                source: 'Google News',
                type: 'update',
                priority: 'medium',
                actionText: 'Read Article',
                actionUrl: link || '#',
                isGlobal: true,
                createdAt: new Date(ts).toISOString(),
                dateKey: new Date(ts).toISOString().split('T')[0],
                readBy: [],
                timestamp: ts,
            });
        }

        if (newNotifs.length > 0) {
            const batch = db.batch();
            newNotifs.forEach(n => batch.set(db.collection('notifications').doc(n.id), n));
            await batch.commit();
        }

        console.log(`✅ News fetch: ${newNotifs.length} new articles`);
        return { count: newNotifs.length };
    } catch (error) {
        console.error('News fetch error:', error);
        return { count: 0 };
    }
}

/**
 * Clean up notifications older than 30 days
 */
export async function runCleanup(): Promise<{ deletedCount: number }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

    // Use dateKey field (the correct field name stored by generateFieldNotifications)
    const snapshot = await db.collection('notifications')
        .where('dateKey', '<', cutoffDate)
        .get();

    if (snapshot.empty) {
        console.log('🧹 No old notifications to clean up');
        return { deletedCount: 0 };
    }

    const BATCH_SIZE = 400;
    let deletedCount = 0;
    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const chunk = docs.slice(i, i + BATCH_SIZE);
        const batch = db.batch();
        chunk.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        deletedCount += chunk.length;
    }

    console.log(`🧹 Cleanup: deleted ${deletedCount} notifications older than ${cutoffDate}`);
    return { deletedCount };
}

// ============================================================
// VERCEL CRON ENDPOINTS — GET requests, protected by CRON_SECRET
// These are called automatically by Vercel's scheduler
// ============================================================

/**
 * GET /api/notifications/cron/daily
 * Vercel Cron: runs daily at 3:00 AM UTC (8:30 AM IST)
 */
router.get('/cron/daily', verifyCronSecret, async (req: Request, res: Response) => {
    try {
        const force = req.query.force === 'true';
        const result = await runDailyGeneration(force);
        res.json({ success: true, ...result, triggeredBy: 'vercel-cron' });
    } catch (error) {
        console.error('Cron daily error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/cron/hourly
 * Vercel Cron: runs every hour
 */
router.get('/cron/hourly', verifyCronSecret, async (req: Request, res: Response) => {
    try {
        const force = req.query.force === 'true';
        const result = await runHourlyGeneration(force);
        res.json({ success: true, ...result, triggeredBy: 'vercel-cron' });
    } catch (error) {
        console.error('Cron hourly error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/cron/news
 * Vercel Cron: runs every 30 minutes
 */
router.get('/cron/news', verifyCronSecret, async (req: Request, res: Response) => {
    try {
        const result = await runNewsFetch();
        res.json({ success: true, ...result, triggeredBy: 'vercel-cron' });
    } catch (error) {
        console.error('Cron news error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/cron/cleanup
 * Vercel Cron: runs every Sunday at 2:00 AM
 */
router.get('/cron/cleanup', verifyCronSecret, async (req: Request, res: Response) => {
    try {
        const result = await runCleanup();
        res.json({ success: true, ...result, triggeredBy: 'vercel-cron' });
    } catch (error) {
        console.error('Cron cleanup error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// ============================================================
// MANUAL TRIGGER ENDPOINTS — POST, for admin dashboard use
// ============================================================

/**
 * POST /api/notifications/generate-daily
 * Manual trigger: generates for all 22 fields
 */
router.post('/generate-daily', async (req: Request, res: Response) => {
    try {
        const force = req.query.force === 'true';
        const result = await runDailyGeneration(force);
        res.json({
            success: true,
            message: `Generated ${result.count} notifications`,
            ...result,
            triggeredBy: 'manual',
        });
    } catch (error) {
        console.error('Manual daily generation error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * POST /api/notifications/generate-hourly
 * Manual trigger: hourly AI insights
 */
router.post('/generate-hourly', async (req: Request, res: Response) => {
    try {
        const force = req.query.force === 'true';
        const result = await runHourlyGeneration(force);
        res.json({ success: true, ...result, triggeredBy: 'manual' });
    } catch (error) {
        console.error('Manual hourly generation error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * POST /api/notifications/fetch-news
 * Manual trigger: news fetch
 */
router.post('/fetch-news', async (req: Request, res: Response) => {
    try {
        const result = await runNewsFetch();
        res.json({ success: true, ...result, triggeredBy: 'manual' });
    } catch (error) {
        console.error('Manual news fetch error:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// ============================================================
// FETCH ENDPOINTS
// ============================================================

/**
 * GET /api/notifications/all
 * Get latest notifications across all fields (limit 50)
 */
router.get('/all', async (req: Request, res: Response) => {
    try {
        const limitVal = Math.min(Number(req.query.limit) || 50, 100);
        const fieldId = req.query.fieldId as string | undefined;

        let query = db.collection('notifications').orderBy('timestamp', 'desc').limit(limitVal);

        const snapshot = await (fieldId
            ? db.collection('notifications')
                .where('fieldId', 'in', [fieldId, 'general'])
                .orderBy('timestamp', 'desc')
                .limit(limitVal)
                .get()
            : query.get()
        );

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, notifications, count: notifications.length });
    } catch (error) {
        console.error('Error fetching all notifications:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/field/:fieldId
 * Get notifications for a specific field
 */
router.get('/field/:fieldId', async (req: Request, res: Response) => {
    try {
        const { fieldId } = req.params;
        const limitVal = Math.min(Number(req.query.limit) || 20, 50);

        const snapshot = await db.collection('notifications')
            .where('fieldId', 'in', [fieldId, 'general'])
            .orderBy('timestamp', 'desc')
            .limit(limitVal)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, notifications, count: notifications.length });
    } catch (error) {
        console.error('Error fetching field notifications:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics (uses dateKey — the correct field)
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalSnapshot = await db.collection('notifications').get();
        const totalCount = totalSnapshot.size;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

        const recentSnapshot = await db.collection('notifications')
            .where('dateKey', '>=', cutoffDate)
            .get();

        const byDate: Record<string, number> = {};
        const byField: Record<string, number> = {};

        recentSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.dateKey || '';
            const field = data.fieldId || 'unknown';
            byDate[date] = (byDate[date] || 0) + 1;
            byField[field] = (byField[field] || 0) + 1;
        });

        res.json({
            success: true,
            stats: {
                total: totalCount,
                last7Days: recentSnapshot.size,
                byDate,
                byField,
                fieldsCount: ALL_FIELDS.length,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// ============================================================
// READ MANAGEMENT
// ============================================================

/**
 * PUT /api/notifications/read/:id
 * Mark a single notification as read by user
 */
router.put('/read/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'userId is required' });
        }

        const docRef = db.collection('notifications').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        const readBy: string[] = docSnap.data()?.readBy || [];
        if (!readBy.includes(userId)) {
            await docRef.update({ readBy: [...readBy, userId] });
        }

        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        console.error('Error marking as read:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for a user
 */
router.put('/read-all', async (req: Request, res: Response) => {
    try {
        const { userId, notificationIds } = req.body;

        if (!userId || !Array.isArray(notificationIds)) {
            return res.status(400).json({ success: false, error: 'userId and notificationIds[] required' });
        }

        const BATCH_SIZE = 400;
        let updatedCount = 0;

        for (let i = 0; i < notificationIds.length; i += BATCH_SIZE) {
            const chunk = notificationIds.slice(i, i + BATCH_SIZE);
            const batch = db.batch();
            chunk.forEach((nId: string) => {
                const ref = db.collection('notifications').doc(nId);
                batch.update(ref, {
                    readBy: require('firebase-admin').firestore.FieldValue.arrayUnion(userId)
                });
            });
            await batch.commit();
            updatedCount += chunk.length;
        }

        res.json({ success: true, updatedCount });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

// ============================================================
// CLEANUP
// ============================================================

/**
 * DELETE /api/notifications/old
 * Clean up notifications older than 30 days (uses dateKey — fixed)
 */
router.delete('/old', async (req: Request, res: Response) => {
    try {
        const result = await runCleanup();
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error cleaning old notifications:', error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

export default router;
