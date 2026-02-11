import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    Search,
    Filter,
    Download,
    Send,
    Bell,
    Lock,
    Unlock,
    Ban,
    UserCheck,
    Eye,
    BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, limit, addDoc } from 'firebase/firestore';

interface UserData {
    id: string;
    email: string;
    name?: string;
    field?: string;
    branch?: string;
    skills?: string[];
    isActive?: boolean;
    isBlocked?: boolean;
    lastActive?: any;
    createdAt?: any;
    roadmap_progress?: number;
}

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    newUsersToday: number;
}

export default function UserDashboardControl() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        newUsersToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userProfiles = collection(db, 'users');
            const snapshot = await getDocs(userProfiles);

            const userData: UserData[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as UserData));

            setUsers(userData);
            setFilteredUsers(userData);

            // Calculate stats
            const now = new Date();
            const todayStart = new Date(now.setHours(0, 0, 0, 0));

            const stats: DashboardStats = {
                totalUsers: userData.length,
                activeUsers: userData.filter(u => !u.isBlocked).length,
                blockedUsers: userData.filter(u => u.isBlocked).length,
                newUsersToday: userData.filter(u => {
                    const created = u.createdAt?.toDate?.() || new Date(0);
                    return created >= todayStart;
                }).length
            };

            setStats(stats);
            toast.success('User data refreshed');
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search/filter users
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredUsers(
                users.filter(user =>
                    user.email?.toLowerCase().includes(term) ||
                    user.name?.toLowerCase().includes(term) ||
                    user.field?.toLowerCase().includes(term) ||
                    user.branch?.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, users]);

    // Block/Unblock user
    const toggleUserBlock = async (userId: string, currentlyBlocked: boolean) => {
        setProcessingAction(userId);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isBlocked: !currentlyBlocked,
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setUsers(users.map(u =>
                u.id === userId ? { ...u, isBlocked: !currentlyBlocked } : u
            ));

            toast.success(
                !currentlyBlocked
                    ? '🚫 User blocked successfully'
                    : '✅ User unblocked successfully'
            );
        } catch (error) {
            console.error('Error toggling user block:', error);
            toast.error('Failed to update user status');
        } finally {
            setProcessingAction(null);
        }
    };

    // Send notification to user
    const sendNotificationToUser = async (userId: string, userEmail: string) => {
        setProcessingAction(userId);
        const title = 'Admin Message';
        const message = 'You have a new message from admin. Please check your dashboard.';

        try {
            // Create notification in Firestore
            const notifRef = collection(db, 'notifications');
            await addDoc(notifRef, {
                userId: userId,
                title,
                message,
                type: 'admin',
                read: false,
                createdAt: new Date().toISOString()
            });

            // Send Email via Vercel Function
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: userEmail,
                    title,
                    message
                })
            });

            toast.success(`Notification sent to ${userEmail}`);
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification');
        } finally {
            setProcessingAction(null);
        }
    };

    // Reset user progress
    const resetUserProgress = async (userId: string) => {
        if (!confirm('Are you sure? This will reset all progress for this user.')) {
            return;
        }

        setProcessingAction(userId);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                roadmap_progress: 0,
                completed_projects: [],
                skills: [],
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setUsers(users.map(u =>
                u.id === userId ? { ...u, roadmap_progress: 0, skills: [], completed_projects: [] } : u
            ));

            toast.success('User progress reset successfully');
        } catch (error) {
            console.error('Error resetting progress:', error);
            toast.error('Failed to reset user progress');
        } finally {
            setProcessingAction(null);
        }
    };

    // Export user data
    const exportUserData = () => {
        try {
            const csvContent = [
                ['Email', 'Name', 'Field', 'Branch', 'Skills Count', 'Progress', 'Status', 'Created At'].join(','),
                ...filteredUsers.map(u => [
                    u.email || '',
                    u.name || '',
                    u.field || '',
                    u.branch || '',
                    u.skills?.length || 0,
                    `${u.roadmap_progress || 0}%`,
                    u.isBlocked ? 'Blocked' : 'Active',
                    u.createdAt?.toDate?.()?.toLocaleDateString() || ''
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `user_data_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('User data exported successfully');
        } catch (error) {
            console.error('Error exporting data:', error);
            toast.error('Failed to export user data');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Dashboard Control</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage user accounts, monitor activity, and control dashboard access in real-time
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchUsers} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button onClick={exportUserData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registered accounts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Not blocked
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.blockedUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Access denied
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">New Today</CardTitle>
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.newUsersToday}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registrations today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by email, name, field, or branch..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                        <CardDescription>
                            Manage user accounts and monitor their dashboard activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div>
                                                    <p className="font-semibold">{user.email}</p>
                                                    {user.name && (
                                                        <p className="text-sm text-muted-foreground">{user.name}</p>
                                                    )}
                                                </div>
                                                {user.isBlocked && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        <Ban className="h-3 w-3 mr-1" />
                                                        Blocked
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                {user.field && (
                                                    <span>Field: <strong>{user.field}</strong></span>
                                                )}
                                                {user.branch && (
                                                    <span>Branch: <strong>{user.branch}</strong></span>
                                                )}
                                                <span>Skills: <strong>{user.skills?.length || 0}</strong></span>
                                                <span>Progress: <strong>{user.roadmap_progress || 0}%</strong></span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                {selectedUser?.id === user.id ? 'Hide' : 'View'}
                                            </Button>
                                            <Button
                                                variant={user.isBlocked ? "default" : "destructive"}
                                                size="sm"
                                                onClick={() => toggleUserBlock(user.id, user.isBlocked || false)}
                                                disabled={processingAction === user.id}
                                            >
                                                {processingAction === user.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : user.isBlocked ? (
                                                    <>
                                                        <Unlock className="h-4 w-4 mr-1" />
                                                        Unblock
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-4 w-4 mr-1" />
                                                        Block
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Selected User Details */}
                {selectedUser && (
                    <Card className="border-2 border-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                User Details: {selectedUser.email}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Name</Label>
                                    <p className="font-medium">{selectedUser.name || 'Not set'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Field</Label>
                                    <p className="font-medium">{selectedUser.field || 'Not selected'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Branch</Label>
                                    <p className="font-medium">{selectedUser.branch || 'Not selected'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Roadmap Progress</Label>
                                    <p className="font-medium">{selectedUser.roadmap_progress || 0}%</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground mb-2">Skills ({selectedUser.skills?.length || 0})</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.skills && selectedUser.skills.length > 0 ? (
                                        selectedUser.skills.map((skill, idx) => (
                                            <Badge key={idx} variant="secondary">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => sendNotificationToUser(selectedUser.id, selectedUser.email)}
                                    disabled={processingAction === selectedUser.id}
                                >
                                    {processingAction === selectedUser.id ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send Notification
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => resetUserProgress(selectedUser.id)}
                                    disabled={processingAction === selectedUser.id}
                                >
                                    {processingAction === selectedUser.id ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Reset Progress
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
