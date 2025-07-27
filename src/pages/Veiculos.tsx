import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Edit, 
  Trash, 
  Car, 
  Settings,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Table,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { useVehicles } from "@/hooks/useVehicles"
import { VehicleFormModal } from "@/components/VehicleFormModal"
import { MaintenanceModal } from "@/components/MaintenanceModal"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const Veiculos = () => {
  const { 
    vehicles, 
    maintenances, 
    loading, 
    createVehicle, 
    updateVehicle, 
    updateKilometers,
    createMaintenance, 
    updateMaintenanceStatus,
    deleteVehicle,
    refetchData
  } = useVehicles()

  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const [kmUpdateModalOpen, setKmUpdateModalOpen] = useState(false)
  const [kmUpdateData, setKmUpdateData] = useState({ vehicleId: '', currentKm: 0, newKm: 0 })

  // Estatísticas calculadas
  const totalVehicles = vehicles.length
  const pendingMaintenances = maintenances.filter(m => m.status === 'pending').length
  const completedMaintenances = maintenances.filter(m => m.status === 'completed').length
  const totalMaintenanceCost = maintenances
    .filter(m => m.cost && m.status === 'completed')
    .reduce((sum, m) => sum + Number(m.cost), 0)

  const handleCreateVehicle = () => {
    setEditingVehicle(null)
    setVehicleModalOpen(true)
  }

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setVehicleModalOpen(true)
  }

  const handleVehicleSubmit = async (data: any) => {
    if (editingVehicle) {
      return await updateVehicle(editingVehicle.id, data)
    } else {
      return await createVehicle(data)
    }
  }

  const handleCreateMaintenance = (vehicleId?: string) => {
    setSelectedVehicleId(vehicleId || vehicles[0]?.id || '')
    setMaintenanceModalOpen(true)
  }

  const handleMaintenanceSubmit = async (data: any) => {
    return await createMaintenance(data)
  }

  const handleDeleteVehicle = async () => {
    if (deleteId) {
      await deleteVehicle(deleteId)
      setDeleteId(null)
    }
  }

  const handleUpdateKm = (vehicle: any) => {
    setKmUpdateData({
      vehicleId: vehicle.id,
      currentKm: vehicle.current_km,
      newKm: vehicle.current_km
    })
    setKmUpdateModalOpen(true)
  }

  const handleKmSubmit = async () => {
    if (kmUpdateData.newKm !== kmUpdateData.currentKm) {
      await updateKilometers(kmUpdateData.vehicleId, kmUpdateData.newKm)
      setKmUpdateModalOpen(false)
    }
  }

  const handleMaintenanceStatusUpdate = async (maintenanceId: string, status: string) => {
    let cost = undefined
    if (status === 'completed') {
      const costInput = prompt('Digite o custo da manutenção (opcional):')
      if (costInput && !isNaN(Number(costInput))) {
        cost = Number(costInput)
      }
    }
    await updateMaintenanceStatus(maintenanceId, status, cost)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pendente</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Concluída</Badge>
      case 'overdue':
        return <Badge variant="destructive">Atrasada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="p-8">Carregando veículos...</div>
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Veículos</h1>
          <p className="text-muted-foreground">Gerencie seus veículos, manutenções e quilometragem</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleCreateMaintenance()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Manutenção
          </Button>
          <Button onClick={handleCreateVehicle} className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Veículo
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingMaintenances}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedMaintenances}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total de Manutenções</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMaintenanceCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Veículos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Meus Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum veículo cadastrado</p>
              <Button onClick={handleCreateVehicle} className="bg-brand-orange hover:bg-brand-orange/90">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Veículo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        {vehicle.brand && vehicle.model && (
                          <div>
                            <span className="font-medium">Modelo:</span> {vehicle.brand} {vehicle.model}
                          </div>
                        )}
                        {vehicle.year && (
                          <div>
                            <span className="font-medium">Ano:</span> {vehicle.year}
                          </div>
                        )}
                        {vehicle.plate && (
                          <div>
                            <span className="font-medium">Placa:</span> {vehicle.plate}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">KM:</span> {vehicle.current_km.toLocaleString()}
                        </div>
                        {vehicle.fuel_type && (
                          <div>
                            <span className="font-medium">Combustível:</span> {vehicle.fuel_type}
                          </div>
                        )}
                        {vehicle.color && (
                          <div>
                            <span className="font-medium">Cor:</span> {vehicle.color}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateKm(vehicle)}
                        title="Atualizar Quilometragem"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateMaintenance(vehicle.id)}
                        title="Nova Manutenção"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(vehicle.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manutenções Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Manutenções Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {maintenances.filter(m => m.status === 'pending').length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma manutenção pendente
            </p>
          ) : (
            <div className="space-y-3">
              {maintenances
                .filter(m => m.status === 'pending')
                .map((maintenance) => {
                  const vehicle = vehicles.find(v => v.id === maintenance.vehicle_id)
                  return (
                    <div key={maintenance.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium">{maintenance.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vehicle?.name} {vehicle?.plate && `(${vehicle.plate})`}
                          </p>
                          {maintenance.system_category && (
                            <Badge variant="outline" className="text-xs">
                              {maintenance.system_category}
                            </Badge>
                          )}
                          {maintenance.due_km && (
                            <p className="text-xs text-muted-foreground">
                              Previsto para: {maintenance.due_km.toLocaleString()} km
                            </p>
                          )}
                          {maintenance.due_date && (
                            <p className="text-xs text-muted-foreground">
                              Data prevista: {new Date(maintenance.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMaintenanceStatusUpdate(maintenance.id, 'completed')}
                            className="text-green-600 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <VehicleFormModal
        open={vehicleModalOpen}
        onOpenChange={setVehicleModalOpen}
        onSubmit={handleVehicleSubmit}
        initialData={editingVehicle}
        mode={editingVehicle ? 'edit' : 'create'}
      />

      <MaintenanceModal
        open={maintenanceModalOpen}
        onOpenChange={setMaintenanceModalOpen}
        onSubmit={handleMaintenanceSubmit}
        vehicleId={selectedVehicleId}
        vehicles={vehicles}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteVehicle}
        title="Excluir Veículo"
        description="Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita e todas as manutenções associadas serão perdidas."
      />

      {/* Modal de Atualização de KM */}
      <Dialog open={kmUpdateModalOpen} onOpenChange={setKmUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Quilometragem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Quilometragem Atual: {kmUpdateData.currentKm.toLocaleString()} km</Label>
            </div>
            <div>
              <Label htmlFor="newKm">Nova Quilometragem</Label>
              <Input
                id="newKm"
                type="number"
                value={kmUpdateData.newKm}
                onChange={(e) => setKmUpdateData(prev => ({ ...prev, newKm: parseInt(e.target.value) || 0 }))}
                min={kmUpdateData.currentKm}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setKmUpdateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleKmSubmit} className="bg-brand-orange hover:bg-brand-orange/90">
                Atualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Veiculos