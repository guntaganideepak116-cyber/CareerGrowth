
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
  Database
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
            <p className="mt-4 text-muted-foreground">
              No projects available for this selection.
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
                className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg transition-transform group-hover:scale-110">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{project.title}</h3>
                        {project.planAccess && project.planAccess !== 'free' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-600 border border-purple-200">
                            {formatTier(project.planAccess)}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[project.difficulty]}`}>
                        {formatTier(project.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                {/* Skills - Replaced Tech Stack */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredSkills?.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {(project.requiredSkills?.length || 0) > 4 && (
                      <span className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">+{project.requiredSkills!.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-foreground">{project.resumeStrength || 0}%</span>
                    <span className="text-xs text-muted-foreground">Resume Impact</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className={`w-4 h-4 ${impactColors[project.careerImpact || 'medium'].split(' ')[0]}`} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${impactColors[project.careerImpact || 'medium']}`}>
                      {project.careerImpact || 'Medium'} impact
                    </span>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                  <p>⏱️ Estimated Time: {project.estimatedTime || 'Self-paced'}</p>
                  <p>💼 Real-world: {project.industryRelevance || 'Standard industry practice'}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant={project.planAccess && project.planAccess !== 'free' ? "outline" : "default"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleStartProject(project)}
                  >
                    {project.planAccess && project.planAccess !== 'free' ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {project.planAccess && project.planAccess !== 'free' ? 'Unlock Project' : 'Start Project'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedProject(project)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Details
                  </Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              {selectedProject?.title}
              {selectedProject?.planAccess && selectedProject.planAccess !== 'free' && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-200">
                  {formatTier(selectedProject.planAccess)}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject?.requiredSkills?.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground">Estimated Time</p>
                <p className="text-sm font-semibold">{selectedProject?.estimatedTime}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground">Resume Impact</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  {selectedProject?.resumeStrength}%
                </p>
              </div>
            </div>

            {selectedProject?.industryRelevance && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Real World Application
                </h4>
                <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                  {selectedProject.industryRelevance}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
