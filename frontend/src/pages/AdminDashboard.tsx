import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, TrendingUp, Activity, RefreshCw, Server, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const StatSkeleton = memo(() => (
    <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
        </CardContent>
    </Card>
));

const HealthItem = memo(({ label, icon: Icon, status }: { label: string, icon: any, status: 'ok' | 'degraded' | 'down' }) => (
    <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg shadow-sm">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">{label}</span>
        </div>
        <span className={cn(
            "flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
            status === 'ok' ? "text-success" : status === 'degraded' ? "text-warning" : "text-danger"
        )}>
            <div className={cn("h-2 w-2 rounded-full animate-pulse", status === 'ok' ? "bg-success" : "bg-danger")} />
            {status === 'ok' ? "Operational" : "Degraded"}
        </span>
    </div>
));

export default function AdminDashboard() {
    const { user } = useAuthContext();

    const { data: stats, isLoading: loading, refetch, isRefetching } = useQuery({
        queryKey: ['admin_stats'],
        queryFn: async () => {
            if (!user) return null;
            const token = await user.getIdToken();
            const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;
            const statsRes = await fetch(`${API_URL}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!statsRes.ok) throw new Error('Failed to load stats');
            return statsRes.json();
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });

    const handleRefresh = async () => {
        try {
            await refetch();
            toast.success('Admin intelligence refreshed');
        } catch (error) {
            toast.error('Failed to sync management data');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Management Control Console</h1>
                        <p className="text-muted-foreground text-sm">System-wide performance and user oversight</p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefetching}
                        variant="outline"
                        className="shadow-sm active:scale-95 transition-transform"
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4", isRefetching && "animate-spin")} />
                        Refresh Intelligence
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {loading && !stats ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        <>
                            <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Intelligence Units (Users)</CardTitle>
                                    <Users className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tighter">{stats?.totalUsers || 0}</div>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Active registered core</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-all duration-300 border-success/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Sessions</CardTitle>
                                    <UserCheck className="h-4 w-4 text-success" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tighter">{stats?.activeUsers || 0}</div>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Live in last 30 minutes</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-all duration-300 border-warning/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Login Events (24h)</CardTitle>
                                    <Activity className="h-4 w-4 text-warning" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tighter">{stats?.logins?.today || 0}</div>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Weekly aggregate: {stats?.logins?.thisWeek || 0}</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Acquisitions</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tighter">{stats?.signups?.today || 0}</div>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">Weekly growth: {stats?.signups?.thisWeek || 0}</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1 border-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">System Nexus</CardTitle>
                            <CardDescription>Core infrastructure status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <HealthItem label="Firestore Cluster" icon={Server} status="ok" />
                            <HealthItem label="Auth Gateway" icon={ShieldCheck} status="ok" />
                            <HealthItem label="AI Compute Layer" icon={Zap} status="ok" />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Activity Metrics</CardTitle>
                            <CardDescription>Comparative growth analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Signups</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Today', value: stats?.signups?.today },
                                            { label: 'This Week', value: stats?.signups?.thisWeek },
                                            { label: 'This Month', value: stats?.signups?.thisMonth },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-end border-b pb-2">
                                                <span className="text-sm font-medium">{item.label}</span>
                                                <span className="text-xl font-bold tracking-tighter">{loading ? '...' : item.value || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logins</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Today', value: stats?.logins?.today },
                                            { label: 'This Week', value: stats?.logins?.thisWeek },
                                            { label: 'This Month', value: stats?.logins?.thisMonth },
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-end border-b pb-2">
                                                <span className="text-sm font-medium">{item.label}</span>
                                                <span className="text-xl font-bold tracking-tighter">{loading ? '...' : item.value || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout >
    );
}
