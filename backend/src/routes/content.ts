import { Router, Request, Response } from 'express';
import { generateDynamicContent, clearCache } from '../services/dynamicContentService';

const router = Router();

router.get('/ping', (req, res) => {
    res.json({ status: 'ok', router: 'content' });
});

interface ContentRequest {
    type: 'fields' | 'specializations' | 'career-paths' | 'roadmap' | 'certifications' | 'projects';
    fieldId?: string;
    specializationId?: string;
    userProfile?: {
        semester?: number;
        skills?: string[];
        careerGoal?: string;
    };
}

// POST /api/content/generate - Universal AI content generation
router.post('/generate', async (req: Request, res: Response) => {
    try {
        const request: ContentRequest = req.body;

        // Validate request
        if (!request.type) {
            return res.status(400).json({
                success: false,
                error: 'Content type is required',
            });
        }

        if (!request.fieldId) {
            return res.status(400).json({
                success: false,
                error: 'fieldId is required',
            });
        }

        // Handle different content types
        switch (request.type) {
            case 'roadmap':
                if (!request.specializationId) {
                    return res.status(400).json({
                        success: false,
                        error: 'specializationId is required for roadmap',
                    });
                }

                const roadmapData = await generateDynamicContent(
                    'roadmap',
                    request.fieldId,
                    request.specializationId,
                    request.userProfile
                );

                return res.json({
                    success: true,
                    data: roadmapData,
                });

            case 'projects':
                if (!request.specializationId) {
                    return res.status(400).json({
                        success: false,
                        error: 'specializationId is required for projects',
                    });
                }

                const projectsData = await generateDynamicContent(
                    'projects',
                    request.fieldId,
                    request.specializationId
                );

                return res.json({
                    success: true,
                    data: projectsData,
                });

            case 'certifications':
                if (!request.specializationId) {
                    return res.status(400).json({
                        success: false,
                        error: 'specializationId is required for certifications',
                    });
                }

                const certificationsData = await generateDynamicContent(
                    'certifications',
                    request.fieldId,
                    request.specializationId
                );

                return res.json({
                    success: true,
                    data: certificationsData,
                });

            case 'specializations':
                const specializationsData = await generateDynamicContent(
                    'specializations',
                    request.fieldId
                );

                return res.json({
                    success: true,
                    data: specializationsData,
                });

            case 'fields':
            case 'career-paths':
                return res.status(400).json({
                    success: false,
                    error: `Content type "${request.type}" not yet implemented. Use existing endpoints.`,
                });

            default:
                return res.status(400).json({
                    success: false,
                    error: `Unknown content type: "${request.type}"`,
                });
        }
    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate content',
        });
    }
});

// POST /api/content/clear-cache - Clear AI cache (for testing/refresh)
router.post('/clear-cache', async (req: Request, res: Response) => {
    try {
        const { cacheKey } = req.body;
        await clearCache(cacheKey);

        return res.json({
            success: true,
            message: cacheKey ? `Cleared cache: ${cacheKey}` : 'Cleared all cache',
        });
    } catch (error) {
        console.error('Error clearing cache:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to clear cache',
        });
    }
});

export default router;

