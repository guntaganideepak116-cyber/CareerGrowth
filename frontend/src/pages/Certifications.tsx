
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCertifications } from '@/hooks/useCertifications';
import { seedCertifications } from '@/utils/seedCertifications';
import { Sparkles, Search, Star, Zap, Target, AlertCircle, Loader2, Award, Database, Lock, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { streamChat } from '@/lib/ai-chat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Send, Terminal } from 'lucide-react';
import { Certification } from '@/types/certification';

type FilterType = 'all' | 'high' | 'medium' | 'low';

export default function Certifications() {
  const { user, profile, loading: profileLoading } = useAuthContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isSeeding, setIsSeeding] = useState(false);

  // Roadmap AI State
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapText, setRoadmapText] = useState('');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Certification Details Modal State
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

  // Load certifications dynamic
  const { data: certifications = [], isLoading: loading, refetch } = useCertifications();

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate('/login');
    }
  }, [user, navigate, profileLoading]);

  // Check if user has selected field
  useEffect(() => {
    if (!profileLoading && !profile?.field) {
      toast.error('Please select your field first');
      navigate('/fields');
    }
  }, [profile?.field, profileLoading, navigate]);

  const handleSeedDatabase = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    try {
      await seedCertifications();
      toast.success('Certifications database initialized!');
      refetch();
    } catch (e) {
      console.error(e);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  const generateAIRoadmap = async () => {
    if (isGeneratingRoadmap) return;

    setRoadmapText('');
    setShowRoadmapModal(true);
    setIsGeneratingRoadmap(true);

    const userContext = `
      User Field: ${profile?.field}
      User Specialization: ${profile?.specialization || 'None'}
      User Branch: ${profile?.branch || 'None'}
      Current Level: ${profile?.career_phase || 'Student'}
    `;

    const prompt = `Generate a highly professional and structured industry certification roadmap for a professional in the ${profile?.field} field (Specialization: ${profile?.specialization || 'General'}). 
    
    The response should:
    1. Start with a brief career path overview.
    2. List 4-6 specific industry certifications in order (Beginner -> Advanced).
    3. For each certification, include:
       - 🎯 Name & Provider
       - 💡 Why it matters
       - ⏱️ Approx. time to complete
       - 💰 Career impact / Salary boost
    4. Provide a "Pro Tip" for clearing these certifications.
    
    Keep the formatting clean with markdown, using bolding and bullet points. Use standard icons like 🚀, 💎, 📈 where appropriate.`;

    try {
      await streamChat({
        messages: [
          { role: 'user', content: prompt }
        ],
        role: 'Certification Strategist',
        onDelta: (delta) => setRoadmapText(prev => prev + delta),
        onDone: () => setIsGeneratingRoadmap(false),
        onError: (err) => {
          toast.error(err);
          setIsGeneratingRoadmap(false);
        }
      });
    } catch (error) {
      console.error('Roadmap error:', error);
      setIsGeneratingRoadmap(false);
    }
  };

  const userPlan = (profile?.userPlan as 'free' | 'pro' | 'premium') || 'free';
  const planLevels = { 'free': 0, 'pro': 1, 'premium': 2 };

  const filteredCertifications = certifications.filter(cert => {
    if (!cert) return false;
    try {
      const term = (searchQuery || '').toLowerCase().trim();
      const title = String(cert.title || '').toLowerCase();
      const provider = String(cert.provider || '').toLowerCase();

      const matchesSearch = !term || title.includes(term) || provider.includes(term);

      // Acceptance Level Filter
      const matchesFilter = filterType === 'all' || cert.industryRecognitionLevel === filterType;

      return matchesSearch && matchesFilter;
    } catch (e) {
      console.warn("Cert filter fail-safe:", e);
      return false;
    }
  });

  const acceptanceColors = {
    high: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-slate-500/10 text-slate-500',
  };

  if (profileLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Tailoring certifications for your career path...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Personalized for {profile?.specialization || profile?.branch || profile?.field}
              </div>
              <h1 className="text-3xl font-bold text-foreground">Industry Certifications</h1>
              <p className="mt-2 text-muted-foreground">
                High-impact certifications for <strong>{profile?.field}</strong>
                {profile?.specialization && ` - ${profile.specialization}`}
              </p>
            </div>
            {/* Admin/Debug Action */}
            {certifications.length === 0 && (
              <Button variant="outline" onClick={handleSeedDatabase} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                Initialize Database
              </Button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search certifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:shadow-sm'
                    }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)} Acceptance
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        {filteredCertifications.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground font-medium">
              {searchQuery ? 'No certifications match your search.' : 'No certifications available for this specialization yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertifications.map((cert, index) => (
              <div
                key={cert.id}
                className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    {cert.logoUrl ? (
                      <div className="w-12 h-12 rounded-lg bg-white p-2 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <img src={cert.logoUrl} alt={cert.provider} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{cert.title || 'Unknown Certification'}</h3>
                        <Badge variant={cert.planAccess === 'free' ? 'secondary' : 'outline'} className={cn(
                          "text-[10px] px-1.5 py-0.5 h-4 shadow-sm shrink-0",
                          cert.planAccess === 'pro' && "border-amber-500 text-amber-500",
                          cert.planAccess === 'premium' && "border-purple-500 text-purple-500"
                        )}>
                          {(cert.planAccess || 'free').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{cert.provider || 'Industry Standard'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${acceptanceColors[(cert.industryRecognitionLevel || 'medium') as keyof typeof acceptanceColors]}`}>
                    {cert.industryRecognitionLevel || 'medium'} acceptance
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{cert.description || 'Professional industry accreditation.'}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Value Score</p>
                      <p className="text-sm font-semibold text-foreground">{cert.valueScore || '85'}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{cert.timeToComplete || cert.duration || 'Self-paced'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="default" size="sm" className="flex-1 gap-2" asChild>
                    <a href={cert.officialUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => !cert.officialUrl && e.preventDefault()}>
                      <ExternalLink className="w-4 h-4" />
                      Enroll Now
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedCertification(cert)}>
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Certification Roadmap</h3>
              <p className="text-sm text-muted-foreground mb-3">
                These certifications are ranked by industry acceptance and career impact for professionals in <strong>{profile?.field || 'your field'}</strong>. Start with high-acceptance certifications to build credibility.
              </p>
              <Button variant="hero" size="sm" onClick={generateAIRoadmap} disabled={isGeneratingRoadmap}>
                {isGeneratingRoadmap ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Field...</>
                ) : (
                  'View Recommended Path'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Roadmap Modal */}
        <Dialog open={showRoadmapModal} onOpenChange={setShowRoadmapModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>AI Career Roadmap</DialogTitle>
                  <DialogDescription>
                    Tailored path for {profile?.field} • Generated in real-time
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
              {roadmapText ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-secondary/30 p-4 rounded-xl border border-border">
                  {roadmapText}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse text-sm">
                    AI is analyzing market trends and industry requirements...
                  </p>
                </div>
              )}
            </div>

            {!isGeneratingRoadmap && roadmapText && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowRoadmapModal(false)}>
                  Close Roadmap
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Certification Details Modal */}
      <Dialog open={!!selectedCertification} onOpenChange={(open) => !open && setSelectedCertification(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCertification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  {selectedCertification.logoUrl ? (
                    <div className="w-16 h-16 rounded-xl bg-white p-3 border border-border flex items-center justify-center shadow-sm">
                      <img src={selectedCertification.logoUrl} alt={selectedCertification.provider} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-2xl">{selectedCertification.title}</DialogTitle>
                    <p className="text-muted-foreground">{selectedCertification.provider} • {selectedCertification.certificationType || 'Industry Certification'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{selectedCertification.level?.toUpperCase()}</Badge>
                  <Badge variant="outline" className="border-primary text-primary">{selectedCertification.industryRecognitionLevel?.toUpperCase()} RECOGNITION</Badge>
                  <Badge variant="outline">{selectedCertification.cost || 'Contact Provider'}</Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Overview
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedCertification.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Key Skills Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertification.skillsCovered?.map(skill => (
                        <Badge key={skill} variant="secondary" className="px-2 py-0 rounded text-[11px]">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Career Relevance</h4>
                      <p className="text-xs text-muted-foreground">{selectedCertification.salaryImpact ? `Expected Salary Boost: ${selectedCertification.salaryImpact}` : 'High industry demand'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Duration</h4>
                      <p className="text-xs text-muted-foreground">{selectedCertification.duration || selectedCertification.timeToComplete}</p>
                    </div>
                  </div>
                </div>

                {selectedCertification.eligibility && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Eligibility</h4>
                    <p className="text-xs text-muted-foreground">{selectedCertification.eligibility}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 gap-2" asChild>
                    <a href={selectedCertification.officialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Enroll on Official Site
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedCertification(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
