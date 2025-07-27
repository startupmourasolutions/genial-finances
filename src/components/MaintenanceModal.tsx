import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface MaintenanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<{ error: any }>
  vehicleId: string
  vehicles: any[]
}

export function MaintenanceModal({ open, onOpenChange, onSubmit, vehicleId, vehicles }: MaintenanceModalProps) {
  const [formData, setFormData] = useState({
    vehicle_id: vehicleId,
    type: '',
    description: '',
    due_km: '',
    due_date: '',
    system_category: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(prev => ({ ...prev, vehicle_id: vehicleId }))
  }, [vehicleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type.trim()) {
      toast.error('Tipo de manutenção é obrigatório')
      return
    }

    if (!formData.vehicle_id) {
      toast.error('Selecione um veículo')
      return
    }

    setLoading(true)
    
    const submitData = {
      ...formData,
      due_km: formData.due_km ? parseInt(formData.due_km) : undefined,
      due_date: formData.due_date || undefined
    }
    
    const { error } = await onSubmit(submitData)
    
    if (!error) {
      onOpenChange(false)
      setFormData({
        vehicle_id: vehicleId,
        type: '',
        description: '',
        due_km: '',
        due_date: '',
        system_category: '',
        notes: ''
      })
    }
    
    setLoading(false)
  }

  const systemCategories = [
    'Motor',
    'Freios',
    'Suspensão',
    'Climatização',
    'Pneus',
    'Elétrica',
    'Transmissão',
    'Outras'
  ]

  const maintenanceTypes = [
    'Troca de óleo do motor',
    'Troca do filtro de ar',
    'Troca do filtro de combustível',
    'Troca do filtro de ar condicionado',
    'Alinhamento e balanceamento',
    'Rodízio de pneus',
    'Troca de pastilhas de freio',
    'Troca de discos de freio',
    'Troca da correia dentada',
    'Revisão geral',
    'Limpeza de bicos injetores',
    'Outras'
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Manutenção</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicle_id">Veículo</Label>
            <Select value={formData.vehicle_id} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} {vehicle.plate && `(${vehicle.plate})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Tipo de Manutenção *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="system_category">Sistema</Label>
            <Select value={formData.system_category} onValueChange={(value) => setFormData(prev => ({ ...prev, system_category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sistema" />
              </SelectTrigger>
              <SelectContent>
                {systemCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a manutenção..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="due_km">Quilometragem Prevista</Label>
              <Input
                id="due_km"
                type="number"
                value={formData.due_km}
                onChange={(e) => setFormData(prev => ({ ...prev, due_km: e.target.value }))}
                placeholder="Ex: 10000"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="due_date">Data Prevista</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={2}
            />
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
              className="bg-brand-orange hover:bg-brand-orange/90"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Manutenção'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}