import { Outlet, createRootRoute } from '@tanstack/react-router'
import { NotificationProvider } from '@/contexts/notification.context'
import { ThemeProvider } from '@/contexts/theme.context'
import { NotificationContainer } from '@/components/notification-container'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-background text-foreground antialiased">
          <Outlet />
          <NotificationContainer />
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}
