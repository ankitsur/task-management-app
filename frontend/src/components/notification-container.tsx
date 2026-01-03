import { useNotifications } from '@/contexts/notification.context'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
          index={index}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
  }
  onRemove: (id: string) => void
  index: number
}

function NotificationItem({ notification, onRemove, index }: NotificationItemProps) {
  const { type, message, id } = notification

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const Icon = icons[type]

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-green-100',
      text: 'text-green-800',
      icon: 'text-green-600',
      glow: 'shadow-green-200/50'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-red-100',
      text: 'text-red-800',
      icon: 'text-red-600',
      glow: 'shadow-red-200/50'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      glow: 'shadow-blue-200/50'
    },
  }

  const style = styles[type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-xl animate-in slide-in-from-right-4 duration-500 hover:scale-105 transition-all',
        style.bg,
        style.glow
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={cn('p-1 rounded-full bg-white/50', style.icon)}>
        <Icon className="h-4 w-4" />
      </div>
      <p className={cn('text-sm flex-1 font-medium', style.text)}>{message}</p>
      <button
        onClick={() => onRemove(id)}
        className={cn(
          'p-1 rounded-full hover:bg-black/10 transition-colors duration-200 group',
          style.text
        )}
      >
        <X className="h-3 w-3 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  )
}
