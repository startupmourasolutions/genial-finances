import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Receitas from "./pages/Receitas";
import Despesas from "./pages/Despesas";
import Transacoes from "./pages/Transacoes";
import Metas from "./pages/Metas";
import Categorias from "./pages/Categorias";
import Dividas from "./pages/Dividas";
import Relatorios from "./pages/Relatorios";
import Mercado from "./pages/Mercado";
import Veiculos from "./pages/Veiculos";
import Perfil from "./pages/Perfil";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Administradores from "./pages/admin/Administradores";
import Leads from "./pages/admin/Leads";
import AdminClientes from "./pages/admin/AdminClientes";
import Faturas from "./pages/admin/Faturas";
import Configuracoes from "./pages/admin/Configuracoes";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RadixToaster />
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/receitas" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Receitas />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/despesas" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Despesas />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/transacoes" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Transacoes />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/categorias" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Categorias />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/metas" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Metas />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dividas" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dividas />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Relatorios />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/mercado" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Mercado />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/veiculos" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Veiculos />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/perfil" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Perfil />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Rotas do Super Administrador */}
                <Route path="/admin/administradores" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Administradores />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/leads" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Leads />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/clientes" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AdminClientes />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/faturas" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Faturas />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/configuracoes" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Configuracoes />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;