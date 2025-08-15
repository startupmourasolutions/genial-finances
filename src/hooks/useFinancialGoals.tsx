import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useProfileContext } from "@/components/DashboardLayout"
import { toast } from "sonner"

interface FinancialGoal {
  id: string
  user_id: string
  client_id?: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  target_date?: string
  status: string
  category_id?: string
  auto_contribution: boolean
  contribution_amount: number
  contribution_frequency: string
  created_at: string
  updated_at: string
  categories?: {
    name: string
    color?: string
    icon?: string
  }
}

interface CreateGoalData {
  title: string
  description?: string
  target_amount: number
  target_date?: string
  category_id?: string
  auto_contribution?: boolean
  contribution_amount?: number
  contribution_frequency?: string
}

export function useFinancialGoals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const { currentProfile } = useProfileContext()

  useEffect(() => {
    // Aguardar um pouco antes de buscar dados para garantir que profile carregou completamente
    const timer = setTimeout(() => {
      if (user && profile && profile.clients) {
        fetchGoals()
        fetchCategories()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [user, profile, profile?.clients])

  const fetchGoals = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Aguardar um pouco para garantir que o profile carregou completamente
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const clientId = profile?.clients?.id

      if (!clientId) {
        console.log('Client ID não encontrado no profile:', profile)
        setGoals([])
        return
      }

      // Determinar o profile_type baseado no contexto atual
      const profileType = currentProfile === "Empresarial" ? "business" : "personal";

      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('client_id', clientId)
        .eq('profile_type', profileType)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error: any) {
      console.error('Error fetching goals:', error)
      toast.error('Erro ao carregar metas')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (!user || !profile) return

    try {
      // Aguardar um pouco para garantir que o profile carregou completamente
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const clientId = profile?.clients?.id

      if (!clientId) {
        console.log('Client ID não encontrado para categorias:', profile)
        setCategories([])
        return
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('client_id', clientId)
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  const createGoal = async (goalData: CreateGoalData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      // Aguardar um pouco para garantir que o profile carregou completamente
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const clientId = profile?.clients?.id

      if (!clientId) {
        console.error('Profile data:', JSON.stringify(profile, null, 2))
        console.error('Profile clients:', profile?.clients)
        toast.error('Perfil de cliente não encontrado. Tente recarregar a página.')
        return { error: 'Client profile not found' }
      }

      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          ...goalData,
          user_id: user.id,
          client_id: clientId,
          current_amount: 0,
          status: 'active',
          auto_contribution: goalData.auto_contribution || false,
          contribution_amount: goalData.contribution_amount || 0,
          contribution_frequency: goalData.contribution_frequency || 'monthly',
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])
        .select()

      if (error) throw error

      toast.success('Meta criada com sucesso!')
      await fetchGoals()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating goal:', error)
      toast.error('Erro ao criar meta')
      return { error: error.message }
    }
  }

  const updateGoal = async (id: string, goalData: Partial<CreateGoalData>) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .update({
          ...goalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Meta atualizada com sucesso!')
      await fetchGoals()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error updating goal:', error)
      toast.error('Erro ao atualizar meta')
      return { error: error.message }
    }
  }

  const addContribution = async (id: string, amount: number) => {
    try {
      // Buscar a meta atual
      const { data: currentGoal, error: fetchError } = await supabase
        .from('financial_goals')
        .select('current_amount, target_amount')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (fetchError) throw fetchError

      const newCurrentAmount = currentGoal.current_amount + amount
      const newStatus = newCurrentAmount >= currentGoal.target_amount ? 'completed' : 'active'

      const { data, error } = await supabase
        .from('financial_goals')
        .update({
          current_amount: newCurrentAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Contribuição adicionada com sucesso!')
      await fetchGoals()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error adding contribution:', error)
      toast.error('Erro ao adicionar contribuição')
      return { error: error.message }
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Meta excluída com sucesso!')
      await fetchGoals()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting goal:', error)
      toast.error('Erro ao excluir meta')
      return { error: error.message }
    }
  }

  return {
    goals,
    categories,
    loading,
    createGoal,
    updateGoal,
    addContribution,
    deleteGoal,
    refreshGoals: fetchGoals
  }
}