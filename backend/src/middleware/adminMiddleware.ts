import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

/**
 * Simple Firebase Auth Middleware
 * Verifies Firebase token and attaches user to request
 */
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user to request
        (req as any).user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Admin Check Middleware
 * Verifies user email matches ADMIN_EMAIL from environment
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = (req as any).user?.email;

    console.log('[Admin Check] Configured Admin Email:', adminEmail);
    console.log('[Admin Check] User Email from Token:', userEmail);

    if (!adminEmail) {
        console.error('[Admin Check] ADMIN_EMAIL is not configured in environment variables!');
        return res.status(500).json({ error: 'Admin not configured' });
    }

    if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        console.warn(`[Admin Check] Access Denied - User: ${userEmail} | Required: ${adminEmail}`);
        return res.status(403).json({
            error: 'Admin access required',
            details: `Please log in with the admin account: ${adminEmail}`
        });
    }

    console.log('[Admin Check] ✓ Admin access granted');
    next();
}
