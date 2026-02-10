import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CareerPath {
  id: string;
  title: string;
  field: string;
  requiredSkills: string[];
  level: string;
}

export default function CareerPaths() {
  const { user, profile, loading, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (!loading && !profile?.field) {
      toast.error('Please select a field first');
      navigate('/fields');
      return;
    }
  }, [user, profile?.field, loading, navigate]);

  // Optimized: Fetch career paths using React Query with caching
  const { data: careerPaths = [], isLoading: pathsLoading } = useQuery({
    queryKey: ['career_paths', profile?.field],
    queryFn: async () => {
      if (!profile?.field) return [];

      const fieldId = profile.field.toLowerCase().replace(/\s+/g, '-');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/career-paths/structured/${fieldId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.specializations) {
        return data.specializations.flatMap((spec: any) =>
          spec.careers.map((career: any) => ({
            ...career,
            fieldId: data.fieldId,
            field: data.fieldName,
            specializationId: spec.specializationId,
            specializationName: spec.specializationName
          }))
        );
      }
      return [];
    },
    enabled: !!profile?.field,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });

  const handleSelectPath = async (path: CareerPath) => {
    setSelectedPath(path.id);
    try {
      await updateProfile({ career_path: path.title });
      toast.success(`${path.title} path selected!`);
      setTimeout(() => navigate('/roadmap'), 1000);
    } catch (error) {
      toast.error('Failed to save selection. Please try again.');
      setSelectedPath(null);
    }
  };

  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/20',
    intermediate: 'bg-warning/10 text-warning border-warning/20',
    advanced: 'bg-danger/10 text-danger border-danger/20',
  };

  const fieldName = profile?.field?.charAt(0).toUpperCase() + profile?.field?.slice(1) || 'your field';

  const CareerPathSkeleton = () => (
    <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded-full" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        <div className="lg:w-64 grid grid-cols-2 gap-4">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="h-20 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border flex justify-between">
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-10 w-32 bg-muted rounded" />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Career Paths
          </div>
          <h1 className="text-3xl font-bold text-foreground">Career Paths for {fieldName}</h1>
          <p className="mt-2 text-muted-foreground">
            Explore curated career paths personalized for your field. These roles include beginner to advanced level opportunities with skills, salary ranges, and growth potential.
          </p>
        </div>

        {/* Loading State - Skeletons */}
        {(loading || pathsLoading) && (
          <div className="space-y-6">
            <CareerPathSkeleton />
            <CareerPathSkeleton />
            <CareerPathSkeleton />
          </div>
        )}

        {/* Empty State - Clean message, no AI generation */}
        {!loading && !pathsLoading && careerPaths.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No Career Paths Available Yet</h3>
              <p className="text-muted-foreground">
                Career paths for <span className="font-semibold text-primary">{fieldName}</span> are being prepared.
                {profile.specialization && <> Please check back soon or contact your administrator.</>}
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Paths List */}
        <div className="space-y-6">
          {careerPaths.map((path, index) => (
            <div
              key={path.id}
              className={`bg-card rounded-xl border p-6 transition-all duration-300 animate-slide-up ${selectedPath === path.id
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Path Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{path.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${difficultyColors[path.level?.toLowerCase() as keyof typeof difficultyColors] || 'bg-secondary/10 text-secondary border-secondary/20'
                        }`}>
                        {path.level || 'Intermediate'}
                      </span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Required Skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {path.requiredSkills && path.requiredSkills.length > 0 ? (
                        path.requiredSkills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No specific skills listed</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 lg:w-64">
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Briefcase className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Field</p>
                    <p className="font-semibold text-foreground text-xs capitalize">{path.field}</p>
                  </div>
                  <div className="text-center p-3 bg-success/5 rounded-lg border border-success/10">
                    <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="font-semibold text-success text-xs capitalize">{path.level}</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-border gap-4 sm:gap-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Recommended for your {fieldName} journey
                </div>
                <Button
                  onClick={() => handleSelectPath(path)}
                  disabled={selectedPath === path.id}
                  className="group w-full sm:w-auto"
                >
                  {selectedPath === path.id ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    <>
                      Select Path
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        {careerPaths.length > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Career Path Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Select a career path that aligns with your interests and skills. After selection,
                  you'll get a personalized roadmap with projects, certifications, and resources.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
