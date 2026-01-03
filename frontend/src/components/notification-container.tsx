import { useNotifications } from '@/contexts/notification.context'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/* =============================================================================
   TYPES
============================================================================= */

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

/* =============================================================================
   NOTIFICATION STYLES
============================================================================= */

const NOTIFICATION_STYLES: Record<
  NotificationType,
  { container: string; icon: string }
> = {
  success: {
    container:
      'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    container:
      'bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-900',
    icon: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    container:
      'bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:border-sky-900',
    icon: 'text-sky-600 dark:text-sky-400',
  },
}

const NOTIFICATION_ICONS: Record<NotificationType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

/* =============================================================================
   NOTIFICATION ITEM COMPONENT
============================================================================= */

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { id, type, message } = notification
  const styles = NOTIFICATION_STYLES[type]
  const Icon = NOTIFICATION_ICONS[type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        styles.container
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', styles.icon)} />
      <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

/* =============================================================================
   NOTIFICATION CONTAINER
============================================================================= */

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}
