import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Cpu,
    Database,
    FileText,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Clock,
    RefreshCw,
    BarChart3
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { getQuotaStats } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuotaStats {
    stats: {
        firestore_reads: number;
        firestore_writes: number;
        gemini_requests: number;
    };
    limits: {
        firestore_reads: number;
        firestore_writes: number;
        gemini_requests: number;
    };
    history: Array<{
        date: string;
        firestore_reads: number;
        firestore_writes: number;
        gemini_requests: number;
    }>;
}

export default function AIUsageMonitor() {
    const [data, setData] = useState<QuotaStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const result = await getQuotaStats();
            if (result.success) {
                setData(result);
            }
        } catch (error) {
            console.error('Failed to fetch usage analytics:', error);
            toast.error('Failed to fetch real-time usage data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Synchronizing with Cloud Metrics...</p>
                </div>
            </AdminLayout>
        );
    }

    const { stats, limits, history = [] } = data || {};

    const firestoreReadPct = Math.min(100, ((stats?.firestore_reads || 0) / (limits?.firestore_reads || 50000)) * 100);
    const firestoreWritePct = Math.min(100, ((stats?.firestore_writes || 0) / (limits?.firestore_writes || 20000)) * 100);
    const geminiPct = Math.min(100, ((stats?.gemini_requests || 0) / (limits?.gemini_requests || 1500)) * 100);

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quota & System Usage</h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            Real-time monitoring of Firestore database and Google Gemini AI consumption.
                        </p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Metrics
                    </Button>
                </div>

                {/* Primary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Firestore Reads */}
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                <span>Firestore Reads</span>
                                <Database className="h-4 w-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.firestore_reads?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground mb-4">Daily Free Limit: {limits?.firestore_reads?.toLocaleString()}</p>
                            <div className="space-y-1">
                                <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${firestoreReadPct}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-medium text-blue-600">
                                    <span>Usage Intensity</span>
                                    <span>{firestoreReadPct.toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Firestore Writes */}
                    <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                <span>Firestore Writes</span>
                                <TrendingUp className="h-4 w-4 text-amber-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.firestore_writes?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground mb-4">Daily Free Limit: {limits?.firestore_writes?.toLocaleString()}</p>
                            <div className="space-y-1">
                                <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-1000"
                                        style={{ width: `${firestoreWritePct}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-medium text-amber-600">
                                    <span>Usage Intensity</span>
                                    <span>{firestoreWritePct.toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gemini AI Requests */}
                    <Card className="border-l-4 border-l-cyan-500 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                <span>Gemini AI Requests</span>
                                <Cpu className="h-4 w-4 text-cyan-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.gemini_requests?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground mb-4">Daily Suggested Limit: {limits?.gemini_requests?.toLocaleString()}</p>
                            <div className="space-y-1">
                                <div className="h-2 w-full rounded-full bg-cyan-100 overflow-hidden">
                                    <div
                                        className="h-full bg-cyan-500 transition-all duration-1000"
                                        style={{ width: `${geminiPct}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-medium text-cyan-600">
                                    <span>Usage Intensity</span>
                                    <span>{geminiPct.toFixed(1)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Multi-Day Usage History */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        7-Day Usage History
                                    </CardTitle>
                                    <CardDescription>
                                        Analyzing consumption patterns across the active tracking period
                                    </CardDescription>
                                </div>
                                <div className="hidden md:flex gap-4 text-xs">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm" /> Reads</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500 rounded-sm" /> Writes</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-cyan-500 rounded-sm" /> AI Requests</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorReads" x1="0" y1="0" x2="0" y1="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#888' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#888' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#e2e8f0' }}
                                        />
                                        <Area type="monotone" dataKey="firestore_reads" name="Reads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReads)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="firestore_writes" name="Writes" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                                        <Area type="monotone" dataKey="gemini_requests" name="AI Requests" stroke="#06b6d4" fillOpacity={0} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Health & Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                System Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Daily Reset Timeline</span>
                                </div>
                                <span className="text-xs text-primary font-bold">12:00 AM IST</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium">Quota Hard Limit</span>
                                </div>
                                <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded">50,000 Reads</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-green-600">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="text-sm font-medium">Tracking Status</span>
                                </div>
                                <span className="text-xs font-bold font-mono">ACTIVE_SECURE</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proactive Optimization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <RefreshCw className="h-5 w-5 text-purple-500" />
                                Performance Guardrails
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Query Limiting active</p>
                                        <p className="text-[11px] text-muted-foreground">All backend requests are now restricted to top 50 matches to preserve quota.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Cpu className="w-4 h-4 text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">AI Response Caching</p>
                                        <p className="text-[11px] text-muted-foreground">Dynamic content is strictly cached in Firestore to prevent redundant Gemini API calls.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
