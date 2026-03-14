/**
 * STRICT CONTENT API
 * Database-first with AI fallback
 */

import { Router, Request, Response } from 'express';
import { getStrictContent } from '../services/strictContentService';

const router = Router();

// POST /api/strict-content
router.post('/', async (req: Request, res: Response) => {
    try {
        const { type, userContext } = req.body;

        // Validation
        if (!type || !userContext || !userContext.field) {
            return res.status(400).json({
                error: 'Missing required fields: type, userContext.field'
            });
        }

        const validTypes = ['career_paths', 'projects', 'certifications', 'roadmap'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
            });
        }

        console.log(`📥 Strict content request: ${type} for ${userContext.field} / ${userContext.specialization || userContext.branch || 'any'}`);

        // Fetch strict content
        const result = await getStrictContent(type, userContext);

        // Return structured response
        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('❌ Strict content error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            field: req.body.userContext?.field,
            data: []
        });
    }
});

export default router;
