/**
 * usePortfolio — Real-time portfolio hook
 *
 * Data flow:
 *   1. On mount, call GET /api/portfolio (fast read) → immediate display
 *   2. Attach Firestore onSnapshot to user_portfolios/{userId} for live updates
 *      (only after Firestore rules allow it — degrades gracefully if not)
 *   3. After snapshot attaches, trigger POST /api/portfolio/sync in background
 *      so auto-generated data populates without blocking UI
 *   4. Expose savePortfolio() and triggerSync() for other components
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from '@/contexts/AuthContext';

// ── Base URL helper ────────────────────────────────────────────────────────
const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost')) return envUrl.replace(/\/$/, '');

    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return 'https://career-growth-opr6.vercel.app';
    }

    return 'http://localhost:5000';
};
const API_BASE = getBaseUrl();

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
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // ── Resolved API URL (falls back to backend Vercel subdomain if env missing) ──
    const resolveApiUrl = useCallback(async (): Promise<string> => {
        return API_BASE;
    }, []);

    // ── Step A: Initial fast fetch from backend API ───────────────────────
    const fetchFromApi = useCallback(async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const base = await resolveApiUrl();
            if (!base) return; // No API URL configured — skip

            const res = await fetch(`${base}/api/portfolio`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const result = await res.json();
                if (mountedRef.current && result.data) {
                    setPortfolioData(result.data);
                    setError(null);
                }
            }
        } catch (err) {
            console.warn('[usePortfolio] API fetch failed:', err);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [user, resolveApiUrl]);

    // ── Step B: Background sync (aggregates progress → portfolio doc) ─────
    const syncPortfolio = useCallback(async () => {
        if (!user) return;
        if (mountedRef.current) setSyncing(true);
        try {
            const token = await user.getIdToken();
            const base = await resolveApiUrl();
            if (!base) return;

            const res = await fetch(`${base}/api/portfolio/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const result = await res.json();
                // If Firestore onSnapshot isn't active (permissions), update directly
                if (mountedRef.current && result.data) {
                    setPortfolioData(result.data);
                    setError(null);
                }
            }
        } catch (err) {
            console.warn('[usePortfolio] Sync failed:', err);
        } finally {
            if (mountedRef.current) setSyncing(false);
        }
    }, [user, resolveApiUrl]);

    // ── Step C: Trigger after completion events ───────────────────────────
    const triggerSync = useCallback(async (
        event: 'roadmap_phase' | 'project' | 'certification' | 'skill' | 'assessment' | 'internship'
    ) => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const base = await resolveApiUrl();
            if (!base) return;

            await fetch(`${base}/api/portfolio/trigger`, {
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
    }, [user, resolveApiUrl]);

    // ── Step D: Real-time Firestore onSnapshot (best-effort) ─────────────
    // If Firestore rules allow it, updates appear in <200ms after any backend write.
    // If rules block it (permissions error), we degrade gracefully to the API fetch.
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Immediate fast-path: fetch from backend API right away
        fetchFromApi();

        // Attach Firestore real-time listener (best-effort)
        const portfolioDocRef = doc(db, 'user_portfolios', user.uid);
        snapshotUnsub.current = onSnapshot(
            portfolioDocRef,
            (snap) => {
                if (!mountedRef.current) return;
                if (snap.exists()) {
                    setPortfolioData(snap.data() as AutoPortfolioData);
                    setError(null);
                }
                setLoading(false);
            },
            (err) => {
                // Permission error = Firestore rules not yet deployed
                // Degrade gracefully: API fetch already ran, just log quietly
                console.warn('[usePortfolio] Firestore listener unavailable (permissions). Using API fallback.');
                if (mountedRef.current) setLoading(false);
            }
        );

        // Background sync — runs after UI is visible
        if (!syncedOnMount.current) {
            syncedOnMount.current = true;
            // Small delay so the initial render is not blocked
            const t = setTimeout(() => syncPortfolio(), 800);
            return () => {
                clearTimeout(t);
                snapshotUnsub.current?.();
            };
        }

        return () => {
            snapshotUnsub.current?.();
        };
    }, [user, fetchFromApi, syncPortfolio]);

    // ── Manual save (Edit mode) ───────────────────────────────────────────
    const savePortfolio = useCallback(async (data: AutoPortfolioData): Promise<boolean> => {
        if (!user) return false;
        try {
            const token = await user.getIdToken();
            const base = await resolveApiUrl();
            if (!base) return false;

            const res = await fetch(`${base}/api/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (res.ok && mountedRef.current) {
                // onSnapshot picks it up; fallback: update local state directly
                setPortfolioData(data);
            }
            return res.ok;
        } catch (err) {
            console.error('[usePortfolio] Save failed:', err);
            return false;
        }
    }, [user, resolveApiUrl]);

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
