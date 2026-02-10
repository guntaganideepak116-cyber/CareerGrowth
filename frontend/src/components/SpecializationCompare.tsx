import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, TrendingUp, AlertTriangle, Users, Scale } from 'lucide-react';
import { type Specialization } from '@/data/fieldsData';

interface SpecializationCompareProps {
  specializations: Specialization[];
  selectedSpecs: string[];
  onToggleSelect: (id: string) => void;
  onClearSelection: () => void;
}

export function SpecializationCompare({
  specializations,
  selectedSpecs,
  onToggleSelect,
  onClearSelection,
}: SpecializationCompareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSpecializations = specializations.filter((s) => selectedSpecs.includes(s.id));

  const typeColors = {
    core: 'bg-primary/10 text-primary',
    emerging: 'bg-success/10 text-success',
    hybrid: 'bg-warning/10 text-warning',
  };

  const riskColors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
  };

  const growthColors = {
    high: 'text-success',
    medium: 'text-warning',
    low: 'text-danger',
  };

  if (selectedSpecs.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-card border border-border rounded-xl shadow-xl p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedSpecs.length} selected
          </span>
        </div>

        <div className="flex -space-x-2">
          {selectedSpecializations.slice(0, 3).map((spec) => (
            <div
              key={spec.id}
              className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
            >
              {spec.name.charAt(0)}
            </div>
          ))}
          {selectedSpecs.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
              +{selectedSpecs.length - 3}
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" disabled={selectedSpecs.length < 2}>
              Compare
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Specialization Comparison
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Criteria</th>
                    {selectedSpecializations.map((spec) => (
                      <th key={spec.id} className="text-left py-3 px-4 min-w-[200px]">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[spec.type]}`}>
                            {spec.type}
                          </span>
                          <span className="font-semibold text-foreground text-sm">{spec.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-4 text-muted-foreground text-sm">Description</td>
                    {selectedSpecializations.map((spec) => (
                      <td key={spec.id} className="py-4 px-4 text-foreground text-sm">
                        {spec.description}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/30">
                    <td className="py-4 px-4 text-muted-foreground text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Growth Potential
                    </td>
                    {selectedSpecializations.map((spec) => (
                      <td key={spec.id} className="py-4 px-4">
                        <span className={`font-semibold capitalize ${growthColors[spec.growthPotential]}`}>
                          {spec.growthPotential}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-muted-foreground text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Level
                    </td>
                    {selectedSpecializations.map((spec) => (
                      <td key={spec.id} className="py-4 px-4">
                        <span className={`font-semibold capitalize ${riskColors[spec.riskLevel]}`}>
                          {spec.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/30">
                    <td className="py-4 px-4 text-muted-foreground text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Market Demand
                    </td>
                    {selectedSpecializations.map((spec) => (
                      <td key={spec.id} className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full max-w-[100px]">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${spec.marketDemand}%` }}
                            />
                          </div>
                          <span className="font-semibold text-foreground text-sm">{spec.marketDemand}%</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-muted-foreground text-sm">Key Skills</td>
                    {selectedSpecializations.map((spec) => (
                      <td key={spec.id} className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {spec.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
