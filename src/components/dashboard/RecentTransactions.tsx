import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/hooks/useTransactions"
import { ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RecentTransactions() {
  const { transactions } = useTransactions()

  const recentTransactions = transactions
    ?.slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8) || []

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-destructive/20 text-destructive'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="h-4 w-4" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                    {transaction.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}