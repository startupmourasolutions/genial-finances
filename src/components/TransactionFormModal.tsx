import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<any>
  categories: any[]
  initialData?: any
  mode: 'create' | 'edit'
  defaultType?: 'income' | 'expense'
}

export function TransactionFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  categories, 
  initialData, 
  mode,
  defaultType 
}: TransactionFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount || '',
    type: initialData?.type || defaultType || 'income',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    category_id: initialData?.category_id || ''
  })
  const [loading, setLoading] = useState(false)

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    })

    if (result.success) {
      onOpenChange(false)
      setFormData({
        title: '',
        amount: '',
        type: defaultType || 'income',
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
            {mode === 'create' ? 'Nova Transação' : 'Editar Transação'}
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
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value, category_id: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}