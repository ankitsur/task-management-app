import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme.context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-full border-2 transition-all duration-300 hover:scale-110",
        theme === 'light'
          ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
          : "border-slate-700 bg-slate-800 hover:bg-slate-700"
      )}
    >
      <Sun className={cn(
        "h-4 w-4 transition-all duration-300",
        theme === 'light'
          ? "text-yellow-600 rotate-0 scale-100"
          : "text-yellow-400 rotate-90 scale-0"
      )} />
      <Moon className={cn(
        "absolute h-4 w-4 transition-all duration-300",
        theme === 'dark'
          ? "text-blue-400 rotate-0 scale-100"
          : "text-blue-400 -rotate-90 scale-0"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Alternative: More elaborate toggle with smooth animation
export function ThemeToggleAdvanced() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          theme === 'light' ? "bg-yellow-400" : "bg-slate-600"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
            theme === 'light' ? "translate-x-1" : "translate-x-6"
          )}
        />
      </button>
      <span className="text-sm font-medium">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </div>
  )
}
