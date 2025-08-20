import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDebts } from "@/hooks/useDebts"
import { CreditCard, AlertCircle, Calendar } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export function DebtsOverview() {
  const { debts } = useDebts()

  const activeDebts = debts
    ?.filter(debt => debt.status === 'active')
    .map(debt => ({
      ...debt,
      daysUntilDue: debt.due_date ? differenceInDays(new Date(debt.due_date), new Date()) : null
    }))
    .sort((a, b) => {
      if (a.daysUntilDue === null) return 1;
      if (b.daysUntilDue === null) return -1;
      return a.daysUntilDue - b.daysUntilDue;
    })
    .slice(0, 6) || []

  const totalRemaining = activeDebts.reduce((sum, debt) => sum + Number(debt.total_amount || 0), 0)

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Dívidas Pendentes</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {activeDebts.length > 0 ? (
          <div className="space-y-3">
            {activeDebts.map((debt) => (
              <div 
                key={debt.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    debt.daysUntilDue !== null && debt.daysUntilDue <= 7 
                      ? 'bg-destructive/20 text-destructive' 
                      : debt.daysUntilDue !== null && debt.daysUntilDue <= 30
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{debt.title}</p>
                    {debt.due_date && (
                      <p className="text-xs text-muted-foreground">
                        Vencimento: {format(new Date(debt.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                    {debt.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {debt.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">
                    R$ {Number(debt.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge 
                    variant={
                      debt.daysUntilDue !== null && debt.daysUntilDue <= 7 
                        ? "destructive" 
                        : debt.daysUntilDue !== null && debt.daysUntilDue <= 30
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {debt.daysUntilDue === null 
                      ? "Sem prazo" 
                      : debt.daysUntilDue <= 0 
                      ? "Vencido" 
                      : debt.daysUntilDue === 1 
                      ? "1 dia" 
                      : `${debt.daysUntilDue} dias`
                    }
                  </Badge>
                </div>
              </div>
            ))}
            {totalRemaining > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Total Pendente:</span>
                  <span className="text-lg font-bold text-destructive">
                    R$ {totalRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhuma dívida pendente</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}