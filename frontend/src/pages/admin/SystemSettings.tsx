import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, DollarSign, Users, Shield, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { usePlans, Plan } from '@/hooks/usePlans';

export default function SystemSettings() {
    const { plans: remotePlans, loading, savePlans } = usePlans();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && remotePlans.length > 0) {
            setPlans(remotePlans);
        }
    }, [remotePlans, loading]);

    const handleToggleActive = (id: string) => {
        const updated = plans.map(p => p.id === id ? { ...p, active: !p.active } : p);
        setPlans(updated);
    };

    const handlePriceChange = (id: string, newPrice: string) => {
        const updated = plans.map(p => p.id === id ? { ...p, price: newPrice } : p);
        setPlans(updated);
    };

    const handleCurrencyChange = (id: string, newCurrency: string) => {
        const updated = plans.map(p => p.id === id ? { ...p, currency: newCurrency } : p);
        setPlans(updated);
    };

    const handleCommitChanges = async () => {
        setSaving(true);
        try {
            await savePlans(plans);
            setEditingId(null);
            toast.success("Pricing architecture synchronized globally");
        } catch (e) {
            toast.error("Cloud synchronization failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

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
                        <Button onClick={handleCommitChanges} disabled={saving} className="bg-primary shadow-lg">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Sync to Cloud
                        </Button>
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
                                            <div className="flex gap-1 items-center">
                                                <Input
                                                    className="w-10 h-8 text-lg px-1"
                                                    value={plan.currency}
                                                    onChange={e => handleCurrencyChange(plan.id, e.target.value)}
                                                />
                                                <Input
                                                    className="w-24 inline-block h-8 text-lg"
                                                    value={plan.price}
                                                    onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            `${plan.currency}${plan.price}`
                                        )}
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground">/month</span>
                                </div>
                                <CardDescription>{plan.subscribers || 0} active users</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-2 text-sm">
                                    {(plan.features || []).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant={editingId === plan.id ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => setEditingId(editingId === plan.id ? null : plan.id)}
                                >
                                    {editingId === plan.id ? "Done" : "Edit Pricing"}
                                </Button>
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
