import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Category {
  id: string
  client_id?: string
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  is_system?: boolean
  created_at: string
  updated_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      
      // Buscar todas as categorias (sistema e do cliente)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_system', { ascending: false })
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

  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_system'>) => {
    try {
      // Obter client_id do usuário
      const { data: clientData, error: clientError } = await supabase
        .rpc('get_user_client_id')
      
      if (clientError) throw clientError
      
      const { error } = await supabase
        .from('categories')
        .insert({
          ...category,
          client_id: clientData,
          is_system: false
        })
      
      if (error) throw error
      toast.success('Categoria criada com sucesso')
      await fetchCategories()
      return true
    } catch (error: any) {
      console.error('Error creating category:', error)
      toast.error('Erro ao criar categoria')
      return false
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('is_system', false) // Garante que apenas categorias do usuário sejam atualizadas
      
      if (error) throw error
      toast.success('Categoria atualizada com sucesso')
      await fetchCategories()
      return true
    } catch (error: any) {
      console.error('Error updating category:', error)
      toast.error('Erro ao atualizar categoria')
      return false
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('is_system', false) // Garante que apenas categorias do usuário sejam deletadas
      
      if (error) throw error
      toast.success('Categoria deletada com sucesso')
      await fetchCategories()
      return true
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error('Erro ao deletar categoria')
      return false
    }
  }

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}