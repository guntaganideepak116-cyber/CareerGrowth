import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

interface FCMNotificationPayload {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
}

export class FCMService {
    /**
     * Send a notification to a specific user based on their stored FCM tokens
     */
    static async sendToUser(userId: string, payload: FCMNotificationPayload) {
        try {
            // Fetch all tokens for this user
            const tokensSnapshot = await db.collection('user_tokens')
                .where('userId', '==', userId)
                .get();

            if (tokensSnapshot.empty) {
                console.log(`No FCM tokens found for user ${userId}`);
                return { success: false, message: 'No tokens found' };
            }

            const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
            return await this.sendToTokens(tokens, payload, userId);
        } catch (error) {
            console.error(`Error sending individual FCM to ${userId}:`, error);
            return { success: false, error };
        }
    }

    /**
     * Send a notification to all users matching a specific career field and optional specialization
     */
    static async sendToField(fieldId: string, payload: FCMNotificationPayload, specialization?: string) {
        try {
            let query = db.collection('user_tokens').where('field', '==', fieldId);
            
            if (specialization) {
                query = query.where('specialization', '==', specialization);
            }

            const tokensSnapshot = await query.get();

            if (tokensSnapshot.empty) {
                return { success: true, count: 0 };
            }

            const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
            return await this.sendToTokens(tokens, payload);
        } catch (error) {
            console.error(`Error sending field FCM for ${fieldId}:`, error);
            return { success: false, error };
        }
    }

    /**
     * Send a notification to a batch of tokens
     */
    static async sendToTokens(tokens: string[], payload: FCMNotificationPayload, userId?: string) {
        if (tokens.length === 0) return { success: true, count: 0 };

        const message: admin.messaging.MulticastMessage = {
            tokens: Array.from(new Set(tokens)), // Unique tokens only
            notification: {
                title: payload.title,
                body: payload.body,
                imageUrl: payload.imageUrl
            },
            data: payload.data || {},
            webpush: {
                notification: {
                    icon: '/favicon.svg',
                    badge: '/favicon.svg',
                    click_action: payload.data?.url || '/dashboard'
                }
            }
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            
            // Cleanup invalid tokens
            if (response.failureCount > 0) {
                const tokensToRemove: string[] = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const errorCode = resp.error?.code;
                        if (errorCode === 'messaging/registration-token-not-registered' || 
                            errorCode === 'messaging/invalid-registration-token') {
                            tokensToRemove.push(tokens[idx]);
                        }
                    }
                });

                if (tokensToRemove.length > 0) {
                    await this.removeInvalidTokens(tokensToRemove);
                }
            }

            // Log the notification
            await this.logNotification(payload, response.successCount, userId);

            return { 
                success: true, 
                successCount: response.successCount, 
                failureCount: response.failureCount 
            };
        } catch (error) {
            console.error('FCM Multicast Error:', error);
            return { success: false, error };
        }
    }

    private static async removeInvalidTokens(tokens: string[]) {
        try {
            const batchSize = 400;
            for (let i = 0; i < tokens.length; i += batchSize) {
                const chunk = tokens.slice(i, i + batchSize);
                const snapshot = await db.collection('user_tokens')
                    .where('token', 'in', chunk)
                    .get();
                
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
            console.log(`Cleaned up ${tokens.length} invalid FCM tokens`);
        } catch (error) {
            console.error('Error removing invalid tokens:', error);
        }
    }

    private static async logNotification(payload: FCMNotificationPayload, sentTo: number, userId?: string) {
        try {
            await db.collection('notifications_log').add({
                title: payload.title,
                body: payload.body,
                sentTo,
                targetUserId: userId || 'broadcast',
                data: payload.data || {},
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error logging notification:', error);
        }
    }
}
