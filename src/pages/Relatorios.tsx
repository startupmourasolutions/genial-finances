import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Filter, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, LineChart, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, AreaChart, Area } from "recharts"

const Relatorios = () => {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  const [periodo, setPeriodo] = useState("mensal")

  // Dados mensais
  const dadosMensais = [
    { mes: "Jan", receitas: 4500, despesas: 3200, lucro: 1300 },
    { mes: "Fev", receitas: 3800, despesas: 2900, lucro: 900 },
    { mes: "Mar", receitas: 5200, despesas: 3800, lucro: 1400 },
    { mes: "Abr", receitas: 4100, despesas: 3100, lucro: 1000 },
    { mes: "Mai", receitas: 4800, despesas: 3500, lucro: 1300 },
    { mes: "Jun", receitas: 5500, despesas: 4200, lucro: 1300 }
  ]

  // Dados de categorias
  const categoriasReceitas = [
    { name: "Salário", value: 3500, fill: "hsl(var(--success))" },
    { name: "Freelance", value: 1200, fill: "hsl(var(--brand-orange))" },
    { name: "Investimentos", value: 800, fill: "hsl(var(--warning))" },
    { name: "Outros", value: 300, fill: "hsl(var(--muted-foreground))" }
  ]

  const categoriasDespesas = [
    { name: "Alimentação", value: 1200, fill: "hsl(var(--destructive))" },
    { name: "Transporte", value: 800, fill: "hsl(var(--warning))" },
    { name: "Moradia", value: 1500, fill: "hsl(var(--brand-orange))" },
    { name: "Saúde", value: 400, fill: "hsl(var(--success))" },
    { name: "Lazer", value: 500, fill: "hsl(var(--muted-foreground))" }
  ]

  // Evolução patrimônio
  const patrimonioData = [
    { mes: "Jan", valor: 15000 },
    { mes: "Fev", valor: 15900 },
    { mes: "Mar", valor: 17300 },
    { mes: "Abr", valor: 18300 },
    { mes: "Mai", valor: 19600 },
    { mes: "Jun", valor: 20900 }
  ]

  const totalReceitas = dadosMensais.reduce((sum, item) => sum + item.receitas, 0)
  const totalDespesas = dadosMensais.reduce((sum, item) => sum + item.despesas, 0)
  const saldoTotal = totalReceitas - totalDespesas
  const crescimentoMensal = ((dadosMensais[5].lucro - dadosMensais[0].lucro) / dadosMensais[0].lucro * 100).toFixed(1)

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análise completa da sua situação financeira</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hover-scale">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button className="bg-brand-orange hover:bg-brand-orange/90 hover-scale">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Receitas</p>
                <p className="text-2xl font-bold text-success">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Despesas</p>
                <p className="text-2xl font-bold text-destructive">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <p className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crescimento</p>
                <p className="text-2xl font-bold text-success">+{crescimentoMensal}%</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input type="date" placeholder="Data inicial" />
            <Input type="date" placeholder="Data final" />
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="despesas">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Abas de Relatórios */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="patrimonio">Patrimônio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
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
                      <BarChart data={dadosMensais}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="receitas" fill="hsl(var(--success))" radius={4} />
                        <Bar dataKey="despesas" fill="hsl(var(--destructive))" radius={4} />
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
                <div className="h-80">
                  <ChartContainer config={{
                    lucro: {
                      label: "Lucro",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dadosMensais}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="lucro" 
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

        <TabsContent value="receitas" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição de Receitas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
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
                          data={categoriasReceitas}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {categoriasReceitas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detalhamento</h3>
                  {categoriasReceitas.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-success">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição de Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
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
                          data={categoriasDespesas}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {categoriasDespesas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detalhamento</h3>
                  {categoriasDespesas.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-destructive">
                        R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patrimonio" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Evolução do Patrimônio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{
                  valor: {
                    label: "Patrimônio",
                    color: "hsl(var(--brand-orange))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={patrimonioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="hsl(var(--brand-orange))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--brand-orange))", strokeWidth: 2, r: 4 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Relatorios