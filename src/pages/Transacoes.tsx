import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter } from "lucide-react"

const Transacoes = () => {
  const transactions = [
    { id: 1, description: "Salário", category: "Receita", date: "2024-01-15", amount: 3500.00, type: "RECEITA" },
    { id: 2, description: "Supermercado", category: "Alimentação", date: "2024-01-14", amount: -234.50, type: "DESPESA" },
    { id: 3, description: "Combustível", category: "Transporte", date: "2024-01-13", amount: -120.00, type: "DESPESA" },
    { id: 4, description: "Freelance", category: "Receita Extra", date: "2024-01-12", amount: 800.00, type: "RECEITA" },
    { id: 5, description: "Internet", category: "Contas", date: "2024-01-10", amount: -89.90, type: "DESPESA" }
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transações</h1>
          <p className="text-muted-foreground">Visualize e gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-success hover:bg-success/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
          <Button className="bg-destructive hover:bg-destructive/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

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
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="alimentacao">Alimentação</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="contas">Contas</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="RECEITA">Receitas</SelectItem>
                <SelectItem value="DESPESA">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'RECEITA' ? 'bg-success' : 'bg-destructive'
                    }`} />
                    <div>
                      <h4 className="font-medium text-foreground">{transaction.description}</h4>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${
                    transaction.type === 'RECEITA' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'RECEITA' ? '+' : ''}
                    R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="destructive">Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Transacoes