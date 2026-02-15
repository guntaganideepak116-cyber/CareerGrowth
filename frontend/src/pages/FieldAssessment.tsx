import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
    const queryField = searchParams.get('field');
    const fieldId = queryField || profile?.branch || profile?.field || '';

    // If generic engineering is passed but branch is available, use branch
    const effectiveFieldId = (fieldId === 'engineering' && profile?.branch) ? profile.branch : fieldId;

    const [stage, setStage] = useState<AssessmentStage>('intro');
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const { status, loading: statusLoading, submitAssessment } = useFieldAssessment(effectiveFieldId);

    const field = getFieldById(fieldId); // Keep original for UI content
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

    // Optimized: Fetch questions using React Query
    const { data: fetchedQuestions = [] } = useQuery({
        queryKey: ['assessment_questions', effectiveFieldId],
        queryFn: async () => {
            if (!effectiveFieldId) return [];
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            try {
                // Try backend first
                const token = await user?.getIdToken();
                const res = await fetch(`${apiBase}/api/assessment/questions/${effectiveFieldId}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (res.ok) {
                    const data = await res.json();
                    return data.questions || [];
                }
            } catch (err) {
                console.warn('Backend questions fetch failed, falling back to Firestore');
            }

            // Fallback to Firestore getDocs (not listener)
            try {
                const q = query(
                    collection(db, 'assessment_questions'),
                    where('fieldId', '==', effectiveFieldId.toLowerCase().trim())
                );
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Security: Do not expose correctAnswer to frontend (Grading fetched separately)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { correctAnswer, ...rest } = data;
                    return {
                        id: doc.id,
                        ...rest
                    } as AssessmentQuestion;
                });
            } catch (firestoreError: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((firestoreError as any)?.code === 'resource-exhausted') {
                    console.warn('Firestore quota exceeded for questions. Returning empty list.');
                    toast.error('System is busy. Assessment questions currently unavailable.');
                    return [];
                }
                throw firestoreError;
            }
        },
        enabled: !!fieldId,
        staleTime: Infinity, // Questions don't change often
        retry: (failureCount, error: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((error as any)?.code === 'resource-exhausted') return false;
            return failureCount < 2;
        }
    });

    useEffect(() => {
        if (fetchedQuestions.length > 0) {
            setQuestions(fetchedQuestions);
        }
    }, [fetchedQuestions]);

    // Start quiz
    const handleStartAssessment = async () => {
        if (questions.length === 0) {
            toast.error('No questions available for this field yet.');
            return;
        }
        setStage('quiz');
    };

    // Handle quiz completion
    const handleQuizComplete = async (answers: AssessmentAnswer[], timeSpent: number, metadata?: Record<string, unknown>) => {
        if (!field || !fieldContent) return;

        try {
            const assessmentResult = await submitAssessment(
                questions,
                answers,
                timeSpent,
                fieldContent.fieldName,
                metadata as { tabSwitchCount?: number; terminated?: boolean }
            );

            // If result contains the full questions with answers (from fallback grading), use them to show correct answers
            if (assessmentResult.questionsWithAnswers) {
                setQuestions(assessmentResult.questionsWithAnswers);
            }

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
        if (field?.hasBranches && !profile?.branch) {
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
