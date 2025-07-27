import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { useTransactions } from "@/hooks/useTransactions"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const Categorias = () => {
  const { categories, loading: categoriesLoading } = useCategories()
  const { transactions, loading: transactionsLoading } = useTransactions()
  const [timeFilter, setTimeFilter] = useState('30') // últimos 30 dias

  const loading = categoriesLoading || transactionsLoading

  // Calcular dados para os gráficos
  const getCategoryData = () => {
    if (!transactions || !categories) return { incomeData: [], expenseData: [] }

    const now = new Date()
    const daysAgo = new Date(now.getTime() - (parseInt(timeFilter) * 24 * 60 * 60 * 1000))

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= daysAgo
    })

    const incomeData = categories
      .filter(cat => cat.type === 'income')
      .map(category => {
        const categoryTransactions = filteredTransactions.filter(
          t => t.type === 'income' && t.category_id === category.id
        )
        const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
        return {
          name: category.name,
          value: total,
          color: category.color || '#8b5cf6',
          count: categoryTransactions.length
        }
      })
      .filter(item => item.value > 0)

    const expenseData = categories
      .filter(cat => cat.type === 'expense')
      .map(category => {
        const categoryTransactions = filteredTransactions.filter(
          t => t.type === 'expense' && t.category_id === category.id
        )
        const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
        return {
          name: category.name,
          value: total,
          color: category.color || '#ef4444',
          count: categoryTransactions.length
        }
      })
      .filter(item => item.value > 0)

    return { incomeData, expenseData }
  }

  const { incomeData, expenseData } = getCategoryData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Transações: {payload[0].payload.count}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <div className="p-8">Carregando dados das categorias...</div>
  }

  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0)
  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise por Categorias</h1>
          <p className="text-muted-foreground">Visualize seus gastos e receitas por categoria</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Último ano</option>
          </select>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {incomeData.length} categorias ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenseData.length} categorias ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-success' : 'text-destructive'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome - totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos {timeFilter} dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Receitas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Receitas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma receita encontrada no período
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma despesa encontrada no período
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparativo por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(incomeData.length > 0 || expenseData.length > 0) ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={[...incomeData.map(item => ({ ...item, type: 'Receita' })), ...expenseData.map(item => ({ ...item, type: 'Despesa' }))]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Nenhum dado encontrado no período selecionado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Categorias