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
    Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';

interface SystemConfig {
    maintenanceMode: boolean;
    aiMentorEnabled: boolean;
    careerPathsEnabled: boolean;
    registrationEnabled: boolean;
    systemMessage: string;
}

export default function SecurityAccess() {
    const [config, setConfig] = useState<SystemConfig>({
        maintenanceMode: false,
        aiMentorEnabled: true,
        careerPathsEnabled: true,
        registrationEnabled: true,
        systemMessage: 'System is currently undergoing maintenance. Please check back later.'
    });
    const [saving, setSaving] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        // Load Config
        const loadConfig = async () => {
            const docRef = doc(db, 'system_settings', 'config');
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setConfig(prev => ({ ...prev, ...snap.data() }));
            }
        };
        loadConfig();

        // Load Security Logs (Real-time, limit 10)
        const q = query(collection(db, 'admin_activity_logs'), orderBy('timestamp', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const saveSettings = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'system_settings', 'config'), {
                ...config,
                updatedAt: new Date().toISOString()
            });
            toast.success('System settings updated');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Settings & Security</h1>
                        <p className="text-muted-foreground">Manage core platform behavior and monitor security events.</p>
                    </div>
                    <Button onClick={saveSettings} disabled={saving}>
                        {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save System Configuration
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Feature Toggles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Platform Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="reg">User Registration</Label>
                                <Switch id="reg" checked={config.registrationEnabled} onCheckedChange={(v) => setConfig({ ...config, registrationEnabled: v })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ai">AI Mentor Service</Label>
                                <Switch id="ai" checked={config.aiMentorEnabled} onCheckedChange={(v) => setConfig({ ...config, aiMentorEnabled: v })} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="career">Career Path Generation</Label>
                                <Switch id="career" checked={config.careerPathsEnabled} onCheckedChange={(v) => setConfig({ ...config, careerPathsEnabled: v })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Maintenance Mode */}
                    <Card className={config.maintenanceMode ? 'border-amber-500 bg-amber-50/50' : ''}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-600">
                                <Shield className="h-5 w-5" />
                                Maintenance Mode
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Under Maintenance</p>
                                    <p className="text-xs text-muted-foreground">Blocks all non-admin user access</p>
                                </div>
                                <Switch checked={config.maintenanceMode} onCheckedChange={(v) => setConfig({ ...config, maintenanceMode: v })} />
                            </div>
                            {config.maintenanceMode && (
                                <Input
                                    value={config.systemMessage}
                                    onChange={(e) => setConfig({ ...config, systemMessage: e.target.value })}
                                    placeholder="Maintenance message..."
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* System Status */}
                    <Card className="md:col-span-1">
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4" /> Service Health</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span>Firestore Database</span>
                                <Badge className="bg-green-500">Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Auth Service</span>
                                <Badge className="bg-green-500">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>AI API Gateway</span>
                                <Badge className="bg-green-500">Operational</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Logs */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Security & Audit Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {logs.length > 0 ? logs.map(log => (
                                    <div key={log.id} className="text-xs flex justify-between items-center p-2 rounded bg-muted/50 border">
                                        <div className="flex gap-2 items-center">
                                            <Badge variant="outline" className="scale-75 origin-left">{log.action || 'ACCESS'}</Badge>
                                            <span className="font-medium">{log.adminEmail}</span>
                                            <span className="text-muted-foreground">{log.details}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{new Date(log.timestamp?.toDate()).toLocaleString()}</span>
                                    </div>
                                )) : (
                                    <p className="text-xs text-center text-muted-foreground py-4">No recent security events found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
