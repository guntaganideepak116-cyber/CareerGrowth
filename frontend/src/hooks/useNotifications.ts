import { useState, useEffect, useCallback } from 'react';
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

export function useNotifications() {
  const { user, profile } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener using onSnapshot
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

        // Filter: Show 'general' notifications + notifications for user's field
        // If sorting is critical, we might need composite index or client-side filter
        // Here we filter client-side for "relevant" notifications while listening to global feed
        // Or show all? User requirements implied "fetch live news" (general) and "hourly AI" (per field).
        // I will show ALL for now, or prioritize user field.
        // User Requirement 5: "Sort by createdAt descending".

        setNotifications(mappedNotifications);
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error('Firestore snapshot error:', err);
        setError('Failed to load real-time notifications');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Failed to setup notification listener');
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    // We can rely on onSnapshot to update UI, but optimistic update feels faster
    // However, onSnapshot is very fast for local writes.
    // Since we are calling API for write (to handle readBy logic securely/consistently),
    // we should wait for API or optimistic update.

    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
    } catch (err) {
      console.error('Error marking as read:', err);
      // Revert if API fails?
      // onSnapshot will eventually reconcile true state
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.is_read);
    unread.forEach(n => markAsRead(n.id));
  }, [notifications, markAsRead, user]);

  return {
    notifications,
    loading,
    error,
    unreadCount: notifications.filter(n => !n.is_read).length,
    markAsRead,
    markAllAsRead,
    refresh: () => { } // No-op for realtime
  };
}
