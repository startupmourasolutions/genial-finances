import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/hooks/useExpenses"
import { useCategories } from "@/hooks/useCategories"
import { useMemo } from "react"

const COLORS = [
  'hsl(24, 95%, 53%)',   // Laranja vibrante
  'hsl(142, 76%, 36%)',  // Verde
  'hsl(221, 83%, 53%)',  // Azul
  'hsl(271, 81%, 56%)',  // Roxo
  'hsl(0, 84%, 60%)',    // Vermelho
  'hsl(38, 92%, 50%)',   // Amarelo/dourado
  'hsl(168, 76%, 42%)',  // Turquesa
  'hsl(340, 82%, 52%)',  // Rosa
  'hsl(120, 60%, 45%)',  // Verde escuro
  'hsl(200, 70%, 50%)'   // Azul claro
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
          <div className="space-y-4">
            <div className="h-48 sm:h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
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
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category Legend with Values */}
            <div className="space-y-2">
              <div className="text-center mb-3">
                <p className="text-lg font-semibold text-foreground">
                  Total: R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chartData.slice(0, 8).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground ml-2">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
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