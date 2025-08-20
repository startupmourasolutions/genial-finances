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
import { useCurrentProfile } from "@/contexts/ProfileContext"

const Despesas = () => {
  const { currentProfile } = useCurrentProfile()
  const { expenses, categories, loading, createExpense, updateExpense, deleteExpense } = useExpenses()
  const isMobile = useIsMobile()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const totalDespesas = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const mediaDespesas = expenses.length > 0 ? totalDespesas / expenses.length : 0
  const maiorDespesa = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0

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

  return (
    <div className="p-3 sm:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-destructive" />
            Despesas {currentProfile}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Controle seus gastos e mantenha suas finanças organizadas</p>
        </div>
        {!isMobile && (
          <Button onClick={handleCreate} className="bg-destructive hover:bg-destructive/90 hover-scale w-full sm:w-auto" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total do Mês
            </CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} despesas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total de Despesas
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-brand-orange" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{expenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              despesas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Média por Despesa
            </CardTitle>
            <ArrowDownCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              R$ {mediaDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseado em {expenses.length} entradas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Maior Despesa
            </CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive">
              R$ {maiorDespesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              maior gasto registrado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input type="date" placeholder="Data inicial" className="text-sm" />
            <Input type="date" placeholder="Data final" className="text-sm" />
            <Select>
              <SelectTrigger className="text-sm">
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
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="fixa">Fixa</SelectItem>
                <SelectItem value="variavel">Variável</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Despesas List */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Lista de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Nenhuma despesa cadastrada ainda.
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex flex-col gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-smooth">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-foreground truncate">{expense.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {expense.categories?.name || 'Sem categoria'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-destructive whitespace-nowrap">
                        - R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {expense.description && (
                        <Badge variant="outline" className="text-xs">
                          {expense.description.length > 15 
                            ? `${expense.description.substring(0, 15)}...` 
                            : expense.description
                          }
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover-scale h-7 w-7 p-0"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="hover-scale h-7 w-7 p-0"
                        onClick={() => setDeleteId(expense.id)}
                      >
                        <Trash2 className="w-3 h-3" />
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