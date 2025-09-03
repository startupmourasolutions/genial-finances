import DashboardPessoal from "./DashboardPessoal"
import DashboardEmpresarial from "./DashboardEmpresarial"
import DashboardSuperAdmin from "./DashboardSuperAdmin"
import { useProfileContext } from "@/components/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const { currentProfile } = useProfileContext();
  const { profile } = useAuth();
  
  // Verifica se é super administrador
  const isSuperAdmin = profile?.user_type === 'super_administrator';

  // Se for super admin, mostra dashboard específico
  if (isSuperAdmin) {
    return <DashboardSuperAdmin />;
  }

  // Para clientes, mostra dashboard baseado no perfil
  return (
    <div className="space-y-6">
      {/* Dynamic Dashboard Content */}
      <div>
        {currentProfile === "Pessoal" ? (
          <DashboardPessoal />
        ) : (
          <DashboardEmpresarial />
        )}
      </div>
    </div>
  )
}