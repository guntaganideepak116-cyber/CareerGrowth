import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { FieldProject } from '@/data/projectsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import {
    ChevronLeft,
    Github,
    Play,
    CheckCircle,
    FileCode,
    BookOpen,
    Layers,
    Clock,
    Shield,
    Loader2,
    Terminal,
    Download,
    ExternalLink
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CodeEditor from '@/components/CodeEditor';
import { useAuthContext } from '@/contexts/AuthContext';
import { logUserActivity } from '@/services/userAnalyticsService';

export default function ProjectWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [project, setProject] = useState<FieldProject | null>(null);

    // UI States
    const [showLocalEnv, setShowLocalEnv] = useState(false);
    const [showRunEnv, setShowRunEnv] = useState(false);
    const [repoUrl, setRepoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Optimized: Fetch project details using React Query
    const { data: projectData, isLoading: loading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiBase}/api/projects?id=${projectId}`);
            const data = await res.json();
            if (data.success && data.data) {
                return data.data as FieldProject;
            }
            throw new Error('Project not found');
        },
        enabled: !!projectId,
        staleTime: 1000 * 60 * 30, // 30 minutes
        retry: 1,
    });

    useEffect(() => {
        if (projectData) {
            setProject(projectData);
        }
    }, [projectData]);

    useEffect(() => {
        if (!loading && !projectData && projectId) {
            toast.error('Project not found');
            navigate('/projects');
        }
    }, [loading, projectData, projectId, navigate]);

    const getRecommendedIDEs = () => {
        if (!project) return [];
        const skills = project.skills.map(s => s.toLowerCase());
        const tools = [
            { name: 'Visual Studio Code', desc: 'Recommended for Web, JS, Python', url: 'https://code.visualstudio.com/' },
            { name: 'Git SCM', desc: 'Required for Version Control', url: 'https://git-scm.com/downloads' }
        ];

        if (skills.some(s => s.includes('java'))) {
            tools.push({ name: 'IntelliJ IDEA', desc: 'Best for Java Development', url: 'https://www.jetbrains.com/idea/' });
        }
        if (skills.some(s => s.includes('python') || s.includes('ai') || s.includes('ml'))) {
            tools.push({ name: 'PyCharm', desc: 'Powerful Python IDE', url: 'https://www.jetbrains.com/pycharm/' });
            tools.push({ name: 'Anaconda', desc: 'Data Science Toolkit', url: 'https://www.anaconda.com/' });
        }
        if (skills.some(s => s.includes('cad') || s.includes('solidworks') || s.includes('mech'))) {
            tools.push({ name: 'AutoCAD', desc: 'Standard for 2D/3D Design', url: 'https://www.autodesk.com/products/autocad' });
            tools.push({ name: 'SolidWorks', desc: '3D CAD & Simulation', url: 'https://www.solidworks.com/' });
        }
        if (skills.some(s => s.includes('civil') || s.includes('etabs'))) {
            tools.push({ name: 'Revit', desc: 'BIM Software', url: 'https://www.autodesk.com/products/revit' });
        }
        if (skills.some(s => s.includes('pcb') || s.includes('simulink'))) {
            tools.push({ name: 'MATLAB & Simulink', desc: 'Simulation Environment', url: 'https://www.mathworks.com/' });
        }

        return tools;
    };

    const handleSubmit = () => {
        if (!repoUrl.includes('github.com') && !repoUrl.includes('gitlab.com')) {
            toast.error('Please enter a valid GitHub repository URL');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(async () => {
            const history = JSON.parse(localStorage.getItem('myProjects') || '[]');
            // Check if already submitted
            if (!history.find((p: any) => p.id === project?.id)) {
                history.push({
                    ...project,
                    submittedAt: new Date().toISOString(),
                    repoUrl,
                    status: 'Completed'
                });
                localStorage.setItem('myProjects', JSON.stringify(history));

                // Added: Log Activity for Real-Time Analytics
                if (user && project) {
                    await logUserActivity(user.uid, 'PROJECT_COMPLETED', {
                        relatedId: project.id,
                        metadata: { title: project.name }
                    });
                }
            }

            setIsSubmitting(false);
            toast.success('Project Submitted Successfully!', {
                description: 'It has been added to your profile.'
            });
            navigate('/profile');
        }, 600);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!project) return null;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold">{project.name}</h1>
                            <Badge variant={project.tier === 'Premium' ? 'destructive' : project.tier === 'Pro' ? 'default' : 'secondary'}>
                                {project.tier || 'Free'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{project.description}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => setShowLocalEnv(true)}>
                            <Download className="w-4 h-4" />
                            Local Environment
                        </Button>
                        <Button className="gap-2" onClick={() => setShowRunEnv(true)}>
                            <Play className="w-4 h-4" />
                            Run Environment
                        </Button>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="guide" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="guide">Guide</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                        <TabsTrigger value="submission">Submission</TabsTrigger>
                    </TabsList>

                    {/* GUIDE TAB */}
                    <TabsContent value="guide" className="mt-6 space-y-6 animate-slide-up">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Getting Started
                                    </h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p>
                                            Welcome to the <strong>{project.name}</strong> workspace. In this project, you will build a
                                            real-world application using <strong>{project.skills.join(', ')}</strong>.
                                            Follow the steps below to complete your implementation.
                                        </p>
                                        <h3 className="text-lg font-medium mt-4">Prerequisites</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            <li>Node.js v16+ or Python 3.9+ dependent on stack</li>
                                            <li>IDE (VS Code recommended)</li>
                                            <li>Git for version control</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-primary" />
                                        Implementation Steps
                                    </h2>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div key={step} className="flex gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {step}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Phase {step}: Component Logic</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Initialize the module structure and implement the core algorithms defined in the technical specification.
                                                        Ensure unit tests are passing before moving to the next phase.
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-semibold mb-3">Project Specs</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between py-2 border-b border-border">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Time
                                            </span>
                                            <span className="font-medium">{project.estimatedTime}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-border">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> Level
                                            </span>
                                            <span className="font-medium capitalize">{project.difficulty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2">Mentor Tip</h3>
                                    <p className="text-sm text-muted-foreground">
                                        "Focus on the {project.skills[0]} implementation first. It's the core of this system."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CODE TAB */}
                    <TabsContent value="code" className="mt-6">
                        <div className="bg-card border border-border rounded-xl p-1 overflow-hidden">
                            <div className="p-4 bg-muted/30 border-b mb-1">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-primary" />
                                    Online Editor
                                </h3>
                                <p className="text-xs text-muted-foreground">Test your snippets here before adding to your local project.</p>
                            </div>
                            <CodeEditor
                                initialLanguage={
                                    project?.skills.some(s => s.toLowerCase().includes('python')) ? 'python' :
                                        project?.skills.some(s => s.toLowerCase().includes('java')) ? 'java' :
                                            project?.skills.some(s => s.toLowerCase().includes('c++')) ? 'c++' :
                                                'javascript'
                                }
                            />
                        </div>
                    </TabsContent>

                    {/* SUBMISSION TAB */}
                    <TabsContent value="submission" className="mt-6">
                        <div className="bg-card border border-border rounded-xl p-12 text-center max-w-3xl mx-auto">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Ready to Submit?</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                Push your code to the repository and paste the link below.
                                Your submission will be added to your profile profile.
                            </p>

                            <div className="max-w-md mx-auto space-y-4">
                                <Input
                                    placeholder="https://github.com/username/project-repo"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                />
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Project'}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Local Environment Dialog */}
            <Dialog open={showLocalEnv} onOpenChange={setShowLocalEnv}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Setup Local Environment</DialogTitle>
                        <DialogDescription>
                            Recommended tools and IDEs for <strong>{project?.name}</strong> based on your tech stack.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {getRecommendedIDEs().map((tool) => (
                            <div key={tool.name} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-background flex items-center justify-center border">
                                        <Terminal className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{tool.name}</h4>
                                        <p className="text-sm text-muted-foreground">{tool.desc}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={tool.url} target="_blank" rel="noreferrer">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Run Environment (Cloud Shel Simulation) Dialog */}
            <Dialog open={showRunEnv} onOpenChange={setShowRunEnv}>
                <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0 bg-zinc-950 border-zinc-800 text-zinc-300">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs font-mono text-zinc-500">Cloud Shell - {project?.name}</span>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Connected</Badge>
                    </div>
                    <div className="flex-1 p-6 font-mono text-sm overflow-auto space-y-2">
                        <div className="text-green-500">$ initialize --environment {project?.skills[0]?.toLowerCase()}</div>
                        <div className="text-zinc-500">Allocating container resources... Done.</div>
                        <div className="text-zinc-500">Mounting volumes... Done.</div>
                        <div className="text-zinc-500">Installing dependencies...</div>
                        <div className="pl-4 border-l-2 border-zinc-800 text-zinc-400">
                            {project?.skills.map(skill => (
                                <div key={skill}>+ installing {skill.toLowerCase()}@latest...</div>
                            ))}
                        </div>
                        <div className="text-green-500">$ npm start</div>
                        <div className="text-blue-400">
                            &gt; {project?.name.toLowerCase().replace(/ /g, '-')}@0.1.0 start<br />
                            &gt; react-scripts start
                        </div>
                        <div className="text-zinc-300 pt-4">
                            Starting the development server...
                        </div>
                        <div className="p-4 mt-4 rounded border border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-zinc-500">
                            [ Application Output Window Placeholder ]
                        </div>
                    </div>
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">➜</span>
                            <span className="text-blue-400">~/project</span>
                            <span className="text-zinc-500 animate-pulse">_</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    );
}
