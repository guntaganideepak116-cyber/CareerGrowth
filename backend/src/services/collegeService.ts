import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export interface College {
    id: string;
    collegeName: string;
    address: string;
    website: string;
    rating: number;
    coursesOffered: string[];
    location: {
        latitude: number;
        longitude: number;
    };
    city: string;
    state: string;
    country: string;
    distance?: number;
}

export class CollegeService {
    /**
     * Haversine formula to calculate distance between two points in km
     */
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(2));
    }

    /**
     * Fetch nearby colleges offering specific specialization
     */
    static async getNearbyColleges(
        userLat: number,
        userLon: number,
        specialization: string,
        limit: number = 20
    ): Promise<College[]> {
        try {
            // Fetch colleges that offer the specialization
            // Note: Cloud Firestore doesn't support geolocation queries directly with 'array-contains-any' and distance sorting.
            // We fetch colleges offering the course and then calculate distance and sort in memory.
            const querySnapshot = await db.collection('colleges')
                .where('coursesOffered', 'array-contains', specialization)
                .get();

            const colleges: College[] = [];
            querySnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const data = doc.data() as Omit<College, 'id'>;
                const distance = this.calculateDistance(
                    userLat,
                    userLon,
                    data.location.latitude,
                    data.location.longitude
                );
                colleges.push({
                    id: doc.id,
                    ...data,
                    distance
                });
            });

            // Sort by distance ascending and limit results
            return colleges.sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, limit);

        } catch (error) {
            console.error('[CollegeService] Error fetching nearby colleges:', error);
            throw error;
        }
    }

    /**
     * Admin: Add new college
     */
    static async addCollege(collegeData: Omit<College, 'id'>): Promise<string> {
        const docRef = await db.collection('colleges').add({
            ...collegeData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    }

    /**
     * Admin: Update college
     */
    static async updateCollege(collegeId: string, collegeData: Partial<College>): Promise<void> {
        await db.collection('colleges').doc(collegeId).update({
            ...collegeData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    /**
     * Admin: Delete college
     */
    static async deleteCollege(collegeId: string): Promise<void> {
        await db.collection('colleges').doc(collegeId).delete();
    }
}
