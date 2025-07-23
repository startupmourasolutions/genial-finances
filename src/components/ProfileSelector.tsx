import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"

interface ProfileSelectorProps {
  profiles: string[]
  userInitial: string
}

export function ProfileSelector({ profiles, userInitial }: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0])

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-surface border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard {selectedProfile}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile} value={profile}>
                {profile}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-brand-orange text-white font-medium">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}