import { Outlet, createRootRoute } from '@tanstack/react-router'
import { NotificationProvider } from '@/contexts/notification.context'
import { NotificationContainer } from '@/components/notification-container'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <NotificationProvider>
      <div className="min-h-screen">
        <Outlet />
        <NotificationContainer />
      </div>
    </NotificationProvider>
  )
}
