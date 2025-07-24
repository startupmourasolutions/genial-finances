import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Plus, Filter, BarChart3, Table as TableIcon, ShoppingCart, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const Mercado = () => {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  const listaCompras = [
    { id: 1, item: "Arroz 5kg", categoria: "Grãos", preco: 18.50, quantidade: 2, comprado: false, prioridade: "alta", dataVencimento: "2024-02-15" },
    { id: 2, item: "Leite Integral 1L", categoria: "Laticínios", preco: 4.20, quantidade: 4, comprado: true, prioridade: "média", dataVencimento: "2024-01-30" },
    { id: 3, item: "Carne Bovina 1kg", categoria: "Carnes", preco: 28.90, quantidade: 1, comprado: false, prioridade: "alta", dataVencimento: "2024-01-28" },
    { id: 4, item: "Banana Prata", categoria: "Frutas", preco: 5.80, quantidade: 2, comprado: false, prioridade: "baixa", dataVencimento: "2024-01-26" },
    { id: 5, item: "Detergente", categoria: "Limpeza", preco: 3.50, quantidade: 3, comprado: true, prioridade: "baixa", dataVencimento: null }
  ]

  const gastosMensais = [
    { mes: "Jan", valor: 850, itens: 45 },
    { mes: "Fev", valor: 920, itens: 52 },
    { mes: "Mar", valor: 780, itens: 38 },
    { mes: "Abr", valor: 1020, itens: 58 },
    { mes: "Mai", valor: 890, itens: 47 },
    { mes: "Jun", valor: 950, itens: 49 }
  ]

  const categoriaData = [
    { name: "Alimentação", value: 650, fill: "hsl(var(--success))" },
    { name: "Limpeza", value: 120, fill: "hsl(var(--brand-orange))" },
    { name: "Higiene", value: 180, fill: "hsl(var(--warning))" }
  ]

  const chartData = listaCompras.map(item => ({
    name: item.item,
    valor: item.preco * item.quantidade,
    categoria: item.categoria
  }))

  const totalGasto = listaCompras.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
  const itensComprados = listaCompras.filter(item => item.comprado).length
  const itensTotal = listaCompras.length
  const mediaGastoMensal = gastosMensais.reduce((sum, mes) => sum + mes.valor, 0) / gastosMensais.length

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-destructive"
      case "média": return "bg-warning"
      case "baixa": return "bg-success"
      default: return "bg-muted"
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      "Grãos": "bg-amber-500",
      "Laticínios": "bg-blue-500",
      "Carnes": "bg-red-500",
      "Frutas": "bg-green-500",
      "Limpeza": "bg-purple-500"
    }
    return colors[categoria] || "bg-muted"
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Mercado</h1>
          <p className="text-muted-foreground">Organize suas compras e controle gastos</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total da Lista</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Itens Comprados</p>
                <p className="text-2xl font-bold text-success">{itensComprados}/{itensTotal}</p>
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
                <p className="text-sm text-muted-foreground">Itens Pendentes</p>
                <p className="text-2xl font-bold text-warning">{itensTotal - itensComprados}</p>
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
                <p className="text-sm text-muted-foreground">Média Mensal</p>
                <p className="text-2xl font-bold text-success">
                  R$ {mediaGastoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Buscar item..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="graos">Grãos</SelectItem>
                <SelectItem value="laticinios">Laticínios</SelectItem>
                <SelectItem value="carnes">Carnes</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="comprado">Comprados</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
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
                Lista
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
                {viewMode === "table" ? "Lista de Compras" : "Gastos por Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="space-y-3">
                  {listaCompras.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth ${
                      item.comprado ? 'bg-success/10 opacity-75' : 'bg-muted/30'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={item.comprado}
                            className="w-4 h-4 rounded border-border"
                            readOnly
                          />
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.prioridade)}`} />
                          <div>
                            <h4 className={`font-medium ${item.comprado ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.item}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getCategoryColor(item.categoria)}>
                                {item.categoria}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Qty: {item.quantidade}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Preço Unit.</p>
                        <span className="font-medium">R$ {item.preco.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-brand-orange">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="destructive">Remover</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80">
                  <ChartContainer config={{
                    valor: {
                      label: "Valor Total",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
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

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={{
                  alimentacao: {
                    label: "Alimentação",
                    color: "hsl(var(--success))",
                  },
                  limpeza: {
                    label: "Limpeza",
                    color: "hsl(var(--brand-orange))",
                  },
                  higiene: {
                    label: "Higiene",
                    color: "hsl(var(--warning))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoriaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoriaData.map((item, index) => (
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

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ChartContainer config={{
                  valor: {
                    label: "Gasto",
                    color: "hsl(var(--brand-orange))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gastosMensais}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="hsl(var(--brand-orange))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--brand-orange))", strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Mercado