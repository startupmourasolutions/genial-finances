import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSelector } from "@/components/ProfileSelector";
import { createContext, useContext, useState } from "react";

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

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="bg-surface border-b border-border">
              <div className="flex items-center h-12 px-2 sm:h-16 sm:px-4">
                <SidebarTrigger className="mr-1 sm:mr-3" />
                <ProfileSelector 
                  profiles={["Pessoal", "Empresarial"]} 
                  userInitial="U" 
                  onProfileChange={setCurrentProfile}
                />
              </div>
            </header>
            <main className="flex-1 overflow-auto p-1 sm:p-3">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProfileContext.Provider>
  );
}