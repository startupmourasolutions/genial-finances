import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSelector } from "@/components/ProfileSelector";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-surface border-b border-border">
          <div className="flex items-center h-16 px-6">
            <SidebarTrigger className="mr-4" />
            <ProfileSelector 
              profiles={["Pessoal", "Empresarial"]} 
              userInitial="U" 
            />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}