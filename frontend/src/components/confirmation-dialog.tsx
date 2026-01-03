import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-500",
          button: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
          iconBg: "bg-red-50",
        }
      case "warning":
        return {
          icon: "text-yellow-500",
          button: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
          iconBg: "bg-yellow-50",
        }
      case "info":
        return {
          icon: "text-blue-500",
          button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          iconBg: "bg-blue-50",
        }
      default:
        return {
          icon: "text-gray-500",
          button: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
          iconBg: "bg-gray-50",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className={`w-16 h-16 ${styles.iconBg} rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse`}>
            <AlertTriangle className={`h-8 w-8 ${styles.icon}`} />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 text-white ${styles.button} transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
