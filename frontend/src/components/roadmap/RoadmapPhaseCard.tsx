import { memo } from 'react';
import { RoadmapPhase } from '@/data/roadmapData';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Award,
  FolderKanban,
  ChevronDown,
  ChevronUp,
  Lock,
  BadgeCheck,
  Zap,
} from 'lucide-react';

interface RoadmapPhaseCardProps {
  phase: RoadmapPhase;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkComplete: () => void;
  index?: number;
}

export const RoadmapPhaseCard = memo(function RoadmapPhaseCard({
  phase,
  isCompleted,
  isCurrent,
  isLocked,
  isExpanded,
  onToggle,
  onMarkComplete,
  index = 0,
}: RoadmapPhaseCardProps) {

  // ── Card outer container styling ────────────────────────────────────────
  const cardBase = [
    'relative group flex gap-0 transition-all duration-300',
  ].join(' ');

  // ── Timeline dot ────────────────────────────────────────────────────────
  const TimelineDot = () => (
    <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: 36 }}>
      {/* vertical line above dot */}
      <div
        className="absolute top-0 w-px"
        style={{
          height: 20,
          background: index === 0 ? 'transparent' : 'rgba(15,118,110,0.18)',
        }}
      />
      {/* dot */}
      <div className="relative z-10 mt-5">
        {isCompleted ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: '#10B981' }}
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        ) : isCurrent ? (
          <div className="relative">
            {/* pulse ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(20,184,166,0.35)', animationDuration: '1.8s' }}
            />
            <div
              className="relative w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: '#0F766E' }}
            >
              <Circle className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
        ) : isLocked ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: '#F3F4F6', border: '2px solid #D1D5DB' }}
          >
            <Lock className="w-3 h-3 text-gray-400" />
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: '#FFFFFF', border: '2px solid #D1D5DB' }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>
        )}
      </div>
      {/* vertical line below dot */}
      <div
        className="flex-1 w-px mt-1"
        style={{ minHeight: 24, background: 'rgba(15,118,110,0.18)' }}
      />
    </div>
  );

  // ── Card box ─────────────────────────────────────────────────────────────
  const cardBoxStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: 14,
    border: isExpanded
      ? '1.5px solid rgba(15,118,110,0.45)'
      : isCurrent
        ? '1.5px solid rgba(15,118,110,0.30)'
        : isLocked
          ? '1px solid rgba(0,0,0,0.06)'
          : '1px solid rgba(15,118,110,0.12)',
    boxShadow: isExpanded
      ? '0 0 0 3px rgba(20,184,166,0.08), 0 8px 24px rgba(0,0,0,0.07)'
      : isCurrent
        ? '0 0 0 2px rgba(20,184,166,0.10), 0 6px 20px rgba(0,0,0,0.06)'
        : '0 4px 14px rgba(0,0,0,0.04)',
    background: isLocked
      ? 'rgba(249,250,251,0.7)'
      : isCompleted
        ? 'linear-gradient(160deg, #FFFFFF 0%, #F0FDF4 100%)'
        : isCurrent
          ? 'linear-gradient(160deg, #FFFFFF 0%, #ECFDF5 100%)'
          : 'linear-gradient(160deg, #FFFFFF 0%, #F9FAFB 100%)',
    transition: 'all 0.25s ease',
    opacity: isLocked ? 0.62 : 1,
    marginBottom: 12,
    // left accent bar for current phase
    ...(isCurrent && !isLocked
      ? { borderLeft: '4px solid #0F766E' }
      : {}),
  };

  const cardHoverClass = !isLocked
    ? 'hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]'
    : '';

  return (
    <div
      className={cardBase}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Left timeline */}
      <TimelineDot />

      {/* Card */}
      <div
        className={`flex-1 ml-3 cursor-pointer ${cardHoverClass} transition-all duration-250`}
        style={cardBoxStyle}
      >
        {/* Header button */}
        <button
          onClick={onToggle}
          disabled={isLocked}
          className="w-full p-4 sm:p-5 flex items-center gap-4 text-left disabled:cursor-not-allowed rounded-[14px]"
        >
          {/* Phase icon badge */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{
              background: isCompleted
                ? 'linear-gradient(135deg, #D1FAE5, #6EE7B7)'
                : isCurrent
                  ? 'linear-gradient(135deg, #CCFBF1, #5EEAD4)'
                  : isLocked
                    ? '#F3F4F6'
                    : '#F0FDF4',
              boxShadow: isCurrent || isCompleted
                ? '0 2px 8px rgba(15,118,110,0.18)'
                : 'none',
            }}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" style={{ color: '#059669' }} />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-gray-400" />
            ) : isCurrent ? (
              <Zap className="w-5 h-5" style={{ color: '#0F766E' }} />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                {phase.duration}
              </span>
              {isCurrent && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{ background: '#CCFBF1', color: '#0F766E' }}
                >
                  ● Current
                </span>
              )}
              {isCompleted && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1"
                  style={{ background: '#D1FAE5', color: '#059669' }}
                >
                  <BadgeCheck className="w-3 h-3" /> Done
                </span>
              )}
              {isLocked && (
                <span
                  className="px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider"
                  style={{ background: '#F3F4F6', color: '#9CA3AF' }}
                >
                  Locked
                </span>
              )}
              {/* FEATURE 4: INDUSTRY-LEVEL BADGE */}
              {(phase as any).level && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-secondary/50 text-muted-foreground border border-border"
                >
                  {(phase as any).level}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
              {phase.title}
            </h3>
            {/* skill count preview when collapsed */}
            {!isExpanded && !isLocked && (
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                {(phase.skills?.length || 0)} skills · {(phase.tools?.length || 0)} tools · {(phase.projects?.length || 0)} projects
              </p>
            )}
          </div>

          {/* Chevron */}
          {!isLocked && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{ background: isExpanded ? 'rgba(15,118,110,0.1)' : 'transparent' }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" style={{ color: '#0F766E' }} />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-teal-700 transition-colors" />
              )}
            </div>
          )}
        </button>

        {/* ── Expanded Content ─────────────────────────────────────── */}
        {isExpanded && !isLocked && (
          <div
            className="px-4 sm:px-5 pb-5 pt-0"
            style={{ borderTop: '1px solid rgba(15,118,110,0.08)', marginTop: 0 }}
          >
            {/* Focus description */}
            <p className="text-sm text-gray-500 mt-4 mb-5 leading-relaxed">{phase.focus}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* ── Skills ── */}
              {phase.skills && phase.skills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: '#ECFDF5' }}
                    >
                      <BookOpen className="w-3.5 h-3.5" style={{ color: '#0F766E' }} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Skills</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center text-xs font-medium transition-colors duration-150 cursor-default"
                        style={{
                          background: '#ECFDF5',
                          color: '#0F766E',
                          borderRadius: 20,
                          padding: '5px 12px',
                          border: '1px solid rgba(15,118,110,0.15)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#D1FAE5')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#ECFDF5')}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tools ── */}
              {phase.tools && phase.tools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: '#F0FDF4' }}
                    >
                      <Code2 className="w-3.5 h-3.5" style={{ color: '#16A34A' }} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tools</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map(tool => (
                      <span
                        key={tool}
                        className="inline-flex items-center text-xs font-medium transition-colors duration-150 cursor-default"
                        style={{
                          background: '#F0FDF4',
                          color: '#15803D',
                          borderRadius: 20,
                          padding: '5px 12px',
                          border: '1px solid rgba(22,163,74,0.18)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#DCFCE7')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#F0FDF4')}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Projects ── */}
              {phase.projects && phase.projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: '#FFF7ED' }}
                    >
                      <FolderKanban className="w-3.5 h-3.5" style={{ color: '#C2410C' }} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Projects</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.projects.map(project => (
                      <li
                        key={project}
                        className="text-sm text-gray-500 flex items-start gap-2.5"
                        style={{
                          borderLeft: '3px solid #14B8A6',
                          paddingLeft: 8,
                          borderRadius: 2,
                        }}
                      >
                        <span className="leading-snug">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Certifications ── */}
              {phase.certifications && phase.certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: '#EFF6FF' }}
                    >
                      <Award className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Certifications</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.certifications.map(cert => (
                      <li
                        key={cert}
                        className="text-sm text-gray-500 flex items-start gap-2"
                      >
                        <BadgeCheck
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: '#2563EB' }}
                        />
                        <span className="leading-snug">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── Career Relevance ── */}
            {phase.careerRelevance && (
              <div
                className="mt-5 p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,118,110,0.06) 0%, rgba(20,184,166,0.06) 100%)',
                  border: '1px solid rgba(15,118,110,0.12)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0F766E' }} />
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Career Relevance: </span>
                    <span className="text-gray-500">{phase.careerRelevance}</span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Mark Complete ── */}
            {!isCompleted && isCurrent && (
              <Button
                className="w-full mt-4 gap-2 font-semibold"
                onClick={onMarkComplete}
                style={{
                  background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(15,118,110,0.30)',
                }}
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
});
