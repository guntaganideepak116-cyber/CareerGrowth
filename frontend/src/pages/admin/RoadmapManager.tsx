import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Map, Search, Edit2, Trash2, FileCheck, Wifi, Loader2, ArrowRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { fields } from '@/data/fieldsData';

interface RoadmapItem {
    id: string;
    title: string;
    fieldId: string;
    type: 'Project' | 'Certification';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    status: 'Active' | 'Draft';
    planType: 'free' | 'pro' | 'premium';
}

export default function RoadmapManager() {
    const [items, setItems] = useState<RoadmapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Stats
    const [form, setForm] = useState({
        title: '',
        fieldId: '',
        type: 'Project' as 'Project' | 'Certification',
        difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
        planType: 'free' as 'free' | 'pro' | 'premium'
    });

    // Real-time Items Listener
    useEffect(() => {
        let allProjects: RoadmapItem[] = [];
        let allCerts: RoadmapItem[] = [];

        const updateItems = () => {
            // Filter out any potential non-object debris
            const sanitizedProjects = allProjects.filter(p => p && typeof p === 'object');
            const sanitizedCerts = allCerts.filter(c => c && typeof c === 'object');
            setItems([...sanitizedProjects, ...sanitizedCerts]);
            setLoading(false);
        };

        const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            allProjects = snapshot.docs.map(doc => {
                const data = doc.data() || {};
                return {
                    id: doc.id,
                    title: String(data.title || ''),
                    fieldId: String(data.fieldId || ''),
                    difficulty: data.difficulty || 'Intermediate',
                    planType: data.planType || data.planAccess || 'free',
                    status: data.status || 'Active',
                    type: 'Project'
                } as RoadmapItem;
            });
            updateItems();
        }, (err) => {
            console.error("Projects Sync Error:", err);
            setLoading(false);
        });

        const qCerts = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
        const unsubCerts = onSnapshot(qCerts, (snapshot) => {
            allCerts = snapshot.docs.map(doc => {
                const data = doc.data() || {};
                return {
                    id: doc.id,
                    title: String(data.title || ''),
                    fieldId: String(data.fieldId || ''),
                    difficulty: data.difficulty || data.level || 'Intermediate',
                    planType: data.planType || data.planAccess || 'free',
                    status: data.status || 'Active',
                    type: 'Certification'
                } as RoadmapItem;
            });
            updateItems();
        }, (err) => {
            console.error("Certs Sync Error:", err);
            setLoading(false);
        });

        return () => {
            unsubProjects();
            unsubCerts();
        };
    }, []);

    const handleSave = async () => {
        if (!form.title || !form.fieldId) {
            toast.error("Please fill in all core fields.");
            return;
        }

        try {
            const collectionName = form.type === 'Project' ? 'projects' : 'certifications';
            const safeFieldId = String(form.fieldId || '').toLowerCase().trim();

            // Map the simplified Admin form to the robust User schema
            const payload = {
                title: String(form.title || '').trim(),
                fieldId: safeFieldId,
                planAccess: form.planType,
                difficulty: String(form.difficulty || 'intermediate').toLowerCase(),
                level: String(form.difficulty || 'intermediate').toLowerCase(), // for certs
                status: 'Active',
                updatedAt: serverTimestamp(),
                // Add default schema fields to prevent crashes in User site
                ...(form.type === 'Project' ? {
                    description: `Industry-grade project for ${safeFieldId} professionals.`,
                    requiredSkills: ['Core Fundamentals', safeFieldId],
                    toolsRequired: ['Industrial Standard Tools'],
                    estimatedTime: '4-6 weeks',
                    resumeStrength: 85,
                    careerImpact: 'high',
                    industryRelevance: 'High demand in current market'
                } : {
                    provider: 'Industry Accredited',
                    description: `Global certification node for ${safeFieldId}.`,
                    industryRecognitionLevel: 'high',
                    validity: 'Lifetime',
                    skillsCovered: ['Professional standards', safeFieldId],
                    officialLink: 'https://google.com',
                    valueScore: 90
                })
            };

            if (editingId) {
                await updateDoc(doc(db, collectionName, editingId), payload);
                toast.success(`${form.type} updated.`);
            } else {
                await addDoc(collection(db, collectionName), {
                    ...payload,
                    createdAt: serverTimestamp()
                });
                toast.success(`New ${form.type} registered.`);
            }
            setIsDialogOpen(false);
            setEditingId(null);
            setForm({ title: '', fieldId: '', type: 'Project', difficulty: 'Intermediate', planType: 'free' });
        } catch (error) {
            console.error(error);
            toast.error("Database write failed.");
        }
    };

    const handleEdit = (item: RoadmapItem) => {
        if (!item) return;
        setEditingId(item.id);
        setForm({
            title: item.title || '',
            fieldId: item.fieldId || '',
            type: item.type || 'Project',
            difficulty: item.difficulty || 'Intermediate',
            planType: item.planType || 'free'
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string, type: 'Project' | 'Certification') => {
        if (!confirm(`De-register this ${type} from the career roadmap?`)) return;
        try {
            const collectionName = type === 'Project' ? 'projects' : 'certifications';
            await deleteDoc(doc(db, collectionName, id));
            toast.success("Asset decommissioned.");
        } catch (e) {
            toast.error("Decommission failed.");
        }
    };

    const filteredItems = items.filter(p => {
        if (!p) return false;
        try {
            const titleStr = String(p.title || '').toLowerCase();
            const fieldStr = String(p.fieldId || '').toLowerCase();
            const searchStr = String(searchTerm || '').toLowerCase().trim();

            if (!searchStr) return true;
            return titleStr.includes(searchStr) || fieldStr.includes(searchStr);
        } catch (e) {
            console.warn("Filter fail-safe triggered:", e);
            return false;
        }
    });

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Content Ecosystem</h1>
                        <p className="text-muted-foreground mt-1">Manage cross-field projects and industry certifications.</p>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="h-10 px-4 border-primary/20 bg-primary/5 text-primary flex gap-2 items-center">
                            <Wifi className="h-4 w-4 animate-pulse text-green-500" />
                            LIVE CATALOG
                        </Badge>
                        <Button onClick={() => {
                            setEditingId(null);
                            setForm({ title: '', fieldId: '', type: 'Project', difficulty: 'Intermediate', planType: 'free' });
                            setIsDialogOpen(true);
                        }} className="shadow-lg hover:shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" />
                            Register Asset
                        </Button>
                    </div>
                </div>

                {/* Statistics Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Assets</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold">{items?.length || 0}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-muted-foreground">Projects</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-primary">{items?.filter(i => i?.type === 'Project').length || 0}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-muted-foreground">Premium Logic</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-amber-600">{items?.filter(i => i?.planType === 'premium').length || 0}</div></CardContent></Card>
                    <Card className="border-green-200 bg-green-50/20"><CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-green-600">Active Node</CardTitle></CardHeader>
                        <CardContent><div className="text-sm font-bold flex items-center gap-2">UP-TO-DATE <ArrowRight className="h-3 w-3" /></div></CardContent></Card>
                </div>

                {/* Workspace */}
                <Card className="shadow-xl">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Resource Pipeline</CardTitle>
                            <CardDescription>Managed objects synced with global career engine</CardDescription>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or field..."
                                className="pl-9 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center gap-4 text-muted-foreground">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-medium animate-pulse uppercase tracking-widest text-[10px]">Synchronizing Node...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-1/3">Asset Identity</TableHead>
                                        <TableHead>Target Discipline</TableHead>
                                        <TableHead>Requirement</TableHead>
                                        <TableHead>Tier</TableHead>
                                        <TableHead className="text-right">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded flex items-center justify-center ${item.type === 'Project' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-600'}`}>
                                                        {item.type === 'Project' ? <Map className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{item.title}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight opacity-70">{item.type} • {item.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] uppercase h-5 font-bold">
                                                    {fields.find(f => f.id === item.fieldId)?.name || item.fieldId}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`text-[10px] uppercase h-5 font-bold ${item.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : item.difficulty === 'Intermediate' ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-700'}`}>
                                                    {item.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[10px] uppercase h-5 font-bold">
                                                    {item.planType || 'FREE'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id, item.type)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-48 text-muted-foreground italic">
                                                No resources matched the current filter.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Asset Editor Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingId ? 'Edit Manifest' : 'Register New Asset'}</DialogTitle>
                            <DialogDescription>
                                Changes manifest across all matching career paths instantly.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Asset Title</Label>
                                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. System Design Mastery" className="h-10" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Managed Field</Label>
                                    <Select value={form.fieldId} onValueChange={(val) => setForm({ ...form, fieldId: val })}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {fields.map(f => (
                                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Asset Type</Label>
                                    <Select value={form.type} onValueChange={(val: any) => setForm({ ...form, type: val })}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Project">Real-world Project</SelectItem>
                                            <SelectItem value="Certification">Industry Cert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Complexity Level</Label>
                                    <Select value={form.difficulty} onValueChange={(val: any) => setForm({ ...form, difficulty: val })}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Level 1: Entry</SelectItem>
                                            <SelectItem value="Intermediate">Level 2: Skilled</SelectItem>
                                            <SelectItem value="Advanced">Level 3: Mastery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-muted-foreground">Access Tier</Label>
                                    <Select value={form.planType} onValueChange={(val: any) => setForm({ ...form, planType: val })}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free Access</SelectItem>
                                            <SelectItem value="pro">Pro Analyst</SelectItem>
                                            <SelectItem value="premium">Premium Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="bg-muted/30 p-4 -m-6 mt-2 rounded-b-lg border-t">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Abort</Button>
                            <Button onClick={handleSave} className="min-w-[120px] shadow-lg">Commit to Catalog</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
