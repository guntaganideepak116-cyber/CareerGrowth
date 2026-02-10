import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ExpandableInfoSection } from './ExpandableInfoSection';

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
    const [activeSection, setActiveSection] = useState<string | null>('important');

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

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
            <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-primary/20 shadow-2xl overflow-hidden p-0">
                <div className="p-6 pb-4 border-b border-border/50">
                    <DialogHeader>
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
                </div>

                <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-sm text-muted-foreground animate-pulse">Fetching intelligence...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ExpandableInfoSection
                                title="Why it's important"
                                content={metadata?.whyImportant}
                                icon={BookOpen}
                                isOpen={activeSection === 'important'}
                                onToggle={() => toggleSection('important')}
                                variant="primary"
                            />

                            <ExpandableInfoSection
                                title="Real-world Usage"
                                content={metadata?.realWorldUsage}
                                icon={Briefcase}
                                isOpen={activeSection === 'usage'}
                                onToggle={() => toggleSection('usage')}
                                variant="blue"
                            />

                            <ExpandableInfoSection
                                title="Industry Demand"
                                content={metadata ? `Current market trends show ${metadata.industryRelevance} for specialists in ${metadata.name}. Candidates with these skills are highly prioritized in modern tech recruitment.` : null}
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
