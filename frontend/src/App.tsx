import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginRedirect } from "@/components/LoginRedirect";

// Critical Routes (Static Import)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Lazy Loaded Routes
const Profile = lazy(() => import("./pages/Profile"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const FieldSelection = lazy(() => import("./pages/FieldSelection"));
const FieldAssessment = lazy(() => import("./pages/FieldAssessment"));
const BranchSelection = lazy(() => import("./pages/BranchSelection"));
const Specializations = lazy(() => import("./pages/Specializations"));
const CareerPaths = lazy(() => import("./pages/CareerPaths"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Projects = lazy(() => import("./pages/Projects"));
const Certifications = lazy(() => import("./pages/Certifications"));
const AIMentor = lazy(() => import("./pages/AIMentor"));
const Subscription = lazy(() => import("./pages/Subscription"));
const ProjectWorkspace = lazy(() => import("./pages/ProjectWorkspace"));
const ProgressAnalytics = lazy(() => import("./pages/ProgressAnalytics"));
const CodePlayground = lazy(() => import("./pages/CodePlayground"));
const Notifications = lazy(() => import("./pages/Notifications"));


// Admin Routes (Lazy)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserDashboardControl = lazy(() => import("./pages/admin/UserDashboardControl"));
const UserActivity = lazy(() => import("./pages/admin/UserActivity"));
const FieldInsights = lazy(() => import("./pages/admin/FieldInsights"));
const RoadmapManager = lazy(() => import("./pages/admin/RoadmapManager"));
const AssessmentManagement = lazy(() => import("./pages/admin/AssessmentManagement"));
const AIUsageMonitor = lazy(() => import("./pages/admin/AIUsageMonitor"));
const NotificationsControl = lazy(() => import("./pages/admin/NotificationsControl"));
const FeedbackReports = lazy(() => import("./pages/admin/FeedbackReports"));
const CareerPathManager = lazy(() => import("./pages/admin/CareerPathManager"));
const SecurityAccess = lazy(() => import("./pages/admin/SecurityAccess"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));


const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Loading experience...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/redirect" element={<LoginRedirect />} />
              {/* Protected User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/fields" element={<ProtectedRoute><FieldSelection /></ProtectedRoute>} />
              <Route path="/field-assessment" element={<ProtectedRoute><FieldAssessment /></ProtectedRoute>} />
              <Route path="/branches" element={<ProtectedRoute><BranchSelection /></ProtectedRoute>} />
              <Route path="/specializations" element={<ProtectedRoute><Specializations /></ProtectedRoute>} />

              <Route path="/career-paths" element={<ProtectedRoute><CareerPaths /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
              <Route path="/ai-mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              <Route path="/project/:projectId" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
              <Route path="/playground" element={<ProtectedRoute><CodePlayground /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><ProgressAnalytics /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/user-dashboard-control" element={<ProtectedRoute requireAdmin><UserDashboardControl /></ProtectedRoute>} />
              <Route path="/admin/user-activity" element={<ProtectedRoute requireAdmin><UserActivity /></ProtectedRoute>} />
              <Route path="/admin/field-insights" element={<ProtectedRoute requireAdmin><FieldInsights /></ProtectedRoute>} />
              <Route path="/admin/roadmaps" element={<ProtectedRoute requireAdmin><RoadmapManager /></ProtectedRoute>} />
              <Route path="/admin/assessments" element={<ProtectedRoute requireAdmin><AssessmentManagement /></ProtectedRoute>} />
              <Route path="/admin/ai-usage" element={<ProtectedRoute requireAdmin><AIUsageMonitor /></ProtectedRoute>} />

              <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><NotificationsControl /></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><FeedbackReports /></ProtectedRoute>} />
              <Route path="/admin/career-paths" element={<ProtectedRoute requireAdmin><CareerPathManager /></ProtectedRoute>} />
              <Route path="/admin/security" element={<ProtectedRoute requireAdmin><SecurityAccess /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><SystemSettings /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
