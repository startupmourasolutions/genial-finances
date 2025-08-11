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
      <div className="flex items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          Dashboard {selectedProfile}
        </h1>
        <TrialBadge />
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
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