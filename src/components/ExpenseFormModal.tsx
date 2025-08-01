import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CurrencyInput from 'react-currency-input-field'

interface ExpenseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<any>
  categories: any[]
  initialData?: any
  mode: 'create' | 'edit'
}

export function ExpenseFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  categories, 
  initialData, 
  mode 
}: ExpenseFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    category_id: initialData?.category_id || ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Preencher formulário com dados para edição
        setFormData({
          title: initialData.title || '',
          amount: initialData.amount?.toString() || '',
          description: initialData.description || '',
          date: initialData.date || new Date().toISOString().split('T')[0],
          category_id: initialData.category_id || ''
        })
      } else {
        // Limpar formulário para nova despesa
        setFormData({
          title: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category_id: ''
        })
      }
    }
  }, [open, initialData])

  const isFormValid = formData.title.trim() && formData.amount && formData.date && formData.category_id

  // Filtrar apenas categorias de despesa
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'))
    })

    if (result.success) {
      onOpenChange(false)
      setFormData({
        title: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: ''
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Despesa' : 'Editar Despesa'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="text"
              placeholder="R$ 0,00"
              value={formData.amount}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                  value = (parseInt(value) / 100).toFixed(2);
                  const parts = value.split('.');
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                  value = parts.join(',');
                  value = 'R$ ' + value;
                }
                setFormData({ ...formData, amount: value });
              }}
              className="w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-[100] max-h-[200px] overflow-y-auto">
                <div className="p-1">
                   {expenseCategories.length === 0 ? (
                     <div className="px-2 py-1 text-sm text-muted-foreground">Nenhuma categoria de despesa disponível</div>
                   ) : (
                     expenseCategories.map((category) => (
                       <SelectItem 
                         key={category.id} 
                         value={category.id}
                         className="cursor-pointer hover:bg-accent focus:bg-accent"
                       >
                         <div className="flex items-center gap-2">
                           <span>{category.icon}</span>
                           <span>{category.name}</span>
                         </div>
                       </SelectItem>
                     ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}