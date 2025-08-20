import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpCircle, ArrowDownCircle, Car, Calendar } from "lucide-react"
import { useIncomes } from "@/hooks/useIncomes"
import { useExpenses } from "@/hooks/useExpenses"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { useDebts } from "@/hooks/useDebts"
import { useVehicles } from "@/hooks/useVehicles"
import { useMemo } from "react"
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart"
import { ExpensesByCategoryChart } from "@/components/dashboard/ExpensesByCategoryChart"
import { DebtsOverview } from "@/components/dashboard/DebtsOverview"
import { FinancialGoalsProgress } from "@/components/dashboard/FinancialGoalsProgress"
import { VehiclesSummary } from "@/components/dashboard/VehiclesSummary"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"

export default function DashboardPessoal() {
  const { incomes } = useIncomes()
  const { expenses } = useExpenses()
  const { goals } = useFinancialGoals()
  const { debts } = useDebts()
  const { vehicles } = useVehicles()

  const currentMonthStats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date)
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear
    })

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const currentBalance = totalIncome - totalExpenses

    const activeGoals = goals.filter(goal => goal.status === 'active')
    const goalProgress = activeGoals.length > 0 
      ? activeGoals.reduce((sum, goal) => sum + (goal.current_amount / goal.target_amount * 100), 0) / activeGoals.length 
      : 0

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      goalProgress: Math.min(goalProgress, 100),
      incomeCount: monthlyIncomes.length,
      expenseCount: monthlyExpenses.length
    }
  }, [incomes, expenses, goals])

  const activeDebts = debts.filter(debt => debt.status === 'active')
  const totalDebt = activeDebts.reduce((sum, debt) => sum + (debt.total_amount || 0), 0)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Pessoal</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Visão geral das suas finanças pessoais</p>
        </div>
        <Badge variant="outline" className="text-xs">
          Perfil Individual
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
            <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${currentMonthStats.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${currentMonthStats.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {currentMonthStats.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <ArrowUpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success">
              R$ {currentMonthStats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.incomeCount} receitas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <ArrowDownCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive">
              R$ {currentMonthStats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.expenseCount} despesas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Progresso Metas
            </CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-brand-orange" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-orange">
              {currentMonthStats.goalProgress.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Média das metas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <MonthlyTrendChart />
        <ExpensesByCategoryChart />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Debts Summary */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
              Dívidas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-destructive">
                R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeDebts.length} dívida(s) pendente(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Summary */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
              Veículos
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-foreground">
                {vehicles.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {vehicles.filter(v => v.status === 'active').length} ativo(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Summary */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              Metas Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-foreground">
                {goals.filter(g => g.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">
                metas ativas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <DebtsOverview />
        <FinancialGoalsProgress />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <VehiclesSummary />
        <RecentTransactions />
      </div>
    </div>
  )
}