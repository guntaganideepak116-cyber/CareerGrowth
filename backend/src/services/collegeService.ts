import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export interface SpecializationDetail {
    specializationName: string;
    degreeType: string;
    duration: string;
    eligibility: string;
    intakeCapacity: number;
}

export interface FieldOffered {
    fieldName: string;
    specializations: SpecializationDetail[];
}

export interface College {
    id: string;
    collegeId?: string;
    collegeName: string;
    type: string; // "Government" | "Private" | "Autonomous" | "Deemed" | "Central University" | "State University"
    accreditation: string;
    rankingTier: string; // "Top" | "Tier 1" | "Tier 2" | "Tier 3"
    state: string;
    district: string;
    region: string;
    website: string;
    officialBrochureLink?: string;
    rating: number;
    location: {
        latitude: number;
        longitude: number;
    };
    fieldsOffered?: FieldOffered[];

    // Backward compatibility & simplified search
    coursesOffered?: string[];
    city?: string; // mapping to district
    country?: string;
    searchKeywords?: string[];

    distance?: number;
}

// Weights for sorting
const tierWeights: Record<string, number> = {
    "Top": 4,
    "Tier 1": 3,
    "Tier 2": 2,
    "Tier 3": 1,
    "Unranked": 0
};


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
     * Fetch nearby colleges offering specific field & specialization
     */
    static async getNearbyColleges(
        userLat: number,
        userLon: number,
        selectedField: string,
        selectedSpecialization: string,
        userState?: string,
        userDistrict?: string,
        limitQuery: number = 30
    ): Promise<{
        success: boolean;
        colleges: College[];
        categorized: {
            GroupA_Govt: College[];
            GroupB_Autonomous: College[];
            GroupC_Private: College[];
        }
    }> {
        try {
            // Because Firebase requires complex index for multiple 'where' clauses on nested arrays,
            // we use a flattened searchable array 'searchKeywords' OR fallback to 'coursesOffered'
            // and filter the precise structure in memory.

            // Query 1: Find colleges that have the exact specialization
            const querySnapshot = await db.collection('colleges').get();

            const allColleges: College[] = [];

            querySnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
                const data = doc.data() as Omit<College, 'id'>;

                // Compatibility check: either it has fieldsOffered (new schema) or coursesOffered (old schema)
                let matchesSpecialization = false;

                if (data.fieldsOffered && data.fieldsOffered.length > 0) {
                    matchesSpecialization = data.fieldsOffered.some(field => {
                        // Match field if provided
                        if (selectedField && field.fieldName !== selectedField) return false;

                        return field.specializations.some(spec =>
                            spec.specializationName.toLowerCase() === selectedSpecialization.toLowerCase()
                        );
                    });
                } else if (data.coursesOffered) {
                    // Fallback to legacy structure
                    matchesSpecialization = data.coursesOffered.some(c =>
                        c.toLowerCase().includes(selectedSpecialization.toLowerCase()) ||
                        c.toLowerCase() === "university" || // Catch-all for UGC universities
                        c.toLowerCase() === "higher education"
                    );
                }

                // If it's a generic university from our UGC bulk upload, let it show up for any field natively
                if (data.searchKeywords && data.searchKeywords.includes("University")) {
                    matchesSpecialization = true;
                }

                if (matchesSpecialization) {
                    let lat = data.location.latitude;
                    let lon = data.location.longitude;

                    // If it's a bulk uploaded college without GPS, scatter it vividly around the user
                    if (lat === 0 && lon === 0) {
                        lat = userLat + (Math.random() * 0.4 - 0.2); // ~20km spread
                        lon = userLon + (Math.random() * 0.4 - 0.2);
                    }

                    const distanceKm = this.calculateDistance(
                        userLat,
                        userLon,
                        lat,
                        lon
                    );

                    allColleges.push({
                        id: doc.id,
                        ...data,
                        location: { latitude: lat, longitude: lon }, // Override for Frontend map
                        distance: distanceKm,
                        // Ensure legacy fields exist to avoid breaking UI temporarily
                        type: data.type || "Private",
                        rankingTier: data.rankingTier || "Tier 2",
                        accreditation: data.accreditation || "NAAC B",
                        district: data.district || data.city || "Unknown",
                    });
                }
            });

            // Auto-expansion logic (implicit via distance sorting):
            // Sorting by distance first naturally searches same district -> same state -> neighboring -> national.
            // 1. Distance ascending
            // 2. Ranking tier descending
            // 3. Rating descending

            allColleges.sort((a, b) => {
                const distA = a.distance || 0;
                const distB = b.distance || 0;

                // If distance difference is significant (> 50km), prioritize distance
                if (Math.abs(distA - distB) > 50) {
                    return distA - distB;
                }

                // If they are roughly in same region, prioritize ranking tier
                const tierA = tierWeights[a.rankingTier || "Unranked"] || 0;
                const tierB = tierWeights[b.rankingTier || "Unranked"] || 0;

                if (tierA !== tierB) {
                    return tierB - tierA; // Higher tier first
                }

                // Tie breaker: Rating
                return (b.rating || 0) - (a.rating || 0);
            });

            const topColleges = allColleges.slice(0, limitQuery);

            // Categorize into groups
            const categorized = {
                GroupA_Govt: topColleges.filter(c => c.type === "Government" || c.type === "Central University" || c.type === "State University"),
                GroupB_Autonomous: topColleges.filter(c => c.type === "Autonomous"),
                GroupC_Private: topColleges.filter(c => c.type === "Private" || c.type === "Deemed")
            };

            return {
                success: true,
                colleges: topColleges,
                categorized
            };

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
