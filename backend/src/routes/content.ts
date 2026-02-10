import { Router, Request, Response } from 'express';
import { generateRoadmap } from '../services/aiService';

const router = Router();

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

// POST /api/content/generate
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

        // Handle different content types
        switch (request.type) {
            case 'roadmap':
                if (!request.fieldId || !request.specializationId) {
                    return res.status(400).json({
                        success: false,
                        error: 'fieldId and specializationId are required for roadmap generation',
                    });
                }

                const roadmapData = await generateRoadmap(
                    request.fieldId,
                    request.specializationId,
                    request.userProfile
                );

                return res.json({
                    success: true,
                    data: roadmapData,
                });

            default:
                return res.status(400).json({
                    success: false,
                    error: `Content type "${request.type}" is not yet implemented`,
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

export default router;
