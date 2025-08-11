import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { Target, Calendar } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export function FinancialGoalsProgress() {
  const { goals } = useFinancialGoals()

  const activeGoals = goals
    ?.filter(goal => goal.status === 'active')
    .map(goal => ({
      ...goal,
      progress: Number(goal.target_amount) > 0 
        ? (Number(goal.current_amount || 0) / Number(goal.target_amount)) * 100 
        : 0,
      daysUntilTarget: goal.target_date 
        ? differenceInDays(new Date(goal.target_date), new Date())
        : null
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 6) || []

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Metas Financeiras</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="space-y-3">
            {activeGoals.map((goal) => (
              <div 
                key={goal.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    goal.progress >= 100 
                      ? 'bg-success/20 text-success' 
                      : goal.progress >= 50
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{goal.title}</p>
                    {goal.target_date && (
                      <p className="text-xs text-muted-foreground">
                        Meta: {format(new Date(goal.target_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={Math.min(goal.progress, 100)} className="h-1 w-20" />
                      <span className="text-xs text-muted-foreground">{goal.progress.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">
                    R$ {Number(goal.current_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge 
                    variant={
                      goal.progress >= 100 
                        ? "default" 
                        : goal.daysUntilTarget !== null && goal.daysUntilTarget <= 30
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs mt-1"
                  >
                    {goal.progress >= 100 
                      ? "Concluída" 
                      : goal.daysUntilTarget === null 
                      ? "Sem prazo" 
                      : goal.daysUntilTarget <= 0 
                      ? "Vencida" 
                      : goal.daysUntilTarget === 1 
                      ? "1 dia" 
                      : `${goal.daysUntilTarget} dias`
                    }
                  </Badge>
                </div>
              </div>
            ))}
            {goals && goals.filter(g => g.status === 'active').length > 6 && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-center">
                  <span className="text-sm text-muted-foreground">
                    +{goals.filter(g => g.status === 'active').length - 6} meta(s) adicional(is)
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhuma meta financeira ativa</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}