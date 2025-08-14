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
          <div className="flex-1 flex flex-col">
            <header className="bg-surface border-b border-border fixed top-0 right-0 left-0 z-40 lg:left-64">
              <div className="flex items-center h-16 px-3 sm:px-6">
                <SidebarTrigger className="mr-2 sm:mr-4" />
                <div className="flex-1 min-w-0">
                  <ProfileSelector 
                    profiles={["Pessoal", "Empresarial"]} 
                    userInitial="U" 
                    onProfileChange={setCurrentProfile}
                  />
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto pt-16 lg:pt-20 p-2 sm:p-4">
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