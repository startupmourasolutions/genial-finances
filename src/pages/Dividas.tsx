import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Plus, Filter, BarChart3, Table as TableIcon, AlertTriangle, Calendar, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const Dividas = () => {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  const dividas = [
    { id: 1, creditor: "Banco Central", description: "Financiamento Casa", amount: 85000.00, dueDate: "2024-02-15", status: "Em dia", priority: "alta", category: "Financiamento" },
    { id: 2, creditor: "Cartão Visa", description: "Fatura Janeiro", amount: 2450.00, dueDate: "2024-01-25", status: "Vencida", priority: "alta", category: "Cartão" },
    { id: 3, creditor: "Financeira ABC", description: "Empréstimo Pessoal", amount: 12000.00, dueDate: "2024-02-10", status: "Em dia", priority: "média", category: "Empréstimo" },
    { id: 4, creditor: "Loja XYZ", description: "Parcelamento Móveis", amount: 3200.00, dueDate: "2024-01-30", status: "Em dia", priority: "baixa", category: "Parcelamento" }
  ]

  const chartData = dividas.map(divida => ({
    name: divida.creditor,
    valor: divida.amount,
    status: divida.status
  }))

  const pieData = [
    { name: "Financiamento", value: 85000, fill: "hsl(var(--brand-orange))" },
    { name: "Cartão", value: 2450, fill: "hsl(var(--destructive))" },
    { name: "Empréstimo", value: 12000, fill: "hsl(var(--warning))" },
    { name: "Parcelamento", value: 3200, fill: "hsl(var(--success))" }
  ]

  const totalDividas = dividas.reduce((sum, divida) => sum + divida.amount, 0)
  const dividasVencidas = dividas.filter(d => d.status === "Vencida").length
  const proximosVencimentos = dividas.filter(d => new Date(d.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-destructive"
      case "média": return "bg-warning"
      case "baixa": return "bg-success"
      default: return "bg-muted"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Vencida" ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dívidas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas obrigações financeiras</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Dívida
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total em Dívidas</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalDividas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dívidas Vencidas</p>
                <p className="text-2xl font-bold text-destructive">{dividasVencidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencem em 7 dias</p>
                <p className="text-2xl font-bold text-warning">{proximosVencimentos}</p>
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
                <p className="text-sm text-muted-foreground">Total de Dívidas</p>
                <p className="text-2xl font-bold text-brand-orange">{dividas.length}</p>
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
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Buscar credor..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="financiamento">Financiamento</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="emprestimo">Empréstimo</SelectItem>
                <SelectItem value="parcelamento">Parcelamento</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="em-dia">Em dia</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="média">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex-1"
              >
                <TableIcon className="w-4 h-4 mr-2" />
                Tabela
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className="flex-1"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Gráfico
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                {viewMode === "table" ? "Lista de Dívidas" : "Gráfico de Dívidas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="space-y-3">
                  {dividas.map((divida) => (
                    <div key={divida.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(divida.priority)}`} />
                          <div>
                            <h4 className="font-medium text-foreground">{divida.creditor}</h4>
                            <p className="text-sm text-muted-foreground">{divida.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={getStatusColor(divida.status)}>
                          {divida.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(divida.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-destructive">
                          R$ {divida.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">Pagar</Button>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80">
                  <ChartContainer config={{
                    valor: {
                      label: "Valor",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="valor" fill="hsl(var(--brand-orange))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={{
                  financiamento: {
                    label: "Financiamento",
                    color: "hsl(var(--brand-orange))",
                  },
                  cartao: {
                    label: "Cartão",
                    color: "hsl(var(--destructive))",
                  },
                  emprestimo: {
                    label: "Empréstimo",
                    color: "hsl(var(--warning))",
                  },
                  parcelamento: {
                    label: "Parcelamento",
                    color: "hsl(var(--success))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dividas