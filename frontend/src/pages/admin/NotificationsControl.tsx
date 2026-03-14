import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Bell,
    Send,
    Trash2,
    RefreshCw,
    CheckCircle2,
    Clock,
    Wifi,
    Users,
    MessageSquareQuote
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs,
    where
} from 'firebase/firestore';
import { fields } from '@/data/fieldsData';

interface NotificationDoc {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: any;
    fieldId?: string;
}

export default function NotificationsControl() {
    const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Form State
    const [targetType, setTargetType] = useState<'all' | 'field' | 'individual'>('all');
    const [targetField, setTargetField] = useState<string>('all');
    const [individualEmail, setIndividualEmail] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    // Real-time Global Notification Stream (Summary)
    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NotificationDoc)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const sendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error("Message content cannot be empty.");
            return;
        }

        setSending(true);
        try {
            let targetUserIds: string[] = [];

            if (targetType === 'all') {
                const usersSnap = await getDocs(collection(db, 'users'));
                targetUserIds = usersSnap.docs.map(d => d.id);
            } else if (targetType === 'field') {
                const q = query(collection(db, 'users'), where('field', '==', targetField));
                const usersSnap = await getDocs(q);
                targetUserIds = usersSnap.docs.map(d => d.id);
            } else {
                const q = query(collection(db, 'users'), where('email', '==', individualEmail));
                const usersSnap = await getDocs(q);
                targetUserIds = usersSnap.docs.map(d => d.id);
            }

            if (targetUserIds.length === 0) {
                toast.error("No target users found for this filter.");
                setSending(false);
                return;
            }

            const batch = targetUserIds.map(uid => addDoc(collection(db, 'notifications'), {
                userId: uid,
                title,
                message,
                type: 'admin',
                read: false,
                createdAt: serverTimestamp(),
                fieldId: targetType === 'field' ? targetField : null
            }));

            await Promise.all(batch);

            toast.success(`Broadcast successful to ${targetUserIds.length} users.`);
            setTitle('');
            setMessage('');
            setIndividualEmail('');
        } catch (error) {
            toast.error("Failed to propagate notifications.");
        } finally {
            setSending(false);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
            toast.success("Message recalled.");
        } catch (e) {
            toast.error("Recall failed.");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notification Command</h1>
                        <p className="text-muted-foreground mt-1">Directly broadcast alerts, news, and system updates to user segments.</p>
                    </div>
                    <Badge variant="outline" className="h-8 px-4 border-primary text-primary font-bold bg-primary/5">
                        <Wifi className="h-4 w-4 mr-2 animate-pulse" /> ENGINE CONNECTED
                    </Badge>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Compose Section */}
                    <Card className="shadow-xl border-primary/10">
                        <CardHeader className="bg-primary/5 border-b py-6">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquareQuote className="h-5 w-5 text-primary" />
                                Compose Broadcast
                            </CardTitle>
                            <CardDescription>Real-time delivery to selective user clusters</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase">Targeting Segment</Label>
                                        <Select value={targetType} onValueChange={(v: any) => setTargetType(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Everywhere</SelectItem>
                                                <SelectItem value="field">Field Specific</SelectItem>
                                                <SelectItem value="individual">Direct UUID/Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {targetType === 'field' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs font-bold uppercase">Active Field</Label>
                                            <Select value={targetField} onValueChange={setTargetField}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {fields.map(f => (
                                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    {targetType === 'individual' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs font-bold uppercase">Target Email</Label>
                                            <Input
                                                placeholder="user@example.com"
                                                value={individualEmail}
                                                onChange={e => setIndividualEmail(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-primary/80">
                                    <Label className="text-xs font-bold uppercase">Alert Title</Label>
                                    <Input
                                        placeholder="System Maintenance, New Feature, etc."
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Detailed Message</Label>
                                    <Textarea
                                        placeholder="Broadcast content reaches users instantly via socket listeners..."
                                        className="min-h-[120px] resize-none"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold gap-3 shadow-lg hover:shadow-primary/20"
                                onClick={sendNotification}
                                disabled={sending}
                            >
                                {sending ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                {sending ? 'TRANSMITTING...' : 'INITIATE BROADCAST'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Audit/History Section */}
                    <Card className="border-primary/10 shadow-lg">
                        <CardHeader className="py- border-b flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-lg">Transmission Ledger</CardTitle>
                                <CardDescription>Last 50 events in the network</CardDescription>
                            </div>
                            <Users className="h-5 w-5 text-muted-foreground opacity-20" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[500px] overflow-y-auto divide-y divide-border/50">
                                {loading ? (
                                    <div className="p-12 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] scale-90 px-1 py-0 uppercase">ADMIN</Badge>
                                                        <p className="text-sm font-bold text-foreground">{notif.title}</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{notif.message}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                                            <Clock className="h-3 w-3" />
                                                            {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                                                        </div>
                                                        {notif.read && (
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase">
                                                                <CheckCircle2 className="h-3 w-3" /> Read
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => deleteNotification(notif.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-20 text-center space-y-4">
                                        <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                                        <p className="text-sm text-muted-foreground italic">No transmissions recorded in this cluster.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
