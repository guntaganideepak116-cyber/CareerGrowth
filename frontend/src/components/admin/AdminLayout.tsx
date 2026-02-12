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
    Menu
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
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Monitor, label: 'User Dashboard Control', path: '/admin/user-dashboard-control' },
    { icon: Users, label: 'User Activity', path: '/admin/user-activity' },
    { icon: Layers, label: 'Field Insights', path: '/admin/field-insights' },
    { icon: Map, label: 'Roadmap Manager', path: '/admin/roadmaps' },
    { icon: FileCheck, label: 'Assessment Management', path: '/admin/assessments' },
    { icon: Cpu, label: 'AI Usage Monitor', path: '/admin/ai-usage' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: MessageSquare, label: 'Feedback & Reports', path: '/admin/feedback' },
    { icon: Target, label: 'Career Paths', path: '/admin/career-paths' },
    { icon: Shield, label: 'Security & Access', path: '/admin/security' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
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
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-primary-dark hover:text-primary-foreground hover:shadow-sm'
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
                <aside className="hidden w-64 border-r bg-card shadow-sm lg:block fixed h-full">
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                    {/* Top Bar with subtle shadow and gradient */}
                    <header className="sticky top-0 z-10 border-b bg-card/95 px-4 lg:px-6 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Mobile Menu Trigger */}
                                <Sheet open={open} onOpenChange={setOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="lg:hidden">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="p-0 w-72">
                                        <SidebarContent />
                                    </SheetContent>
                                </Sheet>

                                <div>
                                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">
                                        {adminNavItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
                                    </h1>
                                    <p className="hidden md:block mt-0.5 text-sm text-muted-foreground">
                                        Platform monitoring and management
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 lg:px-4 lg:py-2 shadow-sm dark:border-green-900 dark:bg-green-950">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                                <span className="text-xs lg:text-sm font-medium text-green-700 dark:text-green-300">System Online</span>
                            </div>
                        </div>
                    </header>

                    {/* Content with subtle background */}
                    <div className="bg-gradient-to-br from-background to-muted/20 p-4 lg:p-6 flex-1 overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
