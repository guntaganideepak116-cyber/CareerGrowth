import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID token and attaches user to request
 */
export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user info to request (using type assertion)
        (req as any).user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };

        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}
