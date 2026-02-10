import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowRight, CheckCircle2, BookOpen, Brain, Briefcase, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Form Data Interface
interface FormData {
    stream: string;
    strongSubjects: string[];
    weakSubjects: string[];
    interests: string[];
    skillRatings: {
        logical: number;
        communication: number;
    };
    careerPreference: string;
    openToNewSkills: boolean;
}

// Recommendation Interface
interface Recommendation {
    fieldName: string;
    matchScore: number;
    reason: string;
    growthOutlook: string;
}

const STREAMS = ['MPC', 'BiPC', 'CEC', 'HEC', 'Other'];
const INTERESTS = [
    'Technology', 'Medicine', 'Business', 'Government Jobs',
    'Research', 'Creative Fields', 'Entrepreneurship', 'Arts', 'Social Service'
];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'History', 'Computer Science', 'Commerce'];

export default function Onboarding() {
    const { user, profile, updateProfile } = useAuthContext();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [step, setStep] = useState(1); // 1: Form, 2: Recommendations
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        stream: '',
        strongSubjects: [],
        weakSubjects: [],
        interests: [],
        skillRatings: { logical: 3, communication: 3 },
        careerPreference: '',
        openToNewSkills: true
    });
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    // Fetch existing profile data to pre-fill
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'user_profiles', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as FormData;
                    setFormData({
                        stream: data.stream || '',
                        strongSubjects: data.strongSubjects || [],
                        weakSubjects: data.weakSubjects || [],
                        interests: data.interests || [],
                        skillRatings: data.skillRatings || { logical: 3, communication: 3 },
                        careerPreference: data.careerPreference || '',
                        openToNewSkills: data.openToNewSkills ?? true
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    // Form Handlers
    const handleStreamChange = (val: string) => setFormData({ ...formData, stream: val });
    const handleInterestToggle = (interest: string) => {
        const newInterests = formData.interests.includes(interest)
            ? formData.interests.filter(i => i !== interest)
            : [...formData.interests, interest];
        setFormData({ ...formData, interests: newInterests });
    };
    const handleSubjectToggle = (subject: string, type: 'strong' | 'weak') => {
        const target = type === 'strong' ? 'strongSubjects' : 'weakSubjects';
        const current = formData[target];
        const newSubjects = current.includes(subject)
            ? current.filter(s => s !== subject)
            : [...current, subject];
        setFormData({ ...formData, [target]: newSubjects });
    };

    // Skip Logic
    const handleSkip = () => {
        navigate('/dashboard');
    };

    // Submit for Recommendations
    const generateRecommendations = async () => {
        if (!formData.stream || formData.strongSubjects.length === 0 || formData.interests.length === 0 || !formData.careerPreference) {
            toast({ title: "Incomplete Form", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const token = await user?.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/recommendation/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to generate');

            const data = await response.json();
            setRecommendations(data.recommendations);
            setStep(2);

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "AI generation failed. Please try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Final Selection
    const handleSelectField = async (field: Recommendation) => {
        setLoading(true);
        try {
            await updateProfile({
                selectedField: field.fieldName,
                onboardingCompleted: true
            });

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    selectedField: field.fieldName,
                    onboardingCompleted: true,
                    selectedFieldDetails: field
                });
            }

            toast({ title: "Success!", description: `Profile updated to ${field.fieldName}.` });
            navigate('/dashboard');

        } catch (error) {
            console.error("Selection error:", error);
            toast({ title: "Error", description: "Could not save selection.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-indigo-50/50 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
            </div>
        );
    }

    if (loading && step === 1) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <div className="text-center space-y-6 animate-pulse max-w-md">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-violet-400/30 rounded-full animate-ping" />
                        <div className="relative bg-white p-5 rounded-full shadow-2xl shadow-violet-200 border border-violet-100">
                            <Brain className="w-14 h-14 text-violet-600 mx-auto animate-bounce" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
                            AI Analysis in Progress...
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Analyzing your academic profile and interests to craft your perfect career roadmap.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            <div className="max-w-5xl w-full z-10">
                {step === 1 ? (
                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 ring-1 ring-white/50">
                        <CardHeader className="text-center pb-8 border-b border-gray-100 bg-gradient-to-b from-white/50 to-transparent">
                            <div className="mx-auto bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-4 rounded-2xl shadow-lg shadow-violet-200 w-fit mb-6 transform hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                                Career Profile
                            </CardTitle>
                            <CardDescription className="text-lg mt-3 text-gray-600 max-w-2xl mx-auto font-medium">
                                Share your academic journey and interests to unlock specific, AI-driven career paths.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-12 p-8 md:p-12">

                            {/* Section 1: Stream */}
                            <div className="space-y-4 animate-in slide-in-from-left-4 duration-500 delay-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold border border-indigo-200 shadow-sm group-hover:scale-110 transition-transform">01</div>
                                    <Label className="text-xl font-bold text-gray-800">Educational Background</Label>
                                </div>
                                <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg opacity-80 transition-opacity hover:opacity-100">
                                    <Select onValueChange={handleStreamChange} value={formData.stream}>
                                        <SelectTrigger className="w-full bg-white border-0 h-12 text-lg font-medium focus:ring-0">
                                            <SelectValue placeholder="Select your current stream" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STREAMS.map(s => <SelectItem key={s} value={s} className="text-base py-3 cursor-pointer hover:bg-slate-50">{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Section 2: Subjects */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-left-4 duration-500 delay-200">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 font-bold border border-emerald-200 shadow-sm group-hover:scale-110 transition-transform">02</div>
                                        <Label className="text-xl font-bold text-gray-800">Strong Subjects</Label>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {SUBJECTS.map(subj => (
                                            <div
                                                key={subj}
                                                onClick={() => handleSubjectToggle(subj, 'strong')}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border select-none",
                                                    formData.strongSubjects.includes(subj)
                                                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-200"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                                                )}
                                            >
                                                {subj}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center w-auto px-2 h-8 rounded-lg bg-rose-100 text-rose-600 font-bold border border-rose-200 shadow-sm text-sm group-hover:scale-110 transition-transform">Optional</div>
                                        <Label className="text-xl font-bold text-gray-800">Weak Subjects</Label>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {SUBJECTS.map(subj => (
                                            <div
                                                key={subj}
                                                onClick={() => handleSubjectToggle(subj, 'weak')}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border select-none",
                                                    formData.weakSubjects.includes(subj)
                                                        ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent shadow-lg shadow-rose-200"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600"
                                                )}
                                            >
                                                {subj}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Interests */}
                            <div className="space-y-5 animate-in slide-in-from-left-4 duration-500 delay-300">
                                <div className="flex items-center gap-3 group">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold border border-blue-200 shadow-sm group-hover:scale-110 transition-transform">03</div>
                                    <Label className="text-xl font-bold text-gray-800">Areas of Interest</Label>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {INTERESTS.map(interest => (
                                        <div
                                            key={interest}
                                            onClick={() => handleInterestToggle(interest)}
                                            className={cn(
                                                "relative group/card cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg overflow-hidden",
                                                formData.interests.includes(interest)
                                                    ? "border-violet-500 bg-violet-50"
                                                    : "border-transparent bg-white hover:border-violet-200 hover:bg-violet-50/30 shadow-sm"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute inset-0 bg-violet-500/5 transition-transform duration-500 origin-left",
                                                formData.interests.includes(interest) ? "scale-x-100" : "scale-x-0 group-hover/card:scale-x-100"
                                            )} />
                                            <div className="relative flex flex-col gap-2 z-10">
                                                <Checkbox
                                                    id={interest}
                                                    checked={formData.interests.includes(interest)}
                                                    onCheckedChange={() => handleInterestToggle(interest)}
                                                    className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300"
                                                />
                                                <span className={cn(
                                                    "font-semibold text-sm transition-colors",
                                                    formData.interests.includes(interest) ? "text-violet-700" : "text-gray-600"
                                                )}>{interest}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 4: Skills */}
                            <div className="space-y-8 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8 rounded-3xl border border-slate-100 animate-in slide-in-from-left-4 duration-500 delay-400 shadow-inner">
                                <div className="flex items-center gap-3 group">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 font-bold border border-amber-200 shadow-sm group-hover:scale-110 transition-transform">04</div>
                                    <Label className="text-xl font-bold text-gray-800">Self Assessment</Label>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    {['logical', 'communication'].map((skill) => (
                                        <div key={skill} className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="font-semibold text-gray-600 capitalize">{skill} Skills</Label>
                                                <span className={cn(
                                                    "font-bold px-3 py-1 rounded-full text-sm",
                                                    skill === 'logical' ? "bg-indigo-100 text-indigo-700" : "bg-fuchsia-100 text-fuchsia-700"
                                                )}>{formData.skillRatings[skill as keyof typeof formData.skillRatings]}/5</span>
                                            </div>
                                            <Slider
                                                defaultValue={[3]}
                                                max={5} min={1} step={1}
                                                value={[formData.skillRatings[skill as keyof typeof formData.skillRatings]]}
                                                onValueChange={(val) => setFormData({ ...formData, skillRatings: { ...formData.skillRatings, [skill]: val[0] } })}
                                                className="py-2"
                                            />
                                            <div className="flex justify-between text-xs font-medium text-gray-400 px-1 uppercase tracking-wide">
                                                <span>Beginner</span>
                                                <span>Master</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 5: Preference */}
                            <div className="space-y-4 animate-in slide-in-from-left-4 duration-500 delay-500 group">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 font-bold border border-cyan-200 shadow-sm group-hover:scale-110 transition-transform">05</div>
                                    <Label className="text-xl font-bold text-gray-800">Career Preference</Label>
                                </div>
                                <div className="p-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-lg opacity-80 transition-opacity hover:opacity-100">
                                    <Select onValueChange={(val) => setFormData({ ...formData, careerPreference: val })} value={formData.careerPreference}>
                                        <SelectTrigger className="w-full bg-white border-0 h-12 text-lg font-medium shadow-sm">
                                            <SelectValue placeholder="Select your preferred path" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Private Job" className="py-2">Private Job (Corporate)</SelectItem>
                                            <SelectItem value="Government Job" className="py-2">Government Job</SelectItem>
                                            <SelectItem value="Startup" className="py-2">Startup / Entrepreneurship</SelectItem>
                                            <SelectItem value="Higher Studies" className="py-2">Higher Studies / Research</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-6 animate-in fade-in duration-700 delay-500 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <Checkbox
                                    id="openToSkills"
                                    checked={formData.openToNewSkills}
                                    onCheckedChange={(checked) => setFormData({ ...formData, openToNewSkills: checked as boolean })}
                                    className="data-[state=checked]:bg-indigo-600 border-indigo-300 w-5 h-5"
                                />
                                <Label htmlFor="openToSkills" className="cursor-pointer text-base font-medium text-gray-700">I am open to learning new skills outside my stream.</Label>
                            </div>

                            <div className="flex gap-6 pt-8 animate-in slide-in-from-bottom-4 duration-500 delay-700">
                                <Button variant="outline" size="xl" className="flex-1 h-16 text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600" onClick={handleSkip}>
                                    Skip for Now
                                </Button>
                                <Button size="xl" className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 group" onClick={generateRecommendations} disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Analyzing...</> :
                                        <span className="flex items-center gap-2">
                                            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            Generate Recommendations
                                        </span>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    recommendations.length > 0 && <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-12">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-xl mb-4 ring-4 ring-white/50 animate-bounce-slow">
                                <Sparkles className="w-10 h-10 text-violet-600" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                                Perfect Matches
                            </h1>
                            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                                Based on your profile, these paths align best with your skills and goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                            {recommendations.map((rec, idx) => (
                                <Card
                                    key={idx}
                                    className={cn(
                                        "relative flex flex-col transition-all duration-300 hover:-translate-y-2 group overflow-visible",
                                        idx === 0
                                            ? "border-0 shadow-2xl shadow-violet-500/20 scale-105 z-10 md:scale-110 bg-gradient-to-b from-white to-violet-50"
                                            : "border-0 shadow-xl bg-white/90 hover:bg-white"
                                    )}
                                >
                                    {idx === 0 && (
                                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 rounded-t-xl" />
                                    )}
                                    {idx === 0 && (
                                        <div className="absolute -top-5 inset-x-0 flex justify-center">
                                            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg animate-pulse">
                                                Top Match
                                            </span>
                                        </div>
                                    )}

                                    <CardHeader className={cn("pb-4", idx === 0 ? "pt-8" : "")}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn(
                                                "p-3 rounded-2xl transition-colors",
                                                idx === 0 ? "bg-violet-100/50 text-violet-600" : "bg-gray-100 text-gray-600"
                                            )}>
                                                <Briefcase className="w-8 h-8" />
                                            </div>
                                            <div className="text-right">
                                                <span className={cn("block text-4xl font-black", idx === 0 ? "text-violet-600" : "text-gray-800")}>{rec.matchScore}%</span>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Match</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl font-bold leading-tight text-gray-800 group-hover:text-violet-700 transition-colors">{rec.fieldName}</CardTitle>
                                        <CardDescription className="flex items-center mt-3 font-medium">
                                            <div className={cn(
                                                "flex items-center px-3 py-1 rounded-full text-xs uppercase font-bold mr-2",
                                                rec.growthOutlook.includes('High') || rec.growthOutlook.includes('Very') ? "bg-emerald-100 text-emerald-700" :
                                                    rec.growthOutlook.includes('Stable') ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                <TrendingUpIcon className="w-3 h-3 mr-1" />
                                                {rec.growthOutlook}
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-gray-600 leading-relaxed font-medium">{rec.reason}</p>
                                    </CardContent>
                                    <div className="p-6 pt-0 mt-auto">
                                        <Button
                                            className={cn(
                                                "w-full h-14 text-lg font-bold shadow-md transition-all",
                                                idx === 0
                                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                                                    : "bg-white border-2 border-gray-100 hover:border-violet-200 hover:bg-violet-50 text-gray-700"
                                            )}
                                            onClick={() => handleSelectField(rec)}
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                                <span className="flex items-center justify-center">
                                                    Select Path <ArrowRight className={cn("w-5 h-5 ml-2 transition-transform", idx === 0 ? "group-hover:translate-x-1" : "")} />
                                                </span>}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Button variant="ghost" className="text-gray-500 hover:text-violet-600 hover:bg-violet-50 text-lg font-medium" onClick={() => setStep(1)}>
                                ← Adjust Profile & Regenerate
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TrendingUpIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
