import express from 'express';
import { CollegeService } from '../services/collegeService';
import { verifyToken } from '../middleware/adminMiddleware';
import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

const router = express.Router();

/**
 * GET /api/colleges/nearby
 * Fetch nearby colleges based on user location and specialization
 */
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lon, specialization } = req.query;

        if (!lat || !lon || !specialization) {
            return res.status(400).json({ error: 'Missing latitude, longitude or specialization' });
        }

        const colleges = await CollegeService.getNearbyColleges(
            parseFloat(lat as string),
            parseFloat(lon as string),
            specialization as string
        );

        res.json({ success: true, colleges });
    } catch (error) {
        console.error('Error in /colleges/nearby:', error);
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * ADMIN ROUTES
 */

// Get all colleges (Admin and dashboard view)
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('colleges').get();
        const colleges = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, colleges });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Add college
router.post('/', verifyToken, async (req, res) => {
    try {
        const collegeId = await CollegeService.addCollege(req.body);
        res.status(201).json({ success: true, collegeId });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Update college
router.put('/:id', verifyToken, async (req, res) => {
    try {
        await CollegeService.updateCollege(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Delete college
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await CollegeService.deleteCollege(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
