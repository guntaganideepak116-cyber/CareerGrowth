import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCertificationApplications } from '@/hooks/useCertificationApplications';
import { Certification } from '@/data/certificationsData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Award, User, Mail, Briefcase, Loader2 } from 'lucide-react';

interface ApplyModalProps {
  certification: Certification;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyModal({ certification, open, onOpenChange }: ApplyModalProps) {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const { applyForCertification, getApplicationStatus } = useCertificationApplications();
  const [isApplying, setIsApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  const existingApplication = getApplicationStatus(certification.id);

  const handleApply = async () => {
    if (!user) {
      toast.info('Please login to apply for certifications');
      onOpenChange(false);
      navigate('/login');
      return;
    }

    setIsApplying(true);
    try {
      await applyForCertification(
        certification.id,
        certification.name,
        certification.provider
      );
      setSuccess(true);
      toast.success('Successfully applied for certification!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onOpenChange(false);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <DialogTitle className="text-xl mb-2">Application Successful!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You have successfully applied for <span className="font-medium text-foreground">{certification.name}</span>.
              We'll notify you about next steps.
            </DialogDescription>
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg w-full">
              <p className="text-sm text-muted-foreground mb-2">Application Status</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Applied
              </span>
            </div>
            <Button onClick={handleClose} className="mt-6 w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (existingApplication) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Already Applied</DialogTitle>
            <DialogDescription>
              You have already applied for this certification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
              <Award className="w-10 h-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{certification.name}</p>
                <p className="text-sm text-muted-foreground">{certification.provider}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                existingApplication.status === 'completed' 
                  ? 'bg-success/20 text-success'
                  : existingApplication.status === 'in_progress'
                  ? 'bg-warning/20 text-warning'
                  : 'bg-primary/20 text-primary'
              }`}>
                {existingApplication.status === 'completed' ? 'Completed' : 
                 existingApplication.status === 'in_progress' ? 'In Progress' : 'Applied'}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for Certification</DialogTitle>
          <DialogDescription>
            Register your interest and track your progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Certification Info */}
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{certification.name}</p>
              <p className="text-sm text-muted-foreground">{certification.provider}</p>
            </div>
          </div>

          {/* User Details */}
          {user && profile ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Your Details</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{profile.full_name || 'Name not set'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{profile.email || user.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {profile.field || 'Field not selected'} 
                    {profile.specialization && ` • ${profile.specialization}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning">
                Please login to apply for certifications. Your progress will be saved to your profile.
              </p>
            </div>
          )}

          {/* Key Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium text-foreground text-sm">{certification.timeToComplete}</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="font-medium text-foreground text-sm">{certification.cost}</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="font-medium text-foreground text-sm">{certification.valueScore}%</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying}>
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              'Confirm Application'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
