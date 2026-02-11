const admin = require('firebase-admin');
const { fieldTips, fieldAliases } = require('../data/fieldTips');

/**
 * Generates daily engagement notifications for all users based on their field.
 * This should run on a schedule (e.g. daily at 9am).
 */
async function generateDailyNotifications() {
    const db = admin.firestore();
    console.log('🚀 Starting Daily Notification Generation...');

    try {
        // 1. Get all active users
        // In a large system, we would stream this or paginate. For now, get all.
        const usersSnapshot = await db.collection('users')
            .where('notificationPreference', '==', true)
            .get(); // Only those who want notifications

        if (usersSnapshot.empty) {
            console.log('No users to notify.');
            return;
        }

        let batch = db.batch(); // Use let to reassign
        const today = new Date().toISOString().split('T')[0];
        let count = 0;
        let operationCount = 0; // Track ops per batch
        const MAX_BATCH_SIZE = 450;
        let commitPromises = [];

        usersSnapshot.forEach(doc => {
            const user = doc.data();
            const userId = doc.id;

            // Determine field
            let field = (user.field || 'general').toLowerCase().trim();

            // Resolve alias
            if (fieldAliases[field]) {
                field = fieldAliases[field];
            } else if (!fieldTips[field]) {
                field = 'general';
            }

            // Get tips for this field
            const tips = fieldTips[field] || fieldTips['general'];

            // Pick a random tip
            const randomTip = tips[Math.floor(Math.random() * tips.length)];

            const notificationRef = db.collection('notifications').doc();
            const newNotif = {
                id: notificationRef.id,
                userId: userId,
                title: `Daily ${randomTip.type}: ${field.charAt(0).toUpperCase() + field.slice(1)}`,
                message: randomTip.message,
                type: 'daily_insight',
                category: 'Growth',
                read: false,
                createdAt: new Date().toISOString(),
                dateKey: today,
                timestamp: Date.now(),
                actionUrl: '/dashboard'
            };

            batch.set(notificationRef, newNotif);
            count++;
            operationCount++;

            // Batch limit management
            if (operationCount >= MAX_BATCH_SIZE) {
                commitPromises.push(batch.commit());
                batch = db.batch(); // Create new batch
                operationCount = 0;
            }
        });

        // Commit remaining
        if (operationCount > 0) {
            commitPromises.push(batch.commit());
        }

        await Promise.all(commitPromises);
        console.log(`✅ Generated ${count} daily notifications.`);

    } catch (error) {
        console.error('❌ Error generating daily notifications:', error);
    }
}

module.exports = { generateDailyNotifications };
