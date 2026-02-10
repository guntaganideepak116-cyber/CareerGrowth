import { useState, memo } from 'react';
import { RoadmapPhase } from '@/data/roadmapData';
import { Button } from '@/components/ui/button';
import { SkillModal } from '@/components/common/SkillModal';
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
  Info,
  Target,
} from 'lucide-react';
import { SemesterModal } from '@/components/common/SemesterModal';
import { ExpandableInfoSection } from '@/components/common/ExpandableInfoSection';

interface RoadmapPhaseCardProps {
  phase: RoadmapPhase;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkComplete: () => void;
}

export const RoadmapPhaseCard = memo(({
  phase,
  isCompleted,
  isCurrent,
  isLocked,
  isExpanded,
  onToggle,
  onMarkComplete,
}: RoadmapPhaseCardProps) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [activeCardSection, setActiveCardSection] = useState<string | null>(null);

  const toggleCardSection = (section: string) => {
    setActiveCardSection(activeCardSection === section ? null : section);
  };

  return (
    <>
      <div
        className={`relative bg-card rounded-xl border transition-all duration-300 ${isExpanded
          ? 'border-primary shadow-lg scale-[1.01]'
          : isLocked
            ? 'border-border/50 opacity-60'
            : 'border-border hover:border-primary/50'
          }`}
      >
        {/* Header */}
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
              }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground/50" />
            ) : (
              <Circle
                className={`w-6 h-6 ${isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}
              />
            )}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
              <span className="text-muted-foreground uppercase font-bold tracking-wider">{phase.duration}</span>
              {isCurrent && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full">
                  CURRENT
                </span>
              )}
              {isCompleted && (
                <span className="px-2 py-0.5 bg-success/10 text-success font-bold rounded-full">
                  COMPLETED
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{phase.title}</h3>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary"
                title="View Semester Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
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
          <div className="px-4 pb-4 pt-0 border-t border-border mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mt-4 mb-6">
              <ExpandableInfoSection
                title="Semester Focus"
                content={phase.focus}
                icon={Target}
                isOpen={activeCardSection === 'focus'}
                onToggle={() => toggleCardSection('focus')}
                variant="primary"
                contextType="roadmap"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={(e) => { e.stopPropagation(); setSelectedSkill(skill); }}
                      className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer text-left"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-success" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tools</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.tools.map(tool => (
                    <button
                      key={tool}
                      onClick={(e) => { e.stopPropagation(); setSelectedSkill(tool); }}
                      className="px-2.5 py-1 bg-success/10 text-success text-xs font-bold rounded-lg hover:bg-success/20 hover:scale-105 active:scale-95 transition-all cursor-pointer text-left"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-warning" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Projects</h4>
                </div>
                <ul className="space-y-1.5">
                  {phase.projects.map(project => (
                    <li key={project} className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                      <div className="w-1.5 h-1.5 bg-warning rounded-full shrink-0" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Certifications</h4>
                </div>
                <ul className="space-y-1.5">
                  {phase.certifications.map(cert => (
                    <li key={cert} className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Career Relevance */}
            <div className="mt-8">
              <ExpandableInfoSection
                title="Career Relevance"
                content={phase.careerRelevance}
                icon={Briefcase}
                isOpen={activeCardSection === 'relevance'}
                onToggle={() => toggleCardSection('relevance')}
                variant="blue"
                contextType="roadmap"
              />
            </div>

            {/* Mark Complete Button */}
            {!isCompleted && isCurrent && (
              <Button
                className="w-full mt-6 gap-2 shadow-btn-glow active:scale-95 transition-all"
                onClick={onMarkComplete}
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Phase as Complete
              </Button>
            )}
          </div>
        )}
      </div>

      <SkillModal
        skillId={selectedSkill || ''}
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        skillName={selectedSkill || ''}
      />

      <SemesterModal
        semesterId={phase.id}
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title={phase.title}
      />
    </>
  );
});

RoadmapPhaseCard.displayName = 'RoadmapPhaseCard';
