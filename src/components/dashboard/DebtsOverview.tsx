import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useDebts } from "@/hooks/useDebts"
import { CreditCard, AlertCircle, TrendingDown, Calendar } from "lucide-react"
import { useMemo } from "react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export function DebtsOverview() {
  const { debts } = useDebts()

  const debtsStats = useMemo(() => {
    if (!debts) return {
      total: 0,
      active: 0,
      totalAmount: 0,
      totalRemaining: 0,
      monthlyPayments: 0,
      urgentDebts: []
    }

    const activeDebts = debts.filter(debt => debt.status === 'active')
    const totalAmount = activeDebts.reduce((sum, debt) => sum + Number(debt.total_amount || 0), 0)
    const totalRemaining = activeDebts.reduce((sum, debt) => sum + Number(debt.remaining_amount || 0), 0)
    const monthlyPayments = activeDebts.reduce((sum, debt) => sum + Number(debt.monthly_payment || 0), 0)
    
    const urgentDebts = activeDebts
      .filter(debt => debt.due_date)
      .map(debt => ({
        ...debt,
        daysUntilDue: differenceInDays(new Date(debt.due_date!), new Date())
      }))
      .filter(debt => debt.daysUntilDue <= 30)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

    return {
      total: debts.length,
      active: activeDebts.length,
      totalAmount,
      totalRemaining,
      monthlyPayments,
      urgentDebts
    }
  }, [debts])

  const paymentProgress = debtsStats.totalAmount > 0 
    ? ((debtsStats.totalAmount - debtsStats.totalRemaining) / debtsStats.totalAmount) * 100 
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Dívidas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{debtsStats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {debtsStats.total} cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Restante
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {debtsStats.totalRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De R$ {debtsStats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso de Pagamento */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Progresso de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Pago: {paymentProgress.toFixed(1)}%</span>
              <span>R$ {debtsStats.monthlyPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
            </div>
            <Progress value={paymentProgress} className="h-2" />
          </div>
          
          {debtsStats.urgentDebts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Vencimentos Próximos</span>
              </div>
              {debtsStats.urgentDebts.slice(0, 3).map((debt) => (
                <div key={debt.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{debt.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {debt.due_date && format(new Date(debt.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant={debt.daysUntilDue <= 7 ? "destructive" : "secondary"}>
                    {debt.daysUntilDue <= 0 ? "Vencido" : `${debt.daysUntilDue} dias`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}