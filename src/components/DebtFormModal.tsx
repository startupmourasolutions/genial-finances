import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import CurrencyInput from 'react-currency-input-field'
import { toast } from "sonner"

interface DebtFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<{ error: any }>
  initialData?: any
  mode: 'create' | 'edit'
}

export function DebtFormModal({ open, onOpenChange, onSubmit, initialData, mode }: DebtFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_amount: 0,
    remaining_amount: 0,
    due_date: '',
    interest_rate: 0,
    monthly_payment: 0,
    creditor_name: '',
    debt_type: 'loan',
    payment_frequency: 'monthly'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        total_amount: initialData.total_amount || 0,
        remaining_amount: initialData.remaining_amount || 0,
        due_date: initialData.due_date || '',
        interest_rate: initialData.interest_rate || 0,
        monthly_payment: initialData.monthly_payment || 0,
        creditor_name: initialData.creditor_name || '',
        debt_type: initialData.debt_type || 'loan',
        payment_frequency: initialData.payment_frequency || 'monthly'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        total_amount: 0,
        remaining_amount: 0,
        due_date: '',
        interest_rate: 0,
        monthly_payment: 0,
        creditor_name: '',
        debt_type: 'loan',
        payment_frequency: 'monthly'
      })
    }
  }, [initialData, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Título da dívida é obrigatório')
      return
    }

    if (formData.total_amount <= 0) {
      toast.error('Valor total deve ser maior que zero')
      return
    }

    setLoading(true)
    
    const submitData = {
      ...formData,
      remaining_amount: formData.remaining_amount || formData.total_amount
    }
    
    const { error } = await onSubmit(submitData)
    
    if (!error) {
      onOpenChange(false)
    }
    
    setLoading(false)
  }

  const debtTypes = [
    { value: 'loan', label: 'Empréstimo' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'financing', label: 'Financiamento' },
    { value: 'other', label: 'Outros' }
  ]

  const paymentFrequencies = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Dívida' : 'Editar Dívida'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Título da Dívida *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Financiamento do Carro, Cartão de Crédito..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhes sobre a dívida..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="debt_type">Tipo de Dívida</Label>
                <Select value={formData.debt_type} onValueChange={(value) => setFormData(prev => ({ ...prev, debt_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {debtTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="creditor_name">Credor</Label>
                <Input
                  id="creditor_name"
                  value={formData.creditor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditor_name: e.target.value }))}
                  placeholder="Nome do banco/instituição"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_amount">Valor Total *</Label>
                <CurrencyInput
                  id="total_amount"
                  placeholder="R$ 0,00"
                  value={formData.total_amount}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  allowDecimals={true}
                  allowNegativeValue={false}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, total_amount: parseFloat(value || '0') }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="remaining_amount">Valor Restante</Label>
                <CurrencyInput
                  id="remaining_amount"
                  placeholder="R$ 0,00 (Se vazio, usa o valor total)"
                  value={formData.remaining_amount}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  allowDecimals={true}
                  allowNegativeValue={false}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, remaining_amount: parseFloat(value || '0') }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthly_payment">Pagamento Mensal</Label>
                <CurrencyInput
                  id="monthly_payment"
                  placeholder="R$ 0,00"
                  value={formData.monthly_payment}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  allowDecimals={true}
                  allowNegativeValue={false}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, monthly_payment: parseFloat(value || '0') }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="payment_frequency">Frequência de Pagamento</Label>
                <Select value={formData.payment_frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest_rate">Taxa de Juros (% a.m.)</Label>
                <Input
                  id="interest_rate"
                  type="number"
                  step="0.01"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, interest_rate: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="due_date">Data de Vencimento</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Salvando...' : mode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}