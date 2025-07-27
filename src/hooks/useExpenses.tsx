import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface Expense {
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

interface CreateExpenseData {
  title: string
  amount: number
  description?: string
  date: string
  category_id?: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchExpenses()
      fetchCategories()
    }
  }, [user])

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
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
      setExpenses(data || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar despesas",
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
        .eq('type', 'expense')

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const createExpense = async (expenseData: CreateExpenseData) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseData,
          user_id: user?.id
        }])
        .select()

      if (error) throw error

      toast({
        title: "Despesa criada com sucesso!",
        description: `${expenseData.title} foi adicionada.`
      })

      fetchExpenses()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao criar despesa",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const updateExpense = async (id: string, expenseData: Partial<CreateExpenseData>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast({
        title: "Despesa atualizada com sucesso!",
        description: `${expenseData.title || 'Despesa'} foi atualizada.`
      })

      fetchExpenses()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar despesa",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Despesa excluída com sucesso!",
        description: "A despesa foi removida permanentemente."
      })

      fetchExpenses()
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir despesa",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  return {
    expenses,
    categories,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses
  }
}