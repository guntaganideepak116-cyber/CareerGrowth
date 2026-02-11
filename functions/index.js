const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendNotificationEmail } = require('./utils/sendEmail');

admin.initializeApp();

exports.onNotificationCreated = functions.firestore
    .document('notifications/{notificationId}')
    .onCreate(async (snap, context) => {
        try {
            const data = snap.data();
            const userId = data.userId;
            const title = data.title;
            const message = data.message;

            console.log(`🔔 New notification created for ${userId}: ${title}`);

            // Fetch user data
            const userSnap = await admin.firestore().collection('users').doc(userId).get();
            if (!userSnap.exists) {
                console.log(`User ${userId} not found.`);
                return null;
            }

            const user = userSnap.data();
            const userEmail = user.email;

            if (!userEmail) {
                console.log(`User ${userId} has no email.`);
                return null;
            }

            if (user.notificationPreference === false) {
                console.log(`User ${userId} has disabled notifications.`);
                return null;
            }

            // Rate Limiting (Max 5 emails per hour)
            const now = Date.now();
            const oneHour = 3600000;
            let rateLimit = user.emailRateLimit || { count: 0, startTime: 0 };

            if (now - rateLimit.startTime < oneHour) {
                if (rateLimit.count >= 5) {
                    console.log(`Rate limit exceeded for user ${userId}. Max 5 emails/hour.`);
                    return null;
                }
                rateLimit.count++;
            } else {
                rateLimit = { count: 1, startTime: now };
            }

            // Update rate limit on user doc
            await admin.firestore().collection('users').doc(userId).update({
                emailRateLimit: rateLimit
            });

            console.log(`📧 Sending email to ${userEmail}...`);
            await sendNotificationEmail(userEmail, title, message);

            return null;
        } catch (error) {
            console.error('Error processing notification:', error);
            return null;
        }
    });

exports.scheduledDailyInsights = functions.pubsub.schedule('0 9 * * *').onRun(async (context) => {
    const { generateDailyNotifications } = require('./scheduled/dailyEngagement');
    await generateDailyNotifications();
    return null;
});
