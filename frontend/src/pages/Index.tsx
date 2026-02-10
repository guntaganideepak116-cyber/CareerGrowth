import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Brain,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  GraduationCap,
  Route,
  MessageSquare,
  Award,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI Career Analysis',
    description: 'Get personalized career readiness scores and market alignment insights',
  },
  {
    icon: Route,
    title: 'Smart Roadmaps',
    description: 'Semester-wise learning paths tailored to your career goals',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'Real-time skill demand tracking and career trend predictions',
  },
  {
    icon: MessageSquare,
    title: 'AI Mentor',
    description: '24/7 career guidance from AI counselors, mentors, and coaches',
  },
  {
    icon: GraduationCap,
    title: 'Specialization Mapping',
    description: 'Discover emerging fields and hybrid career opportunities',
  },
  {
    icon: Award,
    title: 'Certification Intelligence',
    description: 'AI-prioritized certifications with timing recommendations',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Nav */}
          {/* Nav */}
          <nav className="flex items-center justify-between mb-8 md:mb-16 animate-fade-in gap-2">
            <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="p-2 md:p-2.5 bg-primary rounded-xl">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-lg md:text-xl font-bold text-foreground hidden min-[400px]:block">CareerGrowth</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm md:text-base px-2 md:px-4">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm" className="gap-1 md:gap-2 text-sm md:text-base px-3 md:px-6 h-9 md:h-11">
                  Get Started
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Intelligence Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up stagger-1">
              A digital platform for
              <br />
              <span className="gradient-text">career planning and growth</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up stagger-2">
              Get personalized career guidance, skill recommendations, and market-aligned roadmaps powered by advanced AI. From student to professional.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
              <Link to="/signup">
                <Button variant="ai" size="xl" className="gap-2 px-8">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Talk to AI Mentor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-slide-up stagger-4">
              {[
                { value: '95%', label: 'Career Match Accuracy' },
                { value: '10K+', label: 'Career Paths Analyzed' },
                { value: '24/7', label: 'AI Mentor Availability' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI analyzes market trends, skill demands, and career trajectories to provide you with actionable guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

            <div className="relative">
              <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of students and professionals using AI to navigate their career paths with confidence.
              </p>
              <Link to="/signup">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
