import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bell,
  BellOff,
  TrendingUp,
  BookOpen,
  Briefcase,
  Calendar,
  Trophy,
  ExternalLink,
  Check,
  Clock,
  X,
  RefreshCw,
  Filter,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { formatRelativeIST } from '@/lib/dateUtils';

export default function Notifications() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const filterMatch = filter === 'all' || !n.is_read;
    const priorityMatch = priorityFilter === 'all' || n.priority === priorityFilter;
    const fieldMatch = selectedField === 'all' || n.field_id === selectedField;
    return filterMatch && priorityMatch && fieldMatch;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
    toast.success('Notifications refreshed!');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleDismiss = (id: string) => {
    // Just mark as read instead of deleting
    console.log('Dismissing notification:', id);
    markAsRead(id);
    toast.success('Notification marked as read');
  };

  const handleMarkRead = async (id: string) => {
    console.log('Marking notification as read:', id);
    const notification = notifications.find(n => n.id === id);
    console.log('Current read status:', notification?.is_read);

    await markAsRead(id);

    // Check state after marking
    setTimeout(() => {
      const updatedNotification = notifications.find(n => n.id === id);
      console.log('Updated read status:', updatedNotification?.is_read);
    }, 100);

    toast.success('Marked as read');
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Industry Update':
        return TrendingUp;
      case 'Skill Development':
        return BookOpen;
      case 'Career Opportunity':
        return Briefcase;
      case 'Upcoming Event':
        return Calendar;
      case 'Learning Resource':
        return Trophy;
      default:
        return Bell;
    }
  };

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
    medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    low: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Loading AI-generated notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Daily Updates
            </div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time updates generated daily by AI for all 22 fields
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BellOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-2xl font-bold text-foreground">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="engineering">Engineering & Technology</SelectItem>
                <SelectItem value="medical">Medical & Health Sciences</SelectItem>
                <SelectItem value="science">Science & Research</SelectItem>
                <SelectItem value="commerce">Commerce & Business</SelectItem>
                <SelectItem value="design">Design & Creative Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="ghost" size="sm">
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'unread' ? "You're all caught up!" : 'Check back later for updates'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getCategoryIcon(notification.category);
              return (
                <div
                  key={notification.id}
                  className={`bg-card rounded-lg border-l-4 p-4 transition-all duration-500 hover:shadow-md relative ${priorityColors[notification.priority]
                    } ${!notification.is_read ? 'border border-primary/30 bg-primary/5' : 'border-transparent opacity-75'}`}
                  style={{ transition: 'all 0.5s ease-in-out' }}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.is_read && (
                    <div className="absolute top-4 right-4 transition-opacity duration-500">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg transition-all duration-500 ${notification.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Icon className={`h-5 w-5 transition-colors duration-500 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {notification.title}
                            {!notification.is_read && (
                              <span className="ml-2 text-xs font-normal text-primary">(New)</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {notification.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {notification.field_name}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelativeIST(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <p className={`text-sm mb-3 ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.action_url && notification.action_url !== '#' && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={notification.action_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleMarkRead(notification.id)}
                            >
                              {notification.action_text || 'Learn More'}
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkRead(notification.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Mark as read
                          </Button>
                        )}
                        {notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="cursor-not-allowed opacity-50"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Already read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(notification.id)}
                          title="Dismiss (marks as read)"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">AI-Generated Daily Updates</h3>
              <p className="text-sm text-muted-foreground">
                Our AI system generates fresh, relevant notifications every day at 6:00 AM for all 22 fields.
                Stay informed about industry trends, learning opportunities, and career insights tailored to your field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
