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
  CreditCard,
  Terminal,
  Briefcase,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: CreditCard, label: 'Upgrade Plan', path: '/subscription' },
  { icon: GraduationCap, label: 'Field Selection', path: '/fields' },
  { icon: Compass, label: 'Specializations', path: '/specializations' },
  { icon: Route, label: 'Career Paths', path: '/career-paths' },
  { icon: Map, label: 'Roadmap', path: '/roadmap' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: Terminal, label: 'Playground', path: '/playground' },
  { icon: Award, label: 'Certifications', path: '/certifications' },
  { icon: MessageSquare, label: 'AI Mentor', path: '/ai-mentor' },
  { icon: Activity, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthContext();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    try {
      // Signs out ONLY this browser session
      // Other active sessions in different browsers remain logged in
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl shrink-0">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-foreground">CareerGrowth</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isNotifications = item.path === '/notifications';
          const showBadge = isNotifications && unreadCount > 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}

              {/* Unread Badge */}
              {showBadge && (
                <span className={cn(
                  "absolute flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full",
                  collapsed ? "top-1 right-1" : "right-3"
                )}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border space-y-3">
        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="font-medium text-foreground truncate">
              {profile?.full_name || user.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground hover:text-danger hover:bg-danger/10',
            collapsed && 'justify-center px-0'
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 p-1.5 bg-card border border-border rounded-full shadow-md hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
