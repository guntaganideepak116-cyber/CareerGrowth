import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Briefcase, TrendingUp, Target, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ExpandableInfoSection } from './ExpandableInfoSection';

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
    const [activeSection, setActiveSection] = useState<string | null>('why');

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Determine level based on semester number
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
            const docRef = doc(db, 'semester_metadata', level);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                return snap.data() as SemesterMetadata;
            }

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
            <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-primary/20 shadow-2xl overflow-hidden p-0">
                <div className="p-6 pb-4 border-b border-border/50">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                {title}
                            </DialogTitle>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 capitalize">
                                {metadata?.semesterLevel || level} Level
                            </Badge>
                        </div>
                        <DialogDescription className="text-sm text-muted-foreground mt-2 font-medium">
                            {metadata?.shortDescription}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-sm text-muted-foreground animate-pulse">Loading intelligence...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ExpandableInfoSection
                                title="Why Learn This?"
                                content={metadata?.whyLearn}
                                icon={Target}
                                isOpen={activeSection === 'why'}
                                onToggle={() => toggleSection('why')}
                                variant="primary"
                            />

                            <ExpandableInfoSection
                                title="Career Value"
                                content={metadata?.careerValue}
                                icon={Briefcase}
                                isOpen={activeSection === 'career'}
                                onToggle={() => toggleSection('career')}
                                variant="blue"
                            />

                            <ExpandableInfoSection
                                title="Industry Demand"
                                content={metadata?.industryDemand}
                                icon={TrendingUp}
                                isOpen={activeSection === 'demand'}
                                onToggle={() => toggleSection('demand')}
                                variant="emerald"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
