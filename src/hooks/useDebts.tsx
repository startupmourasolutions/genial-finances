import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useProfileContext } from "@/components/DashboardLayout"
import { toast } from "sonner"

interface Debt {
  id: string
  user_id: string
  client_id?: string
  category_id?: string
  title: string
  description?: string
  total_amount?: number
  due_date?: string
  status: string
  original_amount?: number
  payment_frequency: string
  created_at: string
  updated_at: string
  categories?: {
    name: string
    color?: string
    icon?: string
  }
  payments?: DebtPayment[]
}

interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  client_id?: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
  updated_at: string
}

interface CreateDebtData {
  title: string
  description?: string
  category_id?: string
  total_amount?: number
  due_date?: string
  original_amount?: number
  payment_frequency?: string
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const { currentProfile } = useProfileContext()

  useEffect(() => {
    if (user && profile) {
      fetchDebts()
      fetchCategories()
      fetchDebtPayments()
    }
  }, [user, profile, currentProfile])

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
      .select(`
        *,
        categories (
          name,
          color,
          icon
        )
      `)
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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchDebtPayments = async () => {
    if (!user || !profile) return

    try {
      // Verificar se é super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false;
      
      if (isSuperAdmin) {
        const { data, error } = await supabase
          .from('debt_payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDebtPayments(data || []);
        return;
      }

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle()

      if (clientError || !clientData) {
        setDebtPayments([])
        return
      }

      const { data, error } = await supabase
        .from('debt_payments')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDebtPayments(data || [])
    } catch (error: any) {
      console.error('Error fetching debt payments:', error)
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
        .insert({
          ...debtData,
          user_id: user.id,
          client_id: clientData.id,
          status: 'active',
          payment_frequency: debtData.payment_frequency || 'monthly',
          profile_type: currentProfile === "Empresarial" ? "business" : "personal"
        })
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
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (fetchError) throw fetchError

      // Buscar o client_id do usuário atual
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', profile?.id)
        .maybeSingle()

      if (clientError || !clientData) {
        toast.error('Cliente não encontrado')
        return { error: 'Client not found' }
      }

      // Registrar o pagamento no histórico
      const { error: paymentError } = await supabase
        .from('debt_payments')
        .insert({
          debt_id: id,
          user_id: user?.id,
          client_id: clientData.id,
          amount: paymentAmount,
          payment_date: new Date().toISOString().split('T')[0],
        })

      if (paymentError) throw paymentError

      // Lógica baseada na frequência de pagamento
      if (currentDebt.payment_frequency === 'monthly') {
        // Para pagamentos mensais: marcar como pago e criar nova dívida para próximo mês
        await supabase
          .from('debts')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        // Criar nova dívida para o próximo mês
        const nextMonthDate = new Date(currentDebt.due_date)
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)

        await supabase
          .from('debts')
          .insert({
            title: currentDebt.title,
            description: currentDebt.description,
            category_id: currentDebt.category_id,
            total_amount: currentDebt.total_amount,
            due_date: nextMonthDate.toISOString().split('T')[0],
            payment_frequency: 'monthly',
            status: 'active',
            user_id: user?.id,
            client_id: clientData.id,
            profile_type: currentProfile === "Empresarial" ? "business" : "personal"
          })

        toast.success('Pagamento registrado! Nova dívida criada para o próximo mês.')
      } else {
        // Para pagamentos únicos: apenas marcar como pago
        await supabase
          .from('debts')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        toast.success('Dívida quitada com sucesso!')
      }

      await fetchDebts()
      await fetchDebtPayments()
      return { data: null, error: null }
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
    categories,
    debtPayments,
    loading,
    createDebt,
    updateDebt,
    makePayment,
    deleteDebt,
    refreshDebts: fetchDebts,
    refreshCategories: fetchCategories,
    refreshDebtPayments: fetchDebtPayments
  }
}