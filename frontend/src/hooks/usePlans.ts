import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface Plan {
    id: string;
    name: string;
    price: string;
    currency: string;
    features: string[];
    active: boolean;
    subscribers?: number;
}

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_settings', 'plans'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setPlans(data.plans || []);
            } else {
                // Initialize with default if not found
                const defaults: Plan[] = [
                    {
                        id: 'free',
                        name: 'Free',
                        price: '0',
                        currency: '₹',
                        features: ['Access to basic projects', 'Standard career roadmaps', 'Community support'],
                        active: true,
                        subscribers: 1250
                    },
                    {
                        id: 'pro',
                        name: 'Pro',
                        price: '499',
                        currency: '₹',
                        features: ['Everything in Free', 'Unlock Pro-tier Projects', 'AI-assisted roadmaps'],
                        active: true,
                        subscribers: 85
                    },
                    {
                        id: 'premium',
                        name: 'Premium',
                        price: '999',
                        currency: '₹',
                        features: ['Everything in Pro', '1-on-1 Mentorship', 'Job Guarantee Program'],
                        active: true,
                        subscribers: 42
                    }
                ];
                setPlans(defaults);
                // Don't auto-save to firestore here to avoid infinite loops if rules fail
            }
            setLoading(false);
        }, (err) => {
            console.error("Plans listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const savePlans = async (newPlans: Plan[]) => {
        try {
            await setDoc(doc(db, 'system_settings', 'plans'), {
                plans: newPlans,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (e) {
            console.error("Save plans error:", e);
            throw e;
        }
    };

    return { plans, loading, error, savePlans };
}
