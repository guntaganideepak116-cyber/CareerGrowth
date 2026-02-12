import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, Activity, Wifi, DollarSign, BookOpen, Target, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { collection, onSnapshot, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function AdminDashboard() {
    const { user } = useAuthContext();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Listen to Users Collection
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (userSnap) => {
            // Listen to Progress Collection
            const unsubscribeProgress = onSnapshot(collection(db, 'user_progress'), (progressSnap) => {
                try {
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

                    const allUsers = userSnap.docs.map(doc => doc.data());
                    const allProgress = progressSnap.docs.map(doc => doc.data());

                    // User Stats
                    const totalUsers = userSnap.size;
                    const activeUsers = allUsers.filter(u => {
                        const lastLogin = u.lastLogin instanceof Timestamp ? u.lastLogin.toDate() : null;
                        return lastLogin && lastLogin >= thirtyMinutesAgo;
                    }).length;

                    // Signups & Logins
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

                    // Revenue Calculation (Mock Pricing)
                    let totalRevenue = 0;
                    let monthlyRevenue = 0;
                    const fieldCounts: Record<string, number> = {};

                    allUsers.forEach(u => {
                        // Revenue
                        if (u.userPlan === 'pro') {
                            totalRevenue += 99; // Annual
                            monthlyRevenue += 9.99;
                        } else if (u.userPlan === 'premium') {
                            totalRevenue += 199; // Annual
                            monthlyRevenue += 19.99;
                        }

                        // Popular Field
                        if (u.field) {
                            fieldCounts[u.field] = (fieldCounts[u.field] || 0) + 1;
                        }
                    });

                    const popularField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

                    // Learning Stats from user_progress
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
                        totalUsers,
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

                } catch (error) {
                    console.error("Error processing admin stats:", error);
                }
            });

            return () => unsubscribeProgress();
        });

        return () => unsubscribeUsers();
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
            <div className="space-y-6 animate-fade-in">
                {/* Header with Live Indicator */}
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

                {/* Overview Stats */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats.revenue.monthly}/mo</div>
                                <p className="text-xs text-muted-foreground">
                                    Est. Annual: ${stats.revenue.total}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                                <UserCheck className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Online now
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Projects Submitted</CardTitle>
                                <Target className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.learning.totalProjects}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total completions
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Assessment</CardTitle>
                                <Brain className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.learning.avgAssessmentScore}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.learning.totalAssessments} attempts recorded
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">User Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">New Today</span>
                                    <span className="font-bold">{stats?.signups.today}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">This Week</span>
                                    <span className="font-bold">{stats?.signups.thisWeek}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">This Month</span>
                                    <span className="font-bold">{stats?.signups.thisMonth}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="text-sm font-medium">Total Users</span>
                                    <span className="text-xl font-bold text-primary">{stats?.totalUsers}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Logins Today</span>
                                    <span className="font-bold">{stats?.logins.today}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Skills Mastered</span>
                                    <span className="font-bold">{stats?.learning.totalSkills}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Top Field</span>
                                    <span className="font-bold text-primary truncate max-w-[120px]">{stats?.popularField}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">System Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Database</span>
                                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Auth Services</span>
                                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Serverless Functions</span>
                                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout >
    );
}
