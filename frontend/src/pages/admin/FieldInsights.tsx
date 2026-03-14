import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

export default function FieldInsights() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="h-5 w-5" />
                            Field Insights
                        </CardTitle>
                        <CardDescription>
                            Most selected fields, popular specializations, and trending career paths
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This section will display field selection analytics, specialization trends,
                            and popular career paths chosen by users.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
