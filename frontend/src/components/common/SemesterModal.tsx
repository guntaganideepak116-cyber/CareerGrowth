import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Briefcase, TrendingUp, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface SemesterModalProps {
    semesterId: number;
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

interface SemesterMetadata {
    semesterLevel: "foundation" | "core" | "advanced" | "specialization";
    shortDescription: string;
    whyLearn: string;
    careerValue: string;
    industryDemand: string;
}

export function SemesterModal({ semesterId, isOpen, onClose, title }: SemesterModalProps) {
    // Determine level based on semester number (scalable for any field)
    const getLevel = (sem: number) => {
        if (sem <= 2) return "foundation";
        if (sem <= 4) return "core";
        if (sem <= 6) return "advanced";
        return "specialization";
    };

    const level = getLevel(semesterId);

    const { data: metadata, isLoading } = useQuery({
        queryKey: ['semester_metadata', level],
        queryFn: async () => {
            // 1. Fetch generic metadata for this level
            const docRef = doc(db, 'semester_metadata', level);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                return snap.data() as SemesterMetadata;
            }

            // 2. Generate fallback based on level logic
            const fallbacks: Record<string, SemesterMetadata> = {
                foundation: {
                    semesterLevel: "foundation",
                    shortDescription: "Build a strong base in fundamental concepts and theories.",
                    whyLearn: "Mastering the basics is crucial for understanding complex advanced topics later.",
                    careerValue: "Sets the groundwork for all future specialization and problem-solving.",
                    industryDemand: "High - Required for all roles"
                },
                core: {
                    semesterLevel: "core",
                    shortDescription: "Dive deep into the essential subjects of your field.",
                    whyLearn: "These subjects form the core of your professional knowledge toolkit.",
                    careerValue: "Directly applicable to entry-level job requirements and internships.",
                    industryDemand: "Very High"
                },
                advanced: {
                    semesterLevel: "advanced",
                    shortDescription: "Explore complex topics and start applying knowledge practically.",
                    whyLearn: "Bridges the gap between theory and real-world application.",
                    careerValue: "Differentiates you from peers; essential for specialized roles.",
                    industryDemand: "Growing demand for specialized skills"
                },
                specialization: {
                    semesterLevel: "specialization",
                    shortDescription: "Master niche skills and prepare for industry leadership.",
                    whyLearn: "Become an expert in a specific domain to solve unique industry problems.",
                    careerValue: "Opens doors to high-paying, niche roles and senior positions.",
                    industryDemand: "Selective but Premium"
                }
            };

            return fallbacks[level];
        },
        enabled: isOpen,
        staleTime: Infinity,
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {title}
                        <Badge variant="secondary" className="text-xs font-normal capitalize">
                            {metadata?.semesterLevel || level} Level
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {metadata?.shortDescription}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading details...</div>
                ) : (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-3">
                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                <div className="flex items-center gap-2 mb-1.5 text-primary text-sm font-semibold">
                                    <Target className="w-4 h-4" />
                                    Why Learn This?
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">
                                    {metadata?.whyLearn}
                                </p>
                            </div>

                            <div className="bg-secondary/30 p-3 rounded-lg border border-secondary">
                                <div className="flex items-center gap-2 mb-1.5 text-foreground text-sm font-semibold">
                                    <Briefcase className="w-4 h-4" />
                                    Career Value
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {metadata?.careerValue}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border mt-4">
                                <span className="text-xs text-muted-foreground">Industry Demand</span>
                                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    {metadata?.industryDemand}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
