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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {metadata?.name || skillName}
                        {metadata?.category && (
                            <Badge variant="secondary" className="text-xs font-normal">
                                {metadata.category}
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {metadata?.shortDescription || `Learn about ${skillName}`}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading skill details...</div>
                ) : (
                    <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">
                            {metadata?.shortDescription}
                        </p>

                        <div className="space-y-3">
                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                <div className="flex items-center gap-2 mb-1.5 text-primary text-sm font-semibold">
                                    <BookOpen className="w-4 h-4" />
                                    Why it's important
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">
                                    {metadata?.whyImportant}
                                </p>
                            </div>

                            <div className="bg-secondary/30 p-3 rounded-lg border border-secondary">
                                <div className="flex items-center gap-2 mb-1.5 text-foreground text-sm font-semibold">
                                    <Briefcase className="w-4 h-4" />
                                    Real-world Usage
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {metadata?.realWorldUsage}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border mt-4">
                                <span className="text-xs text-muted-foreground">Industry Relevance</span>
                                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                    <TrendingUp className="w-3.5 h-3.5" />
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
