import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVehicles } from "@/hooks/useVehicles"
import { Car, Fuel, Calendar } from "lucide-react"

export function VehiclesSummary() {
  const { vehicles } = useVehicles()

  const activeVehicles = vehicles
    ?.filter(vehicle => vehicle.status === 'active')
    .slice(0, 6) || []

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Veículos</CardTitle>
        <Car className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {activeVehicles.length > 0 ? (
          <div className="space-y-3">
            {activeVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Car className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.brand} {vehicle.model} • {vehicle.year}
                    </p>
                    {vehicle.plate && (
                      <p className="text-xs text-muted-foreground">
                        Placa: {vehicle.plate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={vehicle.status === 'active' ? "default" : "secondary"} className="text-xs">
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
            {vehicles && vehicles.length > 6 && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-center">
                  <span className="text-sm text-muted-foreground">
                    +{vehicles.length - 6} veículo(s) adicional(is)
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhum veículo cadastrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}