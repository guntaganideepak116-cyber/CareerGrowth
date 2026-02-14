import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/projects
// Query params: field, specialization, careerPath
router.get('/', async (req: Request, res: Response) => {
    try {
        const { field, specialization, careerPath, id } = req.query;

        // If ID is provided, return specific project
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

        // Build query
        let query: any = db.collection('projects');

        if (field) {
            query = query.where('fieldId', '==', field); // Support both fieldId and field
        }

        if (req.query.branch) {
            query = query.where('branch', '==', req.query.branch);
        }

        if (specialization) {
            query = query.where('specializationId', '==', specialization);
        }

        const snapshot = await query.get();
        let projects = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Secondary filtering for field/specialization if where clauses failed (due to field vs fieldId inconsistency)
        if (projects.length === 0 && field) {
            const fallbackQuery = db.collection('projects').where('field', '==', field);
            const fallbackSnapshot = await fallbackQuery.get();
            projects = fallbackSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            }));

            if (specialization) {
                projects = projects.filter((p: any) => p.specializationId === specialization || p.specialization === specialization);
            }
        }

        // Additional filter for careerPath if provided
        if (careerPath) {
            const cp = String(careerPath).toLowerCase();
            projects = projects.filter((p: any) =>
                (p.careerPath && p.careerPath.toLowerCase().includes(cp)) ||
                (p.careerPaths && p.careerPaths.some((path: string) => path.toLowerCase().includes(cp)))
            );
        }

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

export default router;
