import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, TrendingUp, Calendar, ArrowUpCircle, Edit, Trash2 } from "lucide-react"
import { useIncomes } from "@/hooks/useIncomes"
import { IncomeFormModal } from "@/components/IncomeFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { useIsMobile } from "@/hooks/use-mobile"

const Receitas = () => {
  const { incomes, categories, loading, createIncome, updateIncome, deleteIncome } = useIncomes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const totalReceitas = incomes.reduce((sum, income) => sum + income.amount, 0)
  const mediaReceitas = incomes.length > 0 ? totalReceitas / incomes.length : 0

  const handleEdit = (income: any) => {
    setEditingIncome(income)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingIncome(null)
    setModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingIncome) {
      return await updateIncome(editingIncome.id, data)
    } else {
      return await createIncome(data)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteIncome(deleteId)
      setDeleteId(null)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando receitas...</div>
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-success" />
            Receitas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        {!isMobile && (
          <Button onClick={handleCreate} className="bg-success hover:bg-success/90 hover-scale w-full sm:w-auto" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total do Mês
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {incomes.length} receitas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total de Receitas
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-brand-orange" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{incomes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              receitas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Média por Receita
            </CardTitle>
            <ArrowUpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              R$ {mediaReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              baseado em {incomes.length} entradas
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
                <SelectItem value="recurring">Recorrentes</SelectItem>
                <SelectItem value="one-time">Pontuais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Receitas List */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            {incomes.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Nenhuma receita cadastrada ainda.
              </div>
            ) : (
              incomes.map((income) => (
                <div key={income.id} className="flex flex-col gap-2 p-3 bg-success/5 rounded-lg border border-success/20 hover:bg-success/10 transition-smooth">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-foreground truncate">{income.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {income.categories?.name || 'Sem categoria'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-success whitespace-nowrap">
                        + R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {income.description && (
                        <Badge variant="outline" className="text-xs">
                          {income.description.length > 15 
                            ? `${income.description.substring(0, 15)}...` 
                            : income.description
                          }
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover-scale h-7 w-7 p-0"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="hover-scale h-7 w-7 p-0"
                        onClick={() => setDeleteId(income.id)}
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

      <IncomeFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingIncome}
        mode={editingIncome ? 'edit' : 'create'}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Receita"
        description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
      />

      <FloatingActionButton 
        onClick={handleCreate}
        className="bg-success hover:bg-success/90"
      >
        <Plus className="w-6 h-6" />
      </FloatingActionButton>
    </div>
  )
}

export default Receitas