import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useFieldAssessment } from '@/hooks/useFieldAssessment';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface AssessmentGateProps {
    children: ReactNode;
    fieldId: string;
    sectionName: string; // "Specializations", "Career Paths", etc.
}

/**
 * AssessmentGate - Blocks access to field sections until user completes assessment
 * 
 * Access Logic:
 * - No assessment record → Block access, show modal
 * - Assessment exists (pass OR fail) → Grant access
 * - Only blocks if user has never attempted the assessment
 */
export function AssessmentGate({ children, fieldId, sectionName }: AssessmentGateProps) {
    const { user, profile } = useAuthContext();
    const { status, loading } = useFieldAssessment(fieldId);
    const navigate = useNavigate();
    const [showBlockModal, setShowBlockModal] = useState(false);

    useEffect(() => {
        // Wait for loading to complete
        if (loading) return;

        // Check if user has attempted assessment
        if (!status?.hasAttempted) {
            // No attempt - block access
            setShowBlockModal(true);
        } else {
            // Has attempted (pass or fail) - allow access
            setShowBlockModal(false);
        }
    }, [status, loading]);

    const handleTakeAssessment = () => {
        setShowBlockModal(false);
        navigate(`/field-assessment?field=${fieldId}`);
    };

    const handleGoBack = () => {
        setShowBlockModal(false);
        navigate('/fields');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Checking access...</span>
                </div>
            </div>
        );
    }

    // Show block modal if no assessment attempt
    if (showBlockModal) {
        return (
            <>
                {/* Blurred background content */}
                <div className="filter blur-sm pointer-events-none">
                    {children}
                </div>

                {/* Access Denied Modal */}
                <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-warning" />
                                </div>
                            </div>
                            <DialogTitle className="text-center text-xl">
                                Assessment Required
                            </DialogTitle>
                            <DialogDescription className="text-center text-base pt-2">
                                To access <strong>{sectionName}</strong>, you must complete the Basic Assessment for this field.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 my-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground mb-1">Why is this required?</p>
                                    <p>
                                        The assessment helps us understand your current knowledge level and provide personalized recommendations.
                                        You only need to attempt it once to unlock all sections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={handleGoBack}
                                className="w-full sm:w-auto"
                            >
                                Go Back
                            </Button>
                            <Button
                                variant="hero"
                                onClick={handleTakeAssessment}
                                className="w-full sm:w-auto gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Take Assessment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    // Access granted - render children
    return <>{children}</>;
}
