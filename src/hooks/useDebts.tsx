import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useProfileContext } from "@/components/DashboardLayout"
import { toast } from "sonner"

interface Debt {
  id: string
  user_id: string
  client_id?: string
  title: string
  description?: string
  total_amount: number
  remaining_amount: number
  due_date?: string
  status: string
  interest_rate?: number
  monthly_payment?: number
  creditor_name?: string
  debt_type: string
  original_amount?: number
  payment_frequency: string
  created_at: string
  updated_at: string
}

interface CreateDebtData {
  title: string
  description?: string
  total_amount: number
  remaining_amount?: number
  due_date?: string
  interest_rate?: number
  monthly_payment?: number
  creditor_name?: string
  debt_type?: string
  original_amount?: number
  payment_frequency?: string
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const { currentProfile } = useProfileContext()

  useEffect(() => {
    if (user && profile) {
      fetchDebts()
    }
  }, [user, profile])

  const fetchDebts = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        // Super admin pode ver todas as dívidas
        const { data, error } = await supabase
          .from('debts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDebts(data || []);
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        setDebts([])
        return
      }

    // Determinar o profile_type baseado no contexto atual
    const profileType = currentProfile === "Empresarial" ? "business" : "personal";

    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('client_id', clientData.id)
      .eq('profile_type', profileType)
      .order('created_at', { ascending: false })

      if (error) throw error
      setDebts(data || [])
    } catch (error: any) {
      console.error('Error fetching debts:', error)
      toast.error('Erro ao carregar dívidas')
    } finally {
      setLoading(false)
    }
  }

  const createDebt = async (debtData: CreateDebtData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        toast.error('Super administradores não podem criar dívidas')
        return { error: 'Super admin cannot create debts' }
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
        .from('debts')
        .insert([{
          ...debtData,
          user_id: user.id,
          client_id: clientData.id,
          remaining_amount: debtData.remaining_amount || debtData.total_amount,
          status: 'active',
          debt_type: debtData.debt_type || 'loan',
          payment_frequency: debtData.payment_frequency || 'monthly',
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        }])
        .select()

      if (error) throw error

      toast.success('Dívida criada com sucesso!')
      await fetchDebts()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating debt:', error)
      toast.error('Erro ao criar dívida')
      return { error: error.message }
    }
  }

  const updateDebt = async (id: string, debtData: Partial<CreateDebtData>) => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .update({
          ...debtData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Dívida atualizada com sucesso!')
      await fetchDebts()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error updating debt:', error)
      toast.error('Erro ao atualizar dívida')
      return { error: error.message }
    }
  }

  const makePayment = async (id: string, paymentAmount: number) => {
    try {
      // Buscar a dívida atual
      const { data: currentDebt, error: fetchError } = await supabase
        .from('debts')
        .select('remaining_amount')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (fetchError) throw fetchError

      const newRemainingAmount = Math.max(0, currentDebt.remaining_amount - paymentAmount)
      const newStatus = newRemainingAmount === 0 ? 'paid' : 'active'

      const { data, error } = await supabase
        .from('debts')
        .update({
          remaining_amount: newRemainingAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Pagamento registrado com sucesso!')
      await fetchDebts()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error making payment:', error)
      toast.error('Erro ao registrar pagamento')
      return { error: error.message }
    }
  }

  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Dívida excluída com sucesso!')
      await fetchDebts()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting debt:', error)
      toast.error('Erro ao excluir dívida')
      return { error: error.message }
    }
  }

  return {
    debts,
    loading,
    createDebt,
    updateDebt,
    makePayment,
    deleteDebt,
    refreshDebts: fetchDebts
  }
}