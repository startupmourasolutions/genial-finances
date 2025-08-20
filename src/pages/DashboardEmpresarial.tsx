import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Calendar, Target } from "lucide-react"
import { useIncomes } from "@/hooks/useIncomes"
import { useExpenses } from "@/hooks/useExpenses"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { useDebts } from "@/hooks/useDebts"
import { useMemo } from "react"
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart"
import { ExpensesByCategoryChart } from "@/components/dashboard/ExpensesByCategoryChart"

export default function DashboardEmpresarial() {
  const { incomes } = useIncomes()
  const { expenses } = useExpenses()
  const { goals } = useFinancialGoals()
  const { debts } = useDebts()

  const businessStats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Últimos 12 meses
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, currentMonth - i, 1)
      return {
        month: date.getMonth(),
        year: date.getFullYear()
      }
    })

    const monthlyRevenue = incomes.filter(income => {
      const incomeDate = new Date(income.date)
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear
    }).reduce((sum, income) => sum + income.amount, 0)

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    }).reduce((sum, expense) => sum + expense.amount, 0)

    const monthlyProfit = monthlyRevenue - monthlyExpenses
    const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0

    // Receita anual (últimos 12 meses)
    const annualRevenue = incomes.filter(income => {
      const incomeDate = new Date(income.date)
      const incomeYear = incomeDate.getFullYear()
      const incomeMonth = incomeDate.getMonth()
      
      return last12Months.some(period => 
        period.year === incomeYear && period.month === incomeMonth
      )
    }).reduce((sum, income) => sum + income.amount, 0)

    const activeGoals = goals.filter(goal => goal.status === 'active')
    const totalGoalProgress = activeGoals.length > 0 
      ? activeGoals.reduce((sum, goal) => sum + (goal.current_amount / goal.target_amount * 100), 0) / activeGoals.length 
      : 0

    return {
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      profitMargin,
      annualRevenue,
      totalGoalProgress: Math.min(totalGoalProgress, 100),
      totalTransactions: incomes.length + expenses.length,
      activeGoalsCount: activeGoals.length
    }
  }, [incomes, expenses, goals])

  const totalDebt = debts.filter(debt => debt.status === 'active')
    .reduce((sum, debt) => sum + (debt.total_amount || 0), 0)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Empresarial</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Visão estratégica do seu negócio</p>
        </div>
        <Badge variant="outline" className="text-xs bg-brand-orange/10 text-brand-orange border-brand-orange">
          <Building2 className="w-3 h-3 mr-1" />
          Perfil Empresarial
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success">
              R$ {businessStats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Faturamento do mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Lucro Líquido
            </CardTitle>
            <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${businessStats.monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${businessStats.monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {businessStats.monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margem: {businessStats.profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Receita Anual
            </CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-brand-orange" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-orange">
              R$ {businessStats.annualRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos 12 meses
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Metas Empresariais
            </CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success">
              {businessStats.totalGoalProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {businessStats.activeGoalsCount} metas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Empresarial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <MonthlyTrendChart />
        <ExpensesByCategoryChart />
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Cash Flow */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              Fluxo de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entradas:</span>
                <span className="font-medium text-success">
                  R$ {businessStats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saídas:</span>
                <span className="font-medium text-destructive">
                  R$ {businessStats.monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Saldo:</span>
                  <span className={businessStats.monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}>
                    R$ {businessStats.monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Debt */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
              Obrigações
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-destructive">
                R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">
                Total em compromissos
              </div>
              <div className="text-xs text-success">
                {totalDebt > 0 && businessStats.monthlyRevenue > 0 
                  ? `${((totalDebt / businessStats.monthlyRevenue) * 100).toFixed(1)}% da receita mensal`
                  : 'Sem compromissos'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-brand-orange">
                {businessStats.totalTransactions}
              </div>
              <div className="text-xs text-muted-foreground">
                Total de transações
              </div>
              <div className="text-xs text-foreground">
                Média: {businessStats.totalTransactions > 0 
                  ? `R$ ${((businessStats.monthlyRevenue + businessStats.monthlyExpenses) / businessStats.totalTransactions).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'R$ 0,00'
                } por transação
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Alerts */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Alertas Empresariais
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3 text-sm">
            {businessStats.profitMargin < 10 && businessStats.monthlyRevenue > 0 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-yellow-800 dark:text-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Margem de lucro baixa ({businessStats.profitMargin.toFixed(1)}%) - revisar custos
              </div>
            )}
            {totalDebt > businessStats.monthlyRevenue && businessStats.monthlyRevenue > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-red-800 dark:text-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Obrigações superam a receita mensal - atenção ao fluxo de caixa
              </div>
            )}
            {businessStats.monthlyProfit > 0 && businessStats.profitMargin > 20 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded text-green-800 dark:text-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Excelente performance! Margem de lucro saudável
              </div>
            )}
            {businessStats.totalTransactions === 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-blue-800 dark:text-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Comece registrando suas primeiras transações empresariais
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}