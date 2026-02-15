import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Save,
  Loader2,
  Award,
  Folder,
  Target,
  Edit,
  Bell,
  BellOff,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user, profile, loading, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    bio: '',
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    ai_recommendations: true,
  });

  const [showMyProjects, setShowMyProjects] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myProjects, setMyProjects] = useState<any[]>([]);

  useEffect(() => {
    if (showMyProjects) {
      const stored = localStorage.getItem('myProjects');
      if (stored) {
        try {
          setMyProjects(JSON.parse(stored).reverse());
        } catch (e) { console.error(e); }
      }
    }
  }, [showMyProjects]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth || null,
        bio: formData.bio,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0;
    const total = 8;

    if (formData.full_name) completed++;
    if (formData.phone) completed++;
    if (formData.date_of_birth) completed++;
    if (formData.bio) completed++;
    if (profile?.field) completed++;
    if (profile?.specialization) completed++;
    if (profile?.career_path) completed++;
    if (formData.email) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Profile Card Skeleton */}
          <div className="rounded-xl border p-6 flex gap-6 items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-[400px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and career journey
            </p>
          </div>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground truncate">
                {formData.full_name || 'Your Name'}
              </h2>
              <p className="text-muted-foreground mt-1">{formData.email}</p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {profile?.career_phase || 'Student'}
                </span>
                {profile?.field && (
                  <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                    {profile.field}
                  </span>
                )}
                {profile?.specialization && (
                  <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {profile.specialization}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="w-full md:w-auto">
              <div className="bg-card rounded-lg p-4 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Profile Strength</span>
                  <span className="text-lg font-bold text-primary">{completionPercentage}%</span>
                </div>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {completionPercentage === 100 ? 'Complete! 🎉' : 'Keep going!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0%</p>
                <p className="text-xs text-muted-foreground">Roadmap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="pl-10 bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date_of_birth" className="text-sm font-medium text-foreground">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio / Career Aspirations
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your career goals..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Career Information */}
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Career Information
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/fields')}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Path
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Selected Field
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={profile?.field || 'Not selected'}
                      disabled
                      className="pl-10 bg-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Specialization
                  </label>
                  <Input
                    value={profile?.specialization || 'Not selected'}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Career Path
                  </label>
                  <Input
                    value={profile?.career_path || 'Not selected'}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Current Level
                  </label>
                  <Input
                    value={`Semester ${profile?.current_semester || 1}`}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preferences & Info */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(p => ({ ...p, email_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">AI Recommendations</p>
                      <p className="text-xs text-muted-foreground">Personalized AI insights</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.ai_recommendations}
                    onCheckedChange={(checked) =>
                      setPreferences(p => ({ ...p, ai_recommendations: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                Account Details
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(profile?.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(profile?.updated_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account Status</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/roadmap')}
                >
                  <Target className="mr-2 w-4 h-4" />
                  View Roadmap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowMyProjects(true)}
                >
                  <Folder className="mr-2 w-4 h-4" />
                  My Portfolio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/certifications')}
                >
                  <Award className="mr-2 w-4 h-4" />
                  Certifications
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showMyProjects} onOpenChange={setShowMyProjects}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              My Project Portfolio
            </DialogTitle>
            <DialogDescription>
              Projects you have successfully submitted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {myProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-lg">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No projects submitted yet.</p>
                <Button variant="link" onClick={() => { setShowMyProjects(false); navigate('/projects'); }}>
                  Browse Projects
                </Button>
              </div>
            ) : (
              myProjects.map((proj, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 bg-card border rounded-lg hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{proj.name}</h4>
                      <Badge variant="outline" className="text-green-600 bg-green-500/10 border-green-200">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{proj.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(proj.submittedAt).toLocaleDateString()}
                      </span>
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <Github className="w-3 h-3" /> Repo Link
                      </a>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setShowMyProjects(false); navigate(`/project/${proj.id}`); }}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
