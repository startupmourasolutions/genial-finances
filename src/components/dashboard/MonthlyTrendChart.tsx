import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIncomes } from "@/hooks/useIncomes"
import { useExpenses } from "@/hooks/useExpenses"
import { useMemo } from "react"
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MonthlyTrendChartProps {
  selectedMonth?: number
  selectedYear?: number
}

export function MonthlyTrendChart({ selectedMonth, selectedYear }: MonthlyTrendChartProps = {}) {
  const { incomes } = useIncomes()
  const { expenses } = useExpenses()

  const chartData = useMemo(() => {
    if (!incomes || !expenses) return []

    // Se um mês específico foi selecionado, mostra 6 meses a partir dele (incluindo os anteriores)
    const endDate = selectedMonth !== undefined && selectedYear !== undefined 
      ? new Date(selectedYear, selectedMonth, 1)
      : new Date()
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
  }, [incomes, expenses, selectedMonth, selectedYear])

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução Mensal (Últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-48 sm:h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(0)}M`
                    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`
                    return `R$ ${value.toFixed(0)}`
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number, name: string) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name === 'receitas' ? 'Receitas' : 
                    name === 'despesas' ? 'Despesas' : 'Saldo'
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Receitas"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Despesas"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Saldo"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
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