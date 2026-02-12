import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Server,
    Shield,
    Database,
    Lock,
    Unlock,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Save,
    Cpu,
    Zap,
    Activity,
    Clock,
    Flame
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, limit, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';

interface SystemConfig {
    maintenanceMode: boolean;
    aiMentorEnabled: boolean;
    careerPathsEnabled: boolean;
    registrationEnabled: boolean;
    systemMessage: string;
}

interface HealthStatus {
    firestore: 'online' | 'offline';
    auth: 'active' | 'inactive';
    api: 'operational' | 'degraded' | 'offline';
    responseTime: number;
    lastError: string;
}

export default function SecurityAccess() {
    const [config, setConfig] = useState<SystemConfig>({
        maintenanceMode: false,
        aiMentorEnabled: true,
        careerPathsEnabled: true,
        registrationEnabled: true,
        systemMessage: 'System is currently undergoing maintenance. Please check back later.'
    });
    const [health, setHealth] = useState<HealthStatus>({
        firestore: 'online',
        auth: 'active',
        api: 'operational',
        responseTime: 12,
        lastError: 'None'
    });
    const [saving, setSaving] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // 1. Load Config (One-time or could be real-time if needed)
        const loadConfig = async () => {
            const docRef = doc(db, 'system_settings', 'config');
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setConfig(prev => ({ ...prev, ...snap.data() }));
            }
        };
        loadConfig();

        // 2. Real-time Security Logs
        const q = query(collection(db, 'admin_activity_logs'), orderBy('timestamp', 'desc'), limit(15));
        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Health Pulse (Simulated for status, real for time)
        const healthInterval = setInterval(checkPlatformHealth, 15000);
        checkPlatformHealth();

        return () => {
            unsubscribeLogs();
            clearInterval(healthInterval);
        };
    }, []);

    const checkPlatformHealth = async () => {
        setIsRefreshing(true);
        const start = Date.now();
        try {
            // Check Firestore by attempting a small read
            await getDoc(doc(db, 'system_settings', 'config'));
            const responseTime = Date.now() - start;

            // Check Internal API if exists (simulated since we don't know the exact endpoint status)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            let apiStatus: 'operational' | 'degraded' | 'offline' = 'offline';
            let apiError = 'API Node Unreachable';

            try {
                // Use a short timeout to prevent hanging
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 3000);

                const apiRes = await fetch(`${apiUrl}/api/system/health`, { signal: controller.signal }).catch(() => null);
                clearTimeout(id);

                if (apiRes?.ok) {
                    apiStatus = 'operational';
                    apiError = 'None';
                } else if (apiRes?.status === 404) {
                    apiStatus = 'degraded';
                    apiError = 'Health Endpoint 404';
                }
            } catch (err) {
                // Keep default offline/unreachable
            }

            setHealth({
                firestore: 'online',
                auth: 'active',
                api: apiStatus,
                responseTime,
                lastError: apiError
            });
        } catch (e: any) {
            setHealth(prev => ({ ...prev, firestore: 'offline', lastError: e.message }));
        } finally {
            setIsRefreshing(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'system_settings', 'config'), {
                ...config,
                updatedAt: new Date().toISOString()
            });
            toast.success('Platform protocols updated successfully');
        } catch (error) {
            toast.error('Failed to commit system changes');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Control & Security</h1>
                        <p className="text-muted-foreground mt-1">Configure global platform state and monitor infrastructure health.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={checkPlatformHealth} disabled={isRefreshing}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Diagnostic Run
                        </Button>
                        <Button onClick={saveSettings} disabled={saving} className="bg-primary hover:bg-primary/90">
                            {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Apply Configuration
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Live Health Matrix */}
                    <Card className="md:col-span-1 border-primary/20 shadow-lg">
                        <CardHeader className="bg-primary/5 border-b py-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Server className="h-4 w-4 text-primary" />
                                Infrastructure Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-3">
                                    <Database className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">Firestore</span>
                                </div>
                                <Badge className={health.firestore === 'online' ? 'bg-green-500' : 'bg-red-500'}>
                                    {health.firestore.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium">Auth Service</span>
                                </div>
                                <Badge className="bg-green-500">ACTIVE</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium">Core API</span>
                                </div>
                                <Badge className={health.api === 'operational' ? 'bg-green-500' : 'bg-amber-500'}>
                                    {health.api.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Latency</p>
                                    <p className="text-xl font-bold text-primary">{health.responseTime}ms</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Error State</p>
                                    <p className={`text-[11px] font-bold truncate ${health.lastError === 'None' ? 'text-green-600' : 'text-red-500'}`}>
                                        {health.lastError}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature & Security Switches */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-500" />
                                        Platform Feature Gateways
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="reg" className="text-xs cursor-pointer">User Onboarding</Label>
                                        <Switch id="reg" checked={config.registrationEnabled} onCheckedChange={(v) => setConfig({ ...config, registrationEnabled: v })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="ai" className="text-xs cursor-pointer">AI Mentor Runtime</Label>
                                        <Switch id="ai" checked={config.aiMentorEnabled} onCheckedChange={(v) => setConfig({ ...config, aiMentorEnabled: v })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="career" className="text-xs cursor-pointer">Roadmap Engine</Label>
                                        <Switch id="career" checked={config.careerPathsEnabled} onCheckedChange={(v) => setConfig({ ...config, careerPathsEnabled: v })} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`transition-all ${config.maintenanceMode ? 'border-amber-500 bg-amber-50/20' : ''}`}>
                                <CardHeader className="py-4">
                                    <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                                        <Flame className="h-4 w-4" />
                                        Emergency Maintenance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold">Lock Platform</p>
                                            <p className="text-[10px] text-muted-foreground leading-none">Restricts all non-admin access</p>
                                        </div>
                                        <Switch checked={config.maintenanceMode} onCheckedChange={(v) => setConfig({ ...config, maintenanceMode: v })} />
                                    </div>
                                    {config.maintenanceMode && (
                                        <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                                            <Label className="text-[10px] uppercase font-bold mb-1 block">Public Message</Label>
                                            <Input
                                                value={config.systemMessage}
                                                onChange={(e) => setConfig({ ...config, systemMessage: e.target.value })}
                                                className="text-xs h-8 bg-white"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Security Feed */}
                        <Card className="shadow-lg border-primary/10">
                            <CardHeader className="py-4 border-b flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-red-500" />
                                    Real-time Audit Ledger
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] scale-90">LIVE FEED</Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[250px] overflow-y-auto divide-y divide-border/50">
                                    {logs.length > 0 ? logs.map(log => (
                                        <div key={log.id} className="p-3 text-[11px] flex justify-between items-center group hover:bg-muted/30 transition-colors">
                                            <div className="flex gap-3 items-center">
                                                <Badge variant="secondary" className="scale-90 font-mono font-bold whitespace-nowrap">{log.action || 'AUTH'}</Badge>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">{log.adminEmail}</span>
                                                    <span className="text-muted-foreground leading-tight">{log.details}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap ml-4">
                                                <Clock className="h-3 w-3" />
                                                {log.timestamp instanceof Timestamp ? log.timestamp.toDate().toLocaleTimeString() : 'Recent'}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                                            <Shield className="h-8 w-8 text-muted-foreground/20" />
                                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/40">Clean Slate</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
