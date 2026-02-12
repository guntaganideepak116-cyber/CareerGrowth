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
    Wifi,
    ShieldAlert,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    updateDoc,
    addDoc,
    onSnapshot,
    Timestamp,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { useAuthContext } from '@/contexts/AuthContext';

interface UserData {
    id: string;
    email: string;
    full_name?: string;
    field?: string;
    branch?: string;
    role?: 'admin' | 'user';
    isBlocked?: boolean;
    lastLogin?: any;
    created_at?: any;
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
    const { profile: adminProfile } = useAuthContext();
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

    // Logger Utility
    const logAdminAction = async (action: string, targetId: string, details: string) => {
        try {
            await addDoc(collection(db, 'admin_activity_logs'), {
                adminId: adminProfile?.id || 'unknown',
                adminEmail: adminProfile?.email || 'unknown',
                action,
                targetId,
                details,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Log error:", e);
        }
    };

    // Real-time Users Listener
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const userData: UserData[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as UserData));

            setUsers(userData);

            const now = new Date();
            const todayStart = new Date(now.setHours(0, 0, 0, 0));

            const newStats: DashboardStats = {
                totalUsers: userData.length,
                activeUsers: userData.filter(u => !u.isBlocked).length,
                blockedUsers: userData.filter(u => u.isBlocked).length,
                newUsersToday: userData.filter(u => {
                    const created = u.created_at instanceof Timestamp ? u.created_at.toDate() : u.created_at ? new Date(u.created_at) : new Date(0);
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
        const term = (searchTerm || '').toLowerCase().trim();
        if (!term) {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(user => {
                    if (!user) return false;
                    try {
                        const email = String(user.email || '').toLowerCase();
                        const name = String(user.full_name || '').toLowerCase();
                        const field = String(user.field || '').toLowerCase();
                        const branch = String(user.branch || '').toLowerCase();
                        return email.includes(term) || name.includes(term) || field.includes(term) || branch.includes(term);
                    } catch (e) {
                        return false;
                    }
                })
            );
        }
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
                updated_at: new Date().toISOString()
            });
            await logAdminAction(currentlyBlocked ? 'UNBLOCK' : 'BLOCK', userId, `User ${currentlyBlocked ? 'unblocked' : 'disabled'}`);
            toast.success(currentlyBlocked ? 'User access restored' : 'User access revoked');
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setProcessingAction(null);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
        setProcessingAction(userId);
        try {
            await updateDoc(doc(db, 'users', userId), {
                role: newRole,
                updated_at: new Date().toISOString()
            });
            await logAdminAction('ROLE_CHANGE', userId, `Role changed to ${newRole}`);
            toast.success(`Role updated to ${newRole}`);
        } catch (error) {
            toast.error('Failed to update role');
        } finally {
            setProcessingAction(null);
        }
    };

    const updateUserPlan = async (userId: string, newPlan: string) => {
        setProcessingAction(userId);
        try {
            await updateDoc(doc(db, 'users', userId), {
                userPlan: newPlan,
                updated_at: new Date().toISOString()
            });
            await logAdminAction('PLAN_UPGRADE', userId, `Plan updated to ${newPlan}`);
            toast.success(`Plan updated to ${newPlan}`);
        } catch (error) {
            toast.error('Failed to update plan');
        } finally {
            setProcessingAction(null);
        }
    };

    const deleteUserAccount = async (userId: string) => {
        if (!confirm('CRITICAL ACTION: This will permanently delete this user from Firestore. This cannot be undone. Continue?')) return;
        setProcessingAction(userId);
        try {
            await deleteDoc(doc(db, 'users', userId));
            await logAdminAction('DELETE_USER', userId, 'Permanently deleted user record');
            toast.success('User deleted successfully');
            setSelectedUser(null);
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setProcessingAction(null);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Active Control Center</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage permissions, roles, and access in real-time.
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium animate-pulse shadow-sm">
                            <Wifi className="h-3 w-3" />
                            Live Sync Active
                        </div>
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Accounts</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.totalUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Nodes</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{stats.activeUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Disabled</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-red-500">{stats.blockedUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Daily Ingress</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">+{stats.newUsersToday}</div></CardContent></Card>
                </div>

                {/* Management Interface */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* User Feed */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Identity Feed</CardTitle>
                                <CardDescription>All registered entities on the grid</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="UUID or Email..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                            ) : (
                                <div className="divide-y max-h-[600px] overflow-y-auto">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-lg ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-sm">{user.email}</p>
                                                        {user.role === 'admin' && <Badge className="bg-amber-500 hover:bg-amber-600 scale-75 h-5 px-1 origin-left">ADMIN</Badge>}
                                                    </div>
                                                    <div className="flex gap-2 text-[11px] text-muted-foreground mt-0.5">
                                                        <span className="uppercase font-bold tracking-tighter">{user.userPlan || 'free'}</span>
                                                        <span>•</span>
                                                        <span>{user.field || 'UNASSIGNED'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {user.isBlocked && <Badge variant="destructive" className="h-5 px-2">BLOCKED</Badge>}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && <div className="p-12 text-center text-muted-foreground">Empty Matrix Results</div>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Command Console */}
                    <div className="space-y-6">
                        {selectedUser ? (
                            <Card className="border-primary shadow-2xl animate-in slide-in-from-right-4">
                                <CardHeader className="bg-primary/5 border-b">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">Command Console</CardTitle>
                                            <CardDescription className="text-xs truncate max-w-[200px]">{selectedUser.id}</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)} className="h-6 w-6 p-0">&times;</Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Access Protocol</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={selectedUser.isBlocked ? "default" : "secondary"}
                                                    className="h-9 justify-start"
                                                    disabled={processingAction === selectedUser.id}
                                                    onClick={() => toggleUserBlock(selectedUser.id, selectedUser.isBlocked || false)}
                                                >
                                                    {selectedUser.isBlocked ? <Unlock className="h-3.5 w-3.5 mr-2 text-green-500" /> : <Ban className="h-3.5 w-3.5 mr-2" />}
                                                    {selectedUser.isBlocked ? 'Restore' : 'Revoke'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-9 justify-start"
                                                    disabled={processingAction === selectedUser.id}
                                                    onClick={() => deleteUserAccount(selectedUser.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Security Role</Label>
                                            <Select
                                                value={selectedUser.role || 'user'}
                                                onValueChange={(v: any) => updateUserRole(selectedUser.id, v)}
                                                disabled={processingAction === selectedUser.id}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">Standard User</SelectItem>
                                                    <SelectItem value="admin">Administrator</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Subscription Tier</Label>
                                            <Select
                                                value={selectedUser.userPlan || 'free'}
                                                onValueChange={(v) => updateUserPlan(selectedUser.id, v)}
                                                disabled={processingAction === selectedUser.id}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="free">Free Forever</SelectItem>
                                                    <SelectItem value="pro">Pro Analyst</SelectItem>
                                                    <SelectItem value="premium">Premium Expert</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Sync Status:</span>
                                            <span className="font-bold text-green-500 flex items-center gap-1">
                                                <Wifi className="h-3 w-3" /> VERIFIED
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground p-3 bg-muted rounded leading-relaxed border italic">
                                            "Protocol updates applied here manifest instantly across geographical clusters using Firestore real-time propagation."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed bg-muted/30 flex items-center justify-center p-12 text-center h-[400px]">
                                <div className="space-y-3">
                                    <ShieldAlert className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                                    <p className="text-sm text-muted-foreground">Select an entity from the feed<br />to initialize command override.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
