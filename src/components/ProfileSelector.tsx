import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { TrialBadge } from "@/components/TrialBadge"
import { NotificationBell } from "@/components/NotificationBell"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { ThemeToggle } from "@/components/ThemeToggle"

interface ProfileSelectorProps {
  profiles: string[]
  userInitial: string
}

export function ProfileSelector({ profiles, userInitial }: ProfileSelectorProps) {
  const { profile } = useAuth()
  const [selectedProfile, setSelectedProfile] = useState(profiles[0])

  const toggleProfile = () => {
    const currentIndex = profiles.indexOf(selectedProfile)
    const nextIndex = (currentIndex + 1) % profiles.length
    setSelectedProfile(profiles[nextIndex])
  }

  const isPessoal = selectedProfile === "Pessoal"

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard {selectedProfile}
        </h1>
        <TrialBadge />
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={toggleProfile}
          className="flex items-center gap-2 h-10 px-4 hover-scale transition-smooth"
        >
          {isPessoal ? (
            <User className="w-4 h-4" />
          ) : (
            <Building className="w-4 h-4" />
          )}
          <span className="font-medium">{selectedProfile}</span>
        </Button>
        
        <ThemeToggle />
        
        <NotificationBell />
        
        <ProfileDropdown userInitial={userInitial} />
      </div>
    </div>
  )
}