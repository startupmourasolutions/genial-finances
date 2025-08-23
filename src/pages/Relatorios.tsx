import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Filter, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, LineChart, FileText, Loader2 } from "lucide-react"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, AreaChart, Area } from "recharts"
import { useReports } from "@/hooks/useReports"

const Relatorios = () => {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  
  const {
    loading,
    filters,
    monthlyData,
    incomeCategories,
    expenseCategories,
    patrimonyData,
    totals,
    updateFilters,
    exportToPDF,
    exportToExcel
  } = useReports()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Análise completa da sua situação financeira</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <Button variant="outline" className="hover-scale" onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button className="bg-brand-orange hover:bg-brand-orange/90 hover-scale" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Total Receitas</p>
                <p className="text-lg lg:text-2xl font-bold text-success truncate">
                  R$ {totals.totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-destructive/10 rounded-lg">
                <TrendingDown className="w-4 h-4 lg:w-6 lg:h-6 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Total Despesas</p>
                <p className="text-lg lg:text-2xl font-bold text-destructive truncate">
                  R$ {totals.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-brand-orange/10 rounded-lg">
                <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-brand-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Saldo Total</p>
                <p className={`text-lg lg:text-2xl font-bold truncate ${totals.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Crescimento</p>
                <p className={`text-lg lg:text-2xl font-bold ${totals.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {totals.growth >= 0 ? '+' : ''}{totals.growth.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Input 
              type="date" 
              placeholder="Data inicial" 
              value={filters.startDate || ''}
              onChange={(e) => updateFilters({ startDate: e.target.value })}
            />
            <Input 
              type="date" 
              placeholder="Data final" 
              value={filters.endDate || ''}
              onChange={(e) => updateFilters({ endDate: e.target.value })}
            />
            <Select value={filters.period} onValueChange={(value: any) => updateFilters({ period: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.categoryFilter} onValueChange={(value: any) => updateFilters({ categoryFilter: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Abas de Relatórios */}
      <Tabs defaultValue="overview" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
          <TabsTrigger value="receitas" className="text-xs sm:text-sm">Receitas</TabsTrigger>
          <TabsTrigger value="despesas" className="text-xs sm:text-sm">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ChartContainer config={{
                    receitas: {
                      label: "Receitas",
                      color: "hsl(var(--success))",
                    },
                    despesas: {
                      label: "Despesas",
                      color: "hsl(var(--destructive))",
                    },
                    lucro: {
                      label: "Lucro",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="incomes" fill="hsl(var(--success))" radius={4} />
                        <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Evolução do Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ChartContainer config={{
                    lucro: {
                      label: "Lucro",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="hsl(var(--brand-orange))" 
                          fill="hsl(var(--brand-orange))" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receitas" className="space-y-4 lg:space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição de Receitas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="h-64 sm:h-80">
                  <ChartContainer config={{
                    salario: {
                      label: "Salário",
                      color: "hsl(var(--success))",
                    },
                    freelance: {
                      label: "Freelance",
                      color: "hsl(var(--brand-orange))",
                    },
                    investimentos: {
                      label: "Investimentos",
                      color: "hsl(var(--warning))",
                    },
                    outros: {
                      label: "Outros",
                      color: "hsl(var(--muted-foreground))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {incomeCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-semibold">Detalhamento</h3>
                  {incomeCategories.length > 0 ? incomeCategories.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium text-sm lg:text-base truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-success text-sm lg:text-base">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center">Nenhuma receita encontrada</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-4 lg:space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição de Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="h-64 sm:h-80">
                  <ChartContainer config={{
                    alimentacao: {
                      label: "Alimentação",
                      color: "hsl(var(--destructive))",
                    },
                    transporte: {
                      label: "Transporte",
                      color: "hsl(var(--warning))",
                    },
                    moradia: {
                      label: "Moradia",
                      color: "hsl(var(--brand-orange))",
                    },
                    saude: {
                      label: "Saúde",
                      color: "hsl(var(--success))",
                    },
                    lazer: {
                      label: "Lazer",
                      color: "hsl(var(--muted-foreground))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-semibold">Detalhamento</h3>
                  {expenseCategories.length > 0 ? expenseCategories.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium text-sm lg:text-base truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-destructive text-sm lg:text-base">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center">Nenhuma despesa encontrada</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <FloatingActionButton 
        onClick={() => {
          // Pode expandir para mostrar opções de exportar
          console.log('Export options')
        }}
      >
        <Download className="w-6 h-6" />
      </FloatingActionButton>
    </div>
  )
}

export default Relatorios