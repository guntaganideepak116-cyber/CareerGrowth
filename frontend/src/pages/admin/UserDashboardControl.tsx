import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Filter,
    Download,
    Send,
    Lock,
    Unlock,
    Ban,
    UserCheck,
    Eye,
    CreditCard,
    Wifi
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, doc, updateDoc, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';

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
    userPlan?: 'free' | 'pro' | 'premium';
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

    // Real-time Users Listener
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const userData: UserData[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as UserData));

            setUsers(userData);

            // Calculate stats immediately
            const now = new Date();
            const todayStart = new Date(now.setHours(0, 0, 0, 0));

            const newStats: DashboardStats = {
                totalUsers: userData.length,
                activeUsers: userData.filter(u => !u.isBlocked).length,
                blockedUsers: userData.filter(u => u.isBlocked).length,
                newUsersToday: userData.filter(u => {
                    const created = u.createdAt instanceof Timestamp ? u.createdAt.toDate() : u.createdAt ? new Date(u.createdAt) : new Date(0);
                    return created >= todayStart;
                }).length
            };
            setStats(newStats);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to users:", error);
            toast.error("Failed to sync user data");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter logic
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
        // Update selected user reference if it exists in new data
        if (selectedUser) {
            const updated = users.find(u => u.id === selectedUser.id);
            if (updated) setSelectedUser(updated);
        }
    }, [searchTerm, users]);

    // Actions
    const toggleUserBlock = async (userId: string, currentlyBlocked: boolean) => {
        setProcessingAction(userId);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isBlocked: !currentlyBlocked,
                updatedAt: new Date().toISOString()
            });
            toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
        } catch (error) {
            console.error('Error toggling block:', error);
            toast.error('Failed to update status');
        } finally {
            setProcessingAction(null);
        }
    };

    const updateUserPlan = async (userId: string, newPlan: string) => {
        setProcessingAction(userId);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                userPlan: newPlan,
                updatedAt: new Date().toISOString()
            });
            toast.success(`Plan updated to ${newPlan}`);
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error('Failed to update plan');
        } finally {
            setProcessingAction(null);
        }
    };

    const sendNotificationToUser = async (userId: string, userEmail: string) => {
        setProcessingAction(userId);
        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                title: 'Admin Message',
                message: 'You have a new message from admin.',
                type: 'admin',
                read: false,
                createdAt: new Date().toISOString()
            });
            toast.success(`Notification sent to ${userEmail}`);
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification');
        } finally {
            setProcessingAction(null);
        }
    };

    const resetUserProgress = async (userId: string) => {
        if (!confirm('Are you sure? This resets all progress.')) return;
        setProcessingAction(userId);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                roadmap_progress: 0,
                completed_projects: [],
                skills: [],
                updatedAt: new Date().toISOString()
            });
            // Also reset user_progress doc? Yes if strict.
            const progressRef = doc(db, 'user_progress', userId);
            await updateDoc(progressRef, {
                completedSemesters: [],
                completedProjects: [],
                completedSkills: [],
                completedCertifications: [],
                assessmentScore: { lastScore: 0, attempts: 0, history: [] },
                overallProgress: 0,
                skillGrowth: 0,
                engagementScore: 0
            }).catch(() => { }); // Ignore if doc doesn't exist

            toast.success('Progress reset');
        } catch (error) {
            console.error('Error resetting:', error);
            toast.error('Failed to reset');
        } finally {
            setProcessingAction(null);
        }
    };

    const exportUserData = () => {
        const csvContent = [
            ['Email', 'Name', 'Field', 'Branch', 'Plan', 'Progress', 'Status'].join(','),
            ...filteredUsers.map(u => [
                u.email || '',
                u.name || '',
                u.field || '',
                u.branch || '',
                u.userPlan || 'free',
                `${u.roadmap_progress || 0}%`,
                u.isBlocked ? 'Blocked' : 'Active'
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-2">
                            Real-time user control & monitoring
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium animate-pulse mr-2">
                            <Wifi className="h-3 w-3" />
                            Live
                        </div>
                        <Button onClick={exportUserData} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.activeUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Blocked</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{stats.blockedUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">New Today</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{stats.newUsersToday}</div></CardContent></Card>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.email}</p>
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="capitalize">{user.userPlan || 'free'}</span>
                                                    <span>•</span>
                                                    <span>{user.field || 'No Field'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {user.isBlocked && <Badge variant="destructive" className="mr-2">Blocked</Badge>}
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}>
                                                {selectedUser?.id === user.id ? 'Close' : 'Manage'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {filteredUsers.length === 0 && <div className="p-8 text-center text-muted-foreground">No users found</div>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Detailed View */}
                {selectedUser && (
                    <Card className="border-primary border-2 shadow-lg animate-in slide-in-from-bottom-4">
                        <CardHeader>
                            <CardTitle>Managing: {selectedUser.email}</CardTitle>
                            <CardDescription>Full control over user account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>User Plan</Label>
                                    <Select
                                        defaultValue={selectedUser.userPlan || 'free'}
                                        onValueChange={(val) => updateUserPlan(selectedUser.id, val)}
                                        disabled={processingAction === selectedUser.id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="pro">Pro ($9.99)</SelectItem>
                                            <SelectItem value="premium">Premium ($19.99)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div><Label>Name</Label><p className="pt-2 font-medium">{selectedUser.name || '-'}</p></div>
                                <div><Label>Field</Label><p className="pt-2 font-medium">{selectedUser.field || '-'}</p></div>
                                <div><Label>Progress</Label><p className="pt-2 font-medium">{selectedUser.roadmap_progress || 0}%</p></div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button
                                    variant={selectedUser.isBlocked ? "default" : "secondary"}
                                    onClick={() => toggleUserBlock(selectedUser.id, selectedUser.isBlocked || false)}
                                    disabled={processingAction === selectedUser.id}
                                >
                                    {selectedUser.isBlocked ? <Unlock className="h-4 w-4 mr-2" /> : <Ban className="h-4 w-4 mr-2" />}
                                    {selectedUser.isBlocked ? 'Unblock Account' : 'Block Access'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => sendNotificationToUser(selectedUser.id, selectedUser.email)}
                                    disabled={processingAction === selectedUser.id}
                                >
                                    <Send className="h-4 w-4 mr-2" /> Message
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => resetUserProgress(selectedUser.id)}
                                    disabled={processingAction === selectedUser.id}
                                >
                                    <AlertCircle className="h-4 w-4 mr-2" /> Reset Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
