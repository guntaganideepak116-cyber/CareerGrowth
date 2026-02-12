import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, DollarSign, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Mock Plan Data
const DEFAULT_PLANS = [
    {
        id: 'free',
        name: 'Free Tier',
        price: '0',
        features: ['Basic Career Paths', 'Limited Projects', 'Community Access'],
        active: true,
        subscribers: 1250
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: '9.99',
        features: ['AI Mentor Access', 'Unlimited Projects', 'Priority Support', 'Certification Badges'],
        active: true,
        subscribers: 85
    },
    {
        id: 'premium',
        name: 'Premium Plan',
        price: '19.99',
        features: ['1-on-1 Mentorship', 'Job Guarantee Program', 'Exclusive Workshops', 'All Pro Features'],
        active: true,
        subscribers: 42
    }
];

export default function SystemSettings() {
    const [plans, setPlans] = useState(DEFAULT_PLANS);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleToggleActive = (id: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
        toast.success("Plan status updated");
    };

    const handlePriceChange = (id: string, newPrice: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, price: newPrice } : p));
    };

    const handleSave = () => {
        setEditingId(null);
        toast.success("Pricing updated successfully");
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Plan & Subscription Manager</h1>
                        <p className="text-muted-foreground">Manage subscription tiers, pricing, and feature access.</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="px-3 py-1 flex gap-2">
                            <Users className="h-3 w-3" />
                            Total Subscribers: {plans.reduce((acc, p) => acc + (p.id !== 'free' ? p.subscribers : 0), 0)}
                        </Badge>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id} className={`relative flex flex-col ${!plan.active ? 'opacity-75 bg-muted/50' : ''} ${plan.id === 'premium' ? 'border-primary/50 shadow-lg' : ''}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant={plan.id === 'free' ? 'secondary' : plan.id === 'pro' ? 'default' : 'destructive'}>
                                        {plan.name}
                                    </Badge>
                                    <Switch
                                        checked={plan.active}
                                        onCheckedChange={() => handleToggleActive(plan.id)}
                                        aria-label="Toggle plan"
                                    />
                                </div>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {editingId === plan.id ? (
                                            <Input
                                                className="w-24 inline-block h-8 text-lg"
                                                value={plan.price}
                                                onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                                            />
                                        ) : (
                                            `$${plan.price}`
                                        )}
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground">/month</span>
                                </div>
                                <CardDescription>{plan.subscribers} active users</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-2 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {editingId === plan.id ? (
                                    <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                                ) : (
                                    <Button variant="outline" className="w-full" onClick={() => setEditingId(plan.id)}>Edit Pricing</Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Payment Gateway Status (Mock) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Gateway Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded flex items-center justify-center border shadow-sm">
                                    <span className="font-bold text-indigo-600">S</span>
                                </div>
                                <div>
                                    <p className="font-medium">Stripe Payments</p>
                                    <p className="text-xs text-muted-foreground">Connected: acct_1GqIC...</p>
                                </div>
                            </div>
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
