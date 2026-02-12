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
    analyticsEnabled: true
};

const SystemContext = createContext<SystemContextType>({
    config: defaultStatus,
    loading: true
});

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SystemConfig>(defaultStatus);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to global platform protocols
        const unsub = onSnapshot(doc(db, 'system_settings', 'config'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setConfig({
                    maintenanceMode: data.maintenanceMode ?? false,
                    registrationEnabled: data.registrationEnabled ?? true,
                    aiMentorEnabled: data.aiMentorEnabled ?? true,
                    careerPathsEnabled: data.careerPathsEnabled ?? true,
                    analyticsEnabled: data.analyticsEnabled ?? true,
                });
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
