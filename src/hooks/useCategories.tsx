import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  created_at: string
  updated_at: string
}

interface CreateCategoryData {
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchCategories()
    }
  }, [user])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('type', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setCategories((data as Category[]) || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar categorias",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: CreateCategoryData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          user_id: user?.id
        }])
        .select()

      if (error) throw error

      toast({
        title: "Categoria criada com sucesso!",
        description: `${categoryData.name} foi adicionada.`
      })

      fetchCategories()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
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

      toast({
        title: "Categoria atualizada com sucesso!",
        description: `${categoryData.name || 'Categoria'} foi atualizada.`
      })

      fetchCategories()
      return { success: true, data }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
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

      toast({
        title: "Categoria excluída com sucesso!",
        description: "A categoria foi removida permanentemente."
      })

      fetchCategories()
      return { success: true }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive"
      })
      return { success: false, error }
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