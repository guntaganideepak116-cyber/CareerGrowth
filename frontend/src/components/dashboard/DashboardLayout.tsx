import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, profile } = useAuthContext();

  // Optimized Phase 1: If we have a cached profile, show layout immediately
  // This achieves the "0ms" load feel for the sidebar and header.
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is admin, redirect to admin dashboard
  // This prevents admins from seeing the user sidebar
  if (profile?.role === 'admin') {
    console.log('[DashboardLayout] Admin user detected, redirecting to /admin');
    return <Navigate to="/admin" replace />;
  }

  // Regular user - show user sidebar
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
