import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

export default function RoadmapManager() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Map className="h-5 w-5" />
                            Roadmap Manager
                        </CardTitle>
                        <CardDescription>
                            View, regenerate, and verify career roadmaps
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This section will allow you to view existing roadmaps, manually trigger AI regeneration,
                            and mark roadmaps as verified or updated.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
