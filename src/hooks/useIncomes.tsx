import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useProfileContext } from "@/components/DashboardLayout"
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
  const { currentProfile } = useProfileContext()

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (user && profile) {
      fetchIncomes()
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

      // Configurar subscription para mudanças na tabela incomes
      const channel = supabase
        .channel('incomes-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'incomes',
            filter: `client_id=eq.${clientData.id}`
          },
          (payload) => {
            console.log('Realtime update incomes:', payload)
            
            if (payload.eventType === 'INSERT') {
              toast.success(`Nova receita de R$ ${payload.new.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi registrada!`)
            }
            
            // Recarregar as receitas para manter a lista atualizada
            fetchIncomes()
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

  const fetchIncomes = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        // Super admin pode ver todas as receitas
        const { data, error } = await supabase
          .from('incomes')
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
        setIncomes((data as Income[]) || []);
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

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
        .order('created_at', { ascending: false })

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

  const createIncome = async (incomeData: CreateIncomeData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        toast.error('Super administradores não podem criar receitas')
        return { error: 'Super admin cannot create incomes' }
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
        .from('incomes')
        .insert([{
          ...incomeData,
          user_id: user.id,
          client_id: clientData.id,
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])
        .select()

      if (error) throw error

      // Automaticamente criar transação correspondente
      await supabase
        .from('transactions')
        .insert([{
          title: incomeData.title,
          amount: incomeData.amount,
          type: 'income',
          description: incomeData.description,
          date: incomeData.date,
          category_id: incomeData.category_id,
          user_id: user.id,
          client_id: clientData.id,
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])

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