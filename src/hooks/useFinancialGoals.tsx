import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
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

  useEffect(() => {
    if (user && profile) {
      fetchGoals()
      fetchCategories()
    }
  }, [user, profile])

  const fetchGoals = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      const clientId = profile?.clients?.[0]?.id

      if (!clientId) {
        setGoals([])
        return
      }

      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('client_id', clientId)
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
      const clientId = profile?.clients?.[0]?.id

      if (!clientId) {
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
      const clientId = profile?.clients?.[0]?.id

      if (!clientId) {
        toast.error('Cliente não encontrado')
        return { error: 'Client not found' }
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
          contribution_frequency: goalData.contribution_frequency || 'monthly'
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