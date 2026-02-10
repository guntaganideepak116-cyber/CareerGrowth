import { Router, Request, Response } from 'express';
import { projectsMap, FieldProject } from '../data/projectsData';

const router = Router();

// GET /api/projects
// Query params: field, branch
router.get('/', (req: Request, res: Response) => {
    try {
        const { field, branch, id } = req.query;

        if (id && typeof id === 'string') {
            const allProjects = Object.values(projectsMap).flat();
            const project = allProjects.find(p => p.id === id);

            if (project) {
                return res.json({
                    success: true,
                    data: project
                });
            } else {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
        }

        let projects: FieldProject[] = [];

        // Logic to select projects based on field/branch
        // Priority: Branch -> Field -> Default (Engineering)

        if (typeof branch === 'string' && projectsMap[branch.toLowerCase()]) {
            projects = projectsMap[branch.toLowerCase()];
        } else if (typeof field === 'string' && projectsMap[field.toLowerCase()]) {
            projects = projectsMap[field.toLowerCase()];
        } else {
            // Fallback or empty
            projects = projectsMap['engineering'] || [];
        }

        // Return successfully with the projects list
        res.status(200).json({
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
