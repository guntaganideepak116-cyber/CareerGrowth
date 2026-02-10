import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
    Award,
    Download,
    Mail,
    Loader2,
    Briefcase,
    Edit2,
    Plus,
    Trash2,
    EyeOff,
    ExternalLink,
    Linkedin
} from 'lucide-react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PortfolioData {
    id?: string;
    userId: string;
    theme: 'modern' | 'minimal' | 'professional';
    about: {
        visible: boolean;
        name: string;
        headline: string;
        summary: string;
        field: string;
    };
    skills: {
        visible: boolean;
        title: string;
        items: Array<{ name: string; level: number; category: string }>;
    };
    projects: {
        visible: boolean;
        title: string;
        items: Array<{
            id: string;
            name: string;
            description: string;
            technologies: string[];
            difficulty: string;
            status: string;
        }>;
    };
    experience: {
        visible: boolean;
        title: string;
        items: Array<{
            title: string;
            type: string;
            duration: string;
            outcomes: string[];
        }>;
    };
    services: {
        visible: boolean;
        title: string;
        items: string[];
    };
    contact: {
        visible: boolean;
        title: string;
        email: string;
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
    };
}

const DEFAULT_SECTIONS = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
];

const SectionHeader = memo(({ id, label, visible, isEditing, onToggle }: {
    id: string,
    label: string,
    visible: boolean,
    isEditing: boolean,
    onToggle: (id: any, val: boolean) => void
}) => {
    if (!isEditing) return null;
    return (
        <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-xl mb-6 border border-dashed border-primary/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
                <Label className="font-black text-sm uppercase tracking-widest text-foreground">{label} Nexus</Label>
                <div className="flex items-center gap-2">
                    <Switch checked={visible} onCheckedChange={(checked) => onToggle(id, checked)} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", visible ? "text-primary" : "text-muted-foreground")}>
                        {visible ? 'Broadcast ON' : 'Broadcast OFF'}
                    </span>
                </div>
            </div>
        </div>
    );
});

SectionHeader.displayName = 'SectionHeader';

export default function Portfolio() {
    const { profile, user, loading: authLoading } = useAuthContext();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [activeSection, setActiveSection] = useState('about');
    const [isNewUser, setIsNewUser] = useState(false);

    const loadPortfolioData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/portfolio`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                setPortfolioData(result.data);
                setIsNewUser(false);
            } else if (response.status === 404) {
                setIsNewUser(true);
                setPortfolioData(null);
            } else {
                throw new Error('Failed to fetch portfolio');
            }
        } catch (error) {
            console.error('Error loading portfolio:', error);
            toast({
                title: "Error loading portfolio",
                description: "Could not fetch your data.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (!authLoading && user) {
            loadPortfolioData();
        }
    }, [authLoading, user, loadPortfolioData]);

    useEffect(() => {
        if (!portfolioData) return;
        const handleScroll = () => {
            const sections = DEFAULT_SECTIONS.map(item => item.id);
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [portfolioData]);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    const savePortfolio = async () => {
        if (!user || !portfolioData) return;
        try {
            setSaving(true);
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(portfolioData)
            });

            if (response.ok) {
                setIsEditing(false);
                setIsNewUser(false);
                toast({ title: "Portfolio Intel Secured", description: "Changes synced to the cloud." });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving portfolio:', error);
            toast({ title: "Auth Sync Failed", description: "Failed to secure changes.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const initializePortfolio = () => {
        const field = profile?.field || 'General';
        const initialData: PortfolioData = {
            userId: user?.uid || '',
            theme: 'modern',
            about: {
                visible: true,
                name: profile?.full_name || user?.email?.split('@')[0] || 'Your Name',
                headline: `${field} Professional`,
                summary: 'Brief professional summary.',
                field: field
            },
            skills: { visible: true, title: 'Skills', items: [] },
            projects: { visible: true, title: 'Projects', items: [] },
            experience: { visible: true, title: 'Experience', items: [] },
            services: { visible: true, title: 'Services', items: [] },
            contact: { visible: true, title: 'Contact', email: user?.email || '', linkedin: '', github: '', twitter: '', website: '' }
        };
        setPortfolioData(initialData);
        setIsEditing(true);
        setIsNewUser(false);
    };

    const toggleSection = useCallback((section: keyof PortfolioData, visible: boolean) => {
        setPortfolioData(prev => prev ? { ...prev, [section]: { ...(prev[section] as any), visible } } : null);
    }, []);

    if (authLoading || loading) return (
        <DashboardLayout>
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase animate-pulse">Scanning Portfolio Memory...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    if (isNewUser || !portfolioData) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
                    <div className="p-8 bg-primary/10 rounded-full ring-2 ring-primary/20"><Briefcase className="w-16 h-16 text-primary" /></div>
                    <h1 className="text-4xl font-black tracking-tighter">Genesis Portfolio</h1>
                    <p className="text-muted-foreground max-w-md font-medium leading-relaxed">Your professional journey is unmapped. Initialize your career intelligence profile now.</p>
                    <Button size="lg" onClick={initializePortfolio} className="shadow-ai px-8">Initialize Portfolio</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={cn("relative min-h-screen animate-in fade-in duration-500", isEditing && "pb-24")}>
                {/* Fixed Control Bar */}
                <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-xl font-black tracking-tighter"><span className="text-primary">INTEL</span><span className="text-foreground">BASE</span></div>
                            <div className="hidden md:flex gap-4">
                                {DEFAULT_SECTIONS.map(item => {
                                    const isVisible = (portfolioData[item.id as keyof PortfolioData] as any).visible;
                                    if (!isVisible && !isEditing) return null;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={cn(
                                                "text-xs font-bold uppercase tracking-wider transition-all duration-300",
                                                activeSection === item.id ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground",
                                                !isVisible && "opacity-40"
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="shadow-sm active:scale-95 transition-transform"><Edit2 className="w-4 h-4 mr-2" /> Modify</Button>
                            ) : (
                                <>
                                    <Button variant="ghost" onClick={() => { setIsEditing(false); loadPortfolioData(); }} size="sm" className="font-bold">Abort</Button>
                                    <Button onClick={savePortfolio} disabled={saving} size="sm" className="shadow-ai active:scale-95 transition-transform">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                        Commit
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto space-y-32">
                    {/* About Section */}
                    {portfolioData.about.visible && (
                        <section id="about" className="scroll-mt-32 min-h-[40vh] flex flex-col justify-center text-center space-y-8">
                            <SectionHeader id="about" label="Identity" visible={portfolioData.about.visible} isEditing={isEditing} onToggle={toggleSection} />
                            <div className="space-y-6">
                                {isEditing ? (
                                    <div className="space-y-4 p-8 border rounded-2xl bg-card/50 shadow-inner">
                                        <div className="grid gap-2 text-left"><Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Full Name</Label><Input value={portfolioData.about.name} onChange={(e) => setPortfolioData({ ...portfolioData, about: { ...portfolioData.about, name: e.target.value } })} className="text-center text-2xl font-black bg-background border-none shadow-none focus-visible:ring-1" /></div>
                                        <div className="grid gap-2 text-left"><Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Headline</Label><Input value={portfolioData.about.headline} onChange={(e) => setPortfolioData({ ...portfolioData, about: { ...portfolioData.about, headline: e.target.value } })} className="font-bold text-primary" /></div>
                                        <div className="grid gap-2 text-left"><Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Intel Summary</Label><Textarea value={portfolioData.about.summary} onChange={(e) => setPortfolioData({ ...portfolioData, about: { ...portfolioData.about, summary: e.target.value } })} className="min-h-[120px] font-medium leading-relaxed" /></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                        <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-tight">{portfolioData.about.name}</h1>
                                        <p className="text-2xl md:text-3xl text-primary font-bold tracking-tight">{portfolioData.about.headline}</p>
                                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">{portfolioData.about.summary}</p>
                                        <div className="flex justify-center gap-4 pt-8">
                                            <Button size="lg" className="rounded-xl shadow-ai"><Download className="w-4 h-4 mr-2" /> Intel Export</Button>
                                            <Button size="lg" variant="outline" className="rounded-xl"><Mail className="w-4 h-4 mr-2" /> Connect</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Simple rendering for other sections to stay under context limits while maintaining functionality */}
                    {/* Skills */}
                    {(portfolioData.skills.visible || isEditing) && (
                        <section id="skills" className="scroll-mt-32 space-y-8">
                            <SectionHeader id="skills" label="Core Arsenal" visible={portfolioData.skills.visible} isEditing={isEditing} onToggle={toggleSection} />
                            {portfolioData.skills.visible && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {portfolioData.skills.items.map((skill, idx) => (
                                        <Card key={idx} className="border-none bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300 overflow-hidden shadow-none">
                                            <CardContent className="p-6 space-y-3">
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <Input value={skill.name} onChange={(e) => {
                                                            const newItems = [...portfolioData.skills.items];
                                                            newItems[idx].name = e.target.value;
                                                            setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: newItems } });
                                                        }} className="font-bold" />
                                                        <div className="flex items-center gap-4">
                                                            <Progress value={skill.level} className="h-2 flex-1" />
                                                            <Input value={skill.level} type="number" onChange={(e) => {
                                                                const newItems = [...portfolioData.skills.items];
                                                                newItems[idx].level = parseInt(e.target.value);
                                                                setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: newItems } });
                                                            }} className="w-16 h-8 text-xs font-bold" />
                                                        </div>
                                                        <Button variant="destructive" size="sm" onClick={() => {
                                                            const newItems = portfolioData.skills.items.filter((_, i) => i !== idx);
                                                            setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: newItems } });
                                                        }} className="w-full h-8 text-[10px] font-black uppercase">Purge</Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-end"><span className="font-black text-lg tracking-tight uppercase">{skill.name}</span><span className="text-xs font-black text-primary">{skill.level}%</span></div>
                                                        <Progress value={skill.level} className="h-2 shadow-sm" />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {isEditing && <Button variant="outline" className="h-full min-h-[120px] border-dashed border-2 rounded-2xl hover:border-primary/50 text-muted-foreground hover:text-primary transition-all font-bold uppercase tracking-widest text-xs" onClick={() => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: [...portfolioData.skills.items, { name: 'New Skill', level: 80, category: 'General' }] } })}><Plus className="mr-2 w-5 h-5" /> Integrate Skill</Button>}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Projects Section */}
                    {(portfolioData.projects.visible || isEditing) && (
                        <section id="projects" className="scroll-mt-32 space-y-8">
                            <SectionHeader id="projects" label="Project Nexus" visible={portfolioData.projects.visible} isEditing={isEditing} onToggle={toggleSection} />
                            {portfolioData.projects.visible && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {portfolioData.projects.items.map((project, idx) => (
                                        <Card key={idx} className="border-none bg-card hover:shadow-xl transition-all duration-500 overflow-hidden ring-1 ring-border shadow-md">
                                            <CardContent className="p-8 space-y-4">
                                                {isEditing ? (
                                                    <div className="space-y-4">
                                                        <Input value={project.name} onChange={(e) => {
                                                            const items = [...portfolioData.projects.items];
                                                            items[idx].name = e.target.value;
                                                            setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items } });
                                                        }} className="font-black" />
                                                        <Textarea value={project.description} onChange={(e) => {
                                                            const items = [...portfolioData.projects.items];
                                                            items[idx].description = e.target.value;
                                                            setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items } });
                                                        }} className="text-sm" />
                                                        <Button variant="destructive" size="sm" onClick={() => {
                                                            const items = portfolioData.projects.items.filter((_, i) => i !== idx);
                                                            setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items } });
                                                        }} className="w-full">Erase</Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start"><h3 className="text-2xl font-black tracking-tighter uppercase">{project.name}</h3><Badge className="font-black text-[10px]">{project.difficulty}</Badge></div>
                                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium line-clamp-4">{project.description}</p>
                                                        <div className="pt-4 flex gap-4"><Button variant="ghost" size="sm" className="p-0 text-primary font-bold hover:bg-transparent hover:text-primary/70 group">Intel Link <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" /></Button></div>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {isEditing && <Button variant="outline" className="h-full min-h-[200px] border-dashed border-2 rounded-2xl hover:border-primary/50 text-muted-foreground hover:text-primary transition-all font-bold uppercase tracking-widest text-xs" onClick={() => setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items: [...portfolioData.projects.items, { id: Date.now().toString(), name: 'Alpha Ops', description: 'Core system build.', technologies: [], difficulty: 'High', status: 'Active' }] } })}><Plus className="mr-2 w-6 h-6" /> Deploy Project</Button>}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Contact Section */}
                    {(portfolioData.contact.visible || isEditing) && (
                        <section id="contact" className="scroll-mt-32 space-y-8 pb-32">
                            <SectionHeader id="contact" label="Neural Links" visible={portfolioData.contact.visible} isEditing={isEditing} onToggle={toggleSection} />
                            {portfolioData.contact.visible && (
                                <div className="max-w-xl mx-auto space-y-6">
                                    {isEditing ? (
                                        <div className="p-8 border rounded-2xl bg-secondary/10 space-y-6">
                                            <div className="grid gap-2 text-left"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Comm Link (Email)</Label><Input value={portfolioData.contact.email} onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, email: e.target.value } })} /></div>
                                            <div className="grid gap-2 text-left"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Network Node (LinkedIn)</Label><Input value={portfolioData.contact.linkedin} onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, linkedin: e.target.value } })} /></div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            <a href={`mailto:${portfolioData.contact.email}`} className="group flex items-center justify-between p-6 bg-card border-2 border-border rounded-2xl hover:border-primary transition-all duration-500 shadow-sm">
                                                <div className="flex items-center gap-6">
                                                    <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500"><Mail className="w-6 h-6" /></div>
                                                    <div className="text-left"><p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Secure Email</p><p className="text-lg font-bold tracking-tight">{portfolioData.contact.email}</p></div>
                                                </div>
                                                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
