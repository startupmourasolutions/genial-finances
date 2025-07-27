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
      
      // Buscar todas as categorias (agora são globais/padrão)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
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

  return {
    categories,
    loading,
    refreshCategories: fetchCategories
  }
}