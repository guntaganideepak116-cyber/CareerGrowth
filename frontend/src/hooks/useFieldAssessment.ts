import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import {
    AssessmentResult,
    FieldAssessmentStatus,
    AssessmentAnswer,
    AssessmentQuestion,
} from '@/types/assessment';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const API_URL = 'http://localhost:5000/api/assessment';

export function useFieldAssessment(fieldId: string) {
    const { user } = useAuthContext();
    const [status, setStatus] = useState<FieldAssessmentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch assessment status
    useEffect(() => {
        if (!user || !fieldId) {
            setLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                setLoading(true);
                // Try backend first
                try {
                    const token = await user.getIdToken();
                    const response = await fetch(`${API_URL}/status/${fieldId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStatus({
                            fieldId,
                            hasAttempted: data.hasAttempted,
                            hasPassed: data.hasPassed,
                            score: data.score,
                            lastAttemptDate: data.lastAttemptDate ? new Date(data.lastAttemptDate._seconds * 1000) : undefined,
                            attemptsCount: data.attemptsCount || 0,
                        });
                        return; // Success, exit
                    }
                } catch (backendError) {
                    console.warn('Backend status fetch failed, falling back to Firestore directly', backendError);
                }

                // Fallback: Read directly from Firestore
                const docRef = doc(db, 'users', user.uid, 'assessments', fieldId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStatus({
                        fieldId,
                        hasAttempted: true,
                        hasPassed: data.status === 'passed',
                        score: data.score,
                        lastAttemptDate: data.attemptDate?.toDate(),
                        attemptsCount: data.attemptsCount || 1,
                    });
                } else {
                    setStatus({
                        fieldId,
                        hasAttempted: false,
                        hasPassed: false,
                        attemptsCount: 0,
                    });
                }
            } catch (error) {
                console.error('Error fetching assessment status:', error);
                setStatus({
                    fieldId,
                    hasAttempted: false,
                    hasPassed: false,
                    attemptsCount: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [user, fieldId]);

    const updateLocalStatus = (result: any) => {
        setStatus({
            fieldId,
            hasAttempted: true,
            hasPassed: result.status === 'passed',
            score: result.score,
            lastAttemptDate: new Date(),
            attemptsCount: result.attemptsCount || 1,
        });
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
        fieldName: string
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
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const result = data.result;
                    updateLocalStatus(result);
                    showCompletionToast(result);
                    return {
                        userId: result.userId,
                        fieldId: result.fieldId,
                        fieldName: result.fieldName,
                        score: result.score,
                        totalQuestions: result.totalQuestions,
                        correctAnswers: result.correctAnswers,
                        answers: result.answers,
                        status: result.status,
                        attemptDate: new Date(result.attemptDate),
                        timeSpent: result.timeSpent,
                    };
                }
            } catch (backendError) {
                // console.warn('Backend submission failed, falling back to client-side evaluation', backendError);
            }

            // Fallback: Client-side evaluation and direct Firestore save
            console.log('Using fallback submission...');

            let correctCount = 0;
            // Evaluated answers locally
            const evaluatedAnswers = answers.map((ans) => {
                const question = questions.find(q => q.id === ans.questionId);
                let isCorrect = ans.isCorrect;

                // If question has correctAnswer property (frontend fallback), use it to verify
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
        fetchQuestions,
    };
}
