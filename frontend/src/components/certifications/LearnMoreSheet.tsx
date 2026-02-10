import { Certification } from '@/data/certificationsData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Award,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  ListChecks,
  Link as LinkIcon,
  TrendingUp,
} from 'lucide-react';

interface LearnMoreSheetProps {
  certification: Certification;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
}

export function LearnMoreSheet({ certification, open, onOpenChange, onApply }: LearnMoreSheetProps) {
  const acceptanceColors = {
    high: 'text-success bg-success/10',
    medium: 'text-warning bg-warning/10',
    low: 'text-danger bg-danger/10',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">{certification.name}</SheetTitle>
              <SheetDescription className="text-base">{certification.provider}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{certification.timeToComplete}</p>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-medium text-foreground">{certification.cost}</p>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Value Score</p>
                  <p className="font-medium text-foreground">{certification.valueScore}%</p>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${certification.industryAcceptance === 'high' ? 'text-success' : certification.industryAcceptance === 'medium' ? 'text-warning' : 'text-danger'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Acceptance</p>
                  <p className={`font-medium capitalize ${certification.industryAcceptance === 'high' ? 'text-success' : certification.industryAcceptance === 'medium' ? 'text-warning' : 'text-danger'}`}>
                    {certification.industryAcceptance}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Overview
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {certification.overview}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Skills Covered</h4>
              <div className="flex flex-wrap gap-2">
                {certification.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Syllabus */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-primary" />
                Syllabus
              </h4>
              <ul className="space-y-2">
                {certification.syllabus.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Prerequisites
              </h4>
              <ul className="space-y-1">
                {certification.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/50" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Salary Range */}
            <div className="p-4 bg-gradient-to-r from-success/5 to-success/10 rounded-lg border border-success/20">
              <h4 className="text-sm font-semibold text-foreground mb-1">Expected Salary Range</h4>
              <p className="text-sm text-muted-foreground">{certification.salaryRange}</p>
            </div>

            {/* Preparation Resources */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" />
                Preparation Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {certification.preparationResources.map((resource) => (
                  <span key={resource} className="px-3 py-1.5 bg-secondary text-muted-foreground text-sm rounded-lg">
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Link */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => window.open(certification.officialUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Visit Official Website
            </Button>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="pt-4 border-t border-border flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
          <Button onClick={onApply} className="flex-1">
            Apply Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
