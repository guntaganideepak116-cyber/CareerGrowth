import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

/**
 * Role-Based Authentication Middleware
 * Provides separate token verification for admin and user roles
 */

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email: string;
        role: 'admin' | 'user';
    };
}

/**
 * Verify Firebase ID Token (Common for both roles)
 */
async function verifyFirebaseToken(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return null;
    }
}

/**
 * Admin Token Verification Middleware
 * Verifies token and ensures user has admin role
 */
export async function verifyAdminToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const decodedToken = await verifyFirebaseToken(req, res);

    if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
    }

    // Check if email matches admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = decodedToken.email;

    if (!adminEmail) {
        console.error('[Admin Auth] ADMIN_EMAIL not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        console.warn(`[Admin Auth] Access denied for ${userEmail}`);
        return res.status(403).json({
            error: 'Admin access required',
            details: 'You do not have admin privileges'
        });
    }

    // Attach admin user info to request
    req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: 'admin'
    };

    console.log(`[Admin Auth] ✓ Admin access granted: ${userEmail}`);
    next();
}

/**
 * User Token Verification Middleware
 * Verifies token for regular user access
 */
export async function verifyUserToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const decodedToken = await verifyFirebaseToken(req, res);

    if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user token' });
    }

    // Attach user info to request
    req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: 'user'
    };

    console.log(`[User Auth] ✓ User access granted: ${decodedToken.email}`);
    next();
}

/**
 * Flexible Token Verification (for routes accessible by both)
 * Verifies token and attaches role based on email
 */
export async function verifyAnyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const decodedToken = await verifyFirebaseToken(req, res);

    if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Determine role based on email
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = decodedToken.email?.toLowerCase() === adminEmail?.toLowerCase();

    req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: isAdmin ? 'admin' : 'user'
    };

    console.log(`[Auth] ✓ Access granted: ${decodedToken.email} (${req.user.role})`);
    next();
}
