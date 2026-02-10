import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { certificationsMap, Certification } from '@/data/certificationsData';
import { Sparkles, Search, Star, Zap, Target, AlertCircle, Loader2, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type FilterType = 'all' | 'high' | 'medium' | 'low';

export default function Certifications() {
  const { user, profile, loading: profileLoading } = useAuthContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

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

  // Optimized: Load certifications using React Query
  const { data: certifications = [], isLoading: loading } = useQuery({
    queryKey: ['certifications', profile?.field, profile?.branch],
    queryFn: async () => {
      if (!profile?.field) return [];

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let data: Certification[] = [];
      // 1. Prioritize Branch
      if (profile.branch && certificationsMap[profile.branch]) {
        data = certificationsMap[profile.branch];
      }
      // 2. Field
      else if (certificationsMap[profile.field]) {
        data = certificationsMap[profile.field];
      }
      // 3. Fallback
      else {
        data = certificationsMap['engineering'] || [];
      }
      return data;
    },
    enabled: !!profile?.field,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Filter certifications
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || cert.industryAcceptance === filterType;
    return matchesSearch && matchesFilter;
  });

  const acceptanceColors = {
    high: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };

  if (profileLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading certifications for {profile?.branch ? profile.branch.toUpperCase() : profile?.field}...
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
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Personalized for {profile?.branch ? profile.branch.toUpperCase() : profile?.field}
            </div>
            <h1 className="text-3xl font-bold text-foreground">Industry Certifications</h1>
            <p className="mt-2 text-muted-foreground">
              Real-world certifications tailored to accelerate your career in {profile?.field}
              {profile?.specialization && ` (${profile.specialization})`}
            </p>
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
            <p className="mt-4 text-muted-foreground">
              {searchQuery ? 'No certifications match your search.' : 'No certifications available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertifications.map((cert, index) => (
              <div
                key={cert.id}
                className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.provider}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${acceptanceColors[cert.industryAcceptance]}`}>
                    {cert.industryAcceptance} acceptance
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{cert.overview}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Value Score</p>
                      <p className="text-sm font-semibold text-foreground">{cert.valueScore}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{cert.timeToComplete}</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Skills Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 4 && (
                      <span className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                        +{cert.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                  <p>💰 Cost: {cert.cost}</p>
                  <p>💼 Salary Range: {cert.salaryRange}</p>
                  {cert.prerequisites.length > 0 && (
                    <p>📋 Prerequisites: {cert.prerequisites.join(', ')}</p>
                  )}
                </div>

                {/* Roles Unlocked */}
                {cert.rolesUnlocked && cert.rolesUnlocked.length > 0 && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs font-medium text-primary mb-1.5">Roles Unlocked:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.rolesUnlocked.map((role) => (
                        <span key={role} className="text-xs text-primary">
                          • {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="hero" size="sm" className="flex-1" asChild>
                    <a href={cert.officialUrl} target="_blank" rel="noopener noreferrer">
                      Enroll Now
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    Save for Later
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
                These certifications are ranked by industry acceptance and career impact for professionals in <strong>{profile?.branch ? profile.branch.toUpperCase() : profile?.field}</strong>. Start with high-acceptance certifications to build credibility.
              </p>
              <Button variant="hero" size="sm">
                View Recommended Path
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
