import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Tag } from "lucide-react"

const Categorias = () => {
  const incomeCategories = [
    { id: 1, name: "Salário", icon: "💼", color: "#10B981", count: 12 },
    { id: 2, name: "Freelance", icon: "💻", color: "#3B82F6", count: 8 },
    { id: 3, name: "Investimentos", icon: "📈", color: "#8B5CF6", count: 5 },
    { id: 4, name: "Vendas", icon: "🛒", color: "#F59E0B", count: 3 }
  ]

  const expenseCategories = [
    { id: 5, name: "Alimentação", icon: "🍽️", color: "#EF4444", count: 45 },
    { id: 6, name: "Transporte", icon: "🚗", color: "#F97316", count: 32 },
    { id: 7, name: "Moradia", icon: "🏠", color: "#06B6D4", count: 18 },
    { id: 8, name: "Saúde", icon: "⚕️", color: "#EC4899", count: 12 },
    { id: 9, name: "Educação", icon: "📚", color: "#8B5CF6", count: 8 },
    { id: 10, name: "Lazer", icon: "🎮", color: "#84CC16", count: 22 },
    { id: 11, name: "Roupas", icon: "👕", color: "#F59E0B", count: 7 },
    { id: 12, name: "Tecnologia", icon: "💻", color: "#6366F1", count: 4 }
  ]

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
          {categories.map((category) => (
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
                    {category.count} transaç{category.count === 1 ? 'ão' : 'ões'}
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
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
        <Button className="bg-brand-orange hover:bg-brand-orange/90">
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
    </div>
  )
}

export default Categorias