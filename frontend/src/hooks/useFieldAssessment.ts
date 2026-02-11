import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import {
    AssessmentResult,
    AssessmentAnswer,
    AssessmentQuestion,
} from '@/types/assessment';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:5000/api/assessment';

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
                    console.warn('Backend status fetch failed, falling back to Firestore directly', backendError);
                }

                // Fallback: Read directly from Firestore
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
                } else {
                    return {
                        fieldId,
                        hasAttempted: false,
                        hasPassed: false,
                        attemptsCount: 0,
                    };
                }
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
        staleTime: Infinity, // Status doesn't change unless user submits
        gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    });

    const updateLocalStatus = (result: any) => {
        const newStatus = {
            fieldId,
            hasAttempted: true,
            hasPassed: result.status === 'passed',
            score: result.score,
            lastAttemptDate: new Date(),
            attemptsCount: result.attemptsCount || 1,
        };

        // Update React Query Cache immediately
        queryClient.setQueryData(['assessment_status', user?.uid, fieldId], newStatus);

        // Also invalidate other related queries if needed (e.g. dashboard metrics)
        queryClient.invalidateQueries({ queryKey: ['dashboard_metrics'] });
    };

    const showCompletionToast = (result: any) => {
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
                    // Since we are now "backend" logic in fallback, we fetch full questions with answers
                    // Note: We need a secure way, but if using Firestore direct access, we might need a separate query 
                    // or assume the previously fetched questions might be sufficient if I hadn't stripped them.
                    // But I DID strip them in FieldAssessment.tsx.
                    // So we must fetch them again here.
                    const qQuery = await import('firebase/firestore').then(mod => {
                        return mod.query(mod.collection(db, 'assessment_questions'), mod.where('fieldId', '==', fieldId));
                    });
                    const snapshot = await import('firebase/firestore').then(mod => mod.getDocs(qQuery));
                    gradingQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentQuestion));
                } catch (e) {
                    console.error("Failed to fetch grading key", e);
                }
            }

            let correctCount = 0;
            // Evaluated answers locally
            const evaluatedAnswers = answers.map((ans) => {
                const question = gradingQuestions.find(q => q.id === ans.questionId);
                let isCorrect = false;

                if (question && typeof (question as any).correctAnswer === 'number') {
                    const expected = (question as any).correctAnswer;
                    isCorrect = ans.selectedOption === expected;
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
            await setDoc(doc(db, 'users', user.uid, 'assessments', fieldId), resultData);

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
            };

            updateLocalStatus(result);
            showCompletionToast(result);

            return result;
        } catch (error) {
            console.error('Error submitting assessment:', error);
            toast.error('Failed to submit assessment. Please try again.');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // Fetch questions from backend with frontend fallback (already handled in Page, but keeping helper here)
    const fetchQuestions = async (): Promise<AssessmentQuestion[]> => {
        if (!user) throw new Error('User not authenticated');

        try {
            const token = await user.getIdToken();
            const response = await fetch(`${API_URL}/questions/${fieldId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch questions');

            const data = await response.json();
            return data.questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    };

    return {
        status,
        loading,
        submitting,
        submitAssessment,
    };
}
