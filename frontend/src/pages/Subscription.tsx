import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, Info, Shield, Zap, Crown, Star, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePlans } from '@/hooks/usePlans';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function Subscription() {
    const navigate = useNavigate();
    const { profile } = useAuthContext();
    const { plans: remotePlans, loading } = usePlans();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);

    const currentPlan = (profile?.userPlan || 'free').toLowerCase();

    const handleUpgrade = (planName: string) => {
        const planNameLower = planName.toLowerCase();

        if (planNameLower === currentPlan) {
            toast.info(`You are already on the ${planName} plan.`);
            return;
        }

        // Show "Coming Soon" modal for premium plans
        if (planNameLower === 'pro' || planNameLower === 'premium') {
            setShowComingSoonModal(true);
            return;
        }

        // Free plan is always available (downgrade scenario)
        toast.info('You are currently on the Free plan.');
    };

    const plans = useMemo(() => {
        if (!remotePlans.length) return [];

        return remotePlans.map(plan => {
            const isPro = plan.id === 'pro';
            const isPremium = plan.id === 'premium';

            // Handle yearly discount (simulated based on monthly price if not explicitly stored)
            let priceVal = parseFloat(plan.price);
            if (billingCycle === 'yearly') {
                // Apply 10 months price for 12 months (standard discount)
                priceVal = Math.round((priceVal * 10));
            }

            return {
                ...plan,
                priceDisplay: `${plan.currency}${priceVal}`,
                period: billingCycle === 'monthly' ? '/month' : '/year',
                icon: isPremium ? Crown : isPro ? Zap : Star,
                color: isPremium ? 'bg-purple-500/10 text-purple-500' : isPro ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500',
                cta: plan.id === currentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`,
                current: plan.id === currentPlan,
                popular: isPro
            };
        });
    }, [remotePlans, billingCycle, currentPlan]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-12">
                {/* Header */}
                <div className="text-center space-y-4 pt-8 animate-fade-in">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Invest in Your Future
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your career goals.
                        Upgrade anytime to unlock more potential.
                    </p>

                    {/* Current Plan Badge */}
                    {profile && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Current Plan: <span className="font-bold capitalize">{currentPlan}</span>
                        </div>
                    )}

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium", billingCycle === 'monthly' ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-7 bg-secondary rounded-full p-1 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <div
                                className={cn(
                                    "w-5 h-5 bg-primary rounded-full shadow-sm transition-transform duration-200",
                                    billingCycle === 'yearly' ? "translate-x-7" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span className={cn("text-sm font-medium", billingCycle === 'yearly' ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">Save 15%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 px-4">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "relative flex flex-col p-6 bg-card rounded-2xl border transition-all duration-300 hover:shadow-xl animate-slide-up",
                                plan.popular ? "border-primary shadow-lg scale-105 z-10" : "border-border hover:border-primary/50"
                            )}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className={cn("p-3 rounded-xl", plan.color)}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold">{plan.priceDisplay}</span>
                                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                {(plan.features || []).map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary shrink-0" />
                                        <span className="text-sm text-foreground/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn("w-full", plan.current && "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
                                onClick={() => handleUpgrade(plan.name)}
                                disabled={plan.current}
                            >
                                {plan.current ? "Current Plan" : plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison / Security Note */}
                <div className="bg-secondary/30 rounded-2xl p-8 border border-border mt-12 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="p-4 bg-background rounded-full border border-border shadow-sm">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">Secure & Transparent Pricing</h3>
                            <p className="text-muted-foreground max-w-2xl">
                                We believe in complete transparency. There are no hidden fees, and you can cancel your subscription at any time.
                                All payments are processed securely via industry-standard encryption.
                            </p>
                        </div>
                        <Button variant="ghost" className="shrink-0 gap-2">
                            <Info className="w-4 h-4" />
                            Contact Sales
                        </Button>
                    </div>
                </div>

                {/* Coming Soon Modal */}
                <Dialog open={showComingSoonModal} onOpenChange={setShowComingSoonModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <DialogTitle className="text-center text-2xl">Premium Plans Coming Soon!</DialogTitle>
                            <DialogDescription className="text-center text-base pt-2">
                                We're working hard to bring you premium features and exclusive benefits.
                                Stay tuned for updates on our Pro and Premium plans.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 mt-4">
                            <p className="text-sm text-muted-foreground text-center">
                                In the meantime, enjoy all the features of our <span className="font-semibold text-foreground">Free Plan</span>!
                            </p>
                            <Button onClick={() => setShowComingSoonModal(false)} className="w-full">
                                Got it, thanks!
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
