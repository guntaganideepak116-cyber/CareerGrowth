import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Certification } from '@/data/certificationsData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  DollarSign,
  Users,
  Target,
  Loader2,
} from 'lucide-react';

interface WhyThisModalProps {
  certification: Certification;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhyThisModal({ certification, open, onOpenChange }: WhyThisModalProps) {
  const { profile } = useAuthContext();
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !aiInsight) {
      generateAiInsight();
    }
  }, [open]);

  const generateAiInsight = async () => {
    setLoading(true);
    try {
      const userContext = profile ? 
        `The user is studying ${profile.field || 'an undecided field'} with specialization in ${profile.specialization || 'not yet selected'}. They are in semester ${profile.current_semester || 1} and their career goal is ${profile.career_path || 'not yet defined'}.` :
        'The user has not set up their profile yet.';

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          role: 'coach',
          messages: [
            {
              role: 'user',
              content: `Analyze why the "${certification.name}" certification from ${certification.provider} would be valuable. ${userContext}

              The certification covers: ${certification.skills.join(', ')}.
              It has a value score of ${certification.valueScore}/100 and ${certification.industryAcceptance} industry acceptance.
              The AI recommendation is: ${certification.aiReason}

              Provide a personalized analysis (3-4 paragraphs) covering:
              1. Why this certification matters for their career path
              2. How it aligns with industry demands
              3. The ROI and career acceleration potential
              4. Best time to pursue it based on their current stage

              Keep it conversational and encouraging but realistic.`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI insight');

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
                setAiInsight(fullText);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating insight:', error);
      setAiInsight(`## Why ${certification.name}?\n\n${certification.aiReason}\n\nThis certification offers excellent value for professionals looking to advance in ${certification.skills.join(', ')}. With ${certification.industryAcceptance} industry acceptance and a value score of ${certification.valueScore}%, it's a strong investment in your career.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <DialogTitle>Why {certification.name}?</DialogTitle>
          <DialogDescription>
            Personalized insights based on your career goals
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-center">
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Industry Demand</p>
              <p className="font-medium text-foreground capitalize">{certification.industryAcceptance}</p>
            </div>
            <div className="p-3 bg-success/5 rounded-lg border border-success/10 text-center">
              <Briefcase className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Roles Unlocked</p>
              <p className="font-medium text-foreground">{certification.rolesUnlocked.length}</p>
            </div>
            <div className="p-3 bg-warning/5 rounded-lg border border-warning/10 text-center">
              <DollarSign className="w-5 h-5 text-warning mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Salary Range</p>
              <p className="font-medium text-foreground text-xs">{certification.salaryRange.split('|')[0].trim()}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg text-center">
              <Target className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Value Score</p>
              <p className="font-medium text-foreground">{certification.valueScore}%</p>
            </div>
          </div>

          {/* Career Roles */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Career Roles Unlocked
            </h4>
            <div className="flex flex-wrap gap-2">
              {certification.rolesUnlocked.map((role) => (
                <span key={role} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Who Should Take This
            </h4>
            <div className="flex flex-wrap gap-2">
              {certification.targetAudience.map((audience) => (
                <span key={audience} className="px-3 py-1.5 bg-secondary text-muted-foreground text-sm rounded-lg">
                  {audience}
                </span>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Personalized AI Analysis</h4>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating personalized insights...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {aiInsight.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
