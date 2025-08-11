import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/hooks/useExpenses"
import { useCategories } from "@/hooks/useCategories"
import { useMemo } from "react"

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--destructive))',
  'hsl(var(--success))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300'
]

export function ExpensesByCategoryChart() {
  const { expenses } = useExpenses()
  const { categories } = useCategories()

  const chartData = useMemo(() => {
    if (!expenses || !categories) return []

    const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
      const categoryId = expense.category_id || 'sem-categoria'
      acc[categoryId] = (acc[categoryId] || 0) + Number(expense.amount)
      return acc
    }, {})

    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId)
      return {
        name: category?.name || 'Sem Categoria',
        value: amount,
        color: category?.color || '#888888'
      }
    }).sort((a, b) => b.value - a.value)
  }, [expenses, categories])

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Valor'
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Total: R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <p>Nenhuma despesa encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}