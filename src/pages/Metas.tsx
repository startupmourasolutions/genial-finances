import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Target as TargetIcon } from "lucide-react"

const Metas = () => {
  const goals = [
    {
      id: 1,
      name: "Reserva de Emergência",
      current_amount: 3500,
      target_amount: 10000,
      target_date: "2024-12-31",
      description: "6 meses de gastos essenciais"
    },
    {
      id: 2,
      name: "Viagem para Europa",
      current_amount: 1200,
      target_amount: 8000,
      target_date: "2024-07-15",
      description: "Viagem de 15 dias"
    },
    {
      id: 3,
      name: "Novo Laptop",
      current_amount: 800,
      target_amount: 2500,
      target_date: "2024-03-30",
      description: "MacBook Pro para trabalho"
    },
    {
      id: 4,
      name: "Entrada do Apartamento",
      current_amount: 15000,
      target_amount: 50000,
      target_date: "2025-06-01",
      description: "30% do valor do imóvel"
    }
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-muted-foreground">Defina e acompanhe seus objetivos</p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercentage = (goal.current_amount / goal.target_amount) * 100
          const remaining = goal.target_amount - goal.current_amount
          const daysUntilTarget = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <Card key={goal.id} className="shadow-card hover:shadow-lg transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5 text-brand-orange" />
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-muted-foreground">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {goal.current_amount.toLocaleString('pt-BR')}</span>
                    <span>R$ {goal.target_amount.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Faltam</p>
                    <p className="font-semibold text-foreground">
                      R$ {remaining.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Prazo</p>
                    <p className={`font-semibold ${daysUntilTarget < 0 ? 'text-destructive' : daysUntilTarget < 30 ? 'text-orange-500' : 'text-foreground'}`}>
                      {daysUntilTarget < 0 ? 'Atrasado' : `${daysUntilTarget} dias`}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                    Adicionar Dinheiro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Metas