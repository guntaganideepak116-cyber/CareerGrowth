import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { seedAssessmentQuestions } from '@/utils/assessmentSeeder';
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
    Settings,
    BarChart3,
    FileText,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { fields } from '@/data/fieldsData';
import { assessmentQuestions } from '@/data/assessmentQuestions';
import { AssessmentQuestion } from '@/types/assessment';

export default function AssessmentManagement() {
    const [selectedField, setSelectedField] = useState<string>('');
    const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [passingScore, setPassingScore] = useState(75);
    const [assessmentEnabled, setAssessmentEnabled] = useState(true);
    const [seeding, setSeeding] = useState(false);
    // Real-time state
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const queryClient = useQueryClient();

    const handleSeedDatabase = async () => {
        if (!confirm('WARNING: This will DELETE all existing questions and replace them with generated templates. Continue?')) {
            return;
        }
        setSeeding(true);
        try {
            await seedAssessmentQuestions();
            toast.success('Database reseeded successfully!');
            // No need to invalidate queries if we are listening to changes, IF we were listening to all. 
            // But we only listen to selectedField. If current view is open, it will update.
            // If not, it will update when opened.
            setSelectedField(''); // Reset view to be safe
        } catch (err) {
            toast.error('Failed to seed database');
            console.error(err);
        } finally {
            setSeeding(false);
        }
    };

    // Form state for question editing
    const [questionForm, setQuestionForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'easy' as 'easy' | 'medium' | 'hard',
        topic: '',
    });

    // Real-time listener for questions
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
            toast.error("Failed to load questions");
            setLoadingQuestions(false);
        });

        return () => unsubscribe();
    }, [selectedField]);

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
        if (!confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'assessment_questions', questionId));
            toast.success('Question deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete question');
        }
    };

    const handleSaveQuestion = async () => {
        // Validation
        if (!questionForm.question.trim()) {
            toast.error('Question text is required');
            return;
        }

        if (questionForm.options.some((opt) => !opt.trim())) {
            toast.error('All options must be filled');
            return;
        }

        // Check for duplicates
        if (questions.some(q => q.question.toLowerCase() === questionForm.question.toLowerCase() && q.id !== editingQuestion?.id)) {
            toast.error('This question already exists in this field.');
            return;
        }

        try {
            const payload = {
                fieldId: selectedField.toLowerCase().trim(),
                ...questionForm,
                updatedAt: new Date().toISOString()
            };

            if (editingQuestion) {
                await updateDoc(doc(db, 'assessment_questions', editingQuestion.id), payload);
                toast.success('Question updated successfully');
            } else {
                await addDoc(collection(db, 'assessment_questions'), {
                    ...payload,
                    createdAt: new Date().toISOString()
                });
                toast.success('Question added successfully');
            }

            setIsDialogOpen(false);

        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save question');
        }
    };

    const handleUpdateOption = (index: number, value: string) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const fieldStats = fields.map((field) => {
        const fieldQuestions = assessmentQuestions[field.id] || [];
        return {
            fieldId: field.id,
            fieldName: field.name,
            questionCount: fieldQuestions.length,
            enabled: true, // In production, fetch from config
        };
    });

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Assessment Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage assessment questions, configure settings, and view statistics for all fields.
                    </p>
                    <div className="mt-4 flex gap-4">
                        <Button
                            variant="destructive"
                            onClick={handleSeedDatabase}
                            disabled={seeding}
                        >
                            {seeding ? 'Seeding...' : 'Reset & Seed Database (Dev Tool)'}
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Fields
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{fields.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {Object.values(assessmentQuestions).reduce((sum, qs) => sum + qs.length, 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg Questions/Field
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {Math.round(
                                    Object.values(assessmentQuestions).reduce((sum, qs) => sum + qs.length, 0) /
                                    fields.length
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Passing Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{passingScore}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Field Selection and Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Management</CardTitle>
                        <CardDescription>Select a field to view and manage its assessment questions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="field-select">Select Field</Label>
                                <Select value={selectedField} onValueChange={setSelectedField}>
                                    <SelectTrigger id="field-select">
                                        <SelectValue placeholder="Choose a field..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fields.map((field) => (
                                            <SelectItem key={field.id} value={field.id}>
                                                {field.name} ({assessmentQuestions[field.id]?.length || 0} questions)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedField && (
                                <div className="flex items-end gap-2">
                                    <Button onClick={handleAddQuestion} className="gap-2 w-full sm:w-auto">
                                        <Plus className="w-4 h-4" />
                                        Add Question
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Questions Table */}
                        {selectedField && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    {questions.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">#</TableHead>
                                                    <TableHead className="min-w-[200px]">Question</TableHead>
                                                    <TableHead>Difficulty</TableHead>
                                                    <TableHead>Topic</TableHead>
                                                    <TableHead className="w-32">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {questions.map((question, index) => (
                                                    <TableRow key={question.id}>
                                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                                        <TableCell className="max-w-md truncate" title={question.question}>
                                                            {question.question}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    question.difficulty === 'easy'
                                                                        ? 'default'
                                                                        : question.difficulty === 'medium'
                                                                            ? 'secondary'
                                                                            : 'destructive'
                                                                }
                                                            >
                                                                {question.difficulty}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{question.topic || '-'}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditQuestion(question)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-danger" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        !loadingQuestions && (
                                            <div className="text-center py-12">
                                                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                                <p className="text-muted-foreground">No questions found for this field</p>
                                                <Button onClick={handleAddQuestion} className="mt-4 gap-2">
                                                    <Plus className="w-4 h-4" />
                                                    Add First Question
                                                </Button>
                                            </div>
                                        )
                                    )}
                                    {loadingQuestions && (
                                        <div className="p-8 text-center text-muted-foreground">Loading questions...</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Field Overview Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Field Overview</CardTitle>
                        <CardDescription>Question counts and status for all fields</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Field Name</TableHead>
                                            <TableHead className="whitespace-nowrap">Questions</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                            <TableHead className="whitespace-nowrap">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fieldStats.map((stat) => (
                                            <TableRow key={stat.fieldId}>
                                                <TableCell className="font-medium whitespace-nowrap">{stat.fieldName}</TableCell>
                                                <TableCell>
                                                    <Badge variant={stat.questionCount >= 10 ? 'default' : 'secondary'}>
                                                        {stat.questionCount} questions
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {stat.enabled ? (
                                                        <span className="flex items-center gap-1 text-success">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Enabled
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-muted-foreground">
                                                            <XCircle className="w-4 h-4" />
                                                            Disabled
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedField(stat.fieldId)}
                                                    >
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingQuestion
                                    ? 'Update the question details below'
                                    : 'Create a new assessment question for ' + fields.find((f) => f.id === selectedField)?.name}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Question Text */}
                            <div className="space-y-2">
                                <Label htmlFor="question">Question *</Label>
                                <Textarea
                                    id="question"
                                    value={questionForm.question}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                    placeholder="Enter the question..."
                                    rows={3}
                                />
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                <Label>Options *</Label>
                                {questionForm.options.map((option, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            value={option}
                                            onChange={(e) => handleUpdateOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        <Button
                                            variant={questionForm.correctAnswer === index ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setQuestionForm({ ...questionForm, correctAnswer: index })}
                                        >
                                            {questionForm.correctAnswer === index ? 'Correct' : 'Mark Correct'}
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Difficulty and Topic */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select
                                        value={questionForm.difficulty}
                                        onValueChange={(value: any) =>
                                            setQuestionForm({ ...questionForm, difficulty: value })
                                        }
                                    >
                                        <SelectTrigger id="difficulty">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="topic">Topic (Optional)</Label>
                                    <Input
                                        id="topic"
                                        value={questionForm.topic}
                                        onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                                        placeholder="e.g., Fundamentals, Advanced"
                                    />
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="space-y-2">
                                <Label htmlFor="explanation">Explanation (Optional)</Label>
                                <Textarea
                                    id="explanation"
                                    value={questionForm.explanation}
                                    onChange={(e) =>
                                        setQuestionForm({ ...questionForm, explanation: e.target.value })
                                    }
                                    placeholder="Explain why this is the correct answer..."
                                    rows={2}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveQuestion}>
                                {editingQuestion ? 'Update Question' : 'Add Question'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
