import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { DynamicHeader } from "@/components/DynamicHeader"
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

  // Get the earliest month with data
  const getEarliestDataMonth = () => {
    const allDates = [...incomes, ...expenses].map(item => new Date(item.date))
    if (allDates.length === 0) return { month: currentDate.getMonth(), year: currentDate.getFullYear() }
    
    const earliestDate = new Date(Math.min(...allDates.map(date => date.getTime())))
    return { month: earliestDate.getMonth(), year: earliestDate.getFullYear() }
  }

  const earliestData = getEarliestDataMonth()

  const handleMonthChange = (month: number, year: number) => {
    // Só permite navegar se há dados para o mês ou se é o mês atual ou posterior
    const selectedDate = new Date(year, month)
    const earliestDate = new Date(earliestData.year, earliestData.month)
    const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth())
    
    if (selectedDate >= earliestDate || selectedDate >= currentDateObj) {
      setSelectedMonth(month)
      setSelectedYear(year)
    }
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

  const handleNewTransaction = () => {
    // TODO: Open transaction modal
    console.log('Nova Transação clicked');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Dynamic Header */}
      <DynamicHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        isCurrentMonth={isCurrentMonth}
        onNewTransaction={handleNewTransaction}
      />
      
      {/* Month Navigator */}
      <MonthNavigator
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
        className="mb-4"
      />

      {/* Summary Cards with stagger animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <Card 
          className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up motion-reduce:hover:transform-none motion-reduce:transition-none"
          style={{ 
            animationDelay: '100ms',
            animationFillMode: 'both'
          }}
        >
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

        <Card 
          className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up motion-reduce:hover:transform-none motion-reduce:transition-none"
          style={{ 
            animationDelay: '200ms',
            animationFillMode: 'both'
          }}
        >
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

        <Card 
          className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up motion-reduce:hover:transform-none motion-reduce:transition-none"
          style={{ 
            animationDelay: '300ms',
            animationFillMode: 'both'
          }}
        >
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

        <Card 
          className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up motion-reduce:hover:transform-none motion-reduce:transition-none"
          style={{ 
            animationDelay: '400ms',
            animationFillMode: 'both'
          }}
        >
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
        <Card 
          className="shadow-card animate-fade-in-up"
          style={{ 
            animationDelay: '200ms',
            animationFillMode: 'both'
          }}
        >
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
        <Card 
          className="shadow-card animate-fade-in-up"
          style={{ 
            animationDelay: '300ms',
            animationFillMode: 'both'
          }}
        >
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