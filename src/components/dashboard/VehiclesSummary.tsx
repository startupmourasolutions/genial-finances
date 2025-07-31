import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVehicles } from "@/hooks/useVehicles"
import { Car, Fuel, Wrench, AlertTriangle } from "lucide-react"
import { useMemo } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function VehiclesSummary() {
  const { vehicles } = useVehicles()

  // Buscar gastos de veículos
  const { data: vehicleExpenses } = useQuery({
    queryKey: ['vehicle-expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_expenses')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  })

  // Buscar manutenções pendentes
  const { data: maintenances } = useQuery({
    queryKey: ['vehicle-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .select('*')
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
      
      if (error) throw error
      return data || []
    }
  })

  const vehicleStats = useMemo(() => {
    if (!vehicles) return {
      total: 0,
      active: 0,
      totalExpenses: 0,
      pendingMaintenance: 0,
      fuelExpenses: 0
    }

    const activeVehicles = vehicles.filter(vehicle => vehicle.status === 'active')
    
    const totalExpenses = vehicleExpenses?.reduce((sum, expense) => 
      sum + Number(expense.amount), 0
    ) || 0

    const fuelExpenses = vehicleExpenses?.filter(expense => 
      expense.type === 'fuel'
    ).reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

    const pendingMaintenance = maintenances?.length || 0

    return {
      total: vehicles.length,
      active: activeVehicles.length,
      totalExpenses,
      pendingMaintenance,
      fuelExpenses
    }
  }, [vehicles, vehicleExpenses, maintenances])

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Veículos Ativos
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{vehicleStats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {vehicleStats.total} cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastos Totais
            </CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {vehicleStats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combustível: R$ {vehicleStats.fuelExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Manutenções
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{vehicleStats.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Geral
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {vehicleStats.pendingMaintenance > 0 ? 'Atenção' : 'OK'}
            </div>
            <Badge variant={vehicleStats.pendingMaintenance > 0 ? "destructive" : "default"}>
              {vehicleStats.pendingMaintenance > 0 ? 'Verificar' : 'Tudo certo'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Veículos */}
      {vehicles && vehicles.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Seus Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.slice(0, 4).map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 text-primary rounded-full">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vehicle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.brand} {vehicle.model} • {vehicle.year}
                      </p>
                      {vehicle.plate && (
                        <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={vehicle.status === 'active' ? "default" : "secondary"}>
                      {vehicle.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {vehicle.current_km && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {vehicle.current_km.toLocaleString()} km
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}