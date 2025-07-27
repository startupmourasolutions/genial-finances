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

const Receitas = () => {
  const { incomes, categories, loading, createIncome, updateIncome, deleteIncome } = useIncomes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ArrowUpCircle className="w-8 h-8 text-success" />
            Receitas
          </h1>
          <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        <Button onClick={handleCreate} className="bg-success hover:bg-success/90 hover-scale">
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
              {incomes.length} receitas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Receitas
            </CardTitle>
            <Calendar className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{incomes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              receitas cadastradas
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
              baseado em {incomes.length} entradas
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
            {incomes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma receita cadastrada ainda.
              </div>
            ) : (
              incomes.map((income) => (
                <div key={income.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-success/5 rounded-lg border border-success/20 hover:bg-success/10 transition-smooth">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground truncate">{income.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {income.categories?.name || 'Sem categoria'}
                        </p>
                        {income.description && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {income.description.length > 20 
                              ? `${income.description.substring(0, 20)}...` 
                              : income.description
                            }
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-center flex-shrink-0">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className="text-lg font-semibold text-success whitespace-nowrap">
                        + R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover-scale h-8 w-8 p-0"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="hover-scale h-8 w-8 p-0"
                        onClick={() => setDeleteId(income.id)}
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
    </div>
  )
}

export default Receitas