import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function SecurityAccess() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security & Access
                        </CardTitle>
                        <CardDescription>
                            Monitor login activity and access logs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This section will show recent login activity, failed login attempts,
                            and basic access logs for security monitoring.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
