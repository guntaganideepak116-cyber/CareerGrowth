import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Sparkles, Calendar, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Notification {
    id: string;
    field_id: string;
    field_name: string;
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    date: string;
    timestamp: number;
    actionText?: string;
    actionUrl?: string;
}

interface GenerationStats {
    success: boolean;
    message: string;
    count: number;
    fields: number;
    timestamp: string;
}

export default function NotificationsControl() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [generationResult, setGenerationResult] = useState<GenerationStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadRecentNotifications = async () => {
        setIsLoadingNotifications(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/notifications/all?limit=30`);
            setNotifications(response.data.notifications);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load notifications');
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    const generateNotifications = async () => {
        setIsGenerating(true);
        setError(null);
        setGenerationResult(null);
        try {
            const response = await axios.post(`${API_URL}/api/notifications/generate-daily`);
            setGenerationResult(response.data);
            // Reload notifications after generation
            await loadRecentNotifications();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to generate notifications');
        } finally {
            setIsGenerating(false);
        }
    };

    const cleanupOldNotifications = async () => {
        if (!confirm('This will delete all notifications older than 30 days. Continue?')) return;

        setError(null);
        try {
            const response = await axios.delete(`${API_URL}/api/notifications/old`);
            alert(response.data.message);
            await loadRecentNotifications();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to cleanup notifications');
        }
    };

    useEffect(() => {
        loadRecentNotifications();
    }, []);

    const groupedNotifications = notifications.reduce((acc, notif) => {
        const field = notif.field_name;
        if (!acc[field]) acc[field] = [];
        acc[field].push(notif);
        return acc;
    }, {} as Record<string, Notification[]>);

    const priorityColors = {
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications Control
                        </CardTitle>
                        <CardDescription>
                            Generate AI-powered notifications for all career fields
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <Button
                                onClick={generateNotifications}
                                disabled={isGenerating}
                                className="flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                {isGenerating ? 'Generating...' : 'Generate Daily Notifications'}
                            </Button>

                            <Button
                                onClick={loadRecentNotifications}
                                disabled={isLoadingNotifications}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoadingNotifications ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <Button
                                onClick={cleanupOldNotifications}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Cleanup Old
                            </Button>
                        </div>

                        {/* Info Alert */}
                        <Alert>
                            <Calendar className="h-4 w-4" />
                            <AlertDescription>
                                Notifications are automatically generated daily at 6:00 AM. Use the button above to generate them manually.
                            </AlertDescription>
                        </Alert>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success Result */}
                        {generationResult && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    ✅ {generationResult.message} for {generationResult.fields} fields
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{notifications.length}</div>
                            <p className="text-xs text-muted-foreground">Showing last 30</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Fields Covered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(groupedNotifications).length}</div>
                            <p className="text-xs text-muted-foreground">Different career fields</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Latest Generation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {notifications[0] ? new Date(notifications[0].date).toLocaleDateString() : 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground">Most recent batch</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Notifications by Field */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Notifications by Field</CardTitle>
                        <CardDescription>Preview of generated notifications across all fields</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingNotifications ? (
                            <p className="text-center text-muted-foreground py-8">Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-4">No notifications generated yet</p>
                                <Button onClick={generateNotifications} disabled={isGenerating}>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate First Batch
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedNotifications).slice(0, 5).map(([fieldName, notifs]) => (
                                    <div key={fieldName} className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            {fieldName}
                                            <span className="text-xs bg-secondary px-2 py-1 rounded">
                                                {notifs.length} notifications
                                            </span>
                                        </h3>
                                        <div className="space-y-2">
                                            {notifs.slice(0, 3).map((notif) => (
                                                <div key={notif.id} className="border-l-4 border-primary pl-3 py-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{notif.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                                                            <div className="flex gap-2 mt-2">
                                                                <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[notif.priority]}`}>
                                                                    {notif.priority}
                                                                </span>
                                                                <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                                                    {notif.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
