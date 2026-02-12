import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSystem } from '@/contexts/SystemContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuthContext();
    const { config, loading: systemLoading } = useSystem();
    const location = useLocation();
    const hasShownToast = useRef(false);

    // Show loading spinner while auth or system config is initializing
    if (loading || systemLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Role check
    const userRole = profile?.role || 'user';
    const isAdmin = userRole === 'admin';

    // Protocol: Maintenance Mode check
    // Maintenance mode blocks ALL authenticated non-admin users from accessing protected routes
    if (config.maintenanceMode && !isAdmin && location.pathname !== '/maintenance') {
        return <Navigate to="/maintenance" replace />;
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User role check (if profile exists)
    // userRole is already defined above in the maintenance check

    // Admin route required but user is not admin
    if (requireAdmin) {
        // If admin required, we MUST wait or ensure profile is loaded
        // However, if profile is null but user is admin, this might fail unless we handled it in useAuth
        // But for typical admin accounts, profile should exist.
        if (userRole !== 'admin') {
            if (!hasShownToast.current) {
                toast.error('⚠️ Access Denied', {
                    description: 'You do not have permission to access the admin area.',
                    duration: 5000,
                });
                hasShownToast.current = true;
            }
            return <Navigate to="/dashboard" replace />;
        }
    }

    // All checks passed - render the protected content
    return <>{children}</>;
}
