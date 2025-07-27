import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<any>
  initialData?: any
  mode: 'create' | 'edit'
}

const defaultIcons = ['💼', '💻', '📈', '🛒', '🍽️', '🚗', '🏠', '⚕️', '📚', '🎮', '👕', '💡', '🎵', '✈️', '🏋️']
const defaultColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#F97316', '#06B6D4', '#EC4899', '#84CC16', '#6366F1']

export function CategoryFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  mode 
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'income' as 'income' | 'expense',
    icon: '💼',
    color: '#10B981'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'income',
        icon: initialData.icon || '💼',
        color: initialData.color || '#10B981'
      })
    } else {
      setFormData({
        name: '',
        type: 'income',
        icon: '💼',
        color: '#10B981'
      })
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await onSubmit(formData)

    if (result.success) {
      onOpenChange(false)
      setFormData({
        name: '',
        type: 'income',
        icon: '💼',
        color: '#10B981'
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
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
            <Label htmlFor="icon">Ícone</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {defaultIcons.map((icon) => (
                <Button
                  key={icon}
                  type="button"
                  variant={formData.icon === icon ? "default" : "outline"}
                  className="h-12 text-lg"
                  onClick={() => setFormData({ ...formData, icon })}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="color">Cor</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {defaultColors.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant="outline"
                  className={`h-12 border-2 ${formData.color === color ? 'border-foreground' : 'border-border'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                >
                  {formData.color === color && '✓'}
                </Button>
              ))}
            </div>
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