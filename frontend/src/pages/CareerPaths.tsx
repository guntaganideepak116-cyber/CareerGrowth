import { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface CareerPath {
  id: string;
  title: string;
  fieldId: string;
  specializationId?: string;
  requiredSkills: string[];
  level: string;
}

export default function CareerPaths() {
  const { user, profile, loading, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);

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

  useEffect(() => {
    if (profile?.field) {
      fetchCareerPaths();
    }
  }, [profile?.field]);

  const fetchCareerPaths = async () => {
    if (!profile?.field) {
      setPathsLoading(false);
      return;
    }

    setPathsLoading(true);
    try {
      const fieldId = profile.field.toLowerCase().trim();
      const specializationId = (profile.specialization || profile.branch || '').toLowerCase().trim();

      console.log(`🔍 Fetching career paths for: ${fieldId} / ${specializationId}`);

      // Query by field first
      const q = query(
        collection(db, 'career_paths'),
        where('fieldId', '==', fieldId)
      );

      const querySnapshot = await getDocs(q);
      let paths = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CareerPath[];

      console.log(`📊 Found ${paths.length} paths for field: ${fieldId}`);

      // Filter by specialization/branch ID if provided
      if (specializationId) {
        const filteredPaths = paths.filter(path => {
          const pathSpec = (path.specializationId || '').toLowerCase().trim();
          const pathBranch = (path.branch || '').toLowerCase().trim();

          // Match if it's the specific specialization OR if it's the broader branch
          return pathSpec === specializationId || pathBranch === specializationId;
        });

        if (filteredPaths.length > 0) {
          paths = filteredPaths;
          console.log(`✅ Filtered to ${paths.length} matches for: ${specializationId}`);
        } else {
          console.warn(`⚠️ No career paths found for ${specializationId}`);
          paths = [];
        }
      }

      // LIMIT to 3 most relevant paths
      if (paths.length > 3) {
        paths = paths.slice(0, 3);
        console.log(`📌 Limited to top 3 most relevant paths`);
      }

      setCareerPaths(paths);
    } catch (error) {
      console.error('Error fetching from Firestore:', error);
      toast.error('Failed to sync career paths.');
    } finally {
      setPathsLoading(false);
    }
  };

  const handleSelectPath = async (path: CareerPath) => {
    setSelectedPath(path.id);
    try {
      await updateProfile({ career_path: path.title });
      toast.success(`${path.title} path selected!`);
      setTimeout(() => navigate('/roadmap'), 1000);
    } catch (error) {
      toast.error('Failed to save selection.');
      setSelectedPath(null);
    }
  };

  const difficultyColors = {
    junior: 'bg-green-100 text-green-700 border-green-200',
    mid: 'bg-blue-100 text-blue-700 border-blue-200',
    senior: 'bg-amber-100 text-amber-700 border-amber-200',
    lead: 'bg-purple-100 text-purple-700 border-purple-200',
    executive: 'bg-red-100 text-red-700 border-red-200'
  };

  if (loading || pathsLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing career nodes...</p>
        </div>
      </DashboardLayout>
    );
  }

  const fieldName = profile?.field?.charAt(0).toUpperCase() + profile?.field?.slice(1) || 'your field';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <Badge variant="outline" className="mb-4 py-1.5 px-4 bg-primary/5 text-primary border-primary/20 flex w-fit gap-2">
            <Briefcase className="w-4 h-4" />
            LIVE CAREER ENGINE
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Career Architecture: {fieldName}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Explore professional roles synchronized directly from the industry core. Each path is mapped to specific skills and seniority grades.
          </p>
        </div>

        {/* Empty State */}
        {careerPaths.length === 0 && (
          <div className="bg-card rounded-2xl border-2 border-dashed border-muted p-16 text-center shadow-sm">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-5 bg-muted rounded-full w-20 h-20 mx-auto flex items-center justify-center opacity-50">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">No Routes Deployed</h3>
              <p className="text-muted-foreground">
                Administrator hasn't deployed career nodes for <span className="font-bold text-primary">{fieldName}</span> yet.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="mt-4">
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Paths List */}
        <div className="grid gap-6">
          {careerPaths.map((path, index) => (
            <div
              key={path.id}
              className={`group bg-card rounded-2xl border-2 p-8 transition-all duration-500 overflow-hidden relative ${selectedPath === path.id
                ? 'border-primary shadow-2xl scale-[1.01]'
                : 'border-border hover:border-primary/40 hover:shadow-xl'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{path.title}</h3>
                      <Badge className={`${difficultyColors[path.level?.toLowerCase() as keyof typeof difficultyColors] || 'bg-muted text-muted-foreground'} border-none uppercase text-[10px] font-bold tracking-widest mt-1 px-3`}>
                        {path.level} NODE
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-tight">
                      <Target className="w-4 h-4 text-primary" />
                      Required Skills Matrix
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {path.requiredSkills?.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted/50 hover:bg-primary/10 transition-colors py-1 px-3 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3 mr-1.5 text-primary" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-muted/50 px-3 py-2 rounded-lg text-center">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Market</p>
                      <p className="text-xs font-bold text-primary">STABLE</p>
                    </div>
                    <div className="bg-muted/50 px-3 py-2 rounded-lg text-center">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Sync</p>
                      <p className="text-xs font-bold text-green-600 flex items-center justify-center gap-1">
                        <Wifi className="h-3 w-3" /> LIVE
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSelectPath(path)}
                    disabled={selectedPath === path.id}
                    className={`h-12 text-md font-bold transition-all ${selectedPath === path.id ? 'bg-green-600 hover:bg-green-600' : 'shadow-lg hover:shadow-primary/30'
                      }`}
                  >
                    {selectedPath === path.id ? (
                      <><CheckCircle2 className="mr-2 h-5 w-5" /> SELECTED</>
                    ) : (
                      <>SELECT PATH <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" /></>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        {careerPaths.length > 0 && (
          <div className="bg-primary/5 rounded-2xl border-2 border-primary/10 p-8 flex gap-6 items-center">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary shrink-0">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1 font-outfit">Synchronized Engineering</h3>
              <p className="text-sm text-muted-foreground">
                All career paths are managed in real-time by the career administrative console. Any changes made by the administrator reflect here instantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout >
  );
}

// Helper to keep Wifi icon
import { Wifi } from 'lucide-react';
