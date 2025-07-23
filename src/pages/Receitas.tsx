import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, TrendingUp, Calendar, ArrowUpCircle } from "lucide-react"

const Receitas = () => {
  const receitas = [
    { id: 1, description: "Salário Principal", category: "Salário", date: "2024-01-15", amount: 3500.00, recurring: true },
    { id: 2, description: "Freelance Web Design", category: "Freelance", date: "2024-01-12", amount: 800.00, recurring: false },
    { id: 3, description: "Dividendos Ações", category: "Investimentos", date: "2024-01-10", amount: 45.30, recurring: true },
    { id: 4, description: "Venda de Curso Online", category: "Receita Extra", date: "2024-01-08", amount: 120.00, recurring: false },
    { id: 5, description: "Cashback Cartão", category: "Cashback", date: "2024-01-05", amount: 23.50, recurring: false }
  ]

  const totalReceitas = receitas.reduce((sum, receita) => sum + receita.amount, 0)
  const receitasRecorrentes = receitas.filter(r => r.recurring).length
  const mediaReceitas = totalReceitas / receitas.length

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ArrowUpCircle className="w-8 h-8 text-success" />
            Receitas
          </h1>
          <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        <Button className="bg-success hover:bg-success/90 hover-scale">
          <Plus className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas Recorrentes
            </CardTitle>
            <Calendar className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{receitasRecorrentes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {receitas.length} receitas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média por Receita
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {mediaReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseado em {receitas.length} entradas
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input type="date" placeholder="Data inicial" />
            <Input type="date" placeholder="Data final" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="salario">Salário</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="investimentos">Investimentos</SelectItem>
                <SelectItem value="extra">Receita Extra</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Receitas List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {receitas.map((receita) => (
              <div key={receita.id} className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20 hover:bg-success/10 transition-smooth">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <div>
                      <h4 className="font-medium text-foreground">{receita.description}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{receita.category}</p>
                        {receita.recurring && (
                          <Badge variant="outline" className="text-xs border-success text-success">
                            Recorrente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {new Date(receita.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-success">
                    + R$ {receita.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default Receitas