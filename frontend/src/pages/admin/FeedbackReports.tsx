import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function FeedbackReports() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Feedback & Reports
                        </CardTitle>
                        <CardDescription>
                            View user feedback and reported issues
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This section will display user feedback, reported issues, and common suggestions
                            to help improve the platform.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
