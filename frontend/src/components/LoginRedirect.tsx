import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * After successful login, redirect user to appropriate dashboard based on role
 */
export function LoginRedirect() {
    const { profile, loading } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile) {
            // Redirect based on role
            if (profile.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                // Send regular users to onboarding (preview) flow
                // This allows them to update preferences or skip on every login
                navigate('/onboarding', { replace: true });
            }
        }
    }, [profile, loading, navigate]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Redirecting...</p>
            </div>
        </div>
    );
}
