import { DashboardLayout } from "@/components/DashboardLayout"

const Dashboard = () => {
  return (
    <div className="p-8">
      <DashboardLayout
        title="Dashboard Pessoal"
        subtitle="Visão geral das suas finanças"
      />
    </div>
  )
}

export default Dashboard