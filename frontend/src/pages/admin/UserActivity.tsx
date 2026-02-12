import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function UserActivity() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            try {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

                const allDocs = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const lastLogin = data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : null;
                    const isOnline = lastLogin && lastLogin >= thirtyMinutesAgo;
                    const signupDate = data.created_at || null;

                    return {
                        id: doc.id,
                        name: data.full_name || 'N/A',
                        email: data.email || 'N/A',
                        signupDate: signupDate || 'N/A',
                        lastLoginTime: lastLogin ? lastLogin.toISOString() : 'Never',
                        loginStatus: isOnline ? 'online' : 'offline',
                        rawSignup: signupDate ? new Date(signupDate) : new Date(0), // for sorting
                        rawLogin: lastLogin || new Date(0) // for calculating stats
                    };
                }) as (User & { rawSignup: Date, rawLogin: Date })[];

                // Sort by signup date desc
                allDocs.sort((a, b) => b.rawSignup.getTime() - a.rawSignup.getTime());

                // Calculate Stats
                const newStats = {
                    logins: {
                        today: allDocs.filter(u => u.rawLogin >= today).length,
                        thisWeek: allDocs.filter(u => u.rawLogin >= weekAgo).length,
                        thisMonth: allDocs.filter(u => u.rawLogin >= monthAgo).length,
                    },
                    signups: {
                        today: allDocs.filter(u => u.rawSignup >= today).length,
                        thisWeek: allDocs.filter(u => u.rawSignup >= weekAgo).length,
                        thisMonth: allDocs.filter(u => u.rawSignup >= monthAgo).length,
                    }
                };

                setUsers(allDocs);
                setStats(newStats);
                setLoading(false);

            } catch (error) {
                console.error("Error processing user activity:", error);
                toast.error("Error processing real-time data");
            }
        }, (error) => {
            console.error("Error listening to users:", error);
            if (error.code !== 'permission-denied') {
                toast.error("Failed to sync user data");
            }
            setLoading(false);
        });

        // Check admin permission is handled by AdminGuard in layout, but double check handled by security rules usually

        return () => unsubscribe();
    }, [user, navigate]);

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
                {/* Header with Live Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">User Activity</h2>
                        <p className="text-sm text-muted-foreground">Real-time user monitoring</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium animate-pulse">
                        <Wifi className="h-3 w-3" />
                        Live Updates Active
                    </div>
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
                        <div className="rounded-md border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Name</TableHead>
                                            <TableHead className="whitespace-nowrap">Email</TableHead>
                                            <TableHead className="whitespace-nowrap">Signup Date</TableHead>
                                            <TableHead className="whitespace-nowrap">Last Login</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {user.signupDate !== 'N/A'
                                                            ? new Date(user.signupDate).toLocaleDateString()
                                                            : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {user.lastLoginTime === 'Never'
                                                            ? 'Never'
                                                            : new Date(user.lastLoginTime).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <Badge variant={user.loginStatus === 'online' ? 'default' : 'secondary'}>
                                                            {user.loginStatus}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
