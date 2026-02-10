import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Brain,
  LayoutDashboard,
  GraduationCap,
  Compass,
  Route,
  Map,
  FolderKanban,
  Award,
  Bell,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Activity,
} from 'lucide-react';
import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const NavItem = memo(({
  to,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  badge,
  onHover
}: {
  to: string;
  icon: any;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: number;
  onHover?: () => void;
}) => (
  <Link
    to={to}
    onMouseEnter={onHover}
    className={cn(
      'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative',
      isActive
        ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground active:scale-[0.98]'
    )}
  >
    <div className={cn(
      "transition-transform duration-300 group-hover:scale-110",
      isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
    )}>
      <Icon className="w-5 h-5" />
    </div>

    {!isCollapsed && (
      <span className="font-bold text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
        {label}
      </span>
    )}

    {badge !== undefined && badge > 0 && (
      <span className={cn(
        "absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-background",
        isActive ? "bg-white text-primary" : "bg-danger text-white animate-pulse"
      )}>
        {badge}
      </span>
    )}

    {isActive && (
      <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full -translate-x-3" />
    )}
  </Link>
));

NavItem.displayName = 'NavItem';

export const Sidebar = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  }, [signOut, navigate]);

  const isAdmin = profile?.role === 'admin';

  const menuItems = useMemo(() => {
    const items = [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
      { icon: Compass, label: 'Explore Fields', to: '/fields' },
      { icon: Route, label: 'Career Paths', to: '/career-paths' },
      { icon: Map, label: 'Roadmap', to: '/roadmap' },
      { icon: Award, label: 'Skills & Badges', to: '/skills' },
      { icon: FolderKanban, label: 'Projects', to: '/projects' },
      { icon: Briefcase, label: 'Portfolio', to: '/portfolio' },
      { icon: Activity, label: 'Assessment', to: '/assessment' },
      { icon: MessageSquare, label: 'AI Mentor', to: '/ai-mentor' },
      { icon: Bell, label: 'Notifications', to: '/notifications' },
    ];

    const combined = [...items];
    if (isAdmin) {
      combined.unshift({ icon: ShieldCheck, label: 'Admin Panel', to: '/admin' });
    }
    return combined;
  }, [isAdmin]);

  const prefetchData = useCallback((to: string) => {
    if (to === '/dashboard') queryClient.prefetchQuery({ queryKey: ['dashboard_metrics'] });
    if (to === '/notifications') queryClient.prefetchQuery({ queryKey: ['notifications'] });
    if (to === '/admin') queryClient.prefetchQuery({ queryKey: ['admin_stats'] });
  }, [queryClient]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border shadow-xl">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className={cn("flex items-center gap-3 transition-all duration-300", isCollapsed && "justify-center w-full")}>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center ring-2 ring-primary/20">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-3 duration-500">
              <span className="text-xl font-black text-foreground tracking-tighter leading-none">Career</span>
              <span className="text-sm font-bold text-primary tracking-widest uppercase">Growth</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden lg:flex p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar py-4">
        {menuItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            isActive={location.pathname === item.to}
            isCollapsed={isCollapsed}
            onHover={() => prefetchData(item.to)}
          />
        ))}

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="hidden lg:flex w-full items-center justify-center p-2.5 text-muted-foreground hover:text-primary transition-colors mt-4"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border bg-secondary/20">
        <Link
          to="/profile"
          onMouseEnter={() => prefetchData('/profile')}
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 hover:bg-background/80",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
            <User className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-bold text-foreground truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate">Project Admin</p>
            </div>
          )}
        </Link>
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 mt-2 rounded-xl text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all duration-300",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-bold tracking-tight">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-black text-lg">Career Growth</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 transition-all duration-500 ease-in-out lg:z-30",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
