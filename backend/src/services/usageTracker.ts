import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

interface DailyUsage {
    firestore_reads: number;
    firestore_writes: number;
    gemini_requests: number;
    last_updated: admin.firestore.FieldValue;
}

export class UsageTracker {
    /**
     * Calculates the document ID based on IST (UTC+5:30) to ensure 
     * the reset happens at Midnight local time for the user.
     */
    private static getDocId() {
        const now = new Date();
        // Shift to IST (UTC + 5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + istOffset);

        // Return YYYY-MM-DD in IST
        return `usage_${istDate.toISOString().split('T')[0]}`;
    }

    private static async updateCounter(field: keyof Omit<DailyUsage, 'last_updated'>, amount: number = 1) {
        if (!db) return;
        const docId = this.getDocId();
        const docRef = db.collection('admin_metrics').doc(docId);

        try {
            await docRef.set({
                [field]: admin.firestore.FieldValue.increment(amount),
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.warn(`[UsageTracker] Failed to update ${field}:`, error);
        }
    }

    static async logFirestoreRead(count: number = 1) {
        await this.updateCounter('firestore_reads', count);
    }

    static async logFirestoreWrite(count: number = 1) {
        await this.updateCounter('firestore_writes', count);
    }

    static async logGeminiRequest() {
        await this.updateCounter('gemini_requests', 1);
    }

    static async getDailyStats() {
        if (!db) return { firestore_reads: 0, firestore_writes: 0, gemini_requests: 0 };
        const docId = this.getDocId();
        const doc = await db.collection('admin_metrics').doc(docId).get();
        if (doc.exists) {
            return doc.data();
        }
        return {
            firestore_reads: 0,
            firestore_writes: 0,
            gemini_requests: 0
        };
    }

    static async getUsageHistory(days: number = 7) {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;

        // Generate list of dates to fetch
        const dates = Array.from({ length: days }, (_, i) => {
            const date = new Date(now.getTime() + istOffset);
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        });

        // Parallel fetch for all days
        const promises = dates.map(async (dateStr) => {
            if (!db) return { date: dateStr, firestore_reads: 0, firestore_writes: 0, gemini_requests: 0 };
            const docId = `usage_${dateStr}`;
            const doc = await db.collection('admin_metrics').doc(docId).get();

            if (doc.exists) {
                const data = doc.data();
                return {
                    date: dateStr,
                    firestore_reads: data?.firestore_reads || 0,
                    firestore_writes: data?.firestore_writes || 0,
                    gemini_requests: data?.gemini_requests || 0
                };
            } else {
                return {
                    date: dateStr,
                    firestore_reads: 0,
                    firestore_writes: 0,
                    gemini_requests: 0
                };
            }
        });

        const history = await Promise.all(promises);
        return history.reverse();
    }
}
