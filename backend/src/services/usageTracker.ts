import * as admin from 'firebase-admin';

const db = admin.firestore();

interface DailyUsage {
    firestore_reads: number;
    firestore_writes: number;
    gemini_requests: number;
    last_updated: admin.firestore.FieldValue;
}

export class UsageTracker {
    private static getDocId() {
        const date = new Date();
        // Use YYYY-MM-DD format for document ID
        return `usage_${date.toISOString().split('T')[0]}`;
    }

    private static async updateCounter(field: keyof Omit<DailyUsage, 'last_updated'>, amount: number = 1) {
        const docId = this.getDocId();
        const docRef = db.collection('admin_metrics').doc(docId);

        try {
            await docRef.set({
                [field]: admin.firestore.FieldValue.increment(amount),
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            // Silently fail if quota exceeded or other DB issues
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
}
