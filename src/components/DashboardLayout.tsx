import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Target } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
}

function StatCard({ title, value, change, icon: Icon, trend = "neutral" }: StatCardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  }

  return (
    <Card className="shadow-card transition-smooth hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs ${trendColors[trend]} flex items-center gap-1 mt-1`}>
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingUp className="h-3 w-3 rotate-180" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardLayoutProps {
  title: string
  subtitle: string
}

export function DashboardLayout({ title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receitas do Mês"
          value="R$ 5.234,50"
          change="+12% vs mês anterior"
          icon={ArrowUpCircle}
          trend="up"
        />
        <StatCard
          title="Despesas do Mês"
          value="R$ 3.456,20"
          change="+8% vs mês anterior"
          icon={ArrowDownCircle}
          trend="down"
        />
        <StatCard
          title="Saldo Atual"
          value="R$ 1.778,30"
          change="+4% vs mês anterior"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Metas Atingidas"
          value="3 de 5"
          change="60% concluído"
          icon={Target}
          trend="neutral"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { description: "Salário", amount: "+R$ 3.500,00", category: "Receita", date: "Hoje" },
                { description: "Supermercado", amount: "-R$ 234,50", category: "Alimentação", date: "Ontem" },
                { description: "Combustível", amount: "-R$ 120,00", category: "Transporte", date: "2 dias atrás" },
                { description: "Freelance", amount: "+R$ 800,00", category: "Receita Extra", date: "3 dias atrás" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                  </div>
                  <span className={`font-semibold ${
                    transaction.amount.startsWith('+') ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Metas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Reserva de Emergência", current: 3500, target: 10000, color: "bg-brand-orange" },
                { name: "Viagem de Férias", current: 1200, target: 3000, color: "bg-blue-500" },
                { name: "Novo Laptop", current: 800, target: 2500, color: "bg-green-500" }
              ].map((goal, index) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${goal.color}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {goal.current.toLocaleString()}</span>
                      <span>R$ {goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}