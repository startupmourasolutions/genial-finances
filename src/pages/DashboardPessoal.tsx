import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpCircle, ArrowDownCircle, Calendar, Plus } from "lucide-react"
import { useIncomes } from "@/hooks/useIncomes"
import { useExpenses } from "@/hooks/useExpenses"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { useDebts } from "@/hooks/useDebts"
import { useAuth } from "@/hooks/useAuth"
import { useMemo, useState } from "react"
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart"
import { ExpensesByCategoryChart } from "@/components/dashboard/ExpensesByCategoryChart"
import { DebtsOverview } from "@/components/dashboard/DebtsOverview"
import { FinancialGoalsProgress } from "@/components/dashboard/FinancialGoalsProgress"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { MonthNavigator } from "@/components/MonthNavigator"

export default function DashboardPessoal() {
  const { incomes } = useIncomes()
  const { expenses } = useExpenses()
  const { goals } = useFinancialGoals()
  const { debts } = useDebts()
  const { profile } = useAuth()

  // Estado para o mês/ano selecionado
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const monthStats = useMemo(() => {
    const monthlyIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date)
      return incomeDate.getMonth() === selectedMonth && incomeDate.getFullYear() === selectedYear
    })

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear
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
  }, [incomes, expenses, goals, selectedMonth, selectedYear])

  const activeDebts = debts.filter(debt => debt.status === 'active')
  const totalDebt = activeDebts.reduce((sum, debt) => sum + (debt.total_amount || 0), 0)

  // Get selected month name in Portuguese
  const getSelectedMonthName = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return `${months[selectedMonth]} ${selectedYear}`
  }

  // Check if it's current month
  const isCurrentMonth = selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear()

  const getGreeting = () => {
    const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Usuário'
    return `Olá, ${firstName}`
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Greeting Header */}
      <div className="flex flex-col gap-4 mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{getGreeting()}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {getSelectedMonthName()}
                {!isCurrentMonth && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Histórico
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>
        
        {/* Month Navigator */}
        <div className="border-t pt-4">
          <MonthNavigator
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
            <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${monthStats.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent className="pb-3">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${monthStats.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {monthStats.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isCurrentMonth ? 'Este mês' : getSelectedMonthName()}
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
              R$ {monthStats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthStats.incomeCount} receitas {isCurrentMonth ? 'este mês' : 'no período'}
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
              R$ {monthStats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthStats.expenseCount} despesas {isCurrentMonth ? 'este mês' : 'no período'}
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
              {monthStats.goalProgress.toFixed(1)}%
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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

      <div className="grid grid-cols-1 gap-4 w-full">
        <RecentTransactions />
      </div>
    </div>
  )
}