import { db } from '../config/firebase';
import { sendNotificationEmail } from '../utils/sendEmail';

/**
 * Creates a notification for a specific user and sends an email if enabled.
 * @param userId The ID of the recipient user
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type (e.g., 'recommendation', 'assessment', 'security', 'system')
 * @param actionUrl Link to dashboard or specific resource
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'system',
    actionUrl: string = '/dashboard'
) {
    try {
        console.log(`🔔 Creating notification for ${userId}: ${title}`);

        // 1. Save to Firestore
        const notificationRef = db.collection('notifications').doc();
        const notificationData = {
            id: notificationRef.id,
            userId, // Targeted to specific user
            title,
            message,
            type,
            category: 'Personal', // User-specific category
            readBy: [], // Consistent with global schema, though implied read by others is impossible if userId is set
            createdAt: new Date().toISOString(),
            dateKey: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            actionUrl
        };

        await notificationRef.set(notificationData);

        // 2. Fetch User Preferences
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();

        // 3. Check Notification Preference
        // Default to true if not set, or strictly check boolean
        const emailEnabled = userData?.notificationPreference !== false; // Default ON

        if (emailEnabled && userData?.email) {
            // 4. Send Email
            // console.log(`📧 Sending email to ${userData.email}`);
            // await sendNotificationEmail(userData.email, title, message);
            console.log(`📧 Email delivery delegated to Cloud Function for ${userData.email}`);
        }

    } catch (error) {
        console.error('❌ Error creating notification:', error);
        // Do not throw, allow system to continue
    }
}
