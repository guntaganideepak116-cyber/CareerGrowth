import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AdminGuardProps {
    children: ReactNode;
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

/**
 * AdminGuard - Blocks non-admin users from accessing admin routes
 * Shows warning message and prevents access
 */
export function AdminGuard({ children }: AdminGuardProps) {
    const { user, loading: authLoading } = useAuthContext();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        checkAdminAccess();
    }, [user, authLoading]);

    const checkAdminAccess = async () => {
        // Wait for auth to load
        if (authLoading) {
            return;
        }

        // Block if not logged in
        if (!user) {
            setAccessDenied(true);
            setChecking(false);
            toast.error('Please login to continue');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }


        try {
            const token = await user.getIdToken();
            const response = await fetch(`${API_URL}/check`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                // Admin verified - allow access
                setIsAdmin(true);
                setAccessDenied(false);
            } else {
                // Not admin - block access
                setIsAdmin(false);
                setAccessDenied(true);
                toast.error('Access Denied: Admin privileges required');
            }
        } catch (error) {
            // Error checking admin - block access
            setIsAdmin(false);
            setAccessDenied(true);
            toast.error('Failed to verify admin access');
        } finally {
            setChecking(false);
        }
    };

    // Show loading state
    if (authLoading || checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Show access denied screen
    if (accessDenied || !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-destructive/50">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                        <CardDescription className="text-base">
                            You do not have permission to access the admin dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Reason:</strong> Admin privileges are required to access this area.
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This section is restricted to authorized administrators only. If you believe you should have access, please contact the system administrator.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full"
                            >
                                Go to Home
                            </Button>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-3 text-center">
                            <p className="text-xs text-muted-foreground">
                                This access attempt has been logged for security purposes
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Admin verified - show admin content
    return <>{children}</>;
}
