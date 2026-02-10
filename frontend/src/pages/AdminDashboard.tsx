import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Stats {
    totalUsers: number;
    activeUsers: number;
    signups: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        thisYear: number;
    };
    logins: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        thisYear: number;
    };
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

export default function AdminDashboard() {
    const { user } = useAuthContext();
    // Optimized: Fetch admin stats using React Query
    const { data: stats, isLoading: loading, refetch, isRefetching } = useQuery({
        queryKey: ['admin_stats'],
        queryFn: async () => {
            if (!user) return null;
            const token = await user.getIdToken(true);
            const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;
            const statsRes = await fetch(`${API_URL}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!statsRes.ok) throw new Error('Failed to load stats');
            return statsRes.json();
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const handleRefresh = async () => {
        await refetch();
        toast.success('Data refreshed');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex justify-end">
                    <Button onClick={handleRefresh} disabled={isRefetching} variant="outline">
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Overview Stats */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Registered on platform
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Active in last 30 min
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Logins Today</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.logins.today}</div>
                                <p className="text-xs text-muted-foreground">
                                    This week: {stats.logins.thisWeek}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Signups Today</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.signups.today}</div>
                                <p className="text-xs text-muted-foreground">
                                    This week: {stats.signups.thisWeek}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Current platform status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="text-sm font-medium">Database</span>
                                <span className="flex items-center gap-2 text-sm text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="text-sm font-medium">Authentication</span>
                                <span className="flex items-center gap-2 text-sm text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="text-sm font-medium">AI Services</span>
                                <span className="flex items-center gap-2 text-sm text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Operational
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Summary */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Signup Activity</CardTitle>
                                <CardDescription>New user registrations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Today:</span>
                                        <span className="font-medium">{stats.signups.today}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Week:</span>
                                        <span className="font-medium">{stats.signups.thisWeek}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Month:</span>
                                        <span className="font-medium">{stats.signups.thisMonth}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Year:</span>
                                        <span className="font-medium">{stats.signups.thisYear}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Login Activity</CardTitle>
                                <CardDescription>User authentication events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Today:</span>
                                        <span className="font-medium">{stats.logins.today}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Week:</span>
                                        <span className="font-medium">{stats.logins.thisWeek}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Month:</span>
                                        <span className="font-medium">{stats.logins.thisMonth}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">This Year:</span>
                                        <span className="font-medium">{stats.logins.thisYear}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AdminLayout >
    );
}
