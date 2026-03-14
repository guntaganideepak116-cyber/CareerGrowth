import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SystemConfig {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    aiMentorEnabled: boolean;
    careerPathsEnabled: boolean;
    analyticsEnabled: boolean;
}

interface SystemContextType {
    config: SystemConfig;
    loading: boolean;
}

const defaultStatus: SystemConfig = {
    maintenanceMode: false,
    registrationEnabled: true,
    aiMentorEnabled: true,
    careerPathsEnabled: true,
    analyticsEnabled: true,
};

const CACHE_KEY = 'system_config_cache';

// Load from localStorage immediately — zero network latency on return visits
function loadCachedConfig(): SystemConfig {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) return { ...defaultStatus, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return defaultStatus;
}

const SystemContext = createContext<SystemContextType>({
    config: defaultStatus,
    loading: false,
});

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialise from cache — page renders instantly on return visits
    const [config, setConfig] = useState<SystemConfig>(loadCachedConfig);
    // loading is only true on first-ever visit when there is no cache
    const [loading, setLoading] = useState(!localStorage.getItem(CACHE_KEY));

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_settings', 'config'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const newConfig: SystemConfig = {
                    maintenanceMode: data.maintenanceMode ?? false,
                    registrationEnabled: data.registrationEnabled ?? true,
                    aiMentorEnabled: data.aiMentorEnabled ?? true,
                    careerPathsEnabled: data.careerPathsEnabled ?? true,
                    analyticsEnabled: data.analyticsEnabled ?? true,
                };
                setConfig(newConfig);
                // Persist for next visit
                localStorage.setItem(CACHE_KEY, JSON.stringify(newConfig));
            }
            setLoading(false);
        }, (err) => {
            console.error('[SYSTEM] Failed to sync platform protocols:', err);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <SystemContext.Provider value={{ config, loading }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => useContext(SystemContext);
