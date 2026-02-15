import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { logUserActivity } from '@/services/userAnalyticsService';
import {
    AssessmentResult,
    AssessmentAnswer,
    AssessmentQuestion,
} from '@/types/assessment';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessment`;

export function useFieldAssessment(fieldId: string) {
    const { user } = useAuthContext();
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();

    // Optimized: Fetch assessment status using React Query
    const { data: status, isLoading: loading } = useQuery({
        queryKey: ['assessment_status', user?.uid, fieldId],
        queryFn: async () => {
            if (!user || !fieldId) return null;

            try {
                // Try backend first
                try {
                    const token = await user.getIdToken();
                    const response = await fetch(`${API_URL}/status/${fieldId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return {
                            fieldId,
                            hasAttempted: data.hasAttempted,
                            hasPassed: data.hasPassed,
                            score: data.score,
                            lastAttemptDate: data.lastAttemptDate ? new Date(data.lastAttemptDate._seconds * 1000) : undefined,
                            attemptsCount: data.attemptsCount || 0,
                        };
                    }
                } catch (backendError) {
                    // Backend failed, silence and try firestore
                }

                // Fallback: Read directly from Firestore
                try {
                    const docRef = doc(db, 'users', user.uid, 'assessments', fieldId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        return {
                            fieldId,
                            hasAttempted: true,
                            hasPassed: data.status === 'passed',
                            score: data.score,
                            lastAttemptDate: data.attemptDate?.toDate(),
                            attemptsCount: data.attemptsCount || 1,
                        };
                    }
                } catch (firestoreError: unknown) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((firestoreError as any)?.code === 'resource-exhausted') {
                        console.warn('Firestore quota exceeded. Returning default state.');
                        toast.error('System traffic is high. Some features may be limited.');
                        return {
                            fieldId,
                            hasAttempted: false,
                            hasPassed: false,
                            attemptsCount: 0,
                            isQuotaExceeded: true
                        };
                    }
                    throw firestoreError;
                }

                return {
                    fieldId,
                    hasAttempted: false,
                    hasPassed: false,
                    attemptsCount: 0,
                };
            } catch (error) {
                console.error('Error fetching assessment status:', error);
                return {
                    fieldId,
                    hasAttempted: false,
                    hasPassed: false,
                    attemptsCount: 0,
                };
            }
        },
        enabled: !!user && !!fieldId,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        retry: (failureCount, error: unknown) => {
            // Don't retry if quota exceeded
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((error as any)?.code === 'resource-exhausted') return false;
            return failureCount < 2;
        }
    });

    const updateLocalStatus = (result: Partial<AssessmentResult> & { attemptsCount?: number }) => {
        const newStatus = {
            fieldId,
            hasAttempted: true,
            hasPassed: result.status === 'passed',
            score: result.score || 0,
            lastAttemptDate: new Date(),
            attemptsCount: result.attemptsCount || 1,
        };

        // Update React Query Cache immediately
        queryClient.setQueryData(['assessment_status', user?.uid, fieldId], newStatus);

        // Also invalidate other related queries if needed (e.g. dashboard metrics)
        queryClient.invalidateQueries({ queryKey: ['dashboard_metrics'] });
    };

    const showCompletionToast = (result: Partial<AssessmentResult> & { score?: number; status?: string }) => {
        if (result.status === 'passed') {
            toast.success('Congratulations! Assessment Passed', {
                description: `You scored ${result.score}%. All sections are unlocked.`,
            });
        } else {
            toast.info('Assessment Completed', {
                description: `You scored ${result.score}%. You can access materials and retake later.`,
            });
        }
    };

    // Submit assessment
    const submitAssessment = async (
        questions: AssessmentQuestion[],
        answers: AssessmentAnswer[],
        timeSpent: number,
        fieldName: string,
        metadata?: { tabSwitchCount?: number; terminated?: boolean }
    ): Promise<AssessmentResult> => {
        if (!user) throw new Error('User not authenticated');

        setSubmitting(true);

        try {
            // First try backend submission
            try {
                const token = await user.getIdToken();
                const formattedAnswers = answers.map((answer, index) => ({
                    questionId: questions[index].id,
                    selectedOption: answer.selectedOption,
                }));

                const response = await fetch(`${API_URL}/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        fieldId,
                        fieldName,
                        answers: formattedAnswers,
                        timeSpent,
                        metadata // Send metadata to backend
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const result = data.result;
                    updateLocalStatus(result);
                    showCompletionToast(result);

                    // Log activity for real-time analytics
                    await logUserActivity(user.uid, 'ASSESSMENT_COMPLETED', {
                        fieldId,
                        metadata: { score: result.score, fieldName }
                    });

                    return { ...result, attemptsCount: result.attemptsCount || 0 };
                }
            } catch (backendError) {
                // console.warn('Backend submission failed, falling back to client-side evaluation', backendError);
            }

            // Fallback: Client-side evaluation and direct Firestore save
            console.log('Using fallback submission...');

            // If questions passed, use them. If they don't have correctAnswer, fetch them securely now.
            let gradingQuestions = questions;
            const needsFetching = questions.some(q => (q as any).correctAnswer === undefined);

            if (needsFetching) {
                try {
                    const qQuery = await import('firebase/firestore').then(mod => {
                        return mod.query(mod.collection(db, 'assessment_questions'), mod.where('fieldId', '==', fieldId));
                    });
                    const snapshot = await import('firebase/firestore').then(mod => mod.getDocs(qQuery));
                    gradingQuestions = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            correctAnswer: data.correctAnswer !== undefined ? data.correctAnswer : data.correctAnswerIndex
                        } as AssessmentQuestion;
                    });
                } catch (e: unknown) {
                    console.error("Failed to fetch grading key", e);
                }
            }

            let correctCount = 0;
            // Evaluated answers locally
            const evaluatedAnswers = answers.map((ans) => {
                const question = gradingQuestions.find(q => q.id === ans.questionId);
                let isCorrect = false;

                if (question) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const qAny = question as any;
                    if (typeof qAny.correctAnswer === 'number') {
                        const expected = qAny.correctAnswer;
                        isCorrect = ans.selectedOption === expected;
                    }
                }

                if (isCorrect) correctCount++;
                return { ...ans, isCorrect };
            });

            const score = Math.round((correctCount / questions.length) * 100);
            const isPassed = score >= 50;
            const statusStr = isPassed ? 'passed' : 'needs_improvement';

            const resultData = {
                userId: user.uid,
                fieldId,
                fieldName,
                score,
                totalQuestions: questions.length,
                correctAnswers: correctCount,
                status: statusStr,
                answers: evaluatedAnswers,
                timeSpent,
                tabSwitchCount: metadata?.tabSwitchCount || 0,
                terminated: metadata?.terminated || false,
                attemptDate: serverTimestamp(),
                updatedAt: serverTimestamp(),
                attemptsCount: (status?.attemptsCount || 0) + 1
            };

            // Save to Firestore
            try {
                await setDoc(doc(db, 'users', user.uid, 'assessments', fieldId), resultData);
            } catch (firestoreError: unknown) {
                console.warn('Failed to save assessment to Firestore (Quota/Offline):', firestoreError);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((firestoreError as any)?.code === 'resource-exhausted') {
                    // Don't throw, let the user proceed with local result
                } else {
                    // For other errors, maybe still allow local-only flow
                }
            }

            const result: AssessmentResult = {
                userId: resultData.userId,
                fieldId: resultData.fieldId,
                fieldName: resultData.fieldName,
                score: resultData.score,
                totalQuestions: resultData.totalQuestions,
                correctAnswers: resultData.correctAnswers,
                answers: resultData.answers,
                status: resultData.status as 'passed' | 'needs_improvement',
                attemptDate: new Date(),
                timeSpent: resultData.timeSpent,
                questionsWithAnswers: gradingQuestions
            };

            updateLocalStatus(result);
            showCompletionToast(result);

            // Log activity for real-time analytics (silent fail)
            logUserActivity(user.uid, 'ASSESSMENT_COMPLETED', {
                fieldId,
                metadata: { score: resultData.score, fieldName }
            }).catch(() => { });

            return result;
        } catch (error: unknown) {
            console.error('Error submitting assessment:', error);
            // Even on general error, we might want to try and return a basic result if possible, 
            // but for now, we'll just allow the local evaluation result above to be the main path.
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        status,
        loading,
        submitting,
        submitAssessment,
    };
}
