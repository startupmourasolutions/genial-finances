import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Plus } from "lucide-react"
import { ReactNode } from "react"

interface FloatingActionButtonProps {
  onClick: () => void
  children?: ReactNode
  className?: string
}

export function FloatingActionButton({ onClick, children, className = "" }: FloatingActionButtonProps) {
  const isMobile = useIsMobile()
  
  if (!isMobile) {
    return null
  }

  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
      size="sm"
    >
      {children || <Plus className="w-6 h-6" />}
    </Button>
  )
}