import DashboardPessoal from "./DashboardPessoal"
import DashboardEmpresarial from "./DashboardEmpresarial"
import { useProfileContext } from "@/components/DashboardLayout"

export default function Dashboard() {
  const { currentProfile } = useProfileContext();

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