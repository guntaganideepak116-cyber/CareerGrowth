import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Server,
    Code,
    Database,
    Lock,
    Unlock,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Save,
    Cpu,
    Cloud,
    Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SystemConfig {
    maintenanceMode: boolean;
    aiMentorEnabled: boolean;
    careerPathsEnabled: boolean;
    notificationsEnabled: boolean;
    registrationEnabled: boolean;
    maxUsersLimit: number;
    systemMessage: string;
    apiRateLimit: number;
}

import { useQuery } from '@tanstack/react-query';

export default function SystemSettings() {
    const [config, setConfig] = useState<SystemConfig>({
        maintenanceMode: false,
        aiMentorEnabled: true,
        careerPathsEnabled: true,
        notificationsEnabled: true,
        registrationEnabled: true,
        maxUsersLimit: 10000,
        systemMessage: '',
        apiRateLimit: 100
    });
    const [saving, setSaving] = useState(false);

    // Load settings from Firestore using React Query
    const { data: configData, isLoading: loading, refetch } = useQuery({
        queryKey: ['system_settings'],
        queryFn: async () => {
            const settingsRef = doc(db, 'system_settings', 'config');
            const snapshot = await getDoc(settingsRef);
            return snapshot.exists() ? (snapshot.data() as SystemConfig) : null;
        },
        staleTime: Infinity, // Settings change rarely
    });

    useEffect(() => {
        if (configData) {
            setConfig(prev => ({ ...prev, ...configData }));
        }
    }, [configData]);

    // Save settings to Firestore
    const saveSettings = async () => {
        setSaving(true);
        try {
            const settingsRef = doc(db, 'system_settings', 'config');
            await setDoc(settingsRef, {
                ...config,
                updatedAt: new Date().toISOString()
            });

            toast.success('✅ Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const toggleSetting = (key: keyof SystemConfig) => {
        setConfig({ ...config, [key]: !config[key] });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Configure platform features, maintenance, and system behavior
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => refetch()} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button onClick={saveSettings} disabled={saving}>
                            {saving ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-green-500" />
                            System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">Frontend</span>
                                </div>
                                <Badge variant="default" className="bg-green-500">Online</Badge>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">Backend</span>
                                </div>
                                <Badge variant="default" className="bg-green-500">Online</Badge>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">Database</span>
                                </div>
                                <Badge variant="default" className="bg-green-500">Connected</Badge>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <Cpu className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">AI Services</span>
                                </div>
                                <Badge variant="default" className="bg-green-500">Active</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Mode */}
                <Card className={config.maintenanceMode ? 'border-2 border-amber-500' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {config.maintenanceMode ? (
                                <Lock className="h-5 w-5 text-amber-500" />
                            ) : (
                                <Unlock className="h-5 w-5 text-green-500" />
                            )}
                            Maintenance Mode
                        </CardTitle>
                        <CardDescription>
                            Enable to prevent user access during system updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                {config.maintenanceMode ? (
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {config.maintenanceMode ? 'Platform Locked' : 'Platform Accessible'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {config.maintenanceMode
                                            ? 'Users cannot access the dashboard'
                                            : 'All users can access the platform normally'
                                        }
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={config.maintenanceMode}
                                onCheckedChange={() => toggleSetting('maintenanceMode')}
                            />
                        </div>

                        {config.maintenanceMode && (
                            <div className="space-y-2">
                                <Label>Maintenance Message</Label>
                                <Textarea
                                    placeholder="Enter message to display to users..."
                                    value={config.systemMessage}
                                    onChange={(e) => setConfig({ ...config, systemMessage: e.target.value })}
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    This message will be shown to users attempting to access the platform
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Feature Toggles
                        </CardTitle>
                        <CardDescription>
                            Enable or disable platform features in real-time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* AI Mentor */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Cpu className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">AI Mentor</p>
                                    <p className="text-sm text-muted-foreground">
                                        AI-powered career guidance and interview prep
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={config.aiMentorEnabled}
                                onCheckedChange={() => toggleSetting('aiMentorEnabled')}
                            />
                        </div>

                        {/* Career Paths */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Code className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium">Career Paths</p>
                                    <p className="text-sm text-muted-foreground">
                                        AI-generated career paths for all fields
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={config.careerPathsEnabled}
                                onCheckedChange={() => toggleSetting('careerPathsEnabled')}
                            />
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Cloud className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="font-medium">Notifications</p>
                                    <p className="text-sm text-muted-foreground">
                                        Real-time user notifications
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={config.notificationsEnabled}
                                onCheckedChange={() => toggleSetting('notificationsEnabled')}
                            />
                        </div>

                        {/* User Registration */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="font-medium">User Registration</p>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to sign up
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={config.registrationEnabled}
                                onCheckedChange={() => toggleSetting('registrationEnabled')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            System Limits
                        </CardTitle>
                        <CardDescription>
                            Configure system constraints and rate limits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxUsers">Maximum Users</Label>
                                <Input
                                    id="maxUsers"
                                    type="number"
                                    value={config.maxUsersLimit}
                                    onChange={(e) => setConfig({ ...config, maxUsersLimit: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maximum number of registered users allowed
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rateLimit">API Rate Limit (per minute)</Label>
                                <Input
                                    id="rateLimit"
                                    type="number"
                                    value={config.apiRateLimit}
                                    onChange={(e) => setConfig({ ...config, apiRateLimit: parseInt(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maximum API requests per user per minute
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Environment Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Environment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Environment</p>
                                <Badge variant="default">Production</Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Version</p>
                                <Badge variant="secondary">v2.1.0</Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Build</p>
                                <Badge variant="outline">2026-02-06</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
