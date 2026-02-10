import express from 'express';
import { db } from '../config/firebase';
import { verifyToken } from '../middleware/adminMiddleware';

const router = express.Router();

/**
 * GET /api/portfolio
 * Get the current user's portfolio data
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const docRef = db.collection('user_portfolios').doc(userId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
                // Optional: return partial user data to help frontend pre-fil
                isNew: true
            });
        }

        res.json({
            success: true,
            data: docSnap.data()
        });

    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * POST /api/portfolio
 * Create or update the current user's portfolio
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.uid;
        const portfolioData = req.body;

        if (!portfolioData) {
            return res.status(400).json({ error: 'No data provided' });
        }

        // Validate structure briefly (optional but recommended)
        // For now, save what is sent, but ensure userId matches token
        // Prevent overwriting userId
        const cleanData = {
            ...portfolioData,
            userId: userId, // Enforce ownership
            updatedAt: new Date().toISOString()
        };

        await db.collection('user_portfolios').doc(userId).set(cleanData, { merge: true });

        res.json({
            success: true,
            message: 'Portfolio updated successfully',
            data: cleanData
        });

    } catch (error) {
        console.error('Error saving portfolio:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
