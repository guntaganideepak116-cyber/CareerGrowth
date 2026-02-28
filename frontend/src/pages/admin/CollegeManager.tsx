import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Loader2, 
    MapPin, 
    Globe, 
    Award, 
    Building2 
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
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
import { specializationsMap } from '@/data/fieldsData';

interface College {
    id: string;
    collegeName: string;
    address: string;
    website: string;
    rating: number;
    coursesOffered: string[];
    location: {
        latitude: number;
        longitude: number;
    };
    city: string;
    state: string;
    country: string;
}

export default function CollegeManager() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({
        collegeName: '',
        address: '',
        website: '',
        rating: 4.0,
        coursesOffered: [] as string[],
        latitude: 0,
        longitude: 0,
        city: '',
        state: '',
        country: 'India'
    });

    // Specialization options for selection
    const allSpecializations = Object.values(specializationsMap).flat().map(s => s.name);
    const uniqueSpecs = Array.from(new Set(allSpecializations)).sort();

    useEffect(() => {
        const q = query(collection(db, 'colleges'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as College));
            setColleges(list);
            setLoading(false);
        }, (error) => {
            console.error("Firestore listen error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!form.collegeName || !form.city || form.coursesOffered.length === 0) {
            toast.error("Please fill in College Name, City and at least one Course.");
            return;
        }

        try {
            const payload = {
                collegeName: form.collegeName,
                address: form.address,
                website: form.website,
                rating: Number(form.rating),
                coursesOffered: form.coursesOffered,
                location: {
                    latitude: Number(form.latitude),
                    longitude: Number(form.longitude)
                },
                city: form.city,
                state: form.state,
                country: form.country,
                updatedAt: serverTimestamp()
            };

            if (editingId) {
                await updateDoc(doc(db, 'colleges', editingId), payload);
                toast.success("College updated successfully.");
            } else {
                await addDoc(collection(db, 'colleges'), {
                    ...payload,
                    createdAt: serverTimestamp()
                });
                toast.success("College added successfully.");
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save college data.");
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            collegeName: '',
            address: '',
            website: '',
            rating: 4.0,
            coursesOffered: [],
            latitude: 0,
            longitude: 0,
            city: '',
            state: '',
            country: 'India'
        });
    };

    const handleEdit = (college: College) => {
        setEditingId(college.id);
        setForm({
            collegeName: college.collegeName,
            address: college.address,
            website: college.website,
            rating: college.rating,
            coursesOffered: college.coursesOffered,
            latitude: college.location.latitude,
            longitude: college.location.longitude,
            city: college.city,
            state: college.state,
            country: college.country
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this college?")) return;
        try {
            await deleteDoc(doc(db, 'colleges', id));
            toast.success("College removed.");
        } catch (e) {
            toast.error("Delete failed.");
        }
    };

    const toggleCourse = (course: string) => {
        setForm(prev => ({
            ...prev,
            coursesOffered: prev.coursesOffered.includes(course)
                ? prev.coursesOffered.filter(c => c !== course)
                : [...prev.coursesOffered, course]
        }));
    };

    const filteredColleges = colleges.filter(c => 
        c.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">College Management</h1>
                        <p className="text-muted-foreground">Add and manage colleges for regional recommendations.</p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add College
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Colleges List</CardTitle>
                        <Input
                            placeholder="Search by name or city..."
                            className="w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>College Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Courses</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredColleges.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                            No colleges found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredColleges.map((college) => (
                                        <TableRow key={college.id}>
                                            <TableCell className="font-bold">{college.collegeName}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span>{college.city}, {college.state}</span>
                                                    <span className="text-muted-foreground">({college.location.latitude}, {college.location.longitude})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {college.coursesOffered.slice(0, 3).map(c => (
                                                        <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                                                    ))}
                                                    {college.coursesOffered.length > 3 && (
                                                        <Badge variant="outline" className="text-[10px]">+{college.coursesOffered.length - 3} more</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-amber-500">{college.rating} ★</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(college)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(college.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit College' : 'Add New College'}</DialogTitle>
                            <DialogDescription>
                                Enter physical college details and coordinates for GPS distance calculation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                                <Label>College Name</Label>
                                <Input 
                                    placeholder="e.g. IIT Bombay" 
                                    value={form.collegeName} 
                                    onChange={e => setForm({ ...form, collegeName: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Address</Label>
                                <Input 
                                    placeholder="Full address..." 
                                    value={form.address} 
                                    onChange={e => setForm({ ...form, address: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Website URL</Label>
                                <Input 
                                    placeholder="https://..." 
                                    value={form.website} 
                                    onChange={e => setForm({ ...form, website: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rating (1-5)</Label>
                                <Input 
                                    type="number" 
                                    step="0.1" 
                                    min="1" 
                                    max="5" 
                                    value={form.rating} 
                                    onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Latitude</Label>
                                <Input 
                                    type="number" 
                                    step="0.000001" 
                                    value={form.latitude} 
                                    onChange={e => setForm({ ...form, latitude: parseFloat(e.target.value) })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Longitude</Label>
                                <Input 
                                    type="number" 
                                    step="0.000001" 
                                    value={form.longitude} 
                                    onChange={e => setForm({ ...form, longitude: parseFloat(e.target.value) })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input 
                                    value={form.city} 
                                    onChange={e => setForm({ ...form, city: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>State</Label>
                                <Input 
                                    value={form.state} 
                                    onChange={e => setForm({ ...form, state: e.target.value })} 
                                />
                            </div>
                            
                            <div className="space-y-2 col-span-2">
                                <Label>Courses Offered (Specializations)</Label>
                                <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                                    {uniqueSpecs.map(spec => (
                                        <div key={spec} className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id={`spec-${spec}`}
                                                checked={form.coursesOffered.includes(spec)}
                                                onChange={() => toggleCourse(spec)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor={`spec-${spec}`} className="text-xs cursor-pointer truncate">
                                                {spec}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save College</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
