import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/certifications
// Query params: field, specialization, careerPath
router.get('/', async (req: Request, res: Response) => {
    try {
        const { field, specialization, careerPath, id } = req.query;

        // 1. If ID is provided, return specific certification (Direct Access)
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

        // 2. Strict Filtering Logic (MANDATORY)
        // Under no circumstances should unrelated certifications be visible.
        if (!field || !specialization) {
            return res.json({
                success: true,
                count: 0,
                data: [],
                message: 'Field and specialization are mandatory for filtered results.'
            });
        }

        // Build strict query
        let query = db.collection('certifications')
            .where('field', '==', field)
            .where('specialization', '==', specialization)
            .limit(50);

        let snapshot = await query.get();
        let certs = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fallback for fieldId/specializationId schema if no results found with primary schema
        if (certs.length === 0) {
            query = db.collection('certifications')
                .where('fieldId', '==', field)
                .where('specializationId', '==', specialization)
                .limit(50);

            snapshot = await query.get();
            certs = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            }));
        }

        // 3. Optional Career Path Filtering (Hierarchy Step)
        if (careerPath && certs.length > 0) {
            const cp = String(careerPath).toLowerCase();
            certs = certs.filter((c: any) =>
                (c.careerPath && String(c.careerPath).toLowerCase().includes(cp)) ||
                (c.careerPaths && Array.isArray(c.careerPaths) && c.careerPaths.some((path: string) => String(path).toLowerCase().includes(cp)))
            );
        }

        res.json({
            success: true,
            status: certs.length > 0 ? 'success' : 'empty',
            count: certs.length,
            data: certs,
            message: certs.length === 0 ? "No certifications available for this specialization yet." : undefined
        });

    } catch (error) {
        console.error('STRICT_CERTIFICATIONS_FILTER_ERROR:', error);
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
