import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { TrialBadge } from "@/components/TrialBadge"
import { NotificationBell } from "@/components/NotificationBell"

interface ProfileSelectorProps {
  profiles: string[]
  userInitial: string
}

export function ProfileSelector({ profiles, userInitial }: ProfileSelectorProps) {
  const { profile, signOut } = useAuth()
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
        
        <NotificationBell />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="hover-scale transition-smooth"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </Button>
        
        <Avatar className="w-10 h-10 hover-scale transition-smooth">
          {profile?.profile_image_url && (
            <AvatarImage src={profile.profile_image_url} alt="Profile" />
          )}
          <AvatarFallback className="bg-brand-orange text-white font-medium">
            {profile?.full_name?.charAt(0).toUpperCase() || userInitial}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}