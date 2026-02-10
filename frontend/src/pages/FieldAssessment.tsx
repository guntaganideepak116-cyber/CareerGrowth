import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { FieldIntroPanel } from '@/components/field-assessment/FieldIntroPanel';
import { AssessmentQuiz } from '@/components/field-assessment/AssessmentQuiz';
import { AssessmentResults } from '@/components/field-assessment/AssessmentResults';
import { useFieldAssessment } from '@/hooks/useFieldAssessment';
import { fieldIntroductions } from '@/data/fieldIntroductions';
import { getFieldById } from '@/data/fieldsData';
import { getAssessmentQuestions } from '@/data/assessmentQuestions';
import { AssessmentAnswer, AssessmentResult, AssessmentQuestion } from '@/types/assessment';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';



type AssessmentStage = 'intro' | 'quiz' | 'results';

export default function FieldAssessment() {
    const { user, profile, loading: authLoading } = useAuthContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fieldId = searchParams.get('field') || profile?.field || '';

    const [stage, setStage] = useState<AssessmentStage>('intro');
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const { status, loading: statusLoading, submitAssessment, fetchQuestions } = useFieldAssessment(fieldId);

    const field = getFieldById(fieldId);
    const fieldContent = fieldIntroductions[fieldId];

    // Redirect if not authenticated or no field selected
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        if (!authLoading && !fieldId) {
            navigate('/fields');
            return;
        }
    }, [authLoading, user, fieldId, navigate]);

    // Real-time questions listener
    useEffect(() => {
        if (!fieldId) return;

        console.log(`[FieldAssessment] Listening for questions for field: ${fieldId}`);
        const q = query(
            collection(db, 'assessment_questions'),
            where('fieldId', '==', fieldId.toLowerCase().trim())
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQuestions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AssessmentQuestion[];

            console.log(`[FieldAssessment] Loaded ${fetchedQuestions.length} questions`);
            setQuestions(fetchedQuestions);
        }, (error) => {
            console.error('Error fetching questions:', error);
            // Don't show toast here to avoid spamming if permission denied initially
        });

        return () => unsubscribe();
    }, [fieldId]);

    // Start quiz
    const handleStartAssessment = async () => {
        if (questions.length === 0) {
            toast.error('No questions available for this field yet.');
            return;
        }
        setStage('quiz');
    };

    // Handle quiz completion
    const handleQuizComplete = async (answers: AssessmentAnswer[], timeSpent: number) => {
        if (!field || !fieldContent) return;

        try {
            const assessmentResult = await submitAssessment(
                questions,
                answers,
                timeSpent,
                fieldContent.fieldName
            );
            setResult(assessmentResult);
            setStage('results');
        } catch (error) {
            console.error('Error submitting assessment:', error);
        }
    };

    // Handle quiz cancellation
    const handleQuizCancel = () => {
        setStage('intro');
        setQuestions([]);
    };

    // Handle continue after results
    const handleContinue = () => {
        // Navigate to specializations or next step
        if (field?.hasBranches) {
            navigate('/branches');
        } else {
            navigate('/specializations');
        }
    };

    // Handle retake
    const handleRetake = () => {
        setResult(null);
        setStage('intro');
    };

    if (authLoading || statusLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-muted-foreground">Loading assessment...</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!field || !fieldContent) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">Field not found</p>
                        <button
                            onClick={() => navigate('/fields')}
                            className="text-primary hover:underline"
                        >
                            Select a field
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto py-8 px-4">
                {stage === 'intro' && (
                    <FieldIntroPanel
                        fieldContent={fieldContent}
                        onStartAssessment={handleStartAssessment}
                        hasAttempted={status?.hasAttempted}
                        hasPassed={status?.hasPassed}
                        lastScore={status?.score}
                    />
                )}

                {stage === 'quiz' && (
                    <AssessmentQuiz
                        questions={questions}
                        onComplete={handleQuizComplete}
                        onCancel={handleQuizCancel}
                    />
                )}

                {stage === 'results' && result && (
                    <AssessmentResults
                        result={result}
                        questions={questions}
                        onContinue={handleContinue}
                        onRetake={handleRetake}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
