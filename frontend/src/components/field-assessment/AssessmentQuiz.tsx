import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';
import { AssessmentQuestion, AssessmentAnswer } from '@/types/assessment';
import { cn } from '@/lib/utils';

interface AssessmentQuizProps {
    questions: AssessmentQuestion[];
    onComplete: (answers: AssessmentAnswer[], timeSpent: number) => void;
    onCancel: () => void;
}

export function AssessmentQuiz({
    questions,
    onComplete,
    onCancel,
}: AssessmentQuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, number>>(new Map());
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [startTime] = useState(Date.now());
    const [showConfirmation, setShowConfirmation] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    // Load saved answer for current question
    useEffect(() => {
        const savedAnswer = answers.get(currentQuestion.id);
        setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
    }, [currentQuestionIndex, currentQuestion.id, answers]);

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedOption(optionIndex);
    };

    const handleNext = () => {
        if (selectedOption !== null) {
            // Save answer
            setAnswers(new Map(answers.set(currentQuestion.id, selectedOption)));

            if (isLastQuestion) {
                setShowConfirmation(true);
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            }
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            // Save current answer before going back
            if (selectedOption !== null) {
                setAnswers(new Map(answers.set(currentQuestion.id, selectedOption)));
            }
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Save last answer
        if (selectedOption !== null) {
            answers.set(currentQuestion.id, selectedOption);
        }

        // Calculate time spent
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        // Convert answers to AssessmentAnswer format
        const assessmentAnswers: AssessmentAnswer[] = questions.map((q) => {
            const selectedAnswer = answers.get(q.id);
            return {
                questionId: q.id,
                selectedOption: selectedAnswer !== undefined ? selectedAnswer : -1,
                isCorrect: selectedAnswer === q.correctAnswer,
            };
        });

        onComplete(assessmentAnswers, timeSpent);
    };

    const answeredCount = answers.size;
    const unansweredCount = questions.length - answeredCount;

    const getQuestionStatus = (index: number) => {
        if (index === currentQuestionIndex) return 'current';
        if (answers.has(questions[index].id)) return 'answered';
        return 'unanswered';
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-fade-in">
            {/* Main Quiz Area */}
            <div className="flex-1 flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Assessment Question {currentQuestionIndex + 1}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Single Select • Basic Level
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-mono font-medium text-foreground">
                                {Math.floor((Date.now() - startTime) / 60000).toString().padStart(2, '0')}:
                                {Math.floor(((Date.now() - startTime) % 60000) / 1000).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (Visual only) */}
                <Progress value={progress} className="h-1" />

                {/* Question Card */}
                <div className="flex-1 bg-card border border-border rounded-xl p-6 sm:p-8 overflow-y-auto shadow-sm">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm mt-1">
                                    {currentQuestionIndex + 1}
                                </span>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                                        {currentQuestion.question}
                                    </h3>
                                    {currentQuestion.topic && (
                                        <div className="mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                {currentQuestion.topic}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pl-12">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    className={cn(
                                        "group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                        selectedOption === index
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                        selectedOption === index
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {selectedOption === index && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-sm sm:text-base",
                                        selectedOption === index ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        {option}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        Quit Exam
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstQuestion}
                            className="w-32"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={selectedOption === null && !answers.has(currentQuestion.id)}
                            className="w-32"
                            variant={isLastQuestion ? "default" : "secondary"}
                        >
                            {isLastQuestion ? 'Submit' : 'Next'}
                            {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question Palette Sidebar */}
            <div className="w-full lg:w-72 bg-card border border-border rounded-xl p-6 h-fit shrink-0 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4 flex items-center justify-between">
                    <span>Question Palette</span>
                    <span className="text-xs font-normal text-muted-foreground">
                        {answeredCount}/{questions.length} answered
                    </span>
                </h3>

                <div className="grid grid-cols-5 gap-2 mb-6">
                    {questions.map((_, idx) => {
                        const status = getQuestionStatus(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    // Save current before jumping
                                    if (selectedOption !== null) {
                                        setAnswers(new Map(answers.set(currentQuestion.id, selectedOption)));
                                    }
                                    setCurrentQuestionIndex(idx);
                                    setSelectedOption(answers.get(questions[idx].id) ?? null);
                                }}
                                className={cn(
                                    "h-10 w-10 text-sm font-medium rounded-lg transition-all",
                                    status === 'current'
                                        ? "ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground"
                                        : status === 'answered'
                                            ? "bg-green-500/20 text-green-700 border border-green-500/50 dark:text-green-400"
                                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                )}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-3 text-xs text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary" />
                        <span>Current Question</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
                        <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-secondary" />
                        <span>Not Visited / Skipped</span>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0">
                    <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full shadow-lg space-y-6">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Submit Assessment?</h3>
                            <p className="text-muted-foreground">
                                You have answered <span className="font-medium text-foreground">{answeredCount}</span> out of <span className="font-medium text-foreground">{questions.length}</span> questions.
                            </p>
                        </div>

                        {unansweredCount > 0 && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>You have {unansweredCount} unanswered questions. Unanswered questions will be marked as incorrect.</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1"
                            >
                                Review
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-1"
                            >
                                Submit Exam
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
