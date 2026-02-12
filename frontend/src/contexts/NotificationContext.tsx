import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Notification {
    id: string;
    field_id: string;
    field_name?: string;
    type: 'skill' | 'trend' | 'warning' | 'certification' | 'update' | 'opportunity';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    category?: string;
    source?: string;
    action_text?: string;
    action_url?: string;
    action_required: boolean;
    source_url: string | null;
    created_at: string;
    generated_date: string;
    timestamp: number;
    is_read: boolean;
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

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Real-time listener using onSnapshot - GLOBAL SINGLE INSTANCE
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Create query for real-time updates
            // We want notifications where userId is 'all' OR the current user's UID
            const q = query(
                collection(db, 'notifications'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            console.log('[NotificationContext] Setting up live segmented listener');

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const mappedNotifications: Notification[] = snapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        const readBy = data.readBy || [];
                        const targetUserId = data.userId || 'all';

                        // Filter in memory for UID or 'all' to avoid complex index requirements initially
                        // Since limit is 50, this is performant.
                        if (targetUserId !== 'all' && targetUserId !== user.uid) return null;

                        return {
                            id: doc.id,
                            field_id: data.fieldId || 'general',
                            type: (data.type as any) || 'update',
                            title: data.title || 'Notification',
                            message: data.message || '',
                            priority: (data.priority as any) || 'medium',
                            action_text: data.actionText,
                            action_url: data.actionUrl,
                            action_required: data.actionRequired || false,
                            source_url: data.sourceUrl || null,
                            created_at: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
                            timestamp: data.createdAt?.toMillis?.() || Date.now(),
                            is_read: readBy.includes(user.uid)
                        };
                    })
                    .filter(n => n !== null) as Notification[];

                setNotifications(mappedNotifications);
                setLoading(false);
                setError(null);
            }, (err) => {
                console.error('Firestore snapshot error:', err);
                setError('Failed to load live notification feed');
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up listener:', err);
            setError('System sync error');
            setLoading(false);
        }
    }, [user]);

    const markAsRead = useCallback(async (notificationId: string) => {
        if (!user) return;

        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));

            // Update Firestore directly (readBy array)
            const docRef = doc(db, 'notifications', notificationId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const readBy = docSnap.data().readBy || [];
                if (!readBy.includes(user.uid)) {
                    await updateDoc(docRef, {
                        readBy: arrayUnion(user.uid)
                    });
                }
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    }, [user]);

    const markAllAsRead = useCallback(async () => {
        if (!user || notifications.length === 0) return;

        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => unreadIds.includes(n.id) ? { ...n, is_read: true } : n));

        // Update all in Firestore
        try {
            const batch = unreadIds.map(async (id) => {
                const docRef = doc(db, 'notifications', id);
                await updateDoc(docRef, {
                    readBy: arrayUnion(user.uid)
                });
            });
            await Promise.all(batch);
        } catch (e) {
            console.error('Batch read update failed:', e);
        }
    }, [notifications, user]);

    const contextValue = useMemo(() => ({
        notifications,
        loading,
        error,
        unreadCount: notifications.filter(n => !n.is_read).length,
        markAsRead,
        markAllAsRead
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
