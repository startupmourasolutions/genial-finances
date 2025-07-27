import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  user_id: string
  category_id?: string
  title: string
  amount: number
  type: 'income' | 'expense'
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

interface CreateTransactionData {
  title: string
  amount: number
  type: 'income' | 'expense'
  description?: string
  date: string
  category_id?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchCategories()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
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
      setTransactions((data as Transaction[]) || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar transações",
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

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const createTransaction = async (transactionData: CreateTransactionData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: user?.id
        }])
        .select()

      if (error) throw error

      toast({
        title: "Transação criada com sucesso!",
        description: `${transactionData.title} foi adicionada.`
      })

      fetchTransactions()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const updateTransaction = async (id: string, transactionData: Partial<CreateTransactionData>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast({
        title: "Transação atualizada com sucesso!",
        description: `${transactionData.title || 'Transação'} foi atualizada.`
      })

      fetchTransactions()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar transação",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast({
        title: "Transação excluída com sucesso!",
        description: "A transação foi removida permanentemente."
      })

      fetchTransactions()
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  return {
    transactions,
    categories,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions
  }
}