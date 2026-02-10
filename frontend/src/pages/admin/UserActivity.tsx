import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    signupDate: string;
    lastLoginTime: string;
    loginStatus: 'online' | 'offline';
}

interface Stats {
    logins: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    signups: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

export default function UserActivity() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        checkAdminAndLoad();
    }, []);

    const checkAdminAndLoad = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = await user.getIdToken();

            // Check admin
            const checkRes = await fetch(`${API_URL}/check`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!checkRes.ok) {
                navigate('/dashboard');
                return;
            }

            await loadData(token);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadData = async (token: string) => {
        try {
            // Load stats
            const statsRes = await fetch(`${API_URL}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

            // Load users
            const usersRes = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users);
            }
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleRefresh = async () => {
        if (!user) return;
        setRefreshing(true);
        try {
            const token = await user.getIdToken();
            await loadData(token);
            toast.success('Data refreshed');
        } catch (error) {
            toast.error('Failed to refresh');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-end">
                    <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Activity Stats */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Activity</CardTitle>
                                <CardDescription>Last 24 hours</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Logins:</span>
                                        <span className="font-medium">{stats.logins.today}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">New Users:</span>
                                        <span className="font-medium">{stats.signups.today}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Activity</CardTitle>
                                <CardDescription>Last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Logins:</span>
                                        <span className="font-medium">{stats.logins.thisWeek}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">New Users:</span>
                                        <span className="font-medium">{stats.signups.thisWeek}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Activity</CardTitle>
                                <CardDescription>Last 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Logins:</span>
                                        <span className="font-medium">{stats.logins.thisMonth}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">New Users:</span>
                                        <span className="font-medium">{stats.signups.thisMonth}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* User List */}
                <Card>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>All registered users with activity status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Signup Date</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.signupDate !== 'N/A'
                                                    ? new Date(user.signupDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {user.lastLoginTime === 'Never'
                                                    ? 'Never'
                                                    : new Date(user.lastLoginTime).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.loginStatus === 'online' ? 'default' : 'secondary'}>
                                                    {user.loginStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
