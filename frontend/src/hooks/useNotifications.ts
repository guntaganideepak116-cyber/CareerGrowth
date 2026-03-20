import { useNotificationsContext } from '@/contexts/NotificationContext';
import { Notification } from '@/contexts/NotificationContext';

export type { Notification };

export function useNotifications() {
  const context = useNotificationsContext();

  return {
    notifications: context.notifications,
    loading: context.loading,
    error: context.error,
    unreadCount: context.unreadCount,
    markAsRead: context.markAsRead,
    markAllAsRead: context.markAllAsRead,
    refresh: () => { } // No-op for realtime
  };
}
