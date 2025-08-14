import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import CurrencyInput from 'react-currency-input-field'
import { toast } from "sonner"

interface FinancialGoalFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<{ error: any }>
  initialData?: any
  mode: 'create' | 'edit'
}

export function FinancialGoalFormModal({ open, onOpenChange, onSubmit, initialData, mode }: FinancialGoalFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: 0,
    current_amount: 0,
    target_date: '',
    auto_contribution: false,
    contribution_amount: 0,
    contribution_frequency: 'monthly'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        target_amount: Number(initialData.target_amount) || 0,
        current_amount: Number(initialData.current_amount) || 0,
        target_date: initialData.target_date || '',
        auto_contribution: initialData.auto_contribution || false,
        contribution_amount: Number(initialData.contribution_amount) || 0,
        contribution_frequency: initialData.contribution_frequency || 'monthly'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        target_amount: 0,
        current_amount: 0,
        target_date: '',
        auto_contribution: false,
        contribution_amount: 0,
        contribution_frequency: 'monthly'
      })
    }
  }, [initialData, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Título da meta é obrigatório')
      return
    }

    if (formData.target_amount <= 0) {
      toast.error('Valor da meta deve ser maior que zero')
      return
    }

    setLoading(true)
    
    const { error } = await onSubmit(formData)
    
    if (!error) {
      onOpenChange(false)
    }
    
    setLoading(false)
  }

  const contributionFrequencies = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" aria-describedby="goal-form-description">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Meta Financeira' : 'Editar Meta Financeira'}
          </DialogTitle>
          <p id="goal-form-description" className="text-sm text-muted-foreground">
            {mode === 'create' ? 'Defina uma nova meta financeira para alcançar seus objetivos' : 'Atualize os dados da sua meta financeira'}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Título da Meta *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Reserva de Emergência, Viagem, Casa Própria..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva sua meta financeira..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_amount">Valor da Meta *</Label>
                <CurrencyInput
                  id="target_amount"
                  placeholder="R$ 0,00"
                  value={formData.target_amount}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  allowDecimals={true}
                  allowNegativeValue={false}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, target_amount: parseFloat(value || '0') }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="current_amount">Valor Atual</Label>
                <CurrencyInput
                  id="current_amount"
                  placeholder="R$ 0,00"
                  value={formData.current_amount}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  allowDecimals={true}
                  allowNegativeValue={false}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, current_amount: parseFloat(value || '0') }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="target_date">Data Alvo</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>

            <div className="space-y-4 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Contribuição Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar contribuições regulares para esta meta
                  </p>
                </div>
                <Switch
                  checked={formData.auto_contribution}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_contribution: checked }))}
                />
              </div>

              {formData.auto_contribution && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contribution_amount">Valor da Contribuição</Label>
                    <CurrencyInput
                      id="contribution_amount"
                      placeholder="R$ 0,00"
                      value={formData.contribution_amount}
                      decimalsLimit={2}
                      decimalSeparator=","
                      groupSeparator="."
                      prefix="R$ "
                      allowDecimals={true}
                      allowNegativeValue={false}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contribution_amount: parseFloat(value || '0') }))}
                      className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contribution_frequency">Frequência</Label>
                    <Select value={formData.contribution_frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, contribution_frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {contributionFrequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
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