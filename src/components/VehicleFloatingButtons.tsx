import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Plus, Car, Settings } from "lucide-react"
import { useState } from "react"

interface VehicleFloatingButtonsProps {
  onNewVehicle: () => void
  onNewMaintenance: () => void
}

export function VehicleFloatingButtons({ onNewVehicle, onNewMaintenance }: VehicleFloatingButtonsProps) {
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Botões secundários - aparecem quando expandido */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <Button
          onClick={() => {
            onNewMaintenance()
            setIsExpanded(false)
          }}
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => {
            onNewVehicle()
            setIsExpanded(false)
          }}
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          <Car className="w-5 h-5" />
        </Button>
      </div>

      {/* Botão principal */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
        size="sm"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}