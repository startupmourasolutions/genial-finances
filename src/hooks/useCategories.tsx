import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface Category {
  id: string
  user_id: string
  client_id?: string
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  created_at: string
  updated_at: string
}

interface CreateCategoryData {
  name: string
  color?: string
  icon?: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user && profile) {
      fetchCategories()
    }
  }, [user, profile])

  const fetchCategories = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      const clientId = profile?.clients?.[0]?.id

      if (!clientId) {
        console.log('No client found for user')
        setCategories([])
        return
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('client_id', clientId)
        .order('name', { ascending: true })

      if (error) throw error
      setCategories((data as Category[]) || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: CreateCategoryData) => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      const clientId = profile?.clients?.[0]?.id

      if (!clientId) {
        toast.error('Cliente não encontrado')
        return { error: 'Client not found' }
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          type: 'expense', // tipo padrão para compatibilidade - categorias são unificadas
          user_id: user.id,
          client_id: clientId
        }])
        .select()

      if (error) throw error

      toast.success('Categoria criada com sucesso!')
      await fetchCategories()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error creating category:', error)
      toast.error('Erro ao criar categoria')
      return { error: error.message }
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<CreateCategoryData>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()

      if (error) throw error

      toast.success('Categoria atualizada com sucesso!')
      await fetchCategories()
      return { data: data[0], error: null }
    } catch (error: any) {
      console.error('Error updating category:', error)
      toast.error('Erro ao atualizar categoria')
      return { error: error.message }
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.success('Categoria excluída com sucesso!')
      await fetchCategories()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error('Erro ao excluir categoria')
      return { error: error.message }
    }
  }

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories
  }
}