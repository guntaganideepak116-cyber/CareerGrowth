import { Router } from 'express';
import { verifyAdminToken } from '../middleware/roleAuth';
import admin from 'firebase-admin';

const router = Router();

/**
 * Check if user is admin
 */
router.get('/check', verifyAdminToken, (req, res) => {
    res.json({ isAdmin: true });
});

/**
 * Get platform statistics with time-based filters
 */
router.get('/stats', verifyAdminToken, async (req, res) => {
    try {
        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logFirestoreRead(1);

        const db = admin.firestore();

        // Time period constants
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        // Get all users
        const usersSnapshot = await db.collection('users').get();
        const allUsers = usersSnapshot.docs.map(doc => doc.data());

        const totalUsers = usersSnapshot.size;

        // Count currently logged-in users (active in last 30 minutes)
        const activeUsers = allUsers.filter(user => {
            const lastLogin = user.lastLogin?.toDate();
            return lastLogin && lastLogin >= thirtyMinutesAgo;
        }).length;

        // Signup statistics
        const signups = {
            today: allUsers.filter(u => {
                const created = u.created_at ? new Date(u.created_at) : null;
                return created && created >= today;
            }).length,
            thisWeek: allUsers.filter(u => {
                const created = u.created_at ? new Date(u.created_at) : null;
                return created && created >= weekAgo;
            }).length,
            thisMonth: allUsers.filter(u => {
                const created = u.created_at ? new Date(u.created_at) : null;
                return created && created >= monthAgo;
            }).length,
            thisYear: allUsers.filter(u => {
                const created = u.created_at ? new Date(u.created_at) : null;
                return created && created >= yearAgo;
            }).length,
        };

        // Login statistics (users who logged in during these periods)
        const logins = {
            today: allUsers.filter(u => {
                const lastLogin = u.lastLogin?.toDate();
                return lastLogin && lastLogin >= today;
            }).length,
            thisWeek: allUsers.filter(u => {
                const lastLogin = u.lastLogin?.toDate();
                return lastLogin && lastLogin >= weekAgo;
            }).length,
            thisMonth: allUsers.filter(u => {
                const lastLogin = u.lastLogin?.toDate();
                return lastLogin && lastLogin >= monthAgo;
            }).length,
            thisYear: allUsers.filter(u => {
                const lastLogin = u.lastLogin?.toDate();
                return lastLogin && lastLogin >= yearAgo;
            }).length,
        };

        res.json({
            totalUsers,
            activeUsers,
            signups,
            logins,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

/**
 * Get list of users with activity data
 */
router.get('/users', verifyAdminToken, async (req, res) => {
    try {
        const { UsageTracker } = await import('../services/usageTracker');
        await UsageTracker.logFirestoreRead(1);

        const db = admin.firestore();
        const usersSnapshot = await db.collection('users').orderBy('created_at', 'desc').get();

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            const lastLogin = data.lastLogin?.toDate();
            const isOnline = lastLogin && lastLogin >= thirtyMinutesAgo;

            return {
                id: doc.id,
                name: data.full_name || 'N/A',
                email: data.email || 'N/A',
                signupDate: data.created_at || 'N/A',
                lastLoginTime: lastLogin ? lastLogin.toISOString() : 'Never',
                loginStatus: isOnline ? 'online' : 'offline',
            };
        });

        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * Get daily quota usage statistics
 */
router.get('/quota', verifyAdminToken, async (req, res) => {
    try {
        const { UsageTracker } = await import('../services/usageTracker');
        // Log a read for fetching stats themselves
        await UsageTracker.logFirestoreRead(1);

        const stats = await UsageTracker.getDailyStats();
        const history = await UsageTracker.getUsageHistory(7);

        res.json({
            success: true,
            stats,
            history,
            limits: {
                firestore_reads: 50000,
                firestore_writes: 20000,
                gemini_requests: 1500
            }
        });
    } catch (error) {
        console.error('Error fetching quota stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch quota statistics' });
    }
});

export default router;

