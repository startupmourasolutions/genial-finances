import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSelector } from "@/components/ProfileSelector";
import Dashboard from "./pages/Dashboard";
import Transacoes from "./pages/Transacoes";
import Metas from "./pages/Metas";
import Categorias from "./pages/Categorias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="bg-surface border-b border-border">
                <div className="flex items-center h-16 px-4">
                  <SidebarTrigger className="mr-4" />
                  <ProfileSelector 
                    profiles={["Pessoal", "Empresarial"]} 
                    userInitial="JW" 
                  />
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transacoes" element={<Transacoes />} />
                  <Route path="/metas" element={<Metas />} />
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
