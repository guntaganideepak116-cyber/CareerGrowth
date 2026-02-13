import express from 'express';
import { verifyToken } from '../middleware/adminMiddleware';
import admin from 'firebase-admin';
import { createNotification } from '../services/notificationService';

const router = express.Router();
const db = admin.firestore();

/**
 * GET /api/assessment/questions/:fieldId
 * Fetch assessment questions for a specific field with balanced difficulty distribution
 * Distribution: 40% easy, 40% medium, 20% hard
 */
router.get('/questions/:fieldId', verifyToken, async (req, res) => {
    try {
        const { fieldId } = req.params;
        const userId = (req as any).user.uid;

        console.log(`[Assessment] Fetching questions for field: ${fieldId}, user: ${userId}`);

        // Fetch ALL questions for the field (up to 100)
        const questionsRef = db.collection('assessment_questions')
            .where('fieldId', '==', fieldId.toLowerCase().trim())
            .limit(100);

        const snapshot = await questionsRef.get();

        if (snapshot.empty) {
            return res.json({
                fieldId,
                questions: [],
                totalQuestions: 0,
                message: `Assessment not yet configured for this field.`
            });
        }

        // Group questions by difficulty
        const questionsByDifficulty: { easy: any[], medium: any[], hard: any[] } = {
            easy: [],
            medium: [],
            hard: []
        };

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const difficulty = (data.difficulty || 'medium').toLowerCase();
            const question = {
                id: doc.id,
                question: data.question,
                options: data.options,
                difficulty: data.difficulty || 'medium',
                topic: data.topic || 'General'
                // DO NOT send correctAnswerIndex to frontend
            };

            if (difficulty === 'easy') questionsByDifficulty.easy.push(question);
            else if (difficulty === 'hard') questionsByDifficulty.hard.push(question);
            else questionsByDifficulty.medium.push(question);
        });

        // Shuffle helper function
        const shuffle = (array: any[]) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        // Select questions with 40/40/20 distribution (total 10 questions)
        const selectedQuestions: any[] = [];

        // Get 4 easy (40%)
        const shuffledEasy = shuffle(questionsByDifficulty.easy);
        selectedQuestions.push(...shuffledEasy.slice(0, 4));

        // Get 4 medium (40%)
        const shuffledMedium = shuffle(questionsByDifficulty.medium);
        selectedQuestions.push(...shuffledMedium.slice(0, 4));

        // Get 2 hard (20%)
        const shuffledHard = shuffle(questionsByDifficulty.hard);
        selectedQuestions.push(...shuffledHard.slice(0, 2));

        // If we don't have enough questions in a category, fill from others
        const needed = 10 - selectedQuestions.length;
        if (needed > 0) {
            const allRemaining = [
                ...shuffledEasy.slice(4),
                ...shuffledMedium.slice(4),
                ...shuffledHard.slice(2)
            ];
            selectedQuestions.push(...shuffle(allRemaining).slice(0, needed));
        }

        // Final shuffle to mix difficulty levels
        const finalQuestions = shuffle(selectedQuestions).slice(0, 10);

        console.log(`[Assessment] Returning ${finalQuestions.length} questions for ${fieldId} (Easy: ${questionsByDifficulty.easy.length}, Medium: ${questionsByDifficulty.medium.length}, Hard: ${questionsByDifficulty.hard.length})`);

        res.json({
            fieldId,
            questions: finalQuestions,
            totalQuestions: finalQuestions.length,
            distribution: {
                easy: Math.min(4, questionsByDifficulty.easy.length),
                medium: Math.min(4, questionsByDifficulty.medium.length),
                hard: Math.min(2, questionsByDifficulty.hard.length)
            }
        });

    } catch (error) {
        console.error('[Assessment] Error fetching questions:', error);
        res.status(500).json({
            error: 'Failed to fetch questions',
            message: (error as Error).message
        });
    }
});

/**
 * POST /api/assessment/questions
 * Create a new assessment question (Admin only)
 */
router.post('/questions', verifyToken, async (req, res) => {
    try {
        const { fieldId, question, options, correctAnswerIndex, correctAnswer, difficulty, topic, explanation } = req.body;
        const userId = (req as any).user.uid;

        // Verify Admin Role
        const userDoc = await db.collection('user_profiles').doc(userId).get();
        if (userDoc.data()?.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized', message: 'Admin access required' });
        }

        // Use either field
        const finalCorrectAnswer = correctAnswer !== undefined ? correctAnswer : correctAnswerIndex;

        if (!fieldId || !question || !options || finalCorrectAnswer === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Normalize fieldId
        const normalizedFieldId = fieldId.trim().toLowerCase();

        const newQuestion = {
            fieldId: normalizedFieldId,
            question,
            options,
            correctAnswerIndex: finalCorrectAnswer,
            difficulty: difficulty || 'medium',
            topic: topic || '',
            explanation: explanation || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: userId
        };

        const docRef = await db.collection('assessment_questions').add(newQuestion);

        res.json({
            success: true,
            id: docRef.id,
            message: 'Question added successfully'
        });

    } catch (error) {
        console.error('[Assessment] Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

/**
 * DELETE /api/assessment/questions/:id
 * Delete an assessment question (Admin only)
 */
router.delete('/questions/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.uid;

        // Verify Admin Role
        const userDoc = await db.collection('user_profiles').doc(userId).get();
        if (userDoc.data()?.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized', message: 'Admin access required' });
        }

        await db.collection('assessment_questions').doc(id).delete();

        res.json({ success: true, message: 'Question deleted successfully' });

    } catch (error) {
        console.error('[Assessment] Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

/**
 * POST /api/assessment/submit
 * Submit assessment answers and calculate score
 */
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { fieldId, fieldName, answers, timeSpent } = req.body;
        const userId = (req as any).user.uid;

        console.log(`[Assessment] Submitting assessment for user: ${userId}, field: ${fieldId}`);

        // Validate input
        if (!fieldId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'fieldId and answers array are required'
            });
        }

        // Fetch correct answers from database
        const questionIds = answers.map((a: any) => a.questionId);
        const questionsSnapshot = await db.collection('assessment_questions')
            .where(admin.firestore.FieldPath.documentId(), 'in', questionIds)
            .get();

        if (questionsSnapshot.empty) {
            return res.status(404).json({
                error: 'Questions not found',
                message: 'Could not find assessment questions'
            });
        }

        // Build correct answers map and full questions list for review
        const correctAnswersMap: Record<string, number> = {};
        const questionsDataMap: Record<string, any> = {};

        questionsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const correctAnswer = data.correctAnswerIndex !== undefined ? data.correctAnswerIndex : data.correctAnswer;
            correctAnswersMap[doc.id] = correctAnswer;

            questionsDataMap[doc.id] = {
                id: doc.id,
                question: data.question,
                options: data.options,
                correctAnswer: correctAnswer,
                explanation: data.explanation || '',
                difficulty: data.difficulty || 'medium',
                topic: data.topic || ''
            };
        });

        // Maintain order based on user's answers (which matches original questions)
        const fullQuestionsWithAnswers = questionIds.map(id => questionsDataMap[id]);

        // Calculate score
        let correctCount = 0;
        const evaluatedAnswers = answers.map((answer: any) => {
            const isCorrect = answer.selectedOption === correctAnswersMap[answer.questionId];
            if (isCorrect) correctCount++;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect
            };
        });

        const totalQuestions = answers.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const status = percentage >= 50 ? 'passed' : 'needs_improvement';

        // Check if user has previous attempts
        const assessmentRef = db.collection('users')
            .doc(userId)
            .collection('assessments')
            .doc(fieldId);

        const existingDoc = await assessmentRef.get();
        const existingData = existingDoc.data();
        const attemptsCount = existingDoc.exists && existingData
            ? (existingData.attemptsCount || 0) + 1
            : 1;

        // Save assessment result
        const assessmentData = {
            userId,
            fieldId,
            fieldName: fieldName || fieldId,
            score: percentage,
            totalQuestions,
            correctAnswers: correctCount,
            status,
            answers: evaluatedAnswers,
            timeSpent: timeSpent || 0,
            attemptDate: admin.firestore.FieldValue.serverTimestamp(),
            attemptsCount,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await assessmentRef.set(assessmentData, { merge: true });

        console.log(`[Assessment] Saved result - User: ${userId}, Field: ${fieldId}, Score: ${percentage}%, Status: ${status}`);

        // TRIGGER NOTIFICATION
        await createNotification(
            userId,
            `Assessment Completed: ${fieldName || fieldId}`,
            `You scored ${percentage}% in your recent assessment. Status: ${status === 'passed' ? 'Passed' : 'Needs Improvement'}.`,
            'assessment',
            `/dashboard`
        );

        // Return result to frontend
        res.json({
            success: true,
            result: {
                userId,
                fieldId,
                fieldName: fieldName || fieldId,
                score: percentage,
                totalQuestions,
                correctAnswers: correctCount,
                status,
                answers: evaluatedAnswers,
                timeSpent: timeSpent || 0,
                attemptDate: new Date(),
                attemptsCount,
                questionsWithAnswers: fullQuestionsWithAnswers
            },
            message: status === 'passed'
                ? 'Congratulations! You passed the assessment!'
                : 'Assessment completed. You can retake to improve your score.'
        });

    } catch (error) {
        console.error('[Assessment] Error submitting assessment:', error);
        res.status(500).json({
            error: 'Failed to submit assessment',
            message: (error as Error).message
        });
    }
});

/**
 * GET /api/assessment/status/:fieldId
 * Check if user has attempted assessment for a field
 */
router.get('/status/:fieldId', verifyToken, async (req, res) => {
    try {
        const { fieldId } = req.params;
        const userId = (req as any).user.uid;

        console.log(`[Assessment] Checking status for user: ${userId}, field: ${fieldId}`);

        const assessmentRef = db.collection('users')
            .doc(userId)
            .collection('assessments')
            .doc(fieldId);

        const doc = await assessmentRef.get();

        if (!doc.exists) {
            return res.json({
                hasAttempted: false,
                hasPassed: false,
                fieldId,
                attemptsCount: 0
            });
        }

        const data = doc.data() || {};

        res.json({
            hasAttempted: true,
            hasPassed: data.status === 'passed',
            score: data.score,
            status: data.status,
            fieldId,
            lastAttemptDate: data.attemptDate,
            attemptsCount: data.attemptsCount || 1
        });

    } catch (error) {
        console.error('[Assessment] Error checking status:', error);
        res.status(500).json({
            error: 'Failed to check assessment status',
            message: (error as Error).message
        });
    }
});

export default router;
