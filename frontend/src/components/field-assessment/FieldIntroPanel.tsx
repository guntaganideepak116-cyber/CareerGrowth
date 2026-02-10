import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BookOpen,
    Target,
    TrendingUp,
    Award,
    Briefcase,
    Play,
    Info
} from 'lucide-react';
import { FieldIntroContent } from '@/types/assessment';

interface FieldIntroPanelProps {
    fieldContent: FieldIntroContent;
    onStartAssessment: () => void;
    hasAttempted?: boolean;
    hasPassed?: boolean;
    lastScore?: number;
}

export function FieldIntroPanel({
    fieldContent,
    onStartAssessment,
    hasAttempted = false,
    hasPassed = false,
    lastScore,
}: FieldIntroPanelProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{
        title: string;
        content: string;
    } | null>(null);

    const openDialog = (title: string, content: string) => {
        setDialogContent({ title, content });
        setDialogOpen(true);
    };

    const infoButtons = [
        {
            title: 'About This Field',
            content: fieldContent.aboutField,
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'What are Specializations?',
            content: fieldContent.whatAreSpecializations,
            icon: Target,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'What are Career Paths?',
            content: fieldContent.whatAreCareerPaths,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Why Certifications Matter?',
            content: fieldContent.whyCertificationsMatter,
            icon: Award,
            color: 'from-amber-500 to-amber-600',
        },
        {
            title: 'Why Projects Matter?',
            content: fieldContent.whyProjectsMatter,
            icon: Briefcase,
            color: 'from-rose-500 to-rose-600',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3 pt-6 sm:pt-0 pl-12 sm:pl-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium">
                    <Info className="w-4 h-4" />
                    Field Introduction
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                    {fieldContent.fieldName}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {fieldContent.shortDescription}
                </p>
            </div>

            {/* Status Badge */}
            {hasAttempted && (
                <div className="flex justify-center">
                    {hasPassed ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-success font-medium">
                            <Award className="w-4 h-4" />
                            Field Ready - Score: {lastScore}%
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-full text-warning font-medium">
                            <Info className="w-4 h-4" />
                            Last Score: {lastScore}% - Retake to improve
                        </div>
                    )}
                </div>
            )}

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {infoButtons.map((button, index) => {
                    const Icon = button.icon;
                    return (
                        <button
                            key={button.title}
                            onClick={() => openDialog(button.title, button.content)}
                            className="group p-5 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 text-left animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${button.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {button.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Click to learn more
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Assessment CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                    <Play className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                    {hasAttempted ? 'Retake Assessment' : 'Start Basic Assessment'}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    {hasAttempted
                        ? 'Improve your score by retaking the assessment. Test your foundational knowledge and unlock full access to all resources.'
                        : 'Test your foundational knowledge with 10 multiple-choice questions. Score 75% or higher to unlock full access to specializations, career paths, and resources.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                    <Button
                        onClick={onStartAssessment}
                        size="lg"
                        variant="hero"
                        className="gap-2 min-w-[200px]"
                    >
                        <Play className="w-5 h-5" />
                        {hasAttempted ? 'Retake Assessment' : 'Start Assessment'}
                    </Button>
                    {hasAttempted && !hasPassed && (
                        <p className="text-sm text-muted-foreground">
                            You can access content now, but passing will unlock advanced features
                        </p>
                    )}
                </div>
            </div>

            {/* Information Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{dialogContent?.title}</DialogTitle>
                        <DialogDescription className="text-base leading-relaxed pt-4">
                            {dialogContent?.content}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end pt-4">
                        <Button onClick={() => setDialogOpen(false)}>Got it</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
