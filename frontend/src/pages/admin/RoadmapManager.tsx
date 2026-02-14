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
import { fields, branchesMap } from '@/data/fieldsData';

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
    // Generate flat list of selectable fields (including branches)
    const selectableFields = fields.flatMap(f => {
        const branches = branchesMap[f.id] || [];
        return [
            { id: f.id, name: f.name, isBranch: false },
            ...branches.map(b => ({ id: b.id, name: b.name, isBranch: true }))
        ];
    });

    const [items, setItems] = useState<RoadmapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        fieldId: '',
        type: 'Project' as 'Project' | 'Certification',
        difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
        planType: 'free' as 'free' | 'pro' | 'premium'
    });

    useEffect(() => {
        let allProjects: RoadmapItem[] = [];
        let allCerts: RoadmapItem[] = [];

        const updateItems = () => {
            const sanitizedProjects = allProjects.filter(p => p && typeof p === 'object');
            const sanitizedCerts = allCerts.filter(c => c && typeof c === 'object');
            setItems([...sanitizedProjects, ...sanitizedCerts]);
            setLoading(false);
        };

        const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            allProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'Project'
            } as RoadmapItem));
            updateItems();
        }, () => setLoading(false));

        const qCerts = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
        const unsubCerts = onSnapshot(qCerts, (snapshot) => {
            allCerts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'Certification'
            } as RoadmapItem));
            updateItems();
        }, () => setLoading(false));

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

            const payload = {
                title: String(form.title || '').trim(),
                fieldId: safeFieldId,
                planAccess: form.planType,
                difficulty: String(form.difficulty || 'intermediate').toLowerCase(),
                level: String(form.difficulty || 'intermediate').toLowerCase(),
                status: 'Active',
                updatedAt: serverTimestamp(),
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
            toast.error("Database write failed.");
        }
    };

    const handleEdit = (item: RoadmapItem) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            fieldId: item.fieldId,
            type: item.type,
            difficulty: item.difficulty,
            planType: item.planType
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string, type: 'Project' | 'Certification') => {
        if (!confirm(`De-register this ${type}?`)) return;
        try {
            await deleteDoc(doc(db, type === 'Project' ? 'projects' : 'certifications', id));
            toast.success("Asset decommissioned.");
        } catch (e) {
            toast.error("Decommission failed.");
        }
    };

    const filteredItems = items.filter(p => {
        const searchStr = (searchTerm || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase();
        const pField = (p.fieldId || '').toLowerCase();
        return pTitle.includes(searchStr) || pField.includes(searchStr);
    });

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Content Ecosystem</h1>
                        <p className="text-muted-foreground">Manage projects and certifications.</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Register Asset</Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Resource Pipeline</CardTitle>
                        <Input
                            placeholder="Search..."
                            className="w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Field / Branch</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-bold">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {selectableFields.find(f => f.id === item.fieldId)?.name || item.fieldId}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.difficulty}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id, item.type)}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Asset' : 'Register Asset'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Field / Branch</Label>
                                <Select value={form.fieldId} onValueChange={val => setForm({ ...form, fieldId: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {selectableFields.map(f => (
                                            <SelectItem key={f.id} value={f.id}>{f.isBranch ? `↳ ${f.name}` : f.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={form.type} onValueChange={(val: any) => setForm({ ...form, type: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Project">Project</SelectItem>
                                            <SelectItem value="Certification">Certification</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <Select value={form.difficulty} onValueChange={(val: any) => setForm({ ...form, difficulty: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
