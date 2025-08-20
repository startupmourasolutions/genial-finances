import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, History } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface DebtPaymentHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt: any
}

interface DebtPayment {
  id: string
  debt_id: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
}

export function DebtPaymentHistoryModal({ open, onOpenChange, debt }: DebtPaymentHistoryModalProps) {
  const [payments, setPayments] = useState<DebtPayment[]>([])
  const [loading, setLoading] = useState(false)
  const { user, profile } = useAuth()

  useEffect(() => {
    if (open && debt?.id) {
      fetchPaymentHistory()
    }
  }, [open, debt?.id])

  const fetchPaymentHistory = async () => {
    if (!debt?.id || !user || !profile) return

    setLoading(true)
    try {
      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        console.error('Error fetching client:', clientError)
        return
      }

      // Buscar todos os pagamentos relacionados a esta dívida
      // Incluindo dívidas com o mesmo título (para pagamentos mensais)
      const { data: allDebts, error: debtsError } = await supabase
        .from('debts')
        .select('id')
        .eq('title', debt.title)
        .eq('client_id', clientData.id)
        .eq('user_id', user.id)

      if (debtsError) throw debtsError

      const debtIds = allDebts.map(d => d.id)

      const { data, error } = await supabase
        .from('debt_payments')
        .select('*')
        .in('debt_id', debtIds)
        .eq('client_id', clientData.id)
        .order('payment_date', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error: any) {
      console.error('Error fetching payment history:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Pagamentos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo da Dívida */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{debt?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={debt?.status === 'paid' ? 'default' : 'secondary'}>
                  {debt?.status === 'paid' ? 'Pago' : 'Ativo'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Frequência:</span>
                <span className="text-sm font-medium">
                  {debt?.payment_frequency === 'monthly' ? 'Mensal' : 'Data específica'}
                </span>
              </div>

              {debt?.due_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vencimento:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(debt.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-muted-foreground">Total Pago:</span>
                <span className="text-lg font-bold text-success">
                  R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Histórico de Pagamentos ({payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Carregando histórico...
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum pagamento realizado ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment, index) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-success/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/20 rounded-full">
                          <Calendar className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Pagamento #{payments.length - index}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.payment_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              {payment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-success">
                          R$ {Number(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.created_at), 'HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}