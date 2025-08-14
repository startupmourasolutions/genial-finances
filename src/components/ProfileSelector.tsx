import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TrialBadge } from "@/components/TrialBadge";
import { NotificationBell } from "@/components/NotificationBell";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileToggle } from "@/components/ProfileToggle";
interface ProfileSelectorProps {
  profiles: string[];
  userInitial: string;
  onProfileChange?: (profile: string) => void;
}
export function ProfileSelector({
  profiles,
  userInitial,
  onProfileChange
}: ProfileSelectorProps) {
  const {
    profile
  } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const handleProfileChange = (newProfile: string) => {
    setSelectedProfile(newProfile);
    onProfileChange?.(newProfile);
  };
  return <div className="flex items-center justify-between w-full text-sm font-bold">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <h1 className="hidden sm:block text-lg sm:text-xl lg:text-2xl font-semibold text-foreground truncate">
          Dashboard {selectedProfile}
        </h1>
        <div className="hidden sm:block">
          <TrialBadge />
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        <ProfileToggle profiles={profiles} onProfileChange={handleProfileChange} />
        
        <ThemeToggle />
        
        <NotificationBell />
        
        <ProfileDropdown userInitial={userInitial} />
      </div>
    </div>;
}

// Export the current profile state
export function useCurrentProfile() {
  const [currentProfile, setCurrentProfile] = useState("Pessoal");
  return {
    currentProfile,
    setCurrentProfile
  };
}