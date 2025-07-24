import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Plus, Filter, BarChart3, Table as TableIcon, Car, Fuel, Wrench, Calendar, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const Veiculos = () => {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  const veiculos = [
    { 
      id: 1, 
      modelo: "Honda Civic 2020", 
      placa: "ABC-1234", 
      km: 45000, 
      combustivel: "Flex",
      status: "Ativo",
      proximaManutencao: "2024-02-15",
      gastoMensal: 450.00
    },
    { 
      id: 2, 
      modelo: "Toyota Corolla 2019", 
      placa: "XYZ-5678", 
      km: 62000, 
      combustivel: "Flex",
      status: "Ativo",
      proximaManutencao: "2024-01-30",
      gastoMensal: 520.00
    }
  ]

  const gastos = [
    { id: 1, veiculo: "Honda Civic", tipo: "Combustível", valor: 280.00, data: "2024-01-20", km: 44800, categoria: "Combustível" },
    { id: 2, veiculo: "Honda Civic", tipo: "Manutenção", valor: 350.00, data: "2024-01-15", km: 44750, categoria: "Manutenção" },
    { id: 3, veiculo: "Toyota Corolla", tipo: "Combustível", valor: 320.00, data: "2024-01-18", km: 61800, categoria: "Combustível" },
    { id: 4, veiculo: "Toyota Corolla", tipo: "Seguro", valor: 180.00, data: "2024-01-10", km: 61750, categoria: "Seguro" },
    { id: 5, veiculo: "Honda Civic", tipo: "IPVA", valor: 400.00, data: "2024-01-05", km: 44700, categoria: "Impostos" }
  ]

  const gastosMensais = [
    { mes: "Jul", combustivel: 580, manutencao: 200, outros: 120 },
    { mes: "Ago", combustivel: 620, manutencao: 150, outros: 180 },
    { mes: "Set", combustivel: 550, manutencao: 400, outros: 100 },
    { mes: "Out", combustivel: 600, manutencao: 180, outros: 150 },
    { mes: "Nov", combustivel: 650, manutencao: 250, outros: 120 },
    { mes: "Dez", combustivel: 580, manutencao: 300, outros: 160 }
  ]

  const distribuicaoGastos = [
    { name: "Combustível", value: 3580, fill: "hsl(var(--destructive))" },
    { name: "Manutenção", value: 1480, fill: "hsl(var(--warning))" },
    { name: "Seguro", value: 720, fill: "hsl(var(--brand-orange))" },
    { name: "Impostos", value: 800, fill: "hsl(var(--success))" }
  ]

  const chartData = gastos.map(gasto => ({
    tipo: gasto.tipo,
    valor: gasto.valor,
    veiculo: gasto.veiculo
  }))

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.valor, 0)
  const manutencoesPendentes = veiculos.filter(v => new Date(v.proximaManutencao) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
  const kmTotal = veiculos.reduce((sum, veiculo) => sum + veiculo.km, 0)
  const gastoMedioMensal = veiculos.reduce((sum, veiculo) => sum + veiculo.gastoMensal, 0)

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      "Combustível": "bg-destructive",
      "Manutenção": "bg-warning",
      "Seguro": "bg-brand-orange",
      "IPVA": "bg-success",
      "Impostos": "bg-success"
    }
    return colors[tipo] || "bg-muted"
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Veículos</h1>
          <p className="text-muted-foreground">Gerencie gastos, manutenções e informações dos seus veículos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Novo Gasto
          </Button>
          <Button className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Veículo
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
                <p className="text-sm text-muted-foreground">Gastos Totais</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Car className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Veículos Ativos</p>
                <p className="text-2xl font-bold text-success">{veiculos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Wrench className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manutenções Próximas</p>
                <p className="text-2xl font-bold text-warning">{manutencoesPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Mensal</p>
                <p className="text-2xl font-bold text-success">
                  R$ {gastoMedioMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Veículos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Meus Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {veiculos.map((veiculo) => (
              <div key={veiculo.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <Car className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{veiculo.modelo}</h4>
                    <p className="text-sm text-muted-foreground">Placa: {veiculo.placa}</p>
                    <p className="text-sm text-muted-foreground">{veiculo.km.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(veiculo.status)}>
                    {veiculo.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Próxima manutenção: {new Date(veiculo.proximaManutencao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="civic">Honda Civic</SelectItem>
                <SelectItem value="corolla">Toyota Corolla</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Gasto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="combustivel">Combustível</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="seguro">Seguro</SelectItem>
                <SelectItem value="impostos">Impostos</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Data inicial" />
            <Input type="date" placeholder="Data final" />
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
                {viewMode === "table" ? "Histórico de Gastos" : "Gastos por Categoria"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="space-y-3">
                  {gastos.map((gasto) => (
                    <div key={gasto.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getTipoColor(gasto.tipo)}`} />
                          <div>
                            <h4 className="font-medium text-foreground">{gasto.tipo}</h4>
                            <p className="text-sm text-muted-foreground">{gasto.veiculo} • KM: {gasto.km.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {new Date(gasto.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-destructive">
                          R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="destructive">Excluir</Button>
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
                        <XAxis dataKey="tipo" />
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
              <CardTitle>Distribuição de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={{
                  combustivel: {
                    label: "Combustível",
                    color: "hsl(var(--destructive))",
                  },
                  manutencao: {
                    label: "Manutenção",
                    color: "hsl(var(--warning))",
                  },
                  seguro: {
                    label: "Seguro",
                    color: "hsl(var(--brand-orange))",
                  },
                  impostos: {
                    label: "Impostos",
                    color: "hsl(var(--success))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribuicaoGastos}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {distribuicaoGastos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-2 mt-4">
                {distribuicaoGastos.map((item, index) => (
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
                  combustivel: {
                    label: "Combustível",
                    color: "hsl(var(--destructive))",
                  },
                  manutencao: {
                    label: "Manutenção",
                    color: "hsl(var(--warning))",
                  },
                  outros: {
                    label: "Outros",
                    color: "hsl(var(--brand-orange))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gastosMensais}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="combustivel" stroke="hsl(var(--destructive))" strokeWidth={2} />
                      <Line type="monotone" dataKey="manutencao" stroke="hsl(var(--warning))" strokeWidth={2} />
                      <Line type="monotone" dataKey="outros" stroke="hsl(var(--brand-orange))" strokeWidth={2} />
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

export default Veiculos