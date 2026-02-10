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

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Field Assessment
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        {Math.floor((Date.now() - startTime) / 60000)}:
                        {String(Math.floor(((Date.now() - startTime) % 60000) / 1000)).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{answeredCount} answered</span>
                    <span>{unansweredCount} remaining</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                {/* Question */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {currentQuestionIndex + 1}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground leading-relaxed">
                                {currentQuestion.question}
                            </h3>
                            {currentQuestion.topic && (
                                <span className="inline-block mt-2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                                    {currentQuestion.topic}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <RadioGroup
                    value={selectedOption !== null ? selectedOption.toString() : ""}
                    onValueChange={(value) => handleOptionSelect(parseInt(value))}
                    className="space-y-3"
                >
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className={cn(
                                'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-secondary/50',
                                selectedOption === index
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border'
                            )}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label
                                htmlFor={`option-${index}`}
                                className="flex-1 cursor-pointer text-foreground"
                            >
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                </Button>

                <Button onClick={onCancel} variant="ghost">
                    Cancel Assessment
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    variant={isLastQuestion ? 'hero' : 'default'}
                    className="gap-2"
                >
                    {isLastQuestion ? 'Review & Submit' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-4 space-y-6">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-2">
                                <AlertCircle className="w-8 h-8 text-warning" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Submit Assessment?
                            </h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>You have answered {answeredCount} out of {questions.length} questions.</p>
                                {unansweredCount > 0 && (
                                    <p className="text-warning font-medium">
                                        {unansweredCount} question(s) remain unanswered and will be marked incorrect.
                                    </p>
                                )}
                                <p className="pt-2">
                                    Once submitted, you cannot change your answers.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1"
                            >
                                Review Answers
                            </Button>
                            <Button
                                variant="hero"
                                onClick={handleSubmit}
                                className="flex-1"
                            >
                                Submit Now
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
