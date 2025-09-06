import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DebtFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<{ error: any }>
  categories: any[]
  initialData?: any
  mode: 'create' | 'edit'
}

type FormStep = 'basic' | 'frequency' | 'date'

export function DebtFormModal({ open, onOpenChange, onSubmit, categories, initialData, mode }: DebtFormModalProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    total_amount: '',
    due_date: '',
    payment_frequency: 'monthly'
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && mode === 'edit') {
      let amountValue = '';
      if (initialData.total_amount) {
        const value = initialData.total_amount.toFixed(2);
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        amountValue = 'R$ ' + parts.join(',');
      }
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        total_amount: amountValue,
        due_date: initialData.due_date || '',
        payment_frequency: initialData.payment_frequency || 'monthly'
      })
      if (initialData.due_date) {
        setSelectedDate(new Date(initialData.due_date))
      }
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        total_amount: '',
        due_date: '',
        payment_frequency: 'monthly'
      })
      setSelectedDate(undefined)
    }
    setCurrentStep('basic')
  }, [initialData, mode, open])

  const handleNext = () => {
    if (currentStep === 'basic') {
      if (!formData.title.trim()) {
        toast.error('Nome da dívida é obrigatório')
        return
      }
      setCurrentStep('frequency')
    } else if (currentStep === 'frequency') {
      setCurrentStep('date')
    }
  }

  const handleBack = () => {
    if (currentStep === 'date') {
      setCurrentStep('frequency')
    } else if (currentStep === 'frequency') {
      setCurrentStep('basic')
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Nome da dívida é obrigatório')
      return
    }

    setLoading(true)
    
    // Parse the amount from formatted string to number
    let amount = 0;
    if (formData.total_amount) {
      const cleanValue = formData.total_amount.replace(/[^\d,]/g, '').replace(',', '.');
      amount = parseFloat(cleanValue) || 0;
    }
    
    const submitData = {
      ...formData,
      total_amount: amount,
      due_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
    }
    
    const { error } = await onSubmit(submitData)
    
    if (!error) {
      onOpenChange(false)
    }
    
    setLoading(false)
  }

  const renderBasicStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Nome da Dívida *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Financiamento do Carro, Cartão de Crédito..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="category_id">Categoria</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione uma categoria..." />
          </SelectTrigger>
          <SelectContent>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                {categories ? 'Nenhuma categoria disponível' : 'Carregando categorias...'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="total_amount">Valor (opcional)</Label>
        <Input
          id="total_amount"
          type="text"
          placeholder="R$ 0,00"
          value={formData.total_amount}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
              value = (parseInt(value) / 100).toFixed(2);
              const parts = value.split('.');
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              value = parts.join(',');
              value = 'R$ ' + value;
            }
            setFormData(prev => ({ ...prev, total_amount: value }));
          }}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detalhes sobre a dívida..."
          rows={3}
          className="mt-2"
        />
      </div>
    </div>
  )

  const renderFrequencyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Como você quer configurar o pagamento?</h3>
        <p className="text-sm text-muted-foreground">Escolha se é um pagamento recorrente ou uma data específica</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          type="button"
          variant={formData.payment_frequency === 'monthly' ? 'default' : 'outline'}
          onClick={() => setFormData(prev => ({ ...prev, payment_frequency: 'monthly' }))}
          className="h-16 text-left justify-start"
        >
          <div>
            <div className="font-medium">Todo mês</div>
            <div className="text-sm text-muted-foreground">Pagamento recorrente mensal</div>
          </div>
        </Button>

        <Button
          type="button"
          variant={formData.payment_frequency === 'one-time' ? 'default' : 'outline'}
          onClick={() => setFormData(prev => ({ ...prev, payment_frequency: 'one-time' }))}
          className="h-16 text-left justify-start"
        >
          <div>
            <div className="font-medium">Data específica</div>
            <div className="text-sm text-muted-foreground">Pagamento único em uma data</div>
          </div>
        </Button>
      </div>
    </div>
  )

  const renderDateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">
          {formData.payment_frequency === 'monthly' 
            ? 'Escolha o dia do mês para pagamento' 
            : 'Escolha a data do pagamento'
          }
        </h3>
        <p className="text-sm text-muted-foreground">
          {formData.payment_frequency === 'monthly' 
            ? 'Selecione o dia que você quer pagar todo mês' 
            : 'Selecione quando você vai quitar esta dívida'
          }
        </p>
      </div>

      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                formData.payment_frequency === 'monthly' 
                  ? `Todo dia ${format(selectedDate, 'd')}`
                  : format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep !== 'basic' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {mode === 'create' ? 'Adicionar Dívida' : 'Editar Dívida'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 'basic' && renderBasicStep()}
          {currentStep === 'frequency' && renderFrequencyStep()}
          {currentStep === 'date' && renderDateStep()}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          {currentStep === 'date' ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Salvando...' : mode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}