/**
 * usePortfolio — Real-time portfolio hook
 *
 * Strategy:
 *   1. On mount, immediately trigger a background sync (POST /api/portfolio/sync)
 *      so the portfolio auto-populates from all progress data.
 *   2. Attach a Firestore onSnapshot listener to user_portfolios/{userId}
 *      so any write (from sync, trigger, or manual save) reflects in <200ms.
 *   3. Expose `syncPortfolio()` so pages can call it manually if needed.
 *   4. Expose `triggerSync(event)` so other components can notify of completions.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from '@/contexts/AuthContext';

// ── Types (must match PortfolioData in Portfolio.tsx) ──────────────────────
export interface SkillItem {
    name: string;
    level: number;
    category: string;
}

export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    difficulty: string;
    status: string;
}

export interface ExperienceItem {
    title: string;
    type: string;
    duration: string;
    outcomes: string[];
}

export interface AutoPortfolioData {
    theme: 'modern' | 'minimal' | 'professional';
    about: { visible: boolean; name: string; headline: string; summary: string; field: string; };
    skills: { visible: boolean; title: string; items: SkillItem[]; };
    projects: { visible: boolean; title: string; items: ProjectItem[]; };
    experience: { visible: boolean; title: string; items: ExperienceItem[]; };
    services: { visible: boolean; title: string; items: string[]; };
    contact: { visible: boolean; title: string; email: string; linkedin?: string; github?: string; twitter?: string; website?: string; };
    readinessScore?: number;
    lastSyncedAt?: string;
    updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export function usePortfolio() {
    const { user } = useAuthContext();
    const [portfolioData, setPortfolioData] = useState<AutoPortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const snapshotUnsub = useRef<(() => void) | null>(null);
    const syncedOnMount = useRef(false);

    // ── Step 1: Trigger backend sync (background, non-blocking) ──
    const syncPortfolio = useCallback(async () => {
        if (!user) return;
        setSyncing(true);
        try {
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${API_URL}/api/portfolio/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // onSnapshot will pick up the updated data automatically
        } catch (err) {
            console.warn('[usePortfolio] Sync failed:', err);
        } finally {
            setSyncing(false);
        }
    }, [user]);

    // ── Trigger after a completion event ──────────────────────────
    const triggerSync = useCallback(async (event: 'roadmap_phase' | 'project' | 'certification' | 'skill' | 'assessment' | 'internship') => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await fetch(`${API_URL}/api/portfolio/trigger`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event }),
            });
        } catch (err) {
            console.warn('[usePortfolio] Trigger sync failed:', err);
        }
    }, [user]);

    // ── Step 2: Real-time Firestore onSnapshot listener ──────────
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Attach realtime listener first so data appears instantly if cached
        const portfolioDocRef = doc(db, 'user_portfolios', user.uid);
        snapshotUnsub.current = onSnapshot(
            portfolioDocRef,
            (snap) => {
                if (snap.exists()) {
                    setPortfolioData(snap.data() as AutoPortfolioData);
                    setError(null);
                } else {
                    // Document doesn't exist yet — sync will create it
                    setPortfolioData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error('[usePortfolio] Snapshot error:', err);
                setError('Failed to load portfolio');
                setLoading(false);
            }
        );

        // Trigger auto-sync once on mount (background — does NOT block UI)
        if (!syncedOnMount.current) {
            syncedOnMount.current = true;
            syncPortfolio();
        }

        return () => {
            snapshotUnsub.current?.();
        };
    }, [user, syncPortfolio]);

    // ── Manual save (for Edit mode) — same shape as before ───────
    const savePortfolio = useCallback(async (data: AutoPortfolioData): Promise<boolean> => {
        if (!user) return false;
        try {
            const token = await user.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            // onSnapshot will update state automatically after write
            return response.ok;
        } catch (err) {
            console.error('[usePortfolio] Save failed:', err);
            return false;
        }
    }, [user]);

    return {
        portfolioData,
        loading,
        syncing,
        error,
        syncPortfolio,
        triggerSync,
        savePortfolio,
    };
}
