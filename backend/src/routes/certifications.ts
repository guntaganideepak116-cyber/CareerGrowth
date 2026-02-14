import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/certifications
// Query params: field, specialization, careerPath
router.get('/', async (req: Request, res: Response) => {
    try {
        const { field, specialization, careerPath, id } = req.query;

        // If ID is provided, return specific certification
        if (id && typeof id === 'string') {
            const certDoc = await db.collection('certifications').doc(id).get();
            if (certDoc.exists) {
                return res.json({
                    success: true,
                    data: { id: certDoc.id, ...certDoc.data() }
                });
            } else {
                return res.status(404).json({ success: false, error: 'Certification not found' });
            }
        }

        // Build query
        let query: any = db.collection('certifications');

        if (field) {
            query = query.where('fieldId', '==', field);
        }

        if (specialization) {
            query = query.where('specializationId', '==', specialization);
        }

        const snapshot = await query.get();
        let certs = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fallback for field naming inconsistency
        if (certs.length === 0 && field) {
            const fallbackQuery = db.collection('certifications').where('field', '==', field);
            const fallbackSnapshot = await fallbackQuery.get();
            certs = fallbackSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            }));

            if (specialization) {
                certs = certs.filter((c: any) => c.specializationId === specialization || c.specialization === specialization);
            }
        }

        // Additional filter for careerPath if provided
        if (careerPath) {
            const cp = String(careerPath).toLowerCase();
            certs = certs.filter((c: any) =>
                (c.careerPath && c.careerPath.toLowerCase().includes(cp)) ||
                (c.careerPaths && c.careerPaths.some((path: string) => path.toLowerCase().includes(cp)))
            );
        }

        res.json({
            success: true,
            count: certs.length,
            data: certs
        });

    } catch (error) {
        console.error('Error fetching certifications:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

// GET /api/certifications/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const certDoc = await db.collection('certifications').doc(id).get();

        if (certDoc.exists) {
            res.json({
                success: true,
                data: { id: certDoc.id, ...certDoc.data() }
            });
        } else {
            res.status(404).json({ success: false, error: 'Certification not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
