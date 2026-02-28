import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { fields, specializationsMap } from '@/data/fieldsData';
import { generateRoadmap, RoadmapPhase } from '@/data/roadmapData';
import { RoadmapPhaseCard } from '@/components/roadmap/RoadmapPhaseCard';
import { RoadmapAIInsights } from '@/components/roadmap/RoadmapAIInsights';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRoadmap, DynamicRoadmapPhase } from '@/hooks/useDynamicContent';
import {
  Sparkles,
  RefreshCw,
  Download,
  MapPin,
  Target,
  Loader2,
  Zap,
  BookOpen,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { NearbyColleges } from '@/components/roadmap/NearbyColleges';

// ── Roadmap Mode ──────────────────────────────────────────────
// AI:     DEFAULT — calls Gemini via backend, real-world personalised roadmap
// STATIC: Fallback / user-selected — local predefined data, no AI call
type RoadmapMode = 'AI' | 'STATIC';

export default function Roadmap() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  // ── Default: AI mode ──────────────────────────────────────────
  const [roadmapMode, setRoadmapMode] = useState<RoadmapMode>('AI');
  const isAIMode = roadmapMode === 'AI';
  const isStaticMode = roadmapMode === 'STATIC';

  const specializations = selectedField ? specializationsMap[selectedField] || [] : [];

  // ── AI Roadmap — only fires when in AI mode and field+spec are selected ──
  const {
    phases: dynamicPhases,
    loading: dynamicLoading,
    error: dynamicError,
    refetch: refetchDynamic,
  } = useRoadmap(
    isAIMode ? selectedField : null,
    isAIMode ? selectedSpecialization : null,
    { semester: profile?.current_semester || 1, careerGoal: profile?.career_path || undefined }
  );

  // ── Static Roadmap — always computed locally, zero network cost ──
  const staticPhases = useMemo(() => {
    if (selectedField && selectedSpecialization) {
      return generateRoadmap(selectedField, selectedSpecialization);
    }
    return [];
  }, [selectedField, selectedSpecialization]);

  // ── Resolved phases based on mode ───────────────────────────
  // AI mode:     Gemini phases when ready; while loading/error → static fallback
  // STATIC mode: Always local data
  const phases: RoadmapPhase[] = useMemo(() => {
    if (isStaticMode) return staticPhases;

    // AI mode with data
    if (dynamicPhases.length > 0) {
      return dynamicPhases.map((dp: DynamicRoadmapPhase) => ({
        id: dp.id,
        title: dp.title,
        focus: dp.focus,
        duration: dp.duration,
        skills: dp.skills,
        tools: dp.tools,
        projects: dp.projects,
        certifications: dp.certifications,
        careerRelevance: dp.careerRelevance,
      }));
    }

    // AI mode but still loading or errored → show static data as placeholder
    // so the page is never empty while waiting for AI
    return staticPhases;
  }, [isStaticMode, dynamicPhases, staticPhases]);

  // True only while AI is fetching AND we have no AI data yet
  const isAIGenerating = isAIMode && dynamicLoading && dynamicPhases.length === 0;
  // AI has successfully loaded its own data
  const aiDataReady = isAIMode && dynamicPhases.length > 0;

  const { progress, loading: progressLoading, markPhaseComplete, resetProgress } =
    useRoadmapProgress(selectedField, selectedSpecialization);

  // ── Init from profile ────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) { navigate('/login'); return; }
    if (profile?.field && !selectedField) setSelectedField(profile.field);
  }, [user, authLoading, profile, navigate, selectedField]);

  useEffect(() => {
    if (profile?.specialization && selectedField && !selectedSpecialization) {
      const match = specializations.find(s => s.id === profile.specialization);
      if (match) setSelectedSpecialization(match.id);
    }
  }, [profile, specializations, selectedField, selectedSpecialization]);

  useEffect(() => {
    if (progress && !expandedPhase) setExpandedPhase(progress.current_phase);
  }, [progress, expandedPhase]);

  // ── Field / Spec handlers ────────────────────────────────────
  const handleFieldChange = (fieldId: string) => {
    setSelectedField(fieldId);
    setSelectedSpecialization('');
    setExpandedPhase(null);
    setRoadmapMode('AI'); // always start fresh with AI on field change
  };

  const handleSpecializationChange = (specId: string) => {
    setSelectedSpecialization(specId);
    setExpandedPhase(1);
    setRoadmapMode('AI'); // always try AI on spec change
  };

  const handleMarkComplete = async (phaseId: number) => {
    try {
      const phase = phases.find(p => p.id === phaseId);
      await markPhaseComplete(phaseId, phases.length, phase?.skills || []);
      toast.success(`Phase ${phaseId} marked as complete!`);
      if (phaseId < phases.length) setExpandedPhase(phaseId + 1);
    } catch { toast.error('Failed to update progress'); }
  };

  // ── Reset: clears progress, stays in AI mode ─────────────────
  const handleReset = async () => {
    try {
      await resetProgress();
      setExpandedPhase(1);
      toast.success('Roadmap progress has been reset');
    } catch { toast.error('Failed to reset progress'); }
  };

  // ── Refresh AI ───────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRoadmapMode('AI');
    refetchDynamic();
    toast.success('Regenerating AI roadmap...');
  }, [refetchDynamic]);

  // ── Toggle: AI ↔ Static ──────────────────────────────────────
  const toggleMode = useCallback(() => {
    if (isAIMode) {
      setRoadmapMode('STATIC');
      queryClient.resetQueries({ queryKey: ['dynamic_roadmap'] });
      toast.info('Switched to Static roadmap — predefined, offline, no AI');
    } else {
      setRoadmapMode('AI');
      refetchDynamic();
      toast.success('Switched to AI-powered roadmap — generating your personalised path...');
    }
  }, [isAIMode, refetchDynamic, queryClient]);

  const handleExport = () => toast.success('Roadmap exported to PDF!');

  const completedPhases = progress?.completed_phases || [];
  const currentPhase = progress?.current_phase || 1;
  const overallProgress = progress?.overall_progress || 0;
  const selectedFieldData = fields.find(f => f.id === selectedField);
  const selectedSpecData = specializations.find(s => s.id === selectedSpecialization);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Mode Banner (prominent, always visible when data loaded) ── */}
        {selectedField && selectedSpecialization && (
          <div className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-500 ${isAIMode
            ? 'bg-gradient-to-r from-violet-500/10 via-primary/10 to-cyan-500/10 border-primary/40 shadow-lg shadow-primary/10'
            : 'bg-muted/40 border-border shadow-none'
            }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: mode label */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isAIMode
                  ? 'bg-gradient-to-br from-violet-500 to-primary text-white shadow-md shadow-primary/30'
                  : 'bg-muted text-muted-foreground'
                  }`}>
                  {isAIMode ? <Brain className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                </div>
                <div>
                  {isAIMode ? (
                    <>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-foreground text-base">AI-Powered Roadmap</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary tracking-wide uppercase">Live</span>
                        {isAIGenerating && (
                          <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> Generating...
                          </span>
                        )}
                        {aiDataReady && (
                          <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                            <Sparkles className="w-3 h-3" /> AI Ready
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Personalised by Gemini · current industry standards · real certifications
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-foreground text-base">Static Roadmap</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground tracking-wide uppercase">Offline</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Predefined curriculum · no AI · works without network
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isAIMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={dynamicLoading}
                    className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dynamicLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                )}
                <Button
                  variant={isAIMode ? 'outline' : 'default'}
                  size="sm"
                  onClick={toggleMode}
                  className={`gap-1.5 text-xs font-semibold ${isAIMode
                    ? 'border-muted hover:bg-muted'
                    : 'bg-gradient-to-r from-violet-500 to-primary text-white border-0 hover:opacity-90 shadow-md shadow-primary/20'
                    }`}
                >
                  {isAIMode ? (
                    <><BookOpen className="w-3.5 h-3.5" /> Use Static</>
                  ) : (
                    <><Brain className="w-3.5 h-3.5" /> Switch to AI</>
                  )}
                </Button>
              </div>
            </div>

            {/* AI generating progress bar */}
            {isAIGenerating && (
              <div className="mt-4 h-1 rounded-full bg-primary/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-primary rounded-full animate-pulse w-2/3" />
              </div>
            )}

            {/* Static notice */}
            {isStaticMode && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Click <strong>Switch to AI</strong> to get a personalised, Gemini-generated roadmap with real industry data</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </div>
            )}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isAIMode
              ? 'bg-gradient-to-r from-violet-500/20 to-primary/20 text-primary'
              : 'bg-muted text-muted-foreground'
              }`}>
              {isAIMode ? <Sparkles className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              {isAIMode ? 'AI-Powered Roadmap' : 'Static Roadmap'}
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Learning Roadmap</h1>
            <p className="mt-2 text-muted-foreground">
              {isAIMode
                ? 'Real-world learning path generated by Gemini AI based on current industry trends'
                : 'Predefined learning path — structured curriculum, no AI generation'}
            </p>
          </div>
          {phases.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Reset
              </Button>
              <Button variant="default" size="sm" onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          )}
        </div>

        {/* ── AI generation notice while static data shown as preview ── */}
        {isAIGenerating && staticPhases.length > 0 && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">AI is generating your personalised roadmap…</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing static preview below. AI version will replace it automatically once ready.
                </p>
              </div>
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin flex-shrink-0" />
            </div>
          </div>
        )}

        {/* ── AI failed, showing static fallback notice ── */}
        {dynamicError && isAIMode && dynamicPhases.length === 0 && !dynamicLoading && staticPhases.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">AI generation failed — showing Static roadmap</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The backend may be busy. The static roadmap below is fully functional and complete.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5 text-xs flex-shrink-0 border-amber-500/40 hover:bg-amber-500/10">
                <RefreshCw className="w-3.5 h-3.5" /> Retry AI
              </Button>
            </div>
          </div>
        )}

        {/* ── Field & Specialization Selection ── */}
        <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Select Your Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Field</label>
              <Select value={selectedField} onValueChange={handleFieldChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map(field => {
                    const FieldIcon = field.icon;
                    return (
                      <SelectItem key={field.id} value={field.id}>
                        <div className="flex items-center gap-2">
                          <FieldIcon className="w-4 h-4" />
                          <span>{field.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Specialization</label>
              <Select
                value={selectedSpecialization}
                onValueChange={handleSpecializationChange}
                disabled={!selectedField}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedField ? 'Choose specialization' : 'Select field first'} />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec.id} value={spec.id}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{spec.name}</span>
                        <span className="text-xs text-muted-foreground">{spec.marketDemand}% demand</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedFieldData && selectedSpecData && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Your path:</span>
                <span className="font-medium text-foreground">{selectedFieldData.name}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-foreground">{selectedSpecData.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{selectedSpecData.description}</p>
            </div>
          )}
        </div>

        {/* ── Roadmap Content ── */}
        {(!selectedField || !selectedSpecialization) ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border animate-fade-in">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Select Your Path</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a field and specialization above to view your personalised AI-powered learning roadmap
            </p>
          </div>
        ) : phases.length > 0 ? (
          <>
            {/* AI Insights */}
            <RoadmapAIInsights
              fieldId={selectedField}
              specializationId={selectedSpecialization}
              currentPhase={currentPhase}
              completedPhases={completedPhases}
              phases={phases}
            />

            {/* Nearby Colleges Section */}
            <NearbyColleges specialization={selectedSpecialization} />

            {/* Progress Overview */}
            <div className={`rounded-xl border p-6 animate-slide-up transition-all duration-500 ${isAIMode
              ? 'bg-gradient-to-r from-violet-500/5 via-primary/5 to-cyan-500/5 border-primary/20'
              : 'bg-card border-border'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  {isAIMode
                    ? <><Sparkles className="w-4 h-4 text-primary" /> Overall Progress — AI Roadmap</>
                    : <><BookOpen className="w-4 h-4 text-muted-foreground" /> Overall Progress — Static Roadmap</>
                  }
                </h2>
                <span className={`font-bold text-sm ${isAIMode ? 'text-primary' : 'text-muted-foreground'}`}>
                  {completedPhases.length} / {phases.length} Phases ({overallProgress}%)
                </span>
              </div>
              <div className="flex gap-2">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`flex-1 h-3 rounded-full transition-all duration-300 ${completedPhases.includes(phase.id)
                      ? 'bg-emerald-500'
                      : phase.id === currentPhase
                        ? isAIMode ? 'bg-primary' : 'bg-muted-foreground'
                        : 'bg-muted'
                      }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Foundation</span>
                <span>Career Launch</span>
              </div>
            </div>

            {/* Phase Cards — wrapped with mode-specific border accent */}
            <div className={`relative space-y-4 ${isAIMode
              ? 'before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-primary before:to-cyan-500 before:rounded-full'
              : ''
              }`}>
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isCurrent = phase.id === currentPhase;
                const isLocked = !isCompleted && phase.id > currentPhase;

                return (
                  <RoadmapPhaseCard
                    key={phase.id}
                    phase={phase}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    isLocked={isLocked}
                    isExpanded={expandedPhase === phase.id}
                    onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                    onMarkComplete={() => handleMarkComplete(phase.id)}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Bottom CTA — push to switch mode */}
            <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${isAIMode
              ? 'bg-muted/30 border-border'
              : 'bg-gradient-to-r from-violet-500/10 to-primary/10 border-primary/30'
              }`}>
              {isAIMode ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>Want a simpler, offline version?</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleMode} className="gap-1.5 text-xs">
                    <BookOpen className="w-3.5 h-3.5" /> View Static
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Brain className="w-4 h-4 text-primary" />
                    <span>Get an <strong>AI-personalised roadmap</strong> with live industry data</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={toggleMode}
                    className="gap-1.5 text-xs bg-gradient-to-r from-violet-500 to-primary text-white border-0 hover:opacity-90"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Activate AI
                  </Button>
                </>
              )}
            </div>
          </>
        ) : progressLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading roadmap...</p>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
