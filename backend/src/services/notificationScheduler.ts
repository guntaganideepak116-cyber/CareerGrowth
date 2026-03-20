import cron from 'node-cron';
import { runDailyGeneration, runHourlyGeneration, runSixHourlyGeneration, runNewsFetch, runCleanup } from '../routes/notifications';

/**
 * Notification Scheduler — uses node-cron for local development.
 *
 * In production (Vercel), cron jobs are managed by Vercel's built-in
 * scheduler via vercel.json crons, which call the GET /cron/* endpoints.
 *
 * Call startNotificationScheduler() on server startup.
 * Call bootstrapNotificationsIfEmpty() to seed today's notifications immediately.
 */

// ============================================================
// BOOTSTRAP: Run on startup if no notifications exist for today
// ============================================================
export async function bootstrapNotificationsIfEmpty(): Promise<void> {
    try {
        // Dynamic import to avoid circular dep at module load time
        const { db } = await import('../config/firebase');
        const today = new Date().toISOString().split('T')[0];

        const snapshot = await db.collection('notifications')
            .where('dateKey', '==', today)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log(`\n🚀 [Bootstrap] No notifications found for ${today}. Generating now...`);
            const result = await runDailyGeneration(false);
            console.log(`✅ [Bootstrap] Generated ${result.count} notifications for ${result.fields} fields`);
        } else {
            console.log(`✅ [Bootstrap] Notifications for ${today} already exist — skipping initial generation`);
        }
    } catch (error) {
        console.error('❌ [Bootstrap] Failed to check/generate initial notifications:', error);
        // Non-fatal — server continues to run
    }
}

// ============================================================
// CRON SCHEDULER (local dev)
// ============================================================
export function startNotificationScheduler(): void {
    // Only start if Firebase is initialized
    const { apps } = require('firebase-admin');
    if (!apps || apps.length === 0) {
        console.warn('⚠️ Skipping notification scheduler: Firebase not initialized.');
        return;
    }

    console.log('\n📅 Starting notification scheduler (node-cron)...');

    // ── Daily at 8:30 AM IST (3:00 AM UTC) ──────────────────────────────────
    cron.schedule('0 3 * * *', async () => {
        console.log(`\n🔔 [${new Date().toISOString()}] Cron: Daily notification generation`);
        try {
            const result = await runDailyGeneration(false);
            console.log(`✅ Daily: ${result.count} notifications for ${result.fields} fields`);
        } catch (error) {
            console.error('❌ Daily cron error:', error);
        }
    }, { timezone: 'UTC' });

    // ── Hourly AI Insights ──────────────────────────────────────────────────
    cron.schedule('0 * * * *', async () => {
        console.log(`\n🧠 [${new Date().toISOString()}] Cron: Hourly AI Insights`);
        try {
            const result = await runHourlyGeneration(false);
            console.log(`✅ Hourly: ${result.count} AI insights generated`);
        } catch (error) {
            console.error('❌ Hourly cron error:', error);
        }
    });

    // ── Six-Hourly AI Notifications ─────────────────────────────────────────
    cron.schedule('0 */6 * * *', async () => {
        console.log(`\n🔔 [${new Date().toISOString()}] Cron: Six-Hourly AI Notifications`);
        try {
            const result = await runSixHourlyGeneration(false);
            console.log(`✅ Six-hourly: ${result.count} AI notifications generated`);
        } catch (error) {
            console.error('❌ Six-hourly cron error:', error);
        }
    });

    // ── News every 30 minutes ────────────────────────────────────────────────
    cron.schedule('*/30 * * * *', async () => {
        console.log(`\n📰 [${new Date().toISOString()}] Cron: Live news fetch`);
        try {
            const result = await runNewsFetch();
            console.log(`✅ News: ${result.count} new articles`);
        } catch (error) {
            console.error('❌ News cron error:', error);
        }
    });

    // ── Cleanup every Sunday at 2:00 AM UTC ─────────────────────────────────
    cron.schedule('0 2 * * 0', async () => {
        console.log(`\n🧹 [${new Date().toISOString()}] Cron: Weekly cleanup`);
        try {
            const result = await runCleanup();
            console.log(`✅ Cleanup: deleted ${result.deletedCount} old notifications`);
        } catch (error) {
            console.error('❌ Cleanup cron error:', error);
        }
    });

    console.log('  ✅ Daily generation  — 3:00 AM UTC (8:30 AM IST)');
    console.log('  ✅ Hourly AI Insights — top of every hour');
    console.log('  ✅ Six-Hourly AI     — every 6 hours (0:00, 6:00, 12:00, 18:00 UTC)');
    console.log('  ✅ Live News          — every 30 minutes');
    console.log('  ✅ Weekly Cleanup     — Sunday 2:00 AM UTC');
    console.log('📅 Scheduler ready.\n');
}
