import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs
} from 'firebase/firestore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    FileSearch,
    BrainCircuit,
    Wand2
} from 'lucide-react';
import { fields, branchesMap } from '@/data/fieldsData';
import { AssessmentQuestion } from '@/types/assessment';
import { seedAssessmentQuestions } from '@/utils/assessmentSeeder';

export default function AssessmentManagement() {
    // Generate flat list of selectable fields (including branches)
    const selectableFields = fields.flatMap(f => {
        const branches = branchesMap[f.id] || [];
        return [
            { id: f.id, name: f.name, isBranch: false, parentName: null },
            ...branches.map(b => ({ id: b.id, name: b.name, isBranch: true, parentName: f.name }))
        ];
    });

    const [selectedField, setSelectedField] = useState<string>('');
    const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [fieldStats, setFieldStats] = useState<Record<string, number>>({});

    // Question Form State
    const [questionForm, setQuestionForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'easy' as 'easy' | 'medium' | 'hard',
        topic: '',
    });

    // 1. Listen for ALL questions to build dynamic field stats
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'assessment_questions'), (snapshot) => {
            const stats: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const fid = data.fieldId;
                if (fid) stats[fid] = (stats[fid] || 0) + 1;
            });
            setFieldStats(stats);
        });
        return () => unsubscribe();
    }, []);

    // 2. Listen for questions of SELECTED field
    useEffect(() => {
        if (!selectedField) {
            setQuestions([]);
            return;
        }

        setLoadingQuestions(true);
        const q = query(
            collection(db, 'assessment_questions'),
            where('fieldId', '==', selectedField.toLowerCase().trim())
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newQuestions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AssessmentQuestion[];
            setQuestions(newQuestions);
            setLoadingQuestions(false);
        }, (error) => {
            console.error("Error fetching questions:", error);
            toast.error("Failed to load field questions");
            setLoadingQuestions(false);
        });

        return () => unsubscribe();
    }, [selectedField]);

    const handleSeedDatabase = async () => {
        if (!confirm('This will wipe all existing questions and reset them from templates. Continue?')) return;
        setSeeding(true);
        try {
            await seedAssessmentQuestions();
            toast.success('Assessment database reseeded');
            setSelectedField('');
        } catch (err) {
            toast.error('Seed operation failed');
        } finally {
            setSeeding(false);
        }
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setQuestionForm({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            difficulty: 'easy',
            topic: '',
        });
        setIsDialogOpen(true);
    };

    const handleEditQuestion = (question: AssessmentQuestion) => {
        setEditingQuestion(question);
        setQuestionForm({
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
            difficulty: question.difficulty,
            topic: question.topic || '',
        });
        setIsDialogOpen(true);
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm('Permanently remove this question from the bank?')) return;
        try {
            await deleteDoc(doc(db, 'assessment_questions', questionId));
            toast.success('Question removed');
        } catch (error) {
            toast.error('Delete operation failed');
        }
    };

    const handleSaveQuestion = async () => {
        if (!questionForm.question.trim() || questionForm.options.some(o => !o.trim())) {
            toast.error('All fields and options are mandatory');
            return;
        }

        try {
            const payload = {
                fieldId: selectedField.toLowerCase().trim(),
                ...questionForm,
                updatedAt: serverTimestamp()
            };

            if (editingQuestion) {
                await updateDoc(doc(db, 'assessment_questions', editingQuestion.id), payload);
                toast.success('Question updated');
            } else {
                await addDoc(collection(db, 'assessment_questions'), {
                    ...payload,
                    createdAt: serverTimestamp()
                });
                toast.success('Question added to bank');
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Failed to commit question');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Assessment Knowledge Hub</h1>
                        <p className="text-muted-foreground mt-1">
                            Configure adaptive assessment engines and manage knowledge banks.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    >
                        {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                        Update Questions
                    </Button>
                </div>

                {/* Real-time Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase font-bold text-muted-foreground">Managed Fields</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold">{fields.length}</div></CardContent></Card>

                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase font-bold text-muted-foreground">Global Question Count</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-primary">
                            {Object.values(fieldStats).reduce((a, b) => a + b, 0)}
                        </div></CardContent></Card>

                    <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase font-bold text-muted-foreground">Avg Density</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-purple-600">
                            {Math.round(Object.values(fieldStats).reduce((a, b) => a + b, 0) / (fields.length || 1))}
                        </div></CardContent></Card>

                    <Card className="bg-primary/5"><CardHeader className="pb-2"><CardTitle className="text-xs uppercase font-bold text-primary">Sync Status</CardTitle></CardHeader>
                        <CardContent><div className="text-sm font-bold flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-ping" /> REAL-TIME</div></CardContent></Card>
                </div>

                {/* Workspace */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Field Overview */}
                    <Card className="lg:col-span-1 border-primary/10">
                        <CardHeader className="pb-2"><CardTitle className="text-lg">Field & Branch Banks</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[500px] overflow-y-auto divide-y">
                                {selectableFields.map((field) => (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedField(field.id)}
                                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-muted/50 ${selectedField === field.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                    >
                                        <div className={`flex flex-col ${field.isBranch ? 'pl-4' : ''}`}>
                                            <span className={`text-sm ${field.isBranch ? 'font-medium' : 'font-bold'}`}>
                                                {field.isBranch ? `↳ ${field.name}` : field.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase opacity-70">
                                                {field.id} {field.parentName && `• ${field.parentName}`}
                                            </span>
                                        </div>
                                        <Badge variant={fieldStats[field.id] > 0 ? 'default' : 'outline'} className="h-5 px-1.5 min-w-[30px] justify-center">
                                            {fieldStats[field.id] || 0}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Question Repository */}
                    <Card className="lg:col-span-2 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                            <div>
                                <CardTitle>{selectedField ? `Repository: ${selectableFields.find(f => f.id === selectedField)?.name}` : 'Select a Category'}</CardTitle>
                                <CardDescription>Direct database interaction layer</CardDescription>
                            </div>
                            {selectedField && (
                                <Button onClick={handleAddQuestion} size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" /> Add Logic
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {!selectedField ? (
                                <div className="p-12 text-center text-muted-foreground space-y-4">
                                    <BrainCircuit className="h-12 w-12 mx-auto opacity-10" />
                                    <p className="text-sm">Initialize field selection to access knowledge bank.</p>
                                </div>
                            ) : loadingQuestions ? (
                                <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30">
                                                <TableHead>Question Metadata</TableHead>
                                                <TableHead>Difficulty</TableHead>
                                                <TableHead className="w-24 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q) => (
                                                <TableRow key={q.id} className="group">
                                                    <TableCell className="max-w-md">
                                                        <p className="font-medium text-sm leading-tight text-foreground truncate">{q.question}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">{q.topic || 'General'}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`uppercase text-[9px] ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} variant="outline">
                                                            {q.difficulty}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditQuestion(q)}>
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDeleteQuestion(q.id)}>
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {questions.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                                                        No logic nodes found for this cluster.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Form Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingQuestion ? 'Modify Logic Node' : 'Register New Question'}</DialogTitle>
                            <DialogDescription>Knowledge bank updates propagate instantly to user sessions.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Question Text</Label>
                                <Textarea
                                    value={questionForm.question}
                                    onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })}
                                    placeholder="Enter the assessment prompt..."
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {questionForm.options.map((opt, i) => (
                                    <div key={i} className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold">Option {i + 1}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={opt}
                                                onChange={e => {
                                                    const newOpts = [...questionForm.options];
                                                    newOpts[i] = e.target.value;
                                                    setQuestionForm({ ...questionForm, options: newOpts });
                                                }}
                                                className={questionForm.correctAnswer === i ? 'border-green-500 bg-green-50/50' : ''}
                                            />
                                            <Button
                                                size="sm"
                                                variant={questionForm.correctAnswer === i ? 'default' : 'outline'}
                                                className={`px-2 h-10 ${questionForm.correctAnswer === i ? 'bg-green-600' : ''}`}
                                                onClick={() => setQuestionForm({ ...questionForm, correctAnswer: i })}
                                            >
                                                {questionForm.correctAnswer === i ? <CheckCircle2 className="h-4 w-4" /> : 'SET'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Complexity</Label>
                                    <Select value={questionForm.difficulty} onValueChange={(v: any) => setQuestionForm({ ...questionForm, difficulty: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy (Fundamentals)</SelectItem>
                                            <SelectItem value="medium">Medium (Intermediate)</SelectItem>
                                            <SelectItem value="hard">Hard (Advanced)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Topic Segment</Label>
                                    <Input
                                        value={questionForm.topic}
                                        onChange={e => setQuestionForm({ ...questionForm, topic: e.target.value })}
                                        placeholder="e.g. Core Java, UI Design"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abort</Button>
                            <Button onClick={handleSaveQuestion}>Commit to Database</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
