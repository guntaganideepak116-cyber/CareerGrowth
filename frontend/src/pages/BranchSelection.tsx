import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { branchesMap, fields } from '@/data/fieldsData';
import type { Branch } from '@/data/fieldsData';

export default function BranchSelection() {
    const { user, profile, loading, updateProfile } = useAuthContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Get field info
    const currentField = fields.find(f => f.id === profile?.field);
    const branches = profile?.field ? branchesMap[profile.field] || [] : [];

    // Redirect if not authenticated or no field selected
    if (!loading && !user) {
        navigate('/login');
        return null;
    }

    if (!loading && !profile?.field) {
        navigate('/fields');
        return null;
    }

    // If field doesn't have branches, skip to specializations
    if (!loading && currentField && !currentField.hasBranches) {
        navigate('/specializations');
        return null;
    }

    const handleSelectBranch = async (branch: Branch) => {
        try {
            await updateProfile({ branch: branch.id });
            toast.success(`${branch.name} selected!`);
            // Go to assessment for the chosen field/branch
            navigate(`/field-assessment?field=${profile?.field || 'engineering'}`);
        } catch (error) {
            toast.error('Failed to save selection. Please try again.');
        }
    };

    const filteredBranches = useMemo(() => {
        return branches.filter((branch) =>
            branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [branches, searchQuery]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <span className="text-muted-foreground">Loading...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        {currentField?.name} Branches
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Choose Your Branch</h1>
                    <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                        Select your engineering branch to explore specialized career paths.
                    </p>
                </div>

                {/* Search */}
                <div className="flex gap-3 animate-fade-in max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {searchQuery && (
                        <Button variant="ghost" size="icon" onClick={() => setSearchQuery('')}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Branches Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBranches.map((branch, index) => {
                        const isSelected = profile?.branch === branch.id;
                        return (
                            <div
                                key={branch.id}
                                className={`group relative bg-card rounded-xl border p-6 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up ${isSelected
                                    ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => handleSelectBranch(branch)}
                            >
                                {/* Branch Color Indicator */}
                                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${branch.color}`} />

                                {/* Selected Badge */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                        Selected
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Branch Name */}
                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {branch.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {branch.description}
                                    </p>

                                    {/* Metrics */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Demand</p>
                                            <p className="text-sm font-semibold text-foreground">{branch.demand}</p>
                                        </div>
                                        <div className="h-8 w-px bg-border" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Growth</p>
                                            <p className="text-sm font-semibold text-success">{branch.growth}</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        variant={isSelected ? 'hero' : 'outline'}
                                        className="w-full group-hover:gap-2 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectBranch(branch);
                                        }}
                                    >
                                        {isSelected ? 'Continue' : 'Select Branch'}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredBranches.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No branches match your search criteria.</p>
                        <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2">
                            Clear search
                        </Button>
                    </div>
                )}

                {branches.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No branches available for this field.</p>
                        <Button variant="link" onClick={() => navigate('/fields')} className="mt-2">
                            Choose a different field
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
