import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";
import { useMemo } from "react";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))', 'hsl(var(--success))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface ExpensesByCategoryChartProps {
  selectedMonth?: number
  selectedYear?: number
}

export function ExpensesByCategoryChart({ selectedMonth, selectedYear }: ExpensesByCategoryChartProps = {}) {
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    if (!expenses || !categories) return [];
    
    // Filtrar despesas pelo mês selecionado
    const filteredExpenses = selectedMonth !== undefined && selectedYear !== undefined
      ? expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear
        })
      : expenses;
    
    const expensesByCategory = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
      const categoryId = expense.category_id || 'sem-categoria';
      acc[categoryId] = (acc[categoryId] || 0) + Number(expense.amount);
      return acc;
    }, {});

    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || 'Sem Categoria',
        value: amount,
        color: COLORS[Object.keys(expensesByCategory).indexOf(categoryId) % COLORS.length]
      };
    }).sort((a, b) => b.value - a.value);
  }, [expenses, categories, selectedMonth, selectedYear]);

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={chartData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={30} 
                    outerRadius={70} 
                    paddingAngle={2} 
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }} 
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {chartData.map((item, index) => {
                const percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : '0';
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover-scale">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentage}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <p>Nenhuma despesa encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}