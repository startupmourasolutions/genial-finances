import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSelector } from "@/components/ProfileSelector";
import { createContext, useContext, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileContextType {
  currentProfile: string;
  setCurrentProfile: (profile: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within ProfileContext");
  }
  return context;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentProfile, setCurrentProfile] = useState("Pessoal");
  const isMobile = useIsMobile();

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-surface border-b border-border sticky top-0 z-40 w-full">
              <div className="flex items-center justify-between h-16 px-3 sm:px-6 gap-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SidebarTrigger className="flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0 max-w-xs sm:max-w-none">
                  <ProfileSelector 
                    profiles={["Pessoal", "Empresarial"]} 
                    userInitial="U" 
                    onProfileChange={setCurrentProfile}
                  />
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-2 sm:p-4">
              <div className="max-w-full overflow-hidden">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProfileContext.Provider>
  );
}