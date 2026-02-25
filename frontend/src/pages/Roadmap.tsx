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
} from 'lucide-react';

// ── Roadmap Mode ──────────────────────────────────────────────
// STATIC: loads predefined local data — NO AI calls
// AI:     calls Gemini via backend and shows personalised roadmap
type RoadmapMode = 'STATIC' | 'AI';

export default function Roadmap() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Field and specialization selection
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  // Expanded phase
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  // ── Mode: default to STATIC ───────────────────────────────────
  // STATIC → uses local roadmapData.ts (no AI, no network call)
  // AI     → calls backend generateContent("/api/content/generate")
  const [roadmapMode, setRoadmapMode] = useState<RoadmapMode>('STATIC');

  // Derived: is AI mode active?
  const isAIMode = roadmapMode === 'AI';

  // Get specializations for selected field
  const specializations = selectedField ? specializationsMap[selectedField] || [] : [];

  // ── AI Roadmap (only fires when mode is AI) ──────────────────
  // Pass null for fieldId/specId when NOT in AI mode → query stays disabled
  const {
    phases: dynamicPhases,
    loading: dynamicLoading,
    error: dynamicError,
    refetch: refetchDynamic
  } = useRoadmap(
    isAIMode ? selectedField : null,
    isAIMode ? selectedSpecialization : null,
    { semester: profile?.current_semester || 1, careerGoal: profile?.career_path || undefined }
  );

  // ── Static Roadmap (always computed, never calls AI) ─────────
  // Derived from local roadmapData.ts — same for all users with same field+spec
  const staticPhases = useMemo(() => {
    if (selectedField && selectedSpecialization) {
      return generateRoadmap(selectedField, selectedSpecialization);
    }
    return [];
  }, [selectedField, selectedSpecialization]);

  // ── Active phases based on current mode ──────────────────────
  // STATIC mode: always use staticPhases (never AI data)
  // AI mode:     use dynamicPhases if available; show loading/error otherwise
  const phases: RoadmapPhase[] = useMemo(() => {
    if (roadmapMode === 'STATIC') {
      // Static mode: ONLY local predefined data — no AI fallback
      return staticPhases;
    }

    // AI mode: use Gemini-generated phases (converted to RoadmapPhase shape)
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

    // AI mode but still loading or errored → return empty so loading/error UI renders
    return [];
  }, [roadmapMode, dynamicPhases, staticPhases]);

  // Progress tracking
  const { progress, loading: progressLoading, markPhaseComplete, resetProgress } =
    useRoadmapProgress(selectedField, selectedSpecialization);

  // ── Initialise field/spec from user profile ────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (profile?.field && !selectedField) {
      setSelectedField(profile.field);
    }
  }, [user, authLoading, profile, navigate, selectedField]);

  useEffect(() => {
    if (profile?.specialization && selectedField && !selectedSpecialization) {
      const specMatch = specializations.find(s => s.id === profile.specialization);
      if (specMatch) {
        setSelectedSpecialization(specMatch.id);
      }
    }
  }, [profile, specializations, selectedField, selectedSpecialization]);

  useEffect(() => {
    if (progress && !expandedPhase) {
      setExpandedPhase(progress.current_phase);
    }
  }, [progress, expandedPhase]);

  // ── Field / Spec change handlers ────────────────────────────
  const handleFieldChange = (fieldId: string) => {
    setSelectedField(fieldId);
    setSelectedSpecialization('');
    setExpandedPhase(null);
    // Changing field resets to static so there's no stale AI data visible
    setRoadmapMode('STATIC');
  };

  const handleSpecializationChange = (specId: string) => {
    setSelectedSpecialization(specId);
    setExpandedPhase(1);
    // Changing spec also resets to static
    setRoadmapMode('STATIC');
  };

  // ── Mark phase complete ──────────────────────────────────────
  const handleMarkComplete = async (phaseId: number) => {
    try {
      const phase = phases.find(p => p.id === phaseId);
      const skills = phase?.skills || [];
      await markPhaseComplete(phaseId, phases.length, skills);
      toast.success(`Phase ${phaseId} marked as complete!`);
      if (phaseId < phases.length) {
        setExpandedPhase(phaseId + 1);
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  // ── Reset: clears progress & returns to STATIC mode ──────────
  const handleReset = async () => {
    try {
      await resetProgress();
      setExpandedPhase(1);
      setRoadmapMode('STATIC');
      // Clear stale AI cache so it won't flash errors on next AI activation
      queryClient.resetQueries({ queryKey: ['dynamic_roadmap'] });
      toast.success('Roadmap progress has been reset');
    } catch (error) {
      toast.error('Failed to reset progress');
    }
  };

  // ── Refresh: switches to AI mode and triggers generation ─────
  // Only Refresh activates AI — Static button always returns to STATIC
  const handleRefresh = useCallback(() => {
    setRoadmapMode('AI');
    refetchDynamic();
    toast.success('Generating AI-powered roadmap...');
  }, [refetchDynamic]);

  // ── Toggle button on header: switches between STATIC and AI ──
  // Static → AI: triggers fetch
  // AI → Static: immediately shows predefined data, no network call
  const toggleContentSource = useCallback(() => {
    if (roadmapMode === 'AI') {
      // Switch to STATIC — predefined data, no AI
      setRoadmapMode('STATIC');
      // Clear any AI error/data from cache so it won't show next time
      queryClient.resetQueries({ queryKey: ['dynamic_roadmap'] });
      toast.info('Switched to Static roadmap (predefined, no AI)');
    } else {
      // Switch to AI — trigger generation
      setRoadmapMode('AI');
      refetchDynamic();
      toast.info('Switched to AI-generated roadmap');
    }
  }, [roadmapMode, refetchDynamic, queryClient]);

  // ── Export ───────────────────────────────────────────────────
  const handleExport = () => {
    toast.success('Roadmap exported to PDF!');
  };

  const completedPhases = progress?.completed_phases || [];
  const currentPhase = progress?.current_phase || 1;
  const overallProgress = progress?.overall_progress || 0;

  const selectedFieldData = fields.find(f => f.id === selectedField);
  const selectedSpecData = specializations.find(s => s.id === selectedSpecialization);

  // Loading state: only show spinner when in AI mode and actively loading
  const isLoading = (isAIMode && dynamicLoading) || progressLoading;

  // Show the AI indicator banner only when AI mode is active and has data
  const showDynamicIndicator = isAIMode && dynamicPhases.length > 0;

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {showDynamicIndicator ? 'AI-Powered Roadmap' : 'Learning Roadmap'}
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Learning Roadmap</h1>
            <p className="mt-2 text-muted-foreground">
              {showDynamicIndicator
                ? 'Real-world learning path generated with AI based on current industry trends'
                : 'Personalized learning path based on your selected specialization'}
            </p>
          </div>
          {phases.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleContentSource}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                {isAIMode ? 'Static' : 'AI'}
              </Button>
              {isAIMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="gap-2"
                  disabled={dynamicLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${dynamicLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
              <Button variant="default" size="sm" onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          )}
        </div>

        {/* Dynamic Content Indicator — shown only in AI mode with loaded data */}
        {showDynamicIndicator && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">AI-Generated Real-World Roadmap</p>
                <p className="text-sm text-muted-foreground">
                  This roadmap uses current industry standards, real technologies, and actual certifications
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error — only in AI mode, only when generation truly failed (no phases loaded) */}
        {dynamicError && isAIMode && dynamicPhases.length === 0 && !dynamicLoading && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Generating your personalized roadmap...</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is creating a custom learning path based on current industry trends. This may take a few moments.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="mt-3 gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Generation
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Field & Specialization Selection */}
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
                  <SelectValue placeholder={selectedField ? "Choose specialization" : "Select field first"} />
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

          {/* Selection Summary */}
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

        {/* Roadmap Content */}
        {isLoading && selectedField && selectedSpecialization ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Generating Your Roadmap</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Creating a personalized learning path with real-world technologies, certifications, and career milestones...
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

            {/* Progress Overview */}
            <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Overall Progress</h2>
                <span className="text-primary font-bold">
                  {completedPhases.length} / {phases.length} Phases ({overallProgress}%)
                </span>
              </div>
              <div className="flex gap-2">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`flex-1 h-3 rounded-full transition-all duration-300 ${completedPhases.includes(phase.id)
                      ? 'bg-success'
                      : phase.id === currentPhase
                        ? 'bg-primary'
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

            {/* Timeline */}
            <div className="relative space-y-4">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isCurrent = phase.id === currentPhase;
                const isLocked = !isCompleted && phase.id > currentPhase;

                return (
                  <div
                    key={phase.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <RoadmapPhaseCard
                      phase={phase}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      isLocked={isLocked}
                      isExpanded={expandedPhase === phase.id}
                      onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                      onMarkComplete={() => handleMarkComplete(phase.id)}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : selectedField && selectedSpecialization ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border animate-fade-in">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isAIMode ? 'Generating AI Roadmap...' : 'Preparing Roadmap...'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              {isAIMode
                ? 'AI is creating a personalized roadmap based on real-world industry standards.'
                : 'A detailed roadmap for this specialization is being prepared.'}
            </p>
            {isAIMode && (
              <Button onClick={handleRefresh} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Generate Now
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border animate-fade-in">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Select Your Path</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a field and specialization above to view your personalized learning roadmap
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
