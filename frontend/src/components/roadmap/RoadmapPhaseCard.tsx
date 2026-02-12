import { RoadmapPhase } from '@/data/roadmapData';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Code,
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';

interface RoadmapPhaseCardProps {
  phase: RoadmapPhase;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkComplete: () => void;
}

export function RoadmapPhaseCard({
  phase,
  isCompleted,
  isCurrent,
  isLocked,
  isExpanded,
  onToggle,
  onMarkComplete,
}: RoadmapPhaseCardProps) {
  return (
    <div
      className={`relative bg-card rounded-xl border transition-all duration-300 ${isExpanded
        ? 'border-primary shadow-lg'
        : isLocked
          ? 'border-border/50 opacity-60'
          : 'border-border hover:border-primary/50'
        } `}
    >
      <div
        className="w-full"
      >
        <button
          onClick={onToggle}
          disabled={isLocked}
          className="w-full p-4 flex items-center gap-4 text-left disabled:cursor-not-allowed"
        >
          {/* Status Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted
              ? 'bg-success/10'
              : isCurrent
                ? 'bg-primary/10'
                : isLocked
                  ? 'bg-muted/50'
                  : 'bg-muted'
              } `}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground/50" />
            ) : (
              <Circle
                className={`w - 6 h - 6 ${isCurrent ? 'text-primary' : 'text-muted-foreground'
                  } `}
              />
            )}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">{phase.duration}</span>
              {isCurrent && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Current
                </span>
              )}
              {isCompleted && (
                <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                  Completed
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground truncate">{phase.title}</h3>
          </div>

          {/* Expand Icon */}
          {!isLocked && (
            isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
            )
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && !isLocked && (
          <div className="px-4 pb-4 pt-0 border-t border-border mt-2">
            <p className="text-muted-foreground text-sm mt-4 mb-6">{phase.focus}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.skills?.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-success" />
                  <h4 className="font-medium text-foreground">Tools</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.tools?.map(tool => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 bg-success/10 text-success text-sm rounded-lg"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-warning" />
                  <h4 className="font-medium text-foreground">Projects</h4>
                </div>
                <ul className="space-y-1.5">
                  {phase.projects?.map(project => (
                    <li key={project} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-warning rounded-full shrink-0" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">Certifications</h4>
                </div>
                <ul className="space-y-1.5">
                  {phase.certifications?.map(cert => (
                    <li key={cert} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Career Relevance */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium text-foreground">Career Relevance: </span>
                <span className="text-muted-foreground">{phase.careerRelevance}</span>
              </p>
            </div>

            {/* Mark Complete Button */}
            {!isCompleted && isCurrent && (
              <Button
                className="w-full mt-4 gap-2"
                onClick={onMarkComplete}
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Phase as Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
