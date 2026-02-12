import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, Activity, Wifi, DollarSign, FileText } from 'lucide-react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Simple Error Boundary to catch render crashes
class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }
    componentDidCatch(error: any, errorInfo: any) {
        console.error("AdminDashboard Crash:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Dashboard Error</h2>
                    <p className="text-muted-foreground mb-4">Something went wrong loading the dashboard.</p>
                    <pre className="text-xs bg-muted p-4 rounded text-left overflow-auto max-w-lg mx-auto">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

interface Stats {
    totalUsers: number;
    activeUsers: number;
    signups: { today: number; thisWeek: number; thisMonth: number; thisYear: number };
    logins: { today: number; thisWeek: number; thisMonth: number; thisYear: number };
    revenue: { total: number; monthly: number };
    learning: {
        totalProjects: number;
        totalSkills: number;
        totalAssessments: number;
        avgAssessmentScore: number;
    };
    popularField: string;
}

const defaultStats: Stats = {
    totalUsers: 0,
    activeUsers: 0,
    signups: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 },
    logins: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 },
    revenue: { total: 0, monthly: 0 },
    learning: { totalProjects: 0, totalSkills: 0, totalAssessments: 0, avgAssessmentScore: 0 },
    popularField: 'Loading...'
};

export default function AdminDashboard() {
    const { user } = useAuthContext();
    const [stats, setStats] = useState<Stats>(defaultStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        console.log("AdminDashboard: Starting subscriptions...");

        try {
            // Listen to Users
            const unsubscribeUsers = onSnapshot(collection(db, 'users'), (userSnap) => {
                // Listen to Progress
                const unsubscribeProgress = onSnapshot(collection(db, 'user_progress'), (progressSnap) => {
                    try {
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

                        console.log(`AdminDashboard: Data received. Users: ${userSnap.size}, Progress: ${progressSnap.size}`);

                        const allUsers = userSnap.docs.map(doc => doc.data());
                        const allProgress = progressSnap.docs.map(doc => doc.data());

                        // Active Users
                        const activeUsers = allUsers.filter(u => {
                            const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                            return lastLogin && lastLogin >= thirtyMinutesAgo;
                        }).length;

                        // Date helper
                        const filterByDate = (dateField: any, threshold: Date) => {
                            const date = dateField instanceof Timestamp ? dateField.toDate() : dateField ? new Date(dateField) : null;
                            return date && date >= threshold;
                        };

                        const signups = {
                            today: allUsers.filter(u => filterByDate(u.created_at, today)).length,
                            thisWeek: allUsers.filter(u => filterByDate(u.created_at, weekAgo)).length,
                            thisMonth: allUsers.filter(u => filterByDate(u.created_at, monthAgo)).length,
                            thisYear: allUsers.filter(u => filterByDate(u.created_at, yearAgo)).length,
                        };

                        const logins = {
                            today: allUsers.filter(u => filterByDate(u.lastLogin, today)).length,
                            thisWeek: allUsers.filter(u => filterByDate(u.lastLogin, weekAgo)).length,
                            thisMonth: allUsers.filter(u => filterByDate(u.lastLogin, monthAgo)).length,
                            thisYear: allUsers.filter(u => filterByDate(u.lastLogin, yearAgo)).length,
                        };

                        // Revenue
                        let totalRevenue = 0;
                        let monthlyRevenue = 0;
                        const fieldCounts: Record<string, number> = {};

                        allUsers.forEach(u => {
                            if (u.userPlan === 'pro') {
                                totalRevenue += 99;
                                monthlyRevenue += 9.99;
                            } else if (u.userPlan === 'premium') {
                                totalRevenue += 199;
                                monthlyRevenue += 19.99;
                            }
                            if (u.field) {
                                fieldCounts[u.field] = (fieldCounts[u.field] || 0) + 1;
                            }
                        });

                        const popularField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

                        // Learning
                        let totalProjects = 0;
                        let totalSkills = 0;
                        let totalAssessments = 0;
                        let totalAssessmentScore = 0;
                        let assessmentCount = 0;

                        allProgress.forEach(p => {
                            totalProjects += p.completedProjects?.length || 0;
                            totalSkills += p.completedSkills?.length || 0;
                            if (p.assessmentScore) {
                                totalAssessments += p.assessmentScore.attempts || 0;
                                if (p.assessmentScore.lastScore > 0) {
                                    totalAssessmentScore += p.assessmentScore.lastScore;
                                    assessmentCount++;
                                }
                            }
                        });

                        setStats({
                            totalUsers: userSnap.size,
                            activeUsers,
                            signups,
                            logins,
                            revenue: {
                                total: Math.round(totalRevenue),
                                monthly: Math.round(monthlyRevenue)
                            },
                            learning: {
                                totalProjects,
                                totalSkills,
                                totalAssessments,
                                avgAssessmentScore: assessmentCount > 0 ? Math.round(totalAssessmentScore / assessmentCount) : 0
                            },
                            popularField
                        });
                        setLoading(false);
                    } catch (err) {
                        console.error("AdminDashboard: Error processing data", err);
                    }
                });
                return () => unsubscribeProgress();
            });
            return () => unsubscribeUsers();
        } catch (err) {
            console.error("AdminDashboard: Error setting up listeners", err);
            setLoading(false);
        }
    }, [user]);

    return (
        <AdminLayout>
            <ErrorBoundary>
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">System Overview</h2>
                                <p className="text-sm text-muted-foreground">Real-time platform intelligence</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium animate-pulse">
                                <Wifi className="h-3 w-3" />
                                Live Data Stream
                            </div>
                        </div>

                        {/* Top Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${stats.revenue?.monthly ?? 0}/mo</div>
                                    <p className="text-xs text-muted-foreground">Est. Annual: ${stats.revenue?.total ?? 0}</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                                    <UserCheck className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.activeUsers ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">Online now</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Projects Submitted</CardTitle>
                                    <FileText className="h-4 w-4 text-purple-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.learning?.totalProjects ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">Total completions</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Assessment</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.learning?.avgAssessmentScore ?? 0}%</div>
                                    <p className="text-xs text-muted-foreground">{stats.learning?.totalAssessments ?? 0} attempts</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Secondary Stats */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">New Today</span><span className="font-bold">{stats.signups?.today ?? 0}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">This Week</span><span className="font-bold">{stats.signups?.thisWeek ?? 0}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">This Month</span><span className="font-bold">{stats.signups?.thisMonth ?? 0}</span></div>
                                        <div className="mt-4 pt-4 border-t flex justify-between items-center"><span className="text-sm font-medium">Total Users</span><span className="text-xl font-bold text-primary">{stats.totalUsers ?? 0}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-base">Engagement</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Logins Today</span><span className="font-bold">{stats.logins?.today ?? 0}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Skills Mastered</span><span className="font-bold">{stats.learning?.totalSkills ?? 0}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Top Field</span><span className="font-bold text-primary truncate max-w-[120px]">{stats.popularField ?? 'N/A'}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-base">System Health</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg"><span className="text-sm font-medium text-green-700">Database</span><Wifi className="h-4 w-4 text-green-500 animate-pulse" /></div>
                                        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg"><span className="text-sm font-medium text-green-700">Auth Services</span><Wifi className="h-4 w-4 text-green-500 animate-pulse" /></div>
                                        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg"><span className="text-sm font-medium text-green-700">Functions</span><Wifi className="h-4 w-4 text-green-500 animate-pulse" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </ErrorBoundary>
        </AdminLayout>
    );
}
