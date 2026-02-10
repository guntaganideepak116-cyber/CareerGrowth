import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface SkillModalProps {
    skillId: string;
    isOpen: boolean;
    onClose: () => void;
    skillName: string;
}

interface SkillMetadata {
    name: string;
    shortDescription: string;
    whyImportant: string;
    realWorldUsage: string;
    industryRelevance: string;
    category: string;
}

export function SkillModal({ skillId, isOpen, onClose, skillName }: SkillModalProps) {
    // Normalize ID
    const normalizedId = skillId.toLowerCase().replace(/\s+/g, '-');

    const { data: metadata, isLoading } = useQuery({
        queryKey: ['skill_metadata', normalizedId],
        queryFn: async () => {
            // 1. Try fetching from generic skills collection
            const docRef = doc(db, 'skills_metadata', normalizedId);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                return snap.data() as SkillMetadata;
            }

            // 2. Generate fallback if missing (or your API could do this)
            return {
                name: skillName,
                shortDescription: `Learn the fundamentals and advanced concepts of ${skillName}.`,
                whyImportant: `${skillName} is a critical skill in today's technology landscape, enabling you to build robust solutions.`,
                realWorldUsage: `Used in production environments for building scalable applications and solving complex problems with ${skillName}.`,
                industryRelevance: "High Demand",
                category: "Technical Skill"
            } as SkillMetadata;
        },
        enabled: isOpen && !!skillId,
        staleTime: Infinity, // Metadata rarely changes
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-primary/20 shadow-2xl overflow-hidden">
                <DialogHeader className="pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            {metadata?.name || skillName}
                        </DialogTitle>
                        {metadata?.category && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1">
                                {metadata.category}
                            </Badge>
                        )}
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-2 font-medium">
                        {metadata?.shortDescription || `Master the essentials of ${skillName}`}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground animate-pulse">Fetching intelligence...</p>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Why it's important section */}
                        <div className="group">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-sm uppercase tracking-wider">Why it's important</h4>
                            </div>
                            <div className="pl-11 pr-2">
                                <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                                    {metadata?.whyImportant}
                                </p>
                            </div>
                        </div>

                        {/* Real-world Usage section */}
                        <div className="group">
                            <div className="flex items-center gap-2 mb-2 text-blue-600">
                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-sm uppercase tracking-wider">Real-world Usage</h4>
                            </div>
                            <div className="pl-11 pr-2">
                                <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-blue-200 pl-4 py-1">
                                    {metadata?.realWorldUsage}
                                </p>
                            </div>
                        </div>

                        {/* Market/Industry section */}
                        <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 text-green-700">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Industry Demand</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">
                                    {metadata?.industryRelevance}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
