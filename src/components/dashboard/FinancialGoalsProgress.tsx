import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { useMemo } from "react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export function FinancialGoalsProgress() {
  const { goals } = useFinancialGoals()

  const goalsStats = useMemo(() => {
    if (!goals) return {
      total: 0,
      active: 0,
      completed: 0,
      totalTarget: 0,
      totalCurrent: 0,
      activeGoals: []
    }

    const activeGoals = goals.filter(goal => goal.status === 'active')
    const completedGoals = goals.filter(goal => goal.status === 'completed')
    const totalTarget = activeGoals.reduce((sum, goal) => sum + Number(goal.target_amount), 0)
    const totalCurrent = activeGoals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0)

    const sortedActiveGoals = activeGoals
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

    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      totalTarget,
      totalCurrent,
      activeGoals: sortedActiveGoals.slice(0, 4)
    }
  }, [goals])

  const overallProgress = goalsStats.totalTarget > 0 
    ? (goalsStats.totalCurrent / goalsStats.totalTarget) * 100 
    : 0

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas Ativas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{goalsStats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {goalsStats.completed} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Acumulado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {goalsStats.totalCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta: R$ {goalsStats.totalTarget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresso Geral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallProgress.toFixed(1)}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detalhes das Metas */}
      {goalsStats.activeGoals.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Progresso das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goalsStats.activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{goal.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {goal.target_date && (
                          <>
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(goal.target_date), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                            {goal.daysUntilTarget !== null && (
                              <Badge variant={goal.daysUntilTarget <= 30 ? "destructive" : "secondary"} className="text-xs">
                                {goal.daysUntilTarget <= 0 ? "Vencida" : `${goal.daysUntilTarget} dias`}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        R$ {Number(goal.current_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progresso: {goal.progress.toFixed(1)}%</span>
                      {goal.progress >= 100 && (
                        <Badge variant="default" className="text-xs">Concluída!</Badge>
                      )}
                    </div>
                    <Progress value={Math.min(goal.progress, 100)} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}