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
  const { user, profile } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (user && profile) {
      fetchTransactions()
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

      // Configurar subscription para mudanças na tabela transactions
      const channel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `client_id=eq.${clientData.id}`
          },
          (payload) => {
            console.log('Realtime update:', payload)
            
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Nova transação recebida!",
                description: `${payload.new.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${payload.new.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi registrada.`
              })
            }
            
            // Recarregar as transações para manter a lista atualizada
            fetchTransactions()
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

  const fetchTransactions = async () => {
    if (!user || !profile) return

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        // Super admin pode ver todas as transações
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTransactions((data as Transaction[]) || []);
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        console.log('No client found for profile:', profile.id)
        setTransactions([])
        return
      }

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
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

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
      // Buscar todas as categorias (agora são globais/padrão)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const createTransaction = async (transactionData: CreateTransactionData) => {
    if (!user || !profile) {
      toast({
        title: "Erro ao criar transação",
        description: "Usuário não autenticado",
        variant: "destructive"
      })
      return { success: false, error: 'User not authenticated' }
    }

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        toast({
          title: "Erro",
          description: "Super administradores não podem criar transações",
          variant: "destructive"
        })
        return { success: false, error: 'Super admin cannot create transactions' }
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        toast({
          title: "Erro ao criar transação",
          description: "Cliente não encontrado",
          variant: "destructive"
        })
        return { success: false, error: 'Client not found' }
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: user.id,
          client_id: clientData.id
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