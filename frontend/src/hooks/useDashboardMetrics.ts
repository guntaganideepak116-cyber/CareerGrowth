import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface DashboardMetrics {
    readinessScore: number;
    marketAlignment: number;
    aiConfidence: number;
    skillsCompleted: number;
    totalSkills: number;
    hasActivity: boolean;
    fieldId: string | null;
}

const DASHBOARD_CACHE_KEY = 'dashboard_metrics_cache';

export function useDashboardMetrics() {
    const { user } = useAuthContext();

    return useQuery({
        queryKey: ['dashboard_metrics', user?.uid],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated');
            const token = await user.getIdToken();

            const response = await fetch(`${API_URL}/api/analytics/dashboard-analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard metrics');
            }

            const data = await response.json();

            // Update local storage for next session init
            localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));

            return data as DashboardMetrics;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes (no background refetch)
        gcTime: 1000 * 60 * 30,   // Keep in cache for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch just because user tabbed away
        initialData: () => {
            // Instant load from localStorage if available
            const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
            return cached ? JSON.parse(cached) : undefined;
        },
        initialDataUpdatedAt: () => {
            // We don't know when LS data was saved, so we treat it as potentially stale immediately
            // allowing background refetch if staleTime is 0, but since staleTime is 5 min,
            // it might prevent immediate refetch if we don't set this.
            // Actually, let's treat LS data as 'stale' so it refreshes in background once.
            return 0;
        }
    });
}
