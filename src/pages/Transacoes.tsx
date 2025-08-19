import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { TransactionFormModal } from "@/components/TransactionFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useCurrentProfile } from "@/contexts/ProfileContext"

const Transacoes = () => {
  const { currentProfile } = useCurrentProfile()
  const { transactions, categories, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('income')
  
  // Estados dos filtros
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }

  const handleCreate = (type?: 'income' | 'expense') => {
    setEditingTransaction(null)
    setDefaultType(type || 'income')
    setModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingTransaction) {
      return await updateTransaction(editingTransaction.id, data)
    } else {
      return await createTransaction(data)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteTransaction(deleteId)
      setDeleteId(null)
    }
  }

  // Filtrar transações em tempo real
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtro por data
      if (startDate && new Date(transaction.date) < new Date(startDate)) return false
      if (endDate && new Date(transaction.date) > new Date(endDate)) return false
      
      // Filtro por categoria
      if (selectedCategory !== 'all' && transaction.category_id !== selectedCategory) return false
      
      // Filtro por tipo
      if (selectedType !== 'all' && transaction.type !== selectedType) return false
      
      return true
    })
  }, [transactions, startDate, endDate, selectedCategory, selectedType])

  if (loading) {
    return <div className="p-8">Carregando transações...</div>
  }

  return (
    <div className="p-3 md:p-8 space-y-4 md:space-y-6 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transações {currentProfile}</h1>
          <p className="text-sm md:text-base text-muted-foreground">Visualize e gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => handleCreate('income')} 
            className="flex-1 sm:flex-none h-9 bg-success hover:bg-success/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:inline">Nova Receita</span>
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleCreate('expense')} 
            className="flex-1 sm:flex-none h-9 bg-destructive hover:bg-destructive/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:inline">Nova Despesa</span>
          </Button>
        </div>
      </div>

      {/* Filtros sempre visíveis no mobile */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input 
              type="date" 
              placeholder="Data inicial" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
            />
            <Input 
              type="date" 
              placeholder="Data final" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lista de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {transactions.length === 0 
                ? "Nenhuma transação cadastrada ainda." 
                : "Nenhuma transação encontrada com os filtros aplicados."
              }
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="group flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="h-4 w-4" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{transaction.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8"
                        onClick={() => setDeleteId(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingTransaction}
        mode={editingTransaction ? 'edit' : 'create'}
        defaultType={defaultType}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Transacoes