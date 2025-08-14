import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, TrendingDown, Calendar, ArrowDownCircle, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { useExpenses } from "@/hooks/useExpenses"
import { ExpenseFormModal } from "@/components/ExpenseFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { useIsMobile } from "@/hooks/use-mobile"

const Despesas = () => {
  const { expenses, categories, loading, createExpense, updateExpense, deleteExpense } = useExpenses()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const totalDespesas = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const mediaDespesas = expenses.length > 0 ? totalDespesas / expenses.length : 0

  const handleEdit = (expense: any) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingExpense) {
      return await updateExpense(editingExpense.id, data)
    } else {
      return await createExpense(data)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId)
      setDeleteId(null)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando despesas...</div>
  }

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
        {!isMobile && (
          <Button onClick={handleCreate} className="bg-destructive hover:bg-destructive/90 hover-scale">
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        )}
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
              {expenses.length} despesas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Despesas
            </CardTitle>
            <Calendar className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{expenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              despesas cadastradas
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
              baseado em {expenses.length} gastos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maior Despesa
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              R$ {expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              despesa mais alta
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
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
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
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma despesa cadastrada ainda.
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-smooth">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-destructive flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground truncate">{expense.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {expense.categories?.name || 'Sem categoria'}
                        </p>
                        {expense.description && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {expense.description.length > 20 
                              ? `${expense.description.substring(0, 20)}...` 
                              : expense.description
                            }
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-center flex-shrink-0">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className="text-lg font-semibold text-destructive whitespace-nowrap">
                        - R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover-scale h-8 w-8 p-0"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="hover-scale h-8 w-8 p-0"
                        onClick={() => setDeleteId(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ExpenseFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingExpense}
        mode={editingExpense ? 'edit' : 'create'}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Despesa"
        description="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
      />

      <FloatingActionButton 
        onClick={handleCreate}
        className="bg-destructive hover:bg-destructive/90"
      >
        <Plus className="w-6 h-6" />
      </FloatingActionButton>
    </div>
  )
}

export default Despesas