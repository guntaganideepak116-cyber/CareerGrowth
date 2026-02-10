import { useState } from 'react';
import { Certification } from '@/data/certificationsData';
import { CertificationApplication } from '@/hooks/useCertificationApplications';
import { Button } from '@/components/ui/button';
import { ApplyModal } from './ApplyModal';
import { WhyThisModal } from './WhyThisModal';
import { LearnMoreSheet } from './LearnMoreSheet';
import {
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Star,
  Zap,
  Target,
} from 'lucide-react';

interface CertificationCardProps {
  certification: Certification;
  index: number;
  application?: CertificationApplication;
  aiRecommendation?: {
    type: 'best-for-you' | 'high-roi' | 'skill-gap';
    reason: string;
  };
}

export function CertificationCard({ certification, index, application, aiRecommendation }: CertificationCardProps) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  const decisionColors = {
    'do-now': 'bg-success text-success-foreground',
    'do-later': 'bg-warning text-warning-foreground',
    'skip': 'bg-muted text-muted-foreground',
  };

  const decisionLabels = {
    'do-now': 'Do Now',
    'do-later': 'Do Later',
    'skip': 'Skip',
  };

  const acceptanceColors = {
    high: 'text-success',
    medium: 'text-warning',
    low: 'text-danger',
  };

  const statusColors = {
    applied: 'bg-primary/20 text-primary',
    'in_progress': 'bg-warning/20 text-warning',
    completed: 'bg-success/20 text-success',
  };

  const statusLabels = {
    applied: 'Applied',
    'in_progress': 'In Progress',
    completed: 'Completed',
  };

  const recommendationIcons = {
    'best-for-you': Star,
    'high-roi': Zap,
    'skill-gap': Target,
  };

  const recommendationColors = {
    'best-for-you': 'bg-primary/10 text-primary border-primary/20',
    'high-roi': 'bg-success/10 text-success border-success/20',
    'skill-gap': 'bg-warning/10 text-warning border-warning/20',
  };

  const recommendationLabels = {
    'best-for-you': 'Best for You',
    'high-roi': 'High ROI',
    'skill-gap': 'Skill Gap Match',
  };

  const RecommendationIcon = aiRecommendation ? recommendationIcons[aiRecommendation.type] : null;

  return (
    <>
      <div
        className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* AI Recommendation Badge */}
        {aiRecommendation && RecommendationIcon && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border mb-4 ${recommendationColors[aiRecommendation.type]}`}>
            <RecommendationIcon className="w-3.5 h-3.5" />
            {recommendationLabels[aiRecommendation.type]}
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Cert Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-semibold text-foreground">{certification.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${decisionColors[certification.aiDecision]}`}>
                    {decisionLabels[certification.aiDecision]}
                  </span>
                  {application && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                      {statusLabels[application.status]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{certification.provider}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {certification.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-auto">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="font-semibold text-foreground">{certification.valueScore}%</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${acceptanceColors[certification.industryAcceptance]}`} />
              <p className="text-xs text-muted-foreground">Acceptance</p>
              <p className={`font-semibold capitalize ${acceptanceColors[certification.industryAcceptance]}`}>
                {certification.industryAcceptance}
              </p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Clock className="w-5 h-5 text-warning mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-semibold text-foreground text-sm">{certification.timeToComplete}</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="font-semibold text-foreground">{certification.cost}</p>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
              <p className="text-sm text-muted-foreground">{certification.aiReason}</p>
            </div>
          </div>
        </div>

        {/* Deadline Alert */}
        {certification.deadline && (
          <div className="mt-3 flex items-center gap-2 text-sm text-warning">
            <Calendar className="w-4 h-4" />
            Registration deadline: {certification.deadline}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setWhyOpen(true)}
          >
            <HelpCircle className="w-4 h-4" />
            Why this certification?
          </Button>
          <div className="flex gap-3 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setLearnMoreOpen(true)}
            >
              <ExternalLink className="w-4 h-4" />
              Learn More
            </Button>
            {certification.aiDecision !== 'skip' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setApplyOpen(true)}
                disabled={!!application}
              >
                {application ? statusLabels[application.status] : 'Apply'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApplyModal
        certification={certification}
        open={applyOpen}
        onOpenChange={setApplyOpen}
      />
      <WhyThisModal
        certification={certification}
        open={whyOpen}
        onOpenChange={setWhyOpen}
      />
      <LearnMoreSheet
        certification={certification}
        open={learnMoreOpen}
        onOpenChange={setLearnMoreOpen}
        onApply={() => {
          setLearnMoreOpen(false);
          setApplyOpen(true);
        }}
      />
    </>
  );
}
