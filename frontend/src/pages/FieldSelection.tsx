import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fields, Field } from '@/data/fieldsData';
import { FieldCard } from '@/components/fields/FieldCard';

type DemandFilter = 'all' | 'Very High' | 'High' | 'Moderate';

export default function FieldSelection() {
  const { user, profile, loading, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [demandFilter, setDemandFilter] = useState<DemandFilter>('all');

  // Redirect if not authenticated
  if (!loading && !user) {
    navigate('/login');
    return null;
  }

  const handleSelectField = async (field: Field) => {
    try {
      await updateProfile({ field: field.id });
      toast.success(`${field.name} selected!`);

      // Redirect to field assessment page
      navigate(`/field-assessment?field=${field.id}`);
    } catch (error) {
      toast.error('Failed to save selection. Please try again.');
    }
  };


  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const matchesSearch =
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDemand = demandFilter === 'all' || field.demand === demandFilter;
      return matchesSearch && matchesDemand;
    });
  }, [searchQuery, demandFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setDemandFilter('all');
  };

  const hasActiveFilters = searchQuery || demandFilter !== 'all';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Career Fields
          </div>
          <h1 className="text-3xl font-bold text-foreground">Choose Your Field</h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Select from 13 major career fields to start your personalized journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Demand
                {demandFilter !== 'all' && (
                  <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {demandFilter}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              <DropdownMenuLabel>Filter by Demand</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={demandFilter === 'all'}
                onCheckedChange={() => setDemandFilter('all')}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={demandFilter === 'Very High'}
                onCheckedChange={() => setDemandFilter('Very High')}
              >
                Very High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={demandFilter === 'High'}
                onCheckedChange={() => setDemandFilter('High')}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={demandFilter === 'Moderate'}
                onCheckedChange={() => setDemandFilter('Moderate')}
              >
                Moderate
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredFields.length} of {fields.length} fields
          </p>
        )}

        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFields.map((field, index) => {
            const isSelected = profile?.field === field.id;
            return (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={isSelected}
                onClick={() => handleSelectField(field)}
                animationDelay={`${index * 0.05}s`}
              />
            );
          })}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No fields match your search criteria.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
