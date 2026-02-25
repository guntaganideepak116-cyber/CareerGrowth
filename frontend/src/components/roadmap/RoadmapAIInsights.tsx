import { useState, useEffect, memo } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RoadmapPhase } from '@/data/roadmapData';
import { Sparkles, Loader2, Zap, AlertCircle, CheckCircle2, TrendingUp, Target } from 'lucide-react';

interface RoadmapAIInsightsProps {
  fieldId: string;
  specializationId: string;
  currentPhase: number;
  completedPhases: number[];
  phases: RoadmapPhase[];
}

export const RoadmapAIInsights = memo(function RoadmapAIInsights({
  fieldId,
  specializationId,
  currentPhase,
  completedPhases,
  phases,
}: RoadmapAIInsightsProps) {
  const { profile } = useAuthContext();
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, specializationId, currentPhase, completedPhases.length]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const currentPhaseData = phases.find(p => p.id === currentPhase);
      const completedCount = completedPhases.length;
      const totalPhases = phases.length;
      const progress = Math.round((completedCount / totalPhases) * 100);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          role: 'mentor',
          messages: [
            {
              role: 'user',
              content: `Give a brief personalized insight (2-3 sentences max) for a student on their learning roadmap.

Current situation:
- Field: ${fieldId}
- Specialization: ${specializationId}
- Progress: ${progress}% complete (${completedCount}/${totalPhases} phases)
- Current Phase: ${currentPhaseData?.title || 'Phase ' + currentPhase}
- Skills to learn: ${currentPhaseData?.skills?.slice(0, 3).join(', ') || 'Various skills'}

Student profile:
- Semester: ${profile?.current_semester || 1}
- Career goal: ${profile?.career_path || 'Not specified'}

Provide:
1. An encouraging observation about their progress
2. One specific actionable tip for their current phase
3. A motivational note

Keep it personal and conversational. No bullet points, just flowing text.`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to get insights');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) { fullText += content; setInsights(fullText); }
            } catch { /* skip malformed JSON */ }
          }
        }
      }
    } catch {
      const progress = Math.round((completedPhases.length / phases.length) * 100);
      if (progress === 0) {
        setInsights("Welcome to your personalized roadmap! This is the beginning of an exciting journey. Start with the first phase and take it one step at a time. Remember, every expert was once a beginner.");
      } else if (progress < 50) {
        setInsights("You're making great progress! Keep building momentum by focusing on one skill at a time in your current phase. Consistency is key — even 30 minutes of focused learning daily compounds into mastery.");
      } else if (progress < 100) {
        setInsights("Impressive progress! You're well past the halfway mark. Now is the time to start applying your skills through real projects. Consider contributing to open source or building a portfolio piece.");
      } else {
        setInsights("Congratulations on completing your roadmap! You've demonstrated incredible dedication. Now focus on showcasing your skills and preparing for the next chapter of your career journey.");
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((completedPhases.length / phases.length) * 100);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(15,118,110,0.06) 0%, rgba(20,184,166,0.10) 50%, rgba(99,102,241,0.06) 100%)',
        border: '1px solid rgba(15,118,110,0.18)',
        boxShadow: '0 4px 20px rgba(15,118,110,0.08)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0F766E 0%, transparent 70%)' }}
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div
          className="p-2.5 rounded-xl shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
            boxShadow: '0 4px 12px rgba(15,118,110,0.30)',
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              AI Mentor Insights
            </h3>
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />}
            {/* Progress pill */}
            <div
              className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: progress >= 75
                  ? '#D1FAE5'
                  : progress >= 40
                    ? '#CCFBF1'
                    : '#F0FDF4',
                color: progress >= 75 ? '#059669' : '#0F766E',
              }}
            >
              <TrendingUp className="w-3 h-3" />
              {progress}% complete
            </div>
          </div>

          {/* Insights text */}
          {loading && !insights ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Analyzing your progress...
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{insights}</p>
          )}

          {/* Recommendation chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {progress < 100 && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
                style={{ background: 'rgba(15,118,110,0.10)', color: '#0F766E' }}
              >
                <Target className="w-3 h-3" />
                Focus on Phase {currentPhase}
              </div>
            )}
            {completedPhases.length > 0 && progress < 50 && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
                style={{ background: 'rgba(245,158,11,0.10)', color: '#B45309' }}
              >
                <Zap className="w-3 h-3" />
                Build projects to solidify learning
              </div>
            )}
            {progress >= 50 && progress < 100 && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
                style={{ background: 'rgba(16,185,129,0.10)', color: '#059669' }}
              >
                <CheckCircle2 className="w-3 h-3" />
                Great momentum! Keep going
              </div>
            )}
            {progress === 100 && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
                style={{ background: '#D1FAE5', color: '#059669' }}
              >
                <CheckCircle2 className="w-3 h-3" />
                Roadmap Complete 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
