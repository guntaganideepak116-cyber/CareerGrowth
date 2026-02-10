import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RoadmapPhase } from '@/data/roadmapData';
import { Sparkles, Loader2, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RoadmapAIInsightsProps {
  fieldId: string;
  specializationId: string;
  currentPhase: number;
  completedPhases: number[];
  phases: RoadmapPhase[];
}

export function RoadmapAIInsights({
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
  }, [fieldId, specializationId, currentPhase, completedPhases.length]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const currentPhaseData = phases.find(p => p.id === currentPhase);
      const completedCount = completedPhases.length;
      const totalPhases = phases.length;
      const progress = Math.round((completedCount / totalPhases) * 100);

      // Get the user's session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

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
              if (content) {
                fullText += content;
                setInsights(fullText);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback insights
      const progress = Math.round((completedPhases.length / phases.length) * 100);
      if (progress === 0) {
        setInsights("Welcome to your personalized roadmap! This is the beginning of an exciting journey. Start with the first phase and take it one step at a time. Remember, every expert was once a beginner.");
      } else if (progress < 50) {
        setInsights("You're making great progress! Keep building momentum by focusing on one skill at a time in your current phase. Consistency is key - even 30 minutes of focused learning daily compounds into mastery.");
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
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground">AI Mentor Insights</h3>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
          
          {loading && !insights ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Analyzing your progress...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{insights}</p>
          )}

          {/* Quick recommendations */}
          <div className="flex flex-wrap gap-2 mt-4">
            {progress < 100 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                <Zap className="w-3 h-3" />
                Focus on Phase {currentPhase}
              </div>
            )}
            {completedPhases.length > 0 && progress < 50 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 text-warning text-xs rounded-full">
                <AlertCircle className="w-3 h-3" />
                Build projects to solidify learning
              </div>
            )}
            {progress >= 50 && progress < 100 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success text-xs rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Great momentum! Keep going
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
