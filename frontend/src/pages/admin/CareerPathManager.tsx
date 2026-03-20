import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    Wifi,
    Loader2,
    Briefcase,
    Tags,
    Database,
    Network
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fields, branchesMap } from '@/data/fieldsData';

interface CareerPath {
    id: string;
    title: string;
    fieldId: string;
    requiredSkills: string[];
    level: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
}

export default function CareerPathManager() {
    // Generate flat list of selectable fields (including branches)
    const selectableFields = fields.flatMap(f => {
        const branches = branchesMap[f.id] || [];
        return [
            { id: f.id, name: f.name, isBranch: false },
            ...branches.map(b => ({ id: b.id, name: b.name, isBranch: true }))
        ];
    });

    const [paths, setPaths] = useState<CareerPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<CareerPath>>({});

    // Real-time Sync
    useEffect(() => {
        const q = query(collection(db, 'career_paths'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CareerPath));
            setPaths(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const parseSkills = (input: string | string[]) => {
        if (Array.isArray(input)) return input;
        return input.split(',').map(s => s.trim()).filter(Boolean);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.fieldId) {
            toast.error("Role identity and field are mandatory.");
            return;
        }

        try {
            const payload = {
                title: formData.title,
                fieldId: formData.fieldId,
                level: formData.level || 'Mid',
                requiredSkills: parseSkills(formData.requiredSkills || []),
                updatedAt: serverTimestamp()
            };

            if (editingId === 'new') {
                await addDoc(collection(db, 'career_paths'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                    active: true
                });
                toast.success('New career role deployed.');
            } else if (editingId) {
                await updateDoc(doc(db, 'career_paths', editingId), payload);
                toast.success('Role specifications updated.');
            }
            setEditingId(null);
            setFormData({});
        } catch (error) {
            toast.error('Deployment failed.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently de-list this career role?')) return;
        try {
            await deleteDoc(doc(db, 'career_paths', id));
            toast.success('Role de-listed.');
        } catch (e) {
            toast.error('De-listing failed.');
        }
    };

    const filteredPaths = paths.filter(p => {
        if (!p) return false;
        try {
            const term = (search || '').toLowerCase().trim();
            const title = String(p.title || '').toLowerCase();
            const fieldId = String(p.fieldId || '').toLowerCase();
            return title.includes(term) || fieldId.includes(term);
        } catch (e) {
            return false;
        }
    });

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Career Architecture</h1>
                        <p className="text-muted-foreground mt-1">Define professional roles, skills, and progression levels.</p>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="h-10 px-4 border-amber-200 bg-amber-50/30 text-amber-700 flex gap-2 items-center">
                            <Wifi className="h-4 w-4 animate-pulse" /> ENGINE ONLINE
                        </Badge>
                        <Button onClick={() => { setEditingId('new'); setFormData({}); }} className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Deploy Role
                        </Button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card><CardHeader className="py-3"><CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total Roles</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold">{paths.length}</div></CardContent></Card>
                    <Card><CardHeader className="py-3"><CardTitle className="text-xs uppercase text-muted-foreground font-bold">Skill Nodes</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-primary">
                            {paths.reduce((acc, curr) => acc + (curr.requiredSkills?.length || 0), 0)}
                        </div></CardContent></Card>
                    <Card><CardHeader className="py-3"><CardTitle className="text-xs uppercase text-muted-foreground font-bold">Coverage</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-green-600">{new Set(paths.map(p => p.fieldId)).size} Fields</div></CardContent></Card>
                    <Card className="bg-primary/5 border-primary/20"><CardHeader className="py-3"><CardTitle className="text-xs uppercase text-primary font-bold">Node Status</CardTitle></CardHeader>
                        <CardContent><div className="text-sm font-bold flex items-center gap-2">SYNCHRONIZED <Database className="h-2 w-2" /></div></CardContent></Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Management Interface */}
                    <Card className="lg:col-span-2 shadow-xl border-primary/10">
                        <CardHeader className="border-b py-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Role Inventory</CardTitle>
                                <CardDescription>Live database of career professional nodes</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Filter by title..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                    <p className="text-xs uppercase font-bold">Mapping Schema...</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead>Professional Title</TableHead>
                                            <TableHead>Field Mapping</TableHead>
                                            <TableHead>Merit Level</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPaths.map((path) => (
                                            <TableRow key={path.id} className="group hover:bg-primary/5 transition-colors">
                                                <TableCell className="font-bold py-4">
                                                    <div className="flex flex-col">
                                                        <span>{path.title}</span>
                                                        <div className="flex gap-1 mt-1">
                                                            {path.requiredSkills?.slice(0, 3).map((s, i) => (
                                                                <Badge key={i} variant="secondary" className="text-[9px] px-1 py-0 h-4">{s}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                                        {selectableFields.find(f => f.id === path.fieldId)?.name || path.fieldId}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none text-[10px] uppercase">
                                                        {path.level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(path.id); setFormData(path); }}>
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(path.id)}>
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Console Editor */}
                    <div className="space-y-6">
                        {editingId ? (
                            <Card className="border-primary shadow-2xl animate-in fade-in slide-in-from-right-4">
                                <CardHeader className="bg-primary/5 border-b py-4">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Network className="h-4 w-4 text-primary" />
                                        Protocol Override
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Professional Title</Label>
                                            <Input
                                                placeholder="e.g. Senior Kernel Engineer"
                                                value={formData.title || ''}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Discipline Mapping</Label>
                                            <Select value={formData.fieldId} onValueChange={v => setFormData({ ...formData, fieldId: v })}>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Select Branch/Field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectableFields.map(f => (
                                                        <SelectItem key={f.id} value={f.id}>
                                                            {f.isBranch ? `↳ ${f.name}` : f.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Seniority Grade</Label>
                                            <Select value={formData.level} onValueChange={(v: any) => setFormData({ ...formData, level: v })}>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Junior">Level 0: Entry</SelectItem>
                                                    <SelectItem value="Mid">Level 1: Skilled</SelectItem>
                                                    <SelectItem value="Senior">Level 2: Veteran</SelectItem>
                                                    <SelectItem value="Lead">Level 3: Principal</SelectItem>
                                                    <SelectItem value="Executive">Level 4: Strategist</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Logic Requirements</Label>
                                            <Input
                                                placeholder="React, AWS, Figma, etc."
                                                value={Array.isArray(formData.requiredSkills) ? formData.requiredSkills.join(', ') : formData.requiredSkills || ''}
                                                onChange={e => setFormData({ ...formData, requiredSkills: e.target.value as any })}
                                            />
                                            <p className="text-[10px] text-muted-foreground italic">Use commas to delineate skill nodes.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t flex gap-2">
                                        <Button variant="ghost" className="flex-1" onClick={() => setEditingId(null)}>Abort</Button>
                                        <Button className="flex-1 shadow-lg" onClick={handleSave}>
                                            <Save className="h-3.5 w-3.5 mr-2" /> Commit
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed h-[300px] flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-40">
                                <Briefcase className="h-12 w-12 text-muted-foreground" />
                                <p className="text-sm font-medium">Select a role node or initialize a new deployment to access console.</p>
                            </Card>
                        )}

                        <Card className="bg-primary/5 border-primary/10 p-6">
                            <h3 className="text-xs font-bold uppercase flex items-center gap-2 mb-2">
                                <Tags className="h-3 w-3" /> Architecture Note
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                "Career path definitions are shared globally across the career engine. Synchronized changes manifest within 80ms to all client nodes."
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
