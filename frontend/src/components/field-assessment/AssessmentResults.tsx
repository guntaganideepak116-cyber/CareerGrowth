import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Award,
    TrendingUp,
    CheckCircle2,
    XCircle,
    ArrowRight,
    BookOpen,
    Target,
    AlertCircle,
} from 'lucide-react';
import { AssessmentResult, AssessmentQuestion } from '@/types/assessment';
import { cn } from '@/lib/utils';

interface AssessmentResultsProps {
    result: AssessmentResult;
    questions: AssessmentQuestion[];
    onContinue: () => void;
    onRetake: () => void;
}

export function AssessmentResults({
    result,
    questions,
    onContinue,
    onRetake,
}: AssessmentResultsProps) {
    const passed = result.score >= 50; // Changed from 75% to 50%
    const scorePercentage = result.score;

    // Get performance level
    const getPerformanceLevel = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-success' };
        if (score >= 50) return { label: 'Good', color: 'text-success' };
        if (score >= 30) return { label: 'Fair', color: 'text-warning' };
        return { label: 'Needs Improvement', color: 'text-danger' };
    };

    const performance = getPerformanceLevel(scorePercentage);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4 pt-6 sm:pt-0 pl-12 sm:pl-0">
                <div
                    className={cn(
                        'inline-flex items-center justify-center w-20 h-20 rounded-full mb-2',
                        passed ? 'bg-success/10' : 'bg-warning/10'
                    )}
                >
                    {passed ? (
                        <Award className="w-10 h-10 text-success" />
                    ) : (
                        <AlertCircle className="w-10 h-10 text-warning" />
                    )}
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                    {passed ? 'Congratulations!' : 'Assessment Complete'}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {passed
                        ? 'You have successfully passed the field assessment and are ready to explore specializations and career paths!'
                        : 'You have completed the assessment. Review your results below and consider retaking to improve your score.'}
                </p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score */}
                    <div className="text-center">
                        <div className="text-5xl font-bold text-primary mb-2">
                            {scorePercentage}%
                        </div>
                        <div className={cn('text-lg font-semibold mb-1', performance.color)}>
                            {performance.label}
                        </div>
                        <p className="text-sm text-muted-foreground">Your Score</p>
                    </div>

                    {/* Correct Answers */}
                    <div className="text-center">
                        <div className="text-5xl font-bold text-success mb-2">
                            {result.correctAnswers}
                        </div>
                        <div className="text-lg font-semibold mb-1">Correct</div>
                        <p className="text-sm text-muted-foreground">
                            Out of {result.totalQuestions} questions
                        </p>
                    </div>

                    {/* Time Spent */}
                    <div className="text-center">
                        <div className="text-5xl font-bold text-foreground mb-2">
                            {result.timeSpent ? Math.floor(result.timeSpent / 60) : 0}
                        </div>
                        <div className="text-lg font-semibold mb-1">Minutes</div>
                        <p className="text-sm text-muted-foreground">Time Spent</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                    <Progress value={scorePercentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Passing Score: 50%</span>
                        <span>Your Score: {scorePercentage}%</span>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            {passed ? (
                <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-success" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-success mb-2">
                                Field Ready Badge Unlocked!
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                You have demonstrated foundational knowledge in {result.fieldName}. You now have full access to:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    All specializations and detailed career paths
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    Comprehensive roadmaps and learning resources
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    Project recommendations and certification guides
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    Advanced AI mentor features
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-warning" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-warning mb-2">
                                Recommendations for Improvement
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                You can still access all content, but we recommend strengthening your foundational knowledge:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-warning" />
                                    Start with beginner-level roadmaps and tutorials
                                </li>
                                <li className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-warning" />
                                    Focus on fundamental concepts before advanced topics
                                </li>
                                <li className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-warning" />
                                    Retake the assessment after studying to unlock full features
                                </li>
                                <li className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-warning" />
                                    Use the AI mentor for personalized guidance
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Review */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Question Review</h2>
                <div className="space-y-3">
                    {questions.map((question, index) => {
                        const answer = result.answers[index];
                        const isCorrect = answer?.isCorrect;

                        return (
                            <div
                                key={question.id}
                                className={cn(
                                    'p-4 rounded-lg border-2',
                                    isCorrect
                                        ? 'bg-success/5 border-success/20'
                                        : 'bg-danger/5 border-danger/20'
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {isCorrect ? (
                                            <CheckCircle2 className="w-5 h-5 text-success" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-danger" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="font-medium text-foreground">
                                            {index + 1}. {question.question}
                                        </p>
                                        {!isCorrect && (
                                            <div className="text-sm space-y-1">
                                                <p className="text-danger">
                                                    Your answer: {question.options[answer?.selectedOption || 0]}
                                                </p>
                                                <p className="text-success">
                                                    Correct answer: {question.options[question.correctAnswer]}
                                                </p>
                                                {question.explanation && (
                                                    <p className="text-muted-foreground italic">
                                                        {question.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {!passed && (
                    <Button
                        onClick={onRetake}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Retake Assessment
                    </Button>
                )}
                <Button
                    onClick={onContinue}
                    variant="hero"
                    size="lg"
                    className="gap-2"
                >
                    Continue to {passed ? 'Specializations' : 'Content'}
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
