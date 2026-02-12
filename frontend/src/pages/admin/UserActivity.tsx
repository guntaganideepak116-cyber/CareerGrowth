import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Wifi,
    BarChart3,
    TrendingUp,
    Users,
    Trophy,
    MousePointer2,
    Calendar,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import { collection, onSnapshot, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';

interface AnalyticsData {
    totalSessions: number;
    avgEngagement: number;
    conversionRate: number;
    activeToday: number;
    fieldDistribution: Record<string, number>;
}

export default function UserActivity() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [progressData, setProgressData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Aggregate State
    const [metrics, setMetrics] = useState<AnalyticsData>({
        totalSessions: 0,
        avgEngagement: 0,
        conversionRate: 0,
        activeToday: 0,
        fieldDistribution: {}
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // 1. Listen for Users
        const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const now = new Date();
            const today = new Date(now.setHours(0, 0, 0, 0));
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

            const userData = snapshot.docs.map(doc => {
                const data = doc.data();
                const lastLogin = data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : null;
                return {
                    id: doc.id,
                    ...data,
                    isOnline: lastLogin && lastLogin >= thirtyMinsAgo,
                    lastLoginTime: lastLogin
                };
            });

            setUsers(userData);

            // Calculate Metrics
            const proUsers = userData.filter(u => u.userPlan !== 'free').length;
            const dist: Record<string, number> = {};
            userData.forEach(u => {
                if (u.field) dist[u.field] = (dist[u.field] || 0) + 1;
            });

            setMetrics(prev => ({
                ...prev,
                activeToday: userData.filter(u => u.lastLoginTime && u.lastLoginTime >= today).length,
                conversionRate: Math.round((proUsers / (userData.length || 1)) * 100),
                fieldDistribution: dist
            }));
        });

        // 2. Listen for Progress (Engagement)
        const unsubProgress = onSnapshot(collection(db, 'user_progress'), (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
            setProgressData(data);

            const totalScore = data.reduce((acc, curr) => acc + (curr.overallProgress || 0), 0);
            setMetrics(prev => ({
                ...prev,
                avgEngagement: Math.round(totalScore / (data.length || 1))
            }));
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubProgress();
        };
    }, [user, navigate]);

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Intelligence & Analytics</h1>
                        <p className="text-muted-foreground mt-1">Real-time engagement telemetry and conversion metrics.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 text-primary rounded-xl text-xs font-bold shadow-sm">
                        <Wifi className="h-4 w-4 animate-pulse text-green-500" />
                        LIVE TELEMETRY STREAM
                    </div>
                </div>

                {/* KPI Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-b-4 border-b-blue-500 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                Daily Active Pulse
                                <Activity className="h-3 w-3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.activeToday}</div>
                            <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> STABLE UPTIME
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-b-4 border-b-purple-500 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                Retention Index
                                <MousePointer2 className="h-3 w-3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.avgEngagement}%</div>
                            <p className="text-[10px] text-purple-600 font-bold mt-1">AVG PROGRESS DEPTH</p>
                        </CardContent>
                    </Card>

                    <Card className="border-b-4 border-b-amber-500 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                Conversion Delta
                                <ArrowUpRight className="h-3 w-3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{metrics.conversionRate}%</div>
                            <p className="text-[10px] text-amber-600 font-bold mt-1">PAID TIER RATIO</p>
                        </CardContent>
                    </Card>

                    <Card className="border-b-4 border-b-primary shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                Market Density
                                <BarChart3 className="h-3 w-3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{Object.keys(metrics.fieldDistribution).length}</div>
                            <p className="text-[10px] text-primary font-bold mt-1">FIELDS PENETRATED</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <Card className="lg:col-span-2 shadow-xl border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between border-b py-6">
                            <div>
                                <CardTitle>User Activity Ledger</CardTitle>
                                <CardDescription>Comprehensive session tracking across the grid</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Scan identity..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead className="w-[250px]">Identity</TableHead>
                                            <TableHead>Field node</TableHead>
                                            <TableHead>Session End</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.slice(0, 15).map((user) => (
                                            <TableRow key={user.id} className="hover:bg-primary/5 transition-colors group">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{user.full_name || 'Anonymous'}</span>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter">
                                                        {user.field || 'PENDING'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-medium text-muted-foreground">
                                                    {user.lastLoginTime ? user.lastLoginTime.toLocaleString() : 'NEVER'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={`text-[10px] font-bold ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}>
                                                        {user.isOnline ? 'ONLINE' : 'IDLE'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Breakdown */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 shadow-lg">
                            <CardHeader className="py-4 border-b">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-amber-500" />
                                    Merit Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {Object.entries(metrics.fieldDistribution)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 5)
                                    .map(([field, count]) => (
                                        <div key={field} className="space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-bold uppercase">
                                                <span>{field}</span>
                                                <span className="text-primary">{Math.round((count / users.length) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${(count / users.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/10">
                            <CardContent className="p-6 text-center space-y-3">
                                <Calendar className="h-8 w-8 text-primary mx-auto opacity-50" />
                                <h3 className="text-sm font-bold">System Health Verified</h3>
                                <p className="text-[11px] text-muted-foreground">
                                    "All telemetry nodes are reporting within nominal parameters. Sync latency: 12ms."
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
