import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, TrendingDown, Calendar, ArrowDownCircle, AlertTriangle } from "lucide-react"

const Despesas = () => {
  const despesas = [
    { id: 1, description: "Supermercado Carrefour", category: "Alimentação", date: "2024-01-14", amount: 234.50, recurring: false, priority: "high" },
    { id: 2, description: "Plano de Internet", category: "Contas", date: "2024-01-10", amount: 89.90, recurring: true, priority: "medium" },
    { id: 3, description: "Combustível", category: "Transporte", date: "2024-01-13", amount: 120.00, recurring: false, priority: "high" },
    { id: 4, description: "Academia", category: "Saúde", date: "2024-01-01", amount: 75.00, recurring: true, priority: "low" },
    { id: 5, description: "Streaming Netflix", category: "Lazer", date: "2024-01-05", amount: 25.90, recurring: true, priority: "low" },
    { id: 6, description: "Farmácia", category: "Saúde", date: "2024-01-11", amount: 45.30, recurring: false, priority: "high" }
  ]

  const totalDespesas = despesas.reduce((sum, despesa) => sum + despesa.amount, 0)
  const despesasRecorrentes = despesas.filter(d => d.recurring).length
  const mediaDespesas = totalDespesas / despesas.length
  const despesasUrgentes = despesas.filter(d => d.priority === "high").length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive text-destructive"
      case "medium": return "border-orange-500 text-orange-500"
      case "low": return "border-muted-foreground text-muted-foreground"
      default: return "border-muted-foreground text-muted-foreground"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "Alta"
      case "medium": return "Média"
      case "low": return "Baixa"
      default: return "Normal"
    }
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ArrowDownCircle className="w-8 h-8 text-destructive" />
            Despesas
          </h1>
          <p className="text-muted-foreground">Controle seus gastos e reduza custos</p>
        </div>
        <Button className="bg-destructive hover:bg-destructive/90 hover-scale">
          <Plus className="w-4 h-4 mr-2" />
          Nova Despesa
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total do Mês
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas Recorrentes
            </CardTitle>
            <Calendar className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{despesasRecorrentes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {despesas.length} despesas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média por Despesa
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {mediaDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseado em {despesas.length} gastos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas Urgentes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{despesasUrgentes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input type="date" placeholder="Data inicial" />
            <Input type="date" placeholder="Data final" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alimentacao">Alimentação</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="contas">Contas</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="lazer">Lazer</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="recurring">Recorrentes</SelectItem>
                <SelectItem value="one-time">Pontuais</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Despesas List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {despesas.map((despesa) => (
              <div key={despesa.id} className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-smooth">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div>
                      <h4 className="font-medium text-foreground">{despesa.description}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{despesa.category}</p>
                        {despesa.recurring && (
                          <Badge variant="outline" className="text-xs border-destructive text-destructive">
                            Recorrente
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(despesa.priority)}`}>
                          {getPriorityText(despesa.priority)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {new Date(despesa.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-destructive">
                    - R$ {despesa.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" className="hover-scale">Editar</Button>
                  <Button size="sm" variant="destructive" className="hover-scale">Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Despesas