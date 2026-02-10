import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  ArrowRight,
} from 'lucide-react';
import { specializationsMap, Specialization } from '@/data/fieldsData';
import { SpecializationCompare } from '@/components/SpecializationCompare';
import { AssessmentGate } from '@/components/field-assessment/AssessmentGate';

export default function Specializations() {
  const { user, profile, loading, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Get specializations for the field, filtered by branch if applicable
  const allSpecs = profile?.field ? specializationsMap[profile.field] || [] : [];
  const specializations = profile?.branch
    ? allSpecs.filter(spec => spec.branch === profile.branch || !spec.branch) // Show branch-specific or branch-agnostic
    : allSpecs;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (!loading && !profile?.field) {
      navigate('/fields');
      return;
    }
  }, [user, profile?.field, loading, navigate]);

  const handleSelectSpecialization = async (spec: Specialization) => {
    try {
      await updateProfile({ specialization: spec.id });
      toast.success(`${spec.name} selected!`);
      navigate('/career-paths');
    } catch (error) {
      toast.error('Failed to save selection. Please try again.');
    }
  };

  const toggleCompareSelection = (specId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(specId)) {
        return prev.filter((id) => id !== specId);
      }
      if (prev.length < 4) {
        return [...prev, specId];
      }
      toast.warning("You can only compare up to 4 specializations");
      return prev;
    });
  };

  const clearCompareSelection = () => {
    setSelectedForCompare([]);
  };

  const typeColors: Record<string, string> = {
    core: 'bg-primary/10 text-primary',
    emerging: 'bg-success/10 text-success',
    hybrid: 'bg-warning/10 text-warning',
  };

  const riskColors: Record<string, string> = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-6 h-64 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!profile?.field) {
    return null;
  }

  return (
    <DashboardLayout>
      <AssessmentGate
        fieldId={profile?.field || ''}
        sectionName="Specializations"
      >
        <div className="space-y-8 animate-fade-in pb-20">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Specializations in {profile?.field}</h1>
            <p className="mt-2 text-muted-foreground">
              Explore available specializations for your field.
              <span className="text-primary ml-1">Select up to 4 to compare.</span>
            </p>
          </div>

          {/* Specializations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specializations.map((spec, index) => {
              const isSelectedForCompare = selectedForCompare.includes(spec.id);
              return (
                <div
                  key={spec.id}
                  className={`bg-card rounded-xl border p-5 hover:shadow-lg transition-all duration-300 animate-slide-up group flex flex-col cursor-pointer ${isSelectedForCompare ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => toggleCompareSelection(spec.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[spec.type] || 'bg-secondary text-secondary-foreground'}`}>
                        {spec.type.charAt(0).toUpperCase() + spec.type.slice(1)}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2 leading-tight">{spec.name}</h3>
                    </div>
                    <div className="ml-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelectedForCompare}
                        onCheckedChange={() => toggleCompareSelection(spec.id)}
                        disabled={!isSelectedForCompare && selectedForCompare.length >= 4}
                        aria-label={`Select ${spec.name} for comparison`}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{spec.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-secondary/50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Growth</p>
                      <p className="font-semibold text-foreground capitalize text-xs">{spec.growthPotential}</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/50 rounded-lg">
                      <AlertTriangle className={`w-4 h-4 mx-auto mb-1 ${riskColors[spec.riskLevel] || ''}`} />
                      <p className="text-[10px] text-muted-foreground">Risk</p>
                      <p className={`font-semibold capitalize text-xs ${riskColors[spec.riskLevel] || ''}`}>{spec.riskLevel}</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/50 rounded-lg">
                      <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Demand</p>
                      <p className="font-semibold text-foreground text-xs">{spec.marketDemand}%</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {spec.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {spec.skills.length > 4 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
                        +{spec.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="hero"
                      size="sm"
                      className="flex-1 group"
                      onClick={() => handleSelectSpecialization(spec)}
                    >
                      Explore Paths
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate('/ai-mentor')}>
                      Ask AI
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {specializations.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-dashed">
              <p className="text-muted-foreground">No specializations found for this field/branch.</p>
              <Button variant="link" onClick={() => navigate('/fields')} className="mt-2">
                Choose a different field
              </Button>
            </div>
          )}

          {/* Comparison Bar */}
          <SpecializationCompare
            specializations={specializations}
            selectedSpecs={selectedForCompare}
            onToggleSelect={toggleCompareSelection}
            onClearSelection={clearCompareSelection}
          />
        </div>
      </AssessmentGate>
    </DashboardLayout>
  );
}
