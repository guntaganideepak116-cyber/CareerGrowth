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
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PortfolioData {
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

export default function Portfolio() {
    const { profile, user, loading: authLoading } = useAuthContext();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [activeSection, setActiveSection] = useState('about');
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            loadPortfolioData();
        }
    }, [authLoading, user]);

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

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const loadPortfolioData = async () => {
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
    };

    const savePortfolio = async () => {
        if (!user || !portfolioData) return;
        try {
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
                toast({ title: "Success", description: "Portfolio updated successfully." });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving portfolio:', error);
            toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" });
        }
    };

    const initializePortfolio = () => {
        const field = profile?.field || 'General';
        const initialData: PortfolioData = {
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

    // State updaters
    const updateAbout = (key: string, value: any) => portfolioData && setPortfolioData({ ...portfolioData, about: { ...portfolioData.about, [key]: value } });
    const updateSectionVisibility = (section: keyof PortfolioData, visible: boolean) => portfolioData && setPortfolioData({ ...portfolioData, [section]: { ...(portfolioData[section] as any), visible } });
    const addSkill = () => portfolioData && setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: [...portfolioData.skills.items, { name: '', level: 50, category: 'General' }] } });
    const updateSkill = (idx: number, key: string, val: any) => {
        if (!portfolioData) return;
        const newItems = [...portfolioData.skills.items];
        newItems[idx] = { ...newItems[idx], [key]: val };
        setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: newItems } });
    };
    const removeSkill = (idx: number) => portfolioData && setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, items: portfolioData.skills.items.filter((_, i) => i !== idx) } });

    if (authLoading || loading) return <DashboardLayout><div className="flex h-screen items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div></DashboardLayout>;

    if (isNewUser || !portfolioData) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                    <div className="p-6 bg-primary/10 rounded-full"><Briefcase className="w-16 h-16 text-primary" /></div>
                    <h1 className="text-3xl font-bold">Create Your Professional Portfolio</h1>
                    <p className="text-muted-foreground max-w-md">Showcase your career journey.</p>
                    <Button size="lg" onClick={initializePortfolio}>Build My Portfolio</Button>
                </div>
            </DashboardLayout>
        );
    }

    const SectionHeader = ({ id, title, label }: { id: keyof PortfolioData, title: string, label: string }) => {
        if (!isEditing) return null;
        const isVisible = (portfolioData[id] as any).visible;
        return (
            <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg mb-4 border border-dashed border-primary/50">
                <div className="flex items-center gap-4">
                    <Label className="font-bold text-lg">{label} Settings</Label>
                    <div className="flex items-center gap-2">
                        <Switch checked={isVisible} onCheckedChange={(checked) => updateSectionVisibility(id, checked)} />
                        <span className="text-sm text-muted-foreground">{isVisible ? 'Visible' : 'Hidden'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className={cn("relative min-h-screen", isEditing && "pb-24")}>
                <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="text-lg font-bold"><span className="text-primary">My</span><span className="text-foreground">Portfolio</span></div>
                        <div className="hidden md:flex gap-6">
                            {DEFAULT_SECTIONS.map(item => {
                                const isVisible = (portfolioData[item.id as keyof PortfolioData] as any).visible;
                                if (!isVisible && !isEditing) return null;
                                return (
                                    <button key={item.id} onClick={() => scrollToSection(item.id)} className={cn("text-sm font-medium transition-colors hover:text-primary", activeSection === item.id ? "text-primary" : "text-muted-foreground", !isVisible && "opacity-50")}>
                                        {item.label} {!isVisible && <EyeOff className="inline w-3 h-3 ml-1" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            {!isEditing ? <Button onClick={() => setIsEditing(true)} size="sm" variant="outline"><Edit2 className="w-4 h-4 mr-2" /> Edit</Button> : <><Button variant="ghost" onClick={() => { setIsEditing(false); loadPortfolioData(); }} size="sm">Cancel</Button><Button onClick={savePortfolio} size="sm">Save</Button></>}
                        </div>
                    </div>
                </nav>

                <div className="max-w-5xl mx-auto px-6 py-12 space-y-24">
                    {/* About */}
                    {portfolioData.about.visible && (
                        <section id="about" className="scroll-mt-24 min-h-[50vh] flex flex-col justify-center text-center">
                            <SectionHeader id="about" title="About" label="About" />
                            <div className="max-w-3xl mx-auto space-y-6">
                                {isEditing ? (
                                    <div className="space-y-4 p-6 border rounded-xl bg-card">
                                        <Input value={portfolioData.about.name} onChange={(e) => updateAbout('name', e.target.value)} placeholder="Full Name" className="text-center text-xl font-bold" />
                                        <Input value={portfolioData.about.headline} onChange={(e) => updateAbout('headline', e.target.value)} placeholder="Headline" />
                                        <Textarea value={portfolioData.about.summary} onChange={(e) => updateAbout('summary', e.target.value)} placeholder="Summary" className="min-h-[100px]" />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">{portfolioData.about.name}</h1>
                                        <p className="text-xl md:text-2xl text-muted-foreground font-medium">{portfolioData.about.headline}</p>
                                        <p className="text-lg text-muted-foreground leading-relaxed">{portfolioData.about.summary}</p>
                                        <div className="flex justify-center gap-4 pt-4">
                                            <Button size="lg" className="rounded-full"><Download className="w-4 h-4 mr-2" /> Resume</Button>
                                            <Button size="lg" variant="outline" className="rounded-full"><Mail className="w-4 h-4 mr-2" /> Contact</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {(portfolioData.skills.visible || isEditing) && (
                        <section id="skills" className="scroll-mt-24">
                            <SectionHeader id="skills" title="Skills" label="Skills" />
                            {portfolioData.skills.visible && (
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-bold text-center mb-6">{portfolioData.skills.title}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {portfolioData.skills.items.map((skill, idx) => (
                                            <Card key={idx} className={cn("relative group", isEditing && "border-dashed border-primary/50")}>
                                                <CardContent className="pt-6">
                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <div className="flex gap-2"><Input value={skill.name} onChange={(e) => updateSkill(idx, 'name', e.target.value)} placeholder="Skill" /><Input value={skill.level} type="number" onChange={(e) => updateSkill(idx, 'level', parseInt(e.target.value))} placeholder="%" className="w-20" /></div>
                                                            <Button variant="destructive" size="sm" onClick={() => removeSkill(idx)} className="w-full">Remove</Button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2"><div className="flex justify-between font-medium"><span>{skill.name}</span><span>{skill.level}%</span></div><Progress value={skill.level} className="h-2" /></div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {isEditing && <Button variant="outline" className="h-full min-h-[100px] border-dashed" onClick={addSkill}><Plus className="mr-2" /> Add Skill</Button>}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Projects */}
                    {(portfolioData.projects.visible || isEditing) && (
                        <section id="projects" className="scroll-mt-24">
                            <SectionHeader id="projects" title="Projects" label="Projects" />
                            {portfolioData.projects.visible && (
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-bold text-center mb-6">{portfolioData.projects.title}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {portfolioData.projects.items.map((project, idx) => (
                                            <Card key={idx} className="group">
                                                <CardContent className="pt-6 space-y-4">
                                                    {isEditing ? (
                                                        <div className="space-y-4">
                                                            <Input value={project.name} onChange={(e) => { const newItems = [...portfolioData.projects.items]; newItems[idx].name = e.target.value; setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items: newItems } }); }} placeholder="Project Name" />
                                                            <Textarea value={project.description} onChange={(e) => { const newItems = [...portfolioData.projects.items]; newItems[idx].description = e.target.value; setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items: newItems } }); }} placeholder="Description" />
                                                            <Button variant="destructive" size="sm" onClick={() => { const newItems = portfolioData.projects.items.filter((_, i) => i !== idx); setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items: newItems } }); }}>Delete</Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex justify-between items-center"><h3 className="text-xl font-bold">{project.name}</h3><Badge>{project.difficulty}</Badge></div>
                                                            <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {isEditing && <Button variant="outline" className="h-full min-h-[150px] border-dashed" onClick={() => { const newItem = { id: Date.now().toString(), name: 'New Project', description: '', technologies: [], difficulty: 'Medium', status: 'Completed' }; setPortfolioData({ ...portfolioData, projects: { ...portfolioData.projects, items: [...portfolioData.projects.items, newItem] } }); }}><Plus className="mr-2" /> Add Project</Button>}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Experience */}
                    {(portfolioData.experience.visible || isEditing) && (
                        <section id="experience" className="scroll-mt-24">
                            <SectionHeader id="experience" title="Experience" label="Experience" />
                            {portfolioData.experience.visible && (
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-bold text-center mb-6">{portfolioData.experience.title}</h2>
                                    <div className="space-y-6">
                                        {portfolioData.experience.items.map((exp, idx) => (
                                            <Card key={idx} className={cn(isEditing && "border-dashed border-primary/50")}>
                                                <CardContent className="pt-6">
                                                    {isEditing ? (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <Input value={exp.title} onChange={e => { const newItems = [...portfolioData.experience.items]; newItems[idx].title = e.target.value; setPortfolioData({ ...portfolioData, experience: { ...portfolioData.experience, items: newItems } }); }} placeholder="Role" />
                                                                <Input value={exp.type} onChange={e => { const newItems = [...portfolioData.experience.items]; newItems[idx].type = e.target.value; setPortfolioData({ ...portfolioData, experience: { ...portfolioData.experience, items: newItems } }); }} placeholder="Type" />
                                                            </div>
                                                            <Input value={exp.duration} onChange={e => { const newItems = [...portfolioData.experience.items]; newItems[idx].duration = e.target.value; setPortfolioData({ ...portfolioData, experience: { ...portfolioData.experience, items: newItems } }); }} placeholder="Duration" />
                                                            <Button variant="destructive" size="sm" onClick={() => { const newItems = portfolioData.experience.items.filter((_, i) => i !== idx); setPortfolioData({ ...portfolioData, experience: { ...portfolioData.experience, items: newItems } }); }}>Remove</Button>
                                                        </div>
                                                    ) : (
                                                        <div><h3 className="text-xl font-bold">{exp.title}</h3><div className="text-muted-foreground">{exp.type} • {exp.duration}</div></div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {isEditing && <Button variant="outline" className="w-full border-dashed" onClick={() => { const newItem = { title: 'New Role', type: 'Full-time', duration: '2024 - Present', outcomes: [] }; setPortfolioData({ ...portfolioData, experience: { ...portfolioData.experience, items: [...portfolioData.experience.items, newItem] } }); }}><Plus className="mr-2" /> Add Experience</Button>}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Services */}
                    {(portfolioData.services.visible || isEditing) && (
                        <section id="services" className="scroll-mt-24">
                            <SectionHeader id="services" title="Services" label="Services" />
                            {portfolioData.services.visible && (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold mb-2">{portfolioData.services.title}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {portfolioData.services.items.map((service, idx) => (
                                            <Card key={idx} className={cn("text-center", isEditing && "border-dashed border-primary/50")}>
                                                <CardContent className="pt-6">
                                                    {isEditing ? (
                                                        <div className="space-y-2">
                                                            <Input value={service} onChange={e => {
                                                                const newItems = [...portfolioData.services.items];
                                                                newItems[idx] = e.target.value;
                                                                setPortfolioData({ ...portfolioData, services: { ...portfolioData.services, items: newItems } });
                                                            }} />
                                                            <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => {
                                                                const newItems = portfolioData.services.items.filter((_, i) => i !== idx);
                                                                setPortfolioData({ ...portfolioData, services: { ...portfolioData.services, items: newItems } });
                                                            }}><Trash2 className="w-3 h-3" /></Button>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">{service}</div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {isEditing && (
                                            <Button variant="outline" className="h-full min-h-[100px] border-dashed" onClick={() => {
                                                setPortfolioData({ ...portfolioData, services: { ...portfolioData.services, items: [...portfolioData.services.items, 'New Service'] } });
                                            }}>
                                                <Plus className="w-6 h-6 mr-2" /> Add Service
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Contact */}
                    {(portfolioData.contact.visible || isEditing) && (
                        <section id="contact" className="scroll-mt-24">
                            <SectionHeader id="contact" title="Contact" label="Contact" />
                            {portfolioData.contact.visible && (
                                <div className="max-w-2xl mx-auto text-center space-y-8">
                                    <h2 className="text-3xl font-bold">{portfolioData.contact.title}</h2>
                                    {isEditing ? (
                                        <div className="p-6 border rounded-xl space-y-4 bg-card">
                                            <Input value={portfolioData.contact.email} onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, email: e.target.value } })} placeholder="Email" />
                                            <Input value={portfolioData.contact.linkedin} onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, linkedin: e.target.value } })} placeholder="LinkedIn URL" />
                                            <Input value={portfolioData.contact.github} onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, github: e.target.value } })} placeholder="GitHub URL" />
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            <a href={`mailto:${portfolioData.contact.email}`} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Mail className="w-5 h-5" /></div>
                                                    <div className="text-left"><div className="text-sm text-muted-foreground uppercase">Email</div><div className="font-medium">{portfolioData.contact.email}</div></div>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                            </a>
                                            {portfolioData.contact.linkedin && (
                                                <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Linkedin className="w-5 h-5" /></div>
                                                        <div className="text-left"><div className="text-sm text-muted-foreground uppercase">LinkedIn</div><div className="font-medium">Connect</div></div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                                </a>
                                            )}
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
