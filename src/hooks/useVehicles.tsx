import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useProfileContext } from '@/components/DashboardLayout'
import { toast } from 'sonner'

interface Vehicle {
  id: string
  name: string
  brand?: string
  model?: string
  year?: number
  plate?: string
  fuel_type?: string
  color?: string
  acquisition_date?: string
  current_km: number
  status: string
  user_id: string
  client_id?: string
  created_at: string
  updated_at: string
}

interface VehicleMaintenance {
  id: string
  vehicle_id: string
  user_id: string
  client_id?: string
  type: string
  description?: string
  status: string
  due_km?: number
  current_km?: number
  due_date?: string
  completed_date?: string
  cost?: number
  notes?: string
  system_category?: string
  created_at: string
  updated_at: string
}

interface CreateVehicleData {
  name: string
  brand?: string
  model?: string
  year?: number
  plate?: string
  fuel_type?: string
  color?: string
  acquisition_date?: string
  current_km?: number
}

interface CreateMaintenanceData {
  vehicle_id: string
  type: string
  description?: string
  due_km?: number
  due_date?: string
  system_category?: string
  notes?: string
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [maintenances, setMaintenances] = useState<VehicleMaintenance[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const { currentProfile } = useProfileContext()

  const fetchVehicles = async () => {
    if (!user) return

    try {
      setLoading(true)
      // Determinar o profile_type baseado no contexto atual
      const profileType = currentProfile === "Empresarial" ? "business" : "personal";

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .eq('profile_type', profileType)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVehicles(data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Erro ao carregar veículos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaintenances = async (vehicleId?: string) => {
    if (!user) return

    try {
      let query = supabase
        .from('vehicle_maintenance')
        .select('*')
        .eq('user_id', user.id)

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setMaintenances(data || [])
    } catch (error) {
      console.error('Error fetching maintenances:', error)
      toast.error('Erro ao carregar manutenções')
    }
  }

  const createVehicle = async (vehicleData: CreateVehicleData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      const clientId = profile?.clients?.id
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          ...vehicleData,
          user_id: user.id,
          client_id: clientId,
          current_km: vehicleData.current_km || 0,
          status: 'active',
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])
        .select()

      if (error) throw error

      toast.success('Veículo criado com sucesso!')
      await fetchVehicles()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating vehicle:', error)
      toast.error('Erro ao criar veículo')
      return { error: error.message }
    }
  }

  const updateVehicle = async (id: string, vehicleData: Partial<CreateVehicleData>) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Veículo atualizado com sucesso!')
      await fetchVehicles()
      return { error: null }
    } catch (error: any) {
      console.error('Error updating vehicle:', error)
      toast.error('Erro ao atualizar veículo')
      return { error: error.message }
    }
  }

  const updateKilometers = async (vehicleId: string, newKm: number) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          current_km: newKm,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Quilometragem atualizada com sucesso!')
      await fetchVehicles()
      return { error: null }
    } catch (error: any) {
      console.error('Error updating kilometers:', error)
      toast.error('Erro ao atualizar quilometragem')
      return { error: error.message }
    }
  }

  const createMaintenance = async (maintenanceData: CreateMaintenanceData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      const clientId = profile?.clients?.id
      
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .insert([{
          ...maintenanceData,
          user_id: user.id,
          client_id: clientId,
          status: 'pending',
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])
        .select()

      if (error) throw error

      toast.success('Manutenção registrada com sucesso!')
      await fetchMaintenances()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating maintenance:', error)
      toast.error('Erro ao registrar manutenção')
      return { error: error.message }
    }
  }

  const updateMaintenanceStatus = async (id: string, status: string, cost?: number) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString().split('T')[0]
      }

      if (cost !== undefined) {
        updateData.cost = cost
      }

      const { error } = await supabase
        .from('vehicle_maintenance')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Status da manutenção atualizado!')
      await fetchMaintenances()
      return { error: null }
    } catch (error: any) {
      console.error('Error updating maintenance status:', error)
      toast.error('Erro ao atualizar status da manutenção')
      return { error: error.message }
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Veículo excluído com sucesso!')
      await fetchVehicles()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting vehicle:', error)
      toast.error('Erro ao excluir veículo')
      return { error: error.message }
    }
  }

  useEffect(() => {
    if (user) {
      fetchVehicles()
      fetchMaintenances()
    }
  }, [user])

  return {
    vehicles,
    maintenances,
    loading,
    createVehicle,
    updateVehicle,
    updateKilometers,
    createMaintenance,
    updateMaintenanceStatus,
    deleteVehicle,
    fetchVehicles,
    fetchMaintenances: () => fetchMaintenances(),
    refetchData: () => {
      fetchVehicles()
      fetchMaintenances()
    }
  }
}