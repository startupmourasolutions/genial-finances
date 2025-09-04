import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Plus, Edit, Trash2, Lock } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { CategoryFormModal } from "@/components/CategoryFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const Categorias = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; categoryId: string | null }>({
    open: false,
    categoryId: null
  })

  if (loading) {
    return <div className="p-8">Carregando categorias...</div>
  }

  // Separar categorias por tipo e origem
  const systemCategories = categories.filter(cat => cat.is_system)
  const userCategories = categories.filter(cat => !cat.is_system)
  
  const incomeCategories = systemCategories.filter(cat => cat.type === 'income')
  const expenseCategories = systemCategories.filter(cat => cat.type === 'expense')
  
  const userIncomeCategories = userCategories.filter(cat => cat.type === 'income')
  const userExpenseCategories = userCategories.filter(cat => cat.type === 'expense')

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    setDeleteDialog({ open: true, categoryId })
  }

  const confirmDelete = async () => {
    if (deleteDialog.categoryId) {
      await deleteCategory(deleteDialog.categoryId)
      setDeleteDialog({ open: false, categoryId: null })
    }
  }

  const handleSubmit = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data)
    } else {
      await createCategory(data)
    }
    setModalOpen(false)
    setEditingCategory(null)
  }

  const CategoryItem = ({ category }: { category: any }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: category.color + '20', color: category.color }}
      >
        {category.icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground flex items-center gap-2">
          {category.name}
          {category.is_system && (
            <span title="Categoria do sistema">
              <Lock className="w-3 h-3 text-muted-foreground" />
            </span>
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          {category.is_system ? 'Categoria padrão do sistema' : 'Categoria personalizada'}
        </p>
      </div>
      {!category.is_system && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(category)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(category.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )}
      <Badge 
        variant="outline" 
        className={category.type === 'income' ? 'border-success text-success' : 'border-destructive text-destructive'}
      >
        {category.type === 'income' ? 'Receita' : 'Despesa'}
      </Badge>
    </div>
  )

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
        <p className="text-muted-foreground">Gerencie as categorias padrão e personalizadas do sistema</p>
      </div>

      {/* Categorias Padrão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Categorias de Receita
              <Badge variant="secondary">{incomeCategories.length + userIncomeCategories.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-3">
                {incomeCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
                {userIncomeCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Categorias de Despesa
              <Badge variant="secondary">{expenseCategories.length + userExpenseCategories.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
                {userExpenseCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Categorias Personalizadas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Minhas Categorias Personalizadas</CardTitle>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Você ainda não criou categorias personalizadas.</p>
              <p className="text-sm mt-2">Clique em "Nova Categoria" para adicionar uma categoria personalizada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.icon}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={category.type === 'income' ? 'border-success text-success' : 'border-destructive text-destructive'}
                      >
                        {category.type === 'income' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Formulário */}
      <CategoryFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        mode={editingCategory ? 'edit' : 'create'}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, categoryId: null })}
        onConfirm={confirmDelete}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Categorias