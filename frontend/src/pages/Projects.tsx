
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { seedProjects } from '@/utils/seedProjects';
import { Project } from '@/types/project';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  Star,
  ExternalLink,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Loader2,
  Lock,
  Database,
  Zap
} from 'lucide-react';

export default function Projects() {
  const { user, profile, loading: profileLoading } = useAuthContext();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'free' | 'pro' | 'premium'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Use the new hook for dynamic data
  const { data: projects = [], isLoading: loading, refetch } = useProjects();

  const handleStartProject = (project: Project) => {
    // Check user plan from profile, or default to free
    const userPlan = (profile?.userPlan as ('free' | 'pro' | 'premium')) || 'free';

    // Define access levels
    const levels = { 'free': 0, 'pro': 1, 'premium': 2 };
    const userLevel = levels[userPlan];
    const projectLevel = levels[project.planAccess || 'free'];

    if (projectLevel > userLevel) {
      toast.error(`Upgrade to ${project.planAccess} to access this project`, {
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/subscription')
        }
      });
      return;
    }

    // Start project workspace
    navigate(`/project/${project.id}`);
    toast.success(`Opening ${project.title}`);
  };

  const handleSeedDatabase = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    try {
      // Double check if we need to pass anything
      await seedProjects();
      toast.success('Projects database initialized!');
      refetch();
    } catch (e) {
      console.error(e);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

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

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => (p.planAccess || 'free') === filter);

  const impactColors = {
    high: 'text-success bg-success/10',
    medium: 'text-warning bg-warning/10',
    low: 'text-muted-foreground bg-muted',
  };

  const difficultyColors = {
    beginner: 'text-success bg-success/10',
    intermediate: 'text-warning bg-warning/10',
    advanced: 'text-danger bg-danger/10',
  };

  // Format tier name for display (capitalize)
  const formatTier = (tier: string) => tier.charAt(0).toUpperCase() + tier.slice(1);

  if (profileLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading personalized projects for {profile?.branch ? profile.branch.toUpperCase() : profile?.field}...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Personalized for {profile?.branch ? profile.branch.toUpperCase() : profile?.field}
            </div>
            <h1 className="text-3xl font-bold text-foreground">Projects & Portfolio</h1>
            <p className="mt-2 text-muted-foreground">
              Real-world projects tailored to your field and career goals
            </p>
          </div>

          {/* Admin/Debug Action */}
          {projects.length === 0 && (
            <Button variant="outline" onClick={handleSeedDatabase} disabled={isSeeding}>
              {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
              Initialize Database
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'free', 'pro', 'premium'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilter(tier)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tier
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:shadow-sm'
                }`}
            >
              {tier === 'all' ? 'All Projects' : `${formatTier(tier)} Projects`}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground font-medium">
              No projects available for this specialization yet.
            </p>
            {projects.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Click "Initialize Database" to generate sample projects for your field.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Project Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <Folder className="w-12 h-12 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-border shadow-sm">
                      {project.difficulty?.toUpperCase() || 'INTERMEDIATE'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{project.title}</h3>
                        {project.planAccess && project.planAccess !== 'free' && (
                          <Lock className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{project.industryRelevance || 'Standard industry practice'}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{project.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.requiredSkills?.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0 h-5 font-normal">
                        {skill}
                      </Badge>
                    ))}
                    {(project.requiredSkills?.length || 0) > 3 && (
                      <span className="text-[10px] text-muted-foreground ml-1">
                        +{(project.requiredSkills?.length || 0) - 3} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span className="text-sm font-semibold">{project.resumeStrength || 85}%</span>
                      <span className="text-[10px] text-muted-foreground">Impact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {project.estimatedTime || '4 weeks'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 gap-2 h-9"
                      onClick={() => handleStartProject(project)}
                    >
                      {project.planAccess && project.planAccess !== 'free' ? <Lock className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-9 px-3"
                      onClick={() => setSelectedProject(project)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Portfolio Optimization</h3>
              <p className="text-sm text-muted-foreground mb-3">
                These projects are specifically curated for <strong>{profile?.branch ? profile.branch.toUpperCase() : profile?.field}</strong> to maximize your career growth and resume strength.
              </p>
              <Button variant="hero" size="sm" className="gap-2">
                View Career Roadmap
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
          {selectedProject && (
            <>
              {/* Modal Banner */}
              <div className="relative h-48 w-full bg-muted">
                {selectedProject.thumbnailUrl ? (
                  <img src={selectedProject.thumbnailUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Folder className="w-16 h-16 text-primary/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge className="mb-2 bg-primary text-primary-foreground">{selectedProject.difficulty?.toUpperCase()}</Badge>
                  <h2 className="text-2xl font-bold text-foreground">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Project Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Technologies Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.requiredSkills?.map(skill => (
                        <Badge key={skill} variant="outline" className="px-2 py-1 text-[11px]">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="text-sm font-medium">Resume Impact</span>
                      </div>
                      <span className="text-sm font-bold">{selectedProject.resumeStrength}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <span className="text-sm font-bold">{selectedProject.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                {selectedProject.realWorldUseCase && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      Industry Relevance
                    </h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{selectedProject.realWorldUseCase}"
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 gap-2" onClick={() => handleStartProject(selectedProject)}>
                    {selectedProject.planAccess && selectedProject.planAccess !== 'free' ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    Begin Transformation
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
