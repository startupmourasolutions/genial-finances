import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Edit, Trash2 } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { TransactionFormModal } from "@/components/TransactionFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

const Transacoes = () => {
  const { transactions, categories, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('income')

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

  if (loading) {
    return <div className="p-8">Carregando transações...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transações</h1>
          <p className="text-muted-foreground">Visualize e gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleCreate('income')} className="bg-success hover:bg-success/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
          <Button onClick={() => handleCreate('expense')} className="bg-destructive hover:bg-destructive/90">
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
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação cadastrada ainda.
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-success' : 'bg-destructive'
                      }`} />
                      <div>
                        <h4 className="font-medium text-foreground">{transaction.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.categories?.name || 'Sem categoria'}
                        </p>
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
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => setDeleteId(transaction.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
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