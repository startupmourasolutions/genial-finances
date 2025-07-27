import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"

const Categorias = () => {
  const { categories, loading } = useCategories()

  if (loading) {
    return <div className="p-8">Carregando categorias...</div>
  }

  // Separar categorias por tipo
  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
        <p className="text-muted-foreground">Visualize todas as categorias disponíveis no sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Receitas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Categorias de Receita
              <Badge variant="secondary">{incomeCategories.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">Categoria de receita</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="border-success text-success"
                  >
                    Receita
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card de Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Categorias de Despesa
              <Badge variant="secondary">{expenseCategories.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">Categoria de despesa</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="border-destructive text-destructive"
                  >
                    Despesa
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Categorias