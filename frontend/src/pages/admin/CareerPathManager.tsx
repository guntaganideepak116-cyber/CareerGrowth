import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { BulkImportCareerPaths } from '@/components/admin/BulkImportCareerPaths';


interface CareerPath {
    id: string;
    title: string;
    field: string;
    requiredSkills: string[];
    level: string;
}

export default function CareerPathManager() {
    const [paths, setPaths] = useState<CareerPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Edit/Add Mode
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<CareerPath>>({});

    useEffect(() => {
        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'career_paths'));
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as CareerPath));
            setPaths(list);
        } catch (error) {
            toast.error('Failed to load career paths');
        } finally {
            setLoading(false);
        }
    };

    const roundedSkills = (skills: string[] | string) => {
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'string') return skills.split(',').map(s => s.trim());
        return [];
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: formData.title,
                field: formData.field,
                level: formData.level,
                requiredSkills: roundedSkills(formData.requiredSkills as any),
                updatedAt: serverTimestamp()
            };

            if (editingId === 'new') {
                await addDoc(collection(db, 'career_paths'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                    verified: true
                });
                toast.success('Career path created');
            } else if (editingId) {
                await updateDoc(doc(db, 'career_paths', editingId), payload);
                toast.success('Career path updated');
            }
            setEditingId(null);
            fetchPaths();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this career path?')) return;
        try {
            await deleteDoc(doc(db, 'career_paths', id));
            toast.success('Deleted successfully');
            fetchPaths();
        } catch (e) {
            toast.error('Delete failed');
        }
    };

    const filteredPaths = paths.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.field?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight">Career Role Management</h2>
                    <Button onClick={() => { setEditingId('new'); setFormData({}); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Role
                    </Button>
                </div>

                {/* Bulk Import Component */}
                {paths.length === 0 && (
                    <BulkImportCareerPaths />
                )}

                <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                {editingId && (
                    <div className="bg-secondary/20 p-4 rounded-lg border border-border space-y-4">
                        <h3 className="font-semibold">{editingId === 'new' ? 'New Role' : 'Edit Role'}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Job Title"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <Input
                                placeholder="Field (e.g. engineering)"
                                value={formData.field || ''}
                                onChange={e => setFormData({ ...formData, field: e.target.value })}
                            />
                            <Input
                                placeholder="Level (Beginner, Intermediate, Advanced)"
                                value={formData.level || ''}
                                onChange={e => setFormData({ ...formData, level: e.target.value })}
                            />
                            <Input
                                placeholder="Required Skills (comma separated)"
                                value={Array.isArray(formData.requiredSkills) ? formData.requiredSkills.join(', ') : formData.requiredSkills || ''}
                                onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                )}

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Field</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
                                </TableRow>
                            ) : filteredPaths.map((path) => (
                                <TableRow key={path.id}>
                                    <TableCell className="font-medium">{path.title}</TableCell>
                                    <TableCell>{path.field}</TableCell>
                                    <TableCell>{path.level}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {path.requiredSkills?.slice(0, 3).map((s, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>
                                            ))}
                                            {path.requiredSkills?.length > 3 && <span className="text-xs text-muted-foreground">+{path.requiredSkills.length - 3}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingId(path.id); setFormData(path); }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(path.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
