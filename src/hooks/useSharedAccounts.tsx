import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export interface SharedAccount {
  id: string
  client_id: string
  name: string
  whatsapp_number: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateSharedAccountData {
  name: string
  whatsapp_number: string
}

export function useSharedAccounts() {
  const [sharedAccounts, setSharedAccounts] = useState<SharedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user && profile) {
      fetchSharedAccounts()
    }
  }, [user, profile])

  const fetchSharedAccounts = async () => {
    try {
      setLoading(true)
      
      const clientData = profile?.clients
      if (!clientData?.id) {
        console.log('No client found for user')
        setSharedAccounts([])
        return
      }

      const { data, error } = await supabase
        .from('shared_accounts')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSharedAccounts(data || [])
    } catch (error: any) {
      console.error('Error fetching shared accounts:', error)
      toast.error('Erro ao carregar contas compartilhadas')
    } finally {
      setLoading(false)
    }
  }

  const createSharedAccount = async (accountData: CreateSharedAccountData) => {
    try {
      if (!user) {
        return { error: 'User not authenticated' }
      }

      const clientData = profile?.clients
      if (!clientData?.id) {
        return { error: 'Client not found' }
      }

      // Verificar limite baseado no tipo de plano
      const isBusinessAccount = clientData.client_type === 'business'
      const maxAccounts = isBusinessAccount ? 4 : 1

      if (sharedAccounts.length >= maxAccounts) {
        const planType = isBusinessAccount ? 'empresarial' : 'pessoal'
        const message = `Limite de ${maxAccounts} conta(s) compartilhada(s) atingido para o plano ${planType}.`
        toast.error(message)
        return { error: message }
      }

      const { data, error } = await supabase
        .from('shared_accounts')
        .insert([{
          ...accountData,
          client_id: clientData.id
        }])
        .select()

      if (error) throw error

      toast.success('Conta compartilhada criada com sucesso!')
      await fetchSharedAccounts()
      return { data }
    } catch (error: any) {
      console.error('Error creating shared account:', error)
      toast.error('Erro ao criar conta compartilhada')
      return { error: error.message }
    }
  }

  const updateSharedAccount = async (id: string, accountData: Partial<CreateSharedAccountData>) => {
    try {
      const { data, error } = await supabase
        .from('shared_accounts')
        .update(accountData)
        .eq('id', id)
        .select()

      if (error) throw error

      toast.success('Conta compartilhada atualizada com sucesso!')
      await fetchSharedAccounts()
      return { data }
    } catch (error: any) {
      console.error('Error updating shared account:', error)
      toast.error('Erro ao atualizar conta compartilhada')
      return { error: error.message }
    }
  }

  const deleteSharedAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shared_accounts')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      toast.success('Conta compartilhada removida com sucesso!')
      await fetchSharedAccounts()
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting shared account:', error)
      toast.error('Erro ao remover conta compartilhada')
      return { error: error.message }
    }
  }

  const getMaxAccounts = () => {
    const clientData = profile?.clients
    const isBusinessAccount = clientData?.client_type === 'business'
    return isBusinessAccount ? 4 : 1
  }

  const getAccountsRemaining = () => {
    return getMaxAccounts() - sharedAccounts.length
  }

  return {
    sharedAccounts,
    loading,
    createSharedAccount,
    updateSharedAccount,
    deleteSharedAccount,
    refetchSharedAccounts: fetchSharedAccounts,
    getMaxAccounts,
    getAccountsRemaining
  }
}