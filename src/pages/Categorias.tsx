import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Tag } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { CategoryFormModal } from "@/components/CategoryFormModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

const Categorias = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingCategory) {
      return await updateCategory(editingCategory.id, data)
    } else {
      return await createCategory(data)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategory(deleteId)
      setDeleteId(null)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando categorias...</div>
  }

  const CategoryCard = ({ categories, title, type }: { categories: any[], title: string, type: 'RECEITA' | 'DESPESA' }) => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma categoria encontrada
            </p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Categoria de {type === 'RECEITA' ? 'receita' : 'despesa'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`${type === 'RECEITA' ? 'border-success text-success' : 'border-destructive text-destructive'}`}
                  >
                    {type === 'RECEITA' ? 'Receita' : 'Despesa'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">Organize suas receitas e despesas</p>
        </div>
        <Button onClick={handleCreate} className="bg-brand-orange hover:bg-brand-orange/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryCard 
          categories={incomeCategories} 
          title="Receitas" 
          type="RECEITA"
        />
        <CategoryCard 
          categories={expenseCategories} 
          title="Despesas" 
          type="DESPESA"
        />
      </div>

      <CategoryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        mode={editingCategory ? 'edit' : 'create'}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Categorias