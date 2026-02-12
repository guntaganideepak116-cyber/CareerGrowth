import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Map, Search, Edit2, Trash2, FileCheck, ExternalLink } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock Data for initial display (since backend might be empty)
const MOCK_PROJECTS = [
    { id: '1', title: 'E-Commerce Platform', field: 'Computer Science', type: 'Project', difficulty: 'Intermediate', status: 'Active' },
    { id: '2', title: 'AWS Solutions Architect', field: 'Computer Science', type: 'Certification', difficulty: 'Advanced', status: 'Active' },
    { id: '3', title: 'Waitbot AI Integration', field: 'Electronics', type: 'Project', difficulty: 'Advanced', status: 'Draft' },
    { id: '4', title: 'Bridge Construction Analysis', field: 'Civil Engineering', type: 'Project', difficulty: 'Beginner', status: 'Active' },
];

export default function RoadmapManager() {
    const [projects, setProjects] = useState(MOCK_PROJECTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Stats
    const [projectForm, setProjectForm] = useState({
        title: '',
        field: '',
        type: 'Project',
        difficulty: 'Intermediate'
    });

    const handleSave = () => {
        if (!projectForm.title || !projectForm.field) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (editingId) {
            setProjects(projects.map(p => p.id === editingId ? { ...p, ...projectForm, status: 'Active' } : p));
            toast.success("Item updated successfully");
        } else {
            setProjects([...projects, { id: Date.now().toString(), ...projectForm, status: 'Active' }]);
            toast.success("New item created successfully");
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setProjectForm({ title: '', field: '', type: 'Project', difficulty: 'Intermediate' });
    };

    const handleEdit = (project: any) => {
        setEditingId(project.id);
        setProjectForm({
            title: project.title,
            field: project.field,
            type: project.type,
            difficulty: project.difficulty
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setProjects(projects.filter(p => p.id !== id));
            toast.success("Item deleted");
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.field.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Projects & Certifications</h1>
                        <p className="text-muted-foreground">Manage ongoing projects, certifications, and learning roadmaps.</p>
                    </div>
                    <Button onClick={() => {
                        setEditingId(null);
                        setProjectForm({ title: '', field: '', type: 'Project', difficulty: 'Intermediate' });
                        setIsDialogOpen(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Item
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Filter Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title or field..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="project">Projects</SelectItem>
                                    <SelectItem value="certification">Certifications</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {project.type === 'Project' ? <Map className="h-4 w-4 text-primary" /> : <FileCheck className="h-4 w-4 text-amber-500" />}
                                                {project.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>{project.field}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{project.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={project.difficulty === 'Beginner' ? 'secondary' : project.difficulty === 'Intermediate' ? 'default' : 'destructive'} className="text-xs">
                                                {project.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${project.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className="text-sm text-muted-foreground">{project.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(project.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredProjects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No projects found. Add one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Item' : 'Add New Project/Certification'}</DialogTitle>
                            <DialogDescription>
                                Add details about the project or certification to display in career paths.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Full Stack Portfolio" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="field">Field</Label>
                                <Select value={projectForm.field} onValueChange={(val) => setProjectForm({ ...projectForm, field: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Type</Label>
                                    <Select value={projectForm.type} onValueChange={(val) => setProjectForm({ ...projectForm, type: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Project">Project</SelectItem>
                                            <SelectItem value="Certification">Certification</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Difficulty</Label>
                                    <Select value={projectForm.difficulty} onValueChange={(val) => setProjectForm({ ...projectForm, difficulty: val })}>
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
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Item</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
