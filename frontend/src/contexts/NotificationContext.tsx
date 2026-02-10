import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
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
            // Sorting by createdAt descending to show latest first
            const q = query(
                collection(db, 'notifications'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            console.log('[NotificationContext] Setting up global listener');

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const mappedNotifications: Notification[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const readBy = data.readBy || [];

                    return {
                        id: doc.id,
                        field_id: data.fieldId || data.field_id || 'general',
                        field_name: data.fieldName || data.field_name || 'General',
                        type: (data.type as any) || 'update',
                        title: data.title || 'Notification',
                        message: data.message || '',
                        priority: (data.priority as any) || 'medium',
                        category: data.category || 'General',
                        source: data.source || 'System',
                        action_text: data.actionText || data.action_text,
                        action_url: data.actionUrl || data.action_url,
                        action_required: data.action_required || false,
                        source_url: data.sourceUrl || null,
                        created_at: data.createdAt || new Date().toISOString(),
                        generated_date: data.dateKey || new Date().toISOString().split('T')[0],
                        timestamp: data.timestamp || Date.now(),
                        is_read: readBy.includes(user.uid)
                    };
                });

                setNotifications(mappedNotifications);
                setLoading(false);
                setError(null);
            }, (err) => {
                console.error('Firestore snapshot error:', err);
                setError('Failed to load real-time notifications');
                setLoading(false);
            });

            return () => {
                console.log('[NotificationContext] Cleaning up listener');
                unsubscribe();
            };
        } catch (err) {
            console.error('Error setting up listener:', err);
            setError('Failed to setup notification listener');
            setLoading(false);
        }
    }, [user]);

    const markAsRead = useCallback(async (notificationId: string) => {
        if (!user) return;

        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Trigger API in background without blocking UI
            fetch(`${API_URL}/api/notifications/read/${notificationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            }).catch(err => console.error('Background markAsRead error:', err));

        } catch (err) {
            console.error('Error in markAsRead logic:', err);
        }
    }, [user]);

    const markAllAsRead = useCallback(async () => {
        if (!user || notifications.length === 0) return;

        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic update for all
        setNotifications(prev => prev.map(n => unreadIds.includes(n.id) ? { ...n, is_read: true } : n));

        // Parallel background requests
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        Promise.all(unreadIds.map(id =>
            fetch(`${API_URL}/api/notifications/read/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            })
        )).catch(err => console.error('Batch markAsRead error:', err));

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
