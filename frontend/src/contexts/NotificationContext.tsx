import {
    createContext, useContext, useEffect, useState,
    ReactNode, useCallback, useMemo
} from 'react';
import { db } from '@/lib/firebase';
import {
    collection, query, orderBy, limit,
    onSnapshot, doc, updateDoc, arrayUnion, getDoc
} from 'firebase/firestore';
import { useAuthContext } from '@/contexts/AuthContext';

// ── Notification type —— mirrors Firestore schema ─────────────────────────────
export interface Notification {
    id: string;
    // Field identity
    field_id: string;
    field_name?: string;
    // Content
    type: 'skill' | 'trend' | 'warning' | 'certification' | 'update' | 'opportunity';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    category?: string;
    source?: string;
    // Actions
    action_text?: string;
    action_url?: string;
    action_required: boolean;
    source_url: string | null;
    // Timestamps
    created_at: string;
    generated_date: string;    // maps to dateKey
    timestamp: number;
    // Read state
    is_read: boolean;
    is_global: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ── Helper: map raw Firestore doc → Notification ───────────────────────────────
function mapDocToNotification(docId: string, data: Record<string, any>, userId: string): Notification | null {
    // Target audience filter
    // Global notifications (no userId field) are shown to everyone.
    // User-specific notifications are shown only to the matching user.
    const targetUserId: string = data.userId || 'all';
    if (targetUserId !== 'all' && targetUserId !== userId) return null;

    const readBy: string[] = data.readBy || [];

    // Resolve createdAt — backend stores as ISO string; handle both
    let createdAtStr = '';
    let ts = data.timestamp || 0;

    if (data.createdAt) {
        if (typeof data.createdAt === 'string') {
            createdAtStr = data.createdAt;
            if (!ts) ts = new Date(data.createdAt).getTime();
        } else if (typeof data.createdAt.toDate === 'function') {
            // Firestore Timestamp
            createdAtStr = data.createdAt.toDate().toISOString();
            if (!ts) ts = data.createdAt.toMillis();
        }
    }
    if (!createdAtStr) createdAtStr = new Date(ts || Date.now()).toISOString();

    return {
        id: docId,
        field_id: data.fieldId || 'general',
        field_name: data.fieldName || '',
        type: (data.type as Notification['type']) || 'update',
        title: data.title || 'Notification',
        message: data.message || '',
        priority: (data.priority as Notification['priority']) || 'medium',
        category: data.category || '',
        source: data.source || '',
        action_text: data.actionText || data.action_text,
        action_url: data.actionUrl || data.action_url,
        action_required: data.actionRequired || false,
        source_url: data.sourceUrl || data.source_url || null,
        created_at: createdAtStr,
        generated_date: data.dateKey || createdAtStr.split('T')[0] || '',
        timestamp: ts,
        is_read: readBy.includes(userId),
        is_global: data.isGlobal !== false,
    };
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Order by `timestamp` (number) for reliable sorting.
        // Backend stores `timestamp: Date.now()` on every notification.
        const q = query(
            collection(db, 'notifications'),
            orderBy('timestamp', 'desc'),
            limit(60)
        );

        console.log('[NotificationContext] Attaching real-time Firestore listener');

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const mapped: Notification[] = [];

                snapshot.docs.forEach(docSnap => {
                    const notif = mapDocToNotification(docSnap.id, docSnap.data(), user.uid);
                    if (notif) mapped.push(notif);
                });

                console.log(`[NotificationContext] Received ${snapshot.docs.length} docs, mapped ${mapped.length}`);
                setNotifications(mapped);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[NotificationContext] Firestore snapshot error:', err);
                setError('Failed to load notification feed. Please refresh.');
                setLoading(false);
            }
        );

        return () => {
            console.log('[NotificationContext] Detaching listener');
            unsubscribe();
        };
    }, [user]);

    // ── markAsRead ──────────────────────────────────────────────────────────
    const markAsRead = useCallback(async (notificationId: string) => {
        if (!user) return;
        try {
            // Optimistic UI update
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            // Persist to Firestore
            const docRef = doc(db, 'notifications', notificationId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const readBy: string[] = docSnap.data().readBy || [];
                if (!readBy.includes(user.uid)) {
                    await updateDoc(docRef, { readBy: arrayUnion(user.uid) });
                }
            }
        } catch (err) {
            console.error('[NotificationContext] Error marking as read:', err);
        }
    }, [user]);

    // ── markAllAsRead ───────────────────────────────────────────────────────
    const markAllAsRead = useCallback(async () => {
        if (!user || notifications.length === 0) return;

        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n =>
            unreadIds.includes(n.id) ? { ...n, is_read: true } : n
        ));

        // Persist all to Firestore in parallel
        try {
            await Promise.all(
                unreadIds.map(id =>
                    updateDoc(doc(db, 'notifications', id), {
                        readBy: arrayUnion(user.uid)
                    })
                )
            );
        } catch (e) {
            console.error('[NotificationContext] Batch read update failed:', e);
        }
    }, [notifications, user]);

    const contextValue = useMemo(() => ({
        notifications,
        loading,
        error,
        unreadCount: notifications.filter(n => !n.is_read).length,
        markAsRead,
        markAllAsRead,
    }), [notifications, loading, error, markAsRead, markAllAsRead]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationsContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationsContext must be used within a NotificationProvider');
    }
    return context;
}
