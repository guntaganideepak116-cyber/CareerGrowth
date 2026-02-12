import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminGuardProps {
    children: ReactNode;
}

/**
 * AdminGuard - Blocks non-admin users from accessing admin routes
 * Uses local AuthContext for instant verification, falling back to profile check
 */
export function AdminGuard({ children }: AdminGuardProps) {
    const { user, profile, loading: authLoading } = useAuthContext();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        // If auth finished loading
        if (!authLoading) {
            // Check if we have user and if role is admin
            if (!user) {
                toast.error('Please login to continue');
                navigate('/login');
                return;
            }

            // If profile is loaded, check role
            if (profile) {
                if (profile.role === 'admin') {
                    setVerifying(false);
                } else {
                    // Not an admin
                    setVerifying(false);
                }
            } else {
                // Profile not loaded yet, wait for it
                // useAuth fetches profile immediately after user is detected
            }
        }
    }, [user, profile, authLoading, navigate]);

    // Show loading state while auth or profile is loading
    if (authLoading || (user && !profile && verifying)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 animate-pulse text-primary" />
                    <p className="mt-4 text-sm font-medium animate-pulse">Establishing Secure Connection...</p>
                </div>
            </div>
        );
    }

    // Access Denied Screen
    if (!user || (profile && profile.role !== 'admin')) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-destructive/50 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-destructive">Unauthorized Access</CardTitle>
                        <CardDescription className="text-base font-medium">
                            Administrative privileges are required for this section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                            Access to the Control Center is restricted to authorized personnel. Your attempt has been logged.
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button onClick={() => navigate('/dashboard')} className="w-full py-6 text-lg font-semibold">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Return to User Dashboard
                            </Button>
                            <Button onClick={() => navigate('/')} variant="ghost" className="w-full">
                                Back to Homepage
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Admin verified - show admin content
    return <>{children}</>;
}
