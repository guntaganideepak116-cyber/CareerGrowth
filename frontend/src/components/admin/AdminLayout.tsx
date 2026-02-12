import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Layers,
    Map,
    Cpu,
    Bell,
    MessageSquare,
    Shield,
    Settings,
    LogOut,
    Target,
    Monitor,
    FileCheck,
    Menu,
    BarChart3
} from 'lucide-react';

import { auth } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { AdminGuard } from './AdminGuard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: ReactNode;
}

const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard Overview', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/user-dashboard-control' },
    { icon: FileCheck, label: 'Assessment Manager', path: '/admin/assessments' },
    { icon: Layers, label: 'Field & Career Content', path: '/admin/career-paths' },
    { icon: Map, label: 'Projects & Certifications', path: '/admin/roadmaps' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/user-activity' },
    { icon: Bell, label: 'Notifications Manager', path: '/admin/notifications' },
    { icon: Shield, label: 'Plan & Subscription Manager', path: '/admin/settings' },
    { icon: Settings, label: 'System Settings', path: '/admin/security' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuthContext();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            // Signs out ONLY this browser session with role-specific cleanup
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Header with subtle gradient background */}
            <div className="border-b bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md transition-transform hover:scale-105">
                        <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Admin Panel</h2>
                        <p className="text-xs text-muted-foreground">Control Center</p>
                    </div>
                </div>
            </div>

            {/* Navigation with hover effects */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${isActive
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-medium'
                                : 'text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground hover:shadow-sm'
                                }`}
                        >
                            <Icon className={`h-4 w-4 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer with enhanced styling */}
            <div className="border-t bg-muted/30 p-4">
                <div className="mb-3 rounded-lg border bg-background/50 p-3 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium text-muted-foreground">Logged in as</p>
                    <p className="truncate text-sm font-semibold text-foreground">
                        {auth.currentUser?.email}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive shadow-sm transition-all duration-200 hover:bg-destructive/20 hover:shadow-md"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-[-2px]" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-background">
                {/* Desktop Sidebar */}
                <aside className="hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm lg:block fixed h-full">
                    <SidebarContent />
                </aside>

                {/* Mobile Sidebar */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>

                <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
                    <header className="sticky top-0 z-10 border-b border-sidebar-border bg-sidebar/95 text-sidebar-foreground px-6 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <h1 className="text-xl font-semibold capitalize">
                                    {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                    </span>
                                    System Operational
                                </span>
                            </div>
                        </div>
                    </header>
                    <div className="bg-gradient-to-br from-background to-muted/20 p-4 lg:p-6 flex-1 overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
