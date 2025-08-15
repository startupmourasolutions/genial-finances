import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface Expense {
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
  const { user, profile } = useAuth()

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (user && profile) {
      fetchExpenses()
      fetchCategories()
      
      const initRealtime = async () => {
        cleanup = await setupRealtimeSubscription()
      }
      
      initRealtime()
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [user, profile])

  const setupRealtimeSubscription = async () => {
    if (!user || !profile) return

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        // Super admin não precisa de subscription específica
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) return

      // Configurar subscription para mudanças na tabela expenses
      const channel = supabase
        .channel('expenses-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'expenses',
            filter: `client_id=eq.${clientData.id}`
          },
          (payload) => {
            console.log('Realtime update expenses:', payload)
            
            if (payload.eventType === 'INSERT') {
              toast.success(`Nova despesa de R$ ${payload.new.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi registrada!`)
            }
            
            // Recarregar as despesas para manter a lista atualizada
            fetchExpenses()
          }
        )
        .subscribe()

      // Cleanup function será retornada no useEffect
      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error('Error setting up realtime subscription:', error)
    }
  }

  const fetchExpenses = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        // Super admin pode ver todas as despesas
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            categories (
              name,
              type,
              icon,
              color
            )
          `)
          .order('date', { ascending: false });

        if (error) throw error;
        setExpenses((data as Expense[]) || []);
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        setExpenses([])
        return
      }

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
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error: any) {
      console.error('Error fetching expenses:', error)
      toast.error('Erro ao carregar despesas')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Buscar todas as categorias (agora são globais/padrão)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  const createExpense = async (expenseData: CreateExpenseData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        toast.error('Super administradores não podem criar despesas')
        return { error: 'Super admin cannot create expenses' }
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        toast.error('Cliente não encontrado')
        return { error: 'Client not found' }
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseData,
          user_id: user.id,
          client_id: clientData.id
        }])
        .select()

      if (error) throw error

      // Automaticamente criar transação correspondente
      await supabase
        .from('transactions')
        .insert([{
          title: expenseData.title,
          amount: expenseData.amount,
          type: 'expense',
          description: expenseData.description,
          date: expenseData.date,
          category_id: expenseData.category_id,
          user_id: user.id,
          client_id: clientData.id
        }])

      toast.success('Despesa criada com sucesso!')
      await fetchExpenses()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating expense:', error)
      toast.error('Erro ao criar despesa')
      return { error: error.message }
    }
  }

  const updateExpense = async (id: string, expenseData: Partial<CreateExpenseData>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...expenseData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Despesa atualizada com sucesso!')
      await fetchExpenses()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error updating expense:', error)
      toast.error('Erro ao atualizar despesa')
      return { error: error.message }
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

      toast.success('Despesa excluída com sucesso!')
      await fetchExpenses()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting expense:', error)
      toast.error('Erro ao excluir despesa')
      return { error: error.message }
    }
  }

  return {
    expenses,
    categories,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses,
    refreshCategories: fetchCategories
  }
}