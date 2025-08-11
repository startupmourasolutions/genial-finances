import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Target } from "lucide-react";
import { ExpensesByCategoryChart } from "@/components/dashboard/ExpensesByCategoryChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { DebtsOverview } from "@/components/dashboard/DebtsOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { FinancialGoalsProgress } from "@/components/dashboard/FinancialGoalsProgress";
import { VehiclesSummary } from "@/components/dashboard/VehiclesSummary";
import { useIncomes } from "@/hooks/useIncomes";
import { useExpenses } from "@/hooks/useExpenses";
import { useFinancialGoals } from "@/hooks/useFinancialGoals";
import { useMemo } from "react";

export default function Dashboard() {
  const { incomes } = useIncomes();
  const { expenses } = useExpenses();
  const { goals } = useFinancialGoals();

  // Calcular estatísticas do mês atual
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyIncomes = incomes?.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startOfMonth && incomeDate <= endOfMonth;
    }).reduce((sum, income) => sum + Number(income.amount), 0) || 0;

    const monthlyExpenses = expenses?.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    }).reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

    const completedGoals = goals?.filter(goal => goal.status === 'completed').length || 0;
    const totalGoals = goals?.length || 0;

    return {
      monthlyIncomes,
      monthlyExpenses,
      currentBalance: monthlyIncomes - monthlyExpenses,
      completedGoals,
      totalGoals
    };
  }, [incomes, expenses, goals]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Principal</h1>
        <p className="text-muted-foreground">Visão geral completa das suas finanças</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              currentMonthStats.currentBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              R$ {currentMonthStats.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.currentBalance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas do Mês
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {currentMonthStats.monthlyIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.monthlyIncomes > 0 ? "Mês atual" : "Nenhuma receita cadastrada"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas do Mês
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {currentMonthStats.monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.monthlyExpenses > 0 ? "Mês atual" : "Nenhuma despesa cadastrada"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas Atingidas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentMonthStats.completedGoals} de {currentMonthStats.totalGoals}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthStats.totalGoals === 0 ? "Nenhuma meta cadastrada" : "Metas concluídas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpensesByCategoryChart />
        <MonthlyTrendChart />
      </div>

      {/* Debts Overview */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Controle de Dívidas</h2>
        <DebtsOverview />
      </div>

      {/* Financial Goals */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Metas Financeiras</h2>
        <FinancialGoalsProgress />
      </div>

      {/* Vehicles Summary */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Gestão de Veículos</h2>
        <VehiclesSummary />
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Atividade Recente</h2>
        <RecentTransactions />
      </div>
    </div>
  );
}