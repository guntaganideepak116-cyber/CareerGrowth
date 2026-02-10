import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuthContext();
    const location = useLocation();
    const hasShownToast = useRef(false);

    // Show loading spinner while auth is initializing
    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User exists but no profile
    if (!profile) {
        return <Navigate to="/login" replace />;
    }

    // Defensive: Treat missing role as 'user'
    const userRole = profile.role || 'user';

    // Admin route required but user is not admin
    if (requireAdmin && userRole !== 'admin') {
        if (!hasShownToast.current) {
            toast.error('⚠️ Access Denied', {
                description: 'You do not have permission to access the admin area.',
                duration: 5000,
            });
            hasShownToast.current = true;
        }
        return <Navigate to="/dashboard" replace />;
    }



    // All checks passed - render the protected content
    return <>{children}</>;
}
