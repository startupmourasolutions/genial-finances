import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface Income {
  id: string
  user_id: string
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
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchIncomes()
      fetchCategories()
    }
  }, [user])

  const fetchIncomes = async () => {
    try {
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
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (error) throw error
      setIncomes(data || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar receitas",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .eq('type', 'income')

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const createIncome = async (incomeData: CreateIncomeData) => {
    try {
      const { data, error } = await supabase
        .from('incomes')
        .insert([{
          ...incomeData,
          user_id: user?.id
        }])
        .select()

      if (error) throw error

      toast({
        title: "Receita criada com sucesso!",
        description: `${incomeData.title} foi adicionada.`
      })

      fetchIncomes()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao criar receita",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const updateIncome = async (id: string, incomeData: Partial<CreateIncomeData>) => {
    try {
      const { data, error } = await supabase
        .from('incomes')
        .update(incomeData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast({
        title: "Receita atualizada com sucesso!",
        description: `${incomeData.title || 'Receita'} foi atualizada.`
      })

      fetchIncomes()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar receita",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
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

      toast({
        title: "Receita excluída com sucesso!",
        description: "A receita foi removida permanentemente."
      })

      fetchIncomes()
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir receita",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  return {
    incomes,
    categories,
    loading,
    createIncome,
    updateIncome,
    deleteIncome,
    refreshIncomes: fetchIncomes
  }
}