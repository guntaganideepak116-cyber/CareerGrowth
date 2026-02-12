import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, TrendingUp, Activity, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function AdminDashboard() {
    const { user } = useAuthContext();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // specific listeners for real-time updates
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            try {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

                const allUsers = snapshot.docs.map(doc => doc.data());
                const totalUsers = snapshot.size;

                // Active Users (last 30 mins)
                const activeUsers = allUsers.filter(u => {
                    const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                    return lastLogin && lastLogin >= thirtyMinutesAgo;
                }).length;

                // Signups
                const signups = {
                    today: allUsers.filter(u => {
                        const created = u.created_at ? new Date(u.created_at) : null;
                        return created && created >= today;
                    }).length,
                    thisWeek: allUsers.filter(u => {
                        const created = u.created_at ? new Date(u.created_at) : null;
                        return created && created >= weekAgo;
                    }).length,
                    thisMonth: allUsers.filter(u => {
                        const created = u.created_at ? new Date(u.created_at) : null;
                        return created && created >= monthAgo;
                    }).length,
                    thisYear: allUsers.filter(u => {
                        const created = u.created_at ? new Date(u.created_at) : null;
                        return created && created >= yearAgo;
                    }).length,
                };

                // Logins
                const logins = {
                    today: allUsers.filter(u => {
                        const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                        return lastLogin && lastLogin >= today;
                    }).length,
                    thisWeek: allUsers.filter(u => {
                        const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                        return lastLogin && lastLogin >= weekAgo;
                    }).length,
                    thisMonth: allUsers.filter(u => {
                        const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                        return lastLogin && lastLogin >= monthAgo;
                    }).length,
                    thisYear: allUsers.filter(u => {
                        const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                        return lastLogin && lastLogin >= yearAgo;
                    }).length,
                };

                setStats({
                    totalUsers,
                    activeUsers,
                    signups,
                    logins
                });
                setLoading(false);
            } catch (error) {
                console.error("Error processing admin stats:", error);
                toast.error("Error processing real-time data");
            }
        }, (error) => {
            console.error("Error listening to users:", error);
            toast.error("Failed to subscribe to real-time updates");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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
                {/* Header with Live Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                        <p className="text-sm text-muted-foreground">Real-time platform statistics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium animate-pulse">
                        <Wifi className="h-3 w-3" />
                        Live Updates Active
                    </div>
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
