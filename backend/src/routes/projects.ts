import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/projects
// Query params: field, specialization, careerPath
router.get('/', async (req: Request, res: Response) => {
    try {
        const { field, specialization, careerPath, id } = req.query;

        // 1. If ID is provided, return specific project (Direct Access)
        if (id && typeof id === 'string') {
            const projectDoc = await db.collection('projects').doc(id).get();
            if (projectDoc.exists) {
                return res.json({
                    success: true,
                    data: { id: projectDoc.id, ...projectDoc.data() }
                });
            } else {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
        }

        // 2. Strict Filtering Logic (MANDATORY)
        // Under no circumstances should unrelated projects be visible.
        if (!field || !specialization) {
            return res.json({
                success: true,
                count: 0,
                data: [],
                message: 'Field and specialization are mandatory for filtered results.'
            });
        }

        // Build strict query
        // We support both 'field'/'specialization' and 'fieldId'/'specializationId' 
        // to maintain compatibility with different data versions while enforcing the filter.
        let query = db.collection('projects')
            .where('field', '==', field)
            .where('specialization', '==', specialization);

        let snapshot = await query.get();
        let projects = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fallback for fieldId/specializationId schema if no results found with primary schema
        if (projects.length === 0) {
            query = db.collection('projects')
                .where('fieldId', '==', field)
                .where('specializationId', '==', specialization);

            snapshot = await query.get();
            projects = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            }));
        }

        // 3. Optional Career Path Filtering (Hierarchy Step)
        if (careerPath && projects.length > 0) {
            const cp = String(careerPath).toLowerCase();
            projects = projects.filter((p: any) =>
                (p.careerPath && String(p.careerPath).toLowerCase().includes(cp)) ||
                (p.careerPaths && Array.isArray(p.careerPaths) && p.careerPaths.some((path: string) => String(path).toLowerCase().includes(cp)))
            );
        }

        res.json({
            success: true,
            status: projects.length > 0 ? 'success' : 'empty',
            count: projects.length,
            data: projects,
            message: projects.length === 0 ? "No projects available for this specialization yet." : undefined
        });

    } catch (error) {
        console.error('STRICT_PROJECTS_FILTER_ERROR:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

export default router;
