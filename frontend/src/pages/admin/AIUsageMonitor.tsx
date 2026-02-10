import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

export default function AIUsageMonitor() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cpu className="h-5 w-5" />
                            AI Usage Monitor
                        </CardTitle>
                        <CardDescription>
                            Track OpenAI and Gemini API usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This section will display AI API usage counts, last generation timestamps,
                            and usage analytics (without exposing API keys).
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
