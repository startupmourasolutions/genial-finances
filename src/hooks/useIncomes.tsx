import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface Income {
  id: string
  user_id: string
  client_id?: string
  category_id?: string
  title: string
  amount: number
  description?: string
  date: string
  created_at: string
  updated_at: string
  categories?: {
    name: string
    color?: string
    icon?: string
  }
}

interface CreateIncomeData {
  title: string
  amount: number
  description?: string
  date: string
  category_id?: string
}

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user && profile) {
      fetchIncomes()
      fetchCategories()
    }
  }, [user, profile])

  const fetchIncomes = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .single()

      if (clientError || !clientData) {
        setIncomes([])
        return
      }

      const { data, error } = await supabase
        .from('incomes')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('client_id', clientData.id)
        .order('date', { ascending: false })

      if (error) throw error
      setIncomes(data || [])
    } catch (error: any) {
      console.error('Error fetching incomes:', error)
      toast.error('Erro ao carregar receitas')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (!user || !profile) return

    try {
      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .single()

      if (clientError || !clientData) {
        console.log('No client found for profile:', profile.id)
        setCategories([])
        return
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('client_id', clientData.id)
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  const createIncome = async (incomeData: CreateIncomeData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .single()

      if (clientError || !clientData) {
        toast.error('Cliente não encontrado')
        return { error: 'Client not found' }
      }

      const { data, error } = await supabase
        .from('incomes')
        .insert([{
          ...incomeData,
          user_id: user.id,
          client_id: clientData.id
        }])
        .select()

      if (error) throw error

      toast.success('Receita criada com sucesso!')
      await fetchIncomes()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating income:', error)
      toast.error('Erro ao criar receita')
      return { error: error.message }
    }
  }

  const updateIncome = async (id: string, incomeData: Partial<CreateIncomeData>) => {
    try {
      const { data, error } = await supabase
        .from('incomes')
        .update({
          ...incomeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Receita atualizada com sucesso!')
      await fetchIncomes()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error updating income:', error)
      toast.error('Erro ao atualizar receita')
      return { error: error.message }
    }
  }

  const deleteIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Receita excluída com sucesso!')
      await fetchIncomes()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting income:', error)
      toast.error('Erro ao excluir receita')
      return { error: error.message }
    }
  }

  return {
    incomes,
    categories,
    loading,
    createIncome,
    updateIncome,
    deleteIncome,
    refreshIncomes: fetchIncomes,
    refreshCategories: fetchCategories
  }
}