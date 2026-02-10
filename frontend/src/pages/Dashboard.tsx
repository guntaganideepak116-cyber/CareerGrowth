import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Brain,
  Zap,
  ArrowRight,
  Bell,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface DashboardMetrics {
  readinessScore: number;
  marketAlignment: number;
  aiConfidence: number;
  skillsCompleted: number;
  totalSkills: number;
  hasActivity: boolean;
  fieldId: string | null;
}

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const { notifications, unreadCount } = useNotifications();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const response = await fetch(`${API_URL}/api/analytics/dashboard-analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          console.error('Failed to fetch analytics');
        }
      } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (authLoading || (loadingMetrics && !metrics)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const careerPhaseLabels = {
    student: 'Student Phase',
    fresher: 'Fresher Phase',
    professional: 'Professional Phase',
  };

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User';

  // Default values if API fails or returns null
  const readinessScore = metrics?.readinessScore || 0;
  const marketAlignment = metrics?.marketAlignment || 0;
  const aiConfidence = metrics?.aiConfidence || 0;
  const skillsCompleted = metrics?.skillsCompleted || 0;
  const totalSkills = metrics?.totalSkills || 20; // fallback denominator
  const hasActivity = metrics?.hasActivity || false;
  const skillsProgress = Math.round((skillsCompleted / totalSkills) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              Your AI career intelligence dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/notifications">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-danger-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/ai-mentor" className="flex-1 sm:flex-none">
              <Button variant="ai" className="gap-2 w-full sm:w-auto">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Ask AI Mentor</span>
                <span className="sm:hidden">AI Mentor</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Career Phase Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-primary-light rounded-xl border border-primary/20 animate-slide-up">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Career Phase</p>
            <p className="text-base sm:text-lg font-semibold text-foreground">
              {careerPhaseLabels[profile?.career_phase || 'student']}
              {profile?.current_semester && ` • Semester ${profile.current_semester}`}
            </p>
          </div>
          {!profile?.field && (
            <Link to="/fields" className="w-full sm:w-auto sm:ml-auto">
              <Button variant="hero" size="sm" className="gap-2 w-full sm:w-auto">
                Select Your Field
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Career Readiness"
            value={readinessScore}
            description={hasActivity ? "Based on assessments & roadmap" : "Complete assessments to unlock"}
            icon={<Target className="w-6 h-6" />}
            trend={readinessScore > 50 ? "up" : "stable"}
            trendValue={hasActivity ? "Active" : "Start now"}
            colorScheme="primary"
            className="animate-slide-up stagger-1"
          />
          <MetricCard
            title="Market Alignment"
            value={marketAlignment}
            description={hasActivity ? "Skills vs Market Demand" : "Select field & add skills"}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={marketAlignment > 50 ? "up" : "stable"}
            trendValue={hasActivity ? "Tracking" : "Pending"}
            colorScheme="success"
            className="animate-slide-up stagger-2"
          />
          <MetricCard
            title="AI Confidence"
            value={aiConfidence}
            description="AI's confidence in your path"
            icon={<Brain className="w-6 h-6" />}
            trend={aiConfidence > 70 ? "up" : "stable"}
            trendValue={aiConfidence > 0 ? "Learning" : "Interact more"}
            colorScheme="primary"
            className="animate-slide-up stagger-3"
          />
          <MetricCard
            title="Skills Progress"
            value={skillsProgress}
            description={`${skillsCompleted} of ${totalSkills} skills completed`}
            icon={<Zap className="w-6 h-6" />}
            trend="up"
            trendValue={skillsCompleted > 0 ? "In progress" : "Start learning"}
            colorScheme="warning"
            className="animate-slide-up stagger-4"
          />
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 sm:p-6 animate-slide-up stagger-5">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/fields" className="block">
                <div className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Field Selection</p>
                      <p className="text-sm text-muted-foreground">Choose your career field</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link to="/roadmap" className="block">
                <div className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Target className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">View Roadmap</p>
                      <p className="text-sm text-muted-foreground">Your semester plan</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link to="/ai-mentor" className="block">
                <div className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">AI Mentor</p>
                      <p className="text-sm text-muted-foreground">Get career advice</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link to="/projects" className="block">
                <div className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Zap className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Projects</p>
                      <p className="text-sm text-muted-foreground">Build your portfolio</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Alerts (Real-Time) */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 animate-slide-up stagger-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Alerts</h2>
              <Link to="/notifications" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 bg-secondary/50 rounded-lg border-l-4 ${notification.is_read ? 'border-muted' : 'border-primary'}`}
                >
                  <div className="flex justify-between items-start">
                    <p className={`font-medium text-sm ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No new alerts. You're all caught up!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
