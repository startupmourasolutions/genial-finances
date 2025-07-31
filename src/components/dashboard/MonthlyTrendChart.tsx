import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIncomes } from "@/hooks/useIncomes"
import { useExpenses } from "@/hooks/useExpenses"
import { useMemo } from "react"
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

export function MonthlyTrendChart() {
  const { incomes } = useIncomes()
  const { expenses } = useExpenses()

  const chartData = useMemo(() => {
    if (!incomes || !expenses) return []

    const endDate = new Date()
    const startDate = subMonths(endDate, 5) // Últimos 6 meses
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthIncomes = incomes
        .filter(income => {
          const incomeDate = new Date(income.date)
          return incomeDate >= monthStart && incomeDate <= monthEnd
        })
        .reduce((sum, income) => sum + Number(income.amount), 0)
      
      const monthExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate >= monthStart && expenseDate <= monthEnd
        })
        .reduce((sum, expense) => sum + Number(expense.amount), 0)
      
      return {
        month: format(month, 'MMM', { locale: ptBR }),
        receitas: monthIncomes,
        despesas: monthExpenses,
        saldo: monthIncomes - monthExpenses
      }
    })
  }, [incomes, expenses])

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução Mensal (Últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => 
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
                  }
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name === 'receitas' ? 'Receitas' : 
                    name === 'despesas' ? 'Despesas' : 'Saldo'
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Receitas"
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Despesas"
                />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Saldo"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <p>Dados insuficientes para gerar o gráfico</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}