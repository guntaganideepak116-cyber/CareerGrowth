import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
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
import { Skeleton } from '@/components/ui/skeleton';
import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

const MetricSkeleton = memo(() => (
  <div className="rounded-xl border border-border p-6 bg-card space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
      </div>
      <div className="h-12 w-12 bg-muted rounded-xl" />
    </div>
    <div className="h-2 w-full bg-muted rounded-full" />
  </div>
));

const AlertSkeleton = memo(() => (
  <div className="p-3 bg-secondary/30 rounded-lg border-l-4 border-muted animate-pulse space-y-2">
    <div className="h-4 w-3/4 bg-muted rounded" />
    <div className="h-3 w-full bg-muted rounded" />
  </div>
));

const DashboardHeader = memo(({ displayName, isRefreshing, unreadCount }: { displayName: string, isRefreshing: boolean, unreadCount: number }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Welcome back, {displayName}
      </h1>
      <p className="mt-1 text-sm sm:text-base text-muted-foreground flex items-center gap-2">
        Your AI career intelligence dashboard
        {isRefreshing && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
      </p>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <Link to="/notifications">
        <Button variant="outline" size="icon" className="relative group transition-all duration-300">
          <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-danger-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </Button>
      </Link>
      <Link to="/ai-mentor" className="flex-1 sm:flex-none">
        <Button variant="ai" className="gap-2 w-full sm:w-auto shadow-ai transition-transform active:scale-95">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI Mentor</span>
          <span className="sm:hidden">AI Mentor</span>
        </Button>
      </Link>
    </div>
  </div>
));

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const { notifications, unreadCount, loading: notificationsLoading } = useNotifications();
  const { data: metrics, isLoading: loadingMetrics, isFetching: isRefreshing } = useDashboardMetrics();

  const careerPhaseLabels = useMemo(() => ({
    student: 'Student Phase',
    fresher: 'Fresher Phase',
    professional: 'Professional Phase',
  }), []);

  const displayName = useMemo(() =>
    profile?.full_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'User'
    , [profile, user]);

  // Shell-first: We render the layout immediately even if auth or metrics are loading
  // Skeletons handle the placeholder state within the shell.

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          displayName={displayName}
          isRefreshing={isRefreshing}
          unreadCount={unreadCount}
        />

        {/* Career Phase Badge - Instant paint with optional skeletons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-primary-light rounded-xl border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Career Phase</p>
            {authLoading && !profile ? (
              <Skeleton className="h-6 w-48 mt-1" />
            ) : (
              <p className="text-base sm:text-lg font-bold text-foreground">
                {careerPhaseLabels[profile?.career_phase || 'student'] as string}
                {profile?.current_semester && ` • Semester ${profile.current_semester}`}
              </p>
            )}
          </div>
          {!authLoading && !profile?.field && (
            <Link to="/fields" className="w-full sm:w-auto sm:ml-auto">
              <Button variant="hero" size="sm" className="gap-2 w-full sm:w-auto shadow-btn-glow">
                Select Your Field
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(loadingMetrics && !metrics) ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Career Readiness"
                value={metrics?.readinessScore || 0}
                description={metrics?.hasActivity ? "Based on assessments & roadmap" : "Complete assessments to unlock"}
                icon={<Target className="w-6 h-6" />}
                trend={(metrics?.readinessScore || 0) > 50 ? "up" : "stable"}
                trendValue={metrics?.hasActivity ? "Active" : "Start now"}
                colorScheme="primary"
                className="stagger-1"
              />
              <MetricCard
                title="Market Alignment"
                value={metrics?.marketAlignment || 0}
                description={metrics?.hasActivity ? "Skills vs Market Demand" : "Select field & add skills"}
                icon={<TrendingUp className="w-6 h-6" />}
                trend={(metrics?.marketAlignment || 0) > 50 ? "up" : "stable"}
                trendValue={metrics?.hasActivity ? "Tracking" : "Pending"}
                colorScheme="success"
                className="stagger-2"
              />
              <MetricCard
                title="AI Confidence"
                value={metrics?.aiConfidence || 0}
                description="AI's confidence in your path"
                icon={<Brain className="w-6 h-6" />}
                trend={(metrics?.aiConfidence || 0) > 70 ? "up" : "stable"}
                trendValue={(metrics?.aiConfidence || 0) > 0 ? "Learning" : "Interact more"}
                colorScheme="primary"
                className="stagger-3"
              />
              <MetricCard
                title="Skills Progress"
                value={Math.round(((metrics?.skillsCompleted || 0) / (metrics?.totalSkills || 20)) * 100)}
                description={`${metrics?.skillsCompleted || 0} of ${metrics?.totalSkills || 20} skills completed`}
                icon={<Zap className="w-6 h-6" />}
                trend="up"
                trendValue={(metrics?.skillsCompleted || 0) > 0 ? "In progress" : "Start learning"}
                colorScheme="warning"
                className="stagger-4"
              />
            </>
          )}
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/fields', icon: GraduationCap, label: 'Field Selection', sub: 'Choose your career field', color: 'bg-primary/10', text: 'text-primary' },
                { to: '/roadmap', icon: Target, label: 'View Roadmap', sub: 'Your semester plan', color: 'bg-success/10', text: 'text-success' },
                { to: '/ai-mentor', icon: MessageSquare, label: 'AI Mentor', sub: 'Get career advice', color: 'bg-primary/10', text: 'text-primary' },
                { to: '/projects', icon: Zap, label: 'Projects', sub: 'Build your portfolio', color: 'bg-warning/10', text: 'text-warning' },
              ].map((action, i) => (
                <Link key={action.to} to={action.to} className="group">
                  <div className="p-4 bg-secondary/30 rounded-xl hover:bg-secondary/60 transition-all duration-300 border border-transparent hover:border-primary/20 shadow-sm active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", action.color)}>
                        <action.icon className={cn("w-5 h-5", action.text)} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm tracking-tight">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.sub}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Alerts (Real-Time) */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Recent Intelligence</h2>
              <Link to="/notifications" className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {(notificationsLoading && notifications.length === 0) ? (
                <>
                  <AlertSkeleton />
                  <AlertSkeleton />
                  <AlertSkeleton />
                </>
              ) : (
                <>
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 bg-secondary/30 rounded-lg border-l-4 transition-all duration-300 hover:bg-secondary/50",
                        notification.is_read ? 'border-muted' : 'border-primary'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <p className={cn("font-bold text-sm tracking-tight", notification.is_read ? 'text-muted-foreground' : 'text-foreground')}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-primary rounded-full mt-1 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8">
                      <div className="inline-flex p-3 bg-muted rounded-full mb-2">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">All systems clear.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
