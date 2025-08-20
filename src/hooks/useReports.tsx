import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentProfile } from "@/contexts/ProfileContext"
import { useToast } from "@/hooks/use-toast"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, eachMonthOfInterval, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ReportsFilters {
  startDate?: string
  endDate?: string
  period: 'daily' | 'monthly' | 'quarterly' | 'yearly'
  categoryFilter: 'all' | 'income' | 'expense'
}

interface MonthlyData {
  month: string
  incomes: number
  expenses: number
  balance: number
  date: Date
}

interface CategoryData {
  name: string
  value: number
  fill: string
  type: 'income' | 'expense'
}

interface PatrimonyData {
  month: string
  value: number
  date: Date
}

export function useReports() {
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ReportsFilters>({
    period: 'monthly',
    categoryFilter: 'all'
  })
  
  const { user, profile } = useAuth()
  const { currentProfile } = useCurrentProfile()
  const { toast } = useToast()

  // Raw data states
  const [incomes, setIncomes] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [debts, setDebts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    if (user && profile) {
      fetchAllData()
    }
  }, [user, profile, currentProfile])

  const fetchAllData = async () => {
    if (!user || !profile) return

    try {
      setLoading(true)
      
      // Check if super admin
      const isSuperAdmin = profile?.super_administrators?.id ? true : false
      
      if (isSuperAdmin) {
        await Promise.all([
          fetchIncomesAdmin(),
          fetchExpensesAdmin(),
          fetchDebtsAdmin(),
          fetchCategories()
        ])
      } else {
        // Get client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle()

        if (clientError || !clientData) {
          console.log('No client found for profile:', profile.id)
          return
        }

        await Promise.all([
          fetchIncomes(clientData.id),
          fetchExpenses(clientData.id),
          fetchDebts(clientData.id),
          fetchCategories()
        ])
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados dos relatórios",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchIncomes = async (clientId: string) => {
    const profileType = currentProfile === "Empresarial" ? "business" : "personal"
    
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
      .eq('client_id', clientId)
      .eq('profile_type', profileType)
      .order('date', { ascending: false })

    if (error) throw error
    setIncomes(data || [])
  }

  const fetchIncomesAdmin = async () => {
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
      .order('date', { ascending: false })

    if (error) throw error
    setIncomes(data || [])
  }

  const fetchExpenses = async (clientId: string) => {
    const profileType = currentProfile === "Empresarial" ? "business" : "personal"
    
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
      .eq('client_id', clientId)
      .eq('profile_type', profileType)
      .order('date', { ascending: false })

    if (error) throw error
    setExpenses(data || [])
  }

  const fetchExpensesAdmin = async () => {
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
      .order('date', { ascending: false })

    if (error) throw error
    setExpenses(data || [])
  }

  const fetchDebts = async (clientId: string) => {
    const profileType = currentProfile === "Empresarial" ? "business" : "personal"
    
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('client_id', clientId)
      .eq('profile_type', profileType)
      .order('created_at', { ascending: false })

    if (error) throw error
    setDebts(data || [])
  }

  const fetchDebtsAdmin = async () => {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setDebts(data || [])
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    setCategories(data || [])
  }

  // Processed data using useMemo for performance
  const monthlyData = useMemo(() => {
    const filteredIncomes = filterDataByDate(incomes)
    const filteredExpenses = filterDataByDate(expenses)
    
    // Get last 6 months
    const endDate = new Date()
    const startDate = subMonths(endDate, 5)
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthIncomes = filteredIncomes.filter(income => {
        const incomeDate = parseISO(income.date)
        return incomeDate >= monthStart && incomeDate <= monthEnd
      })
      
      const monthExpenses = filteredExpenses.filter(expense => {
        const expenseDate = parseISO(expense.date)
        return expenseDate >= monthStart && expenseDate <= monthEnd
      })
      
      const totalIncomes = monthIncomes.reduce((sum, income) => sum + Number(income.amount), 0)
      const totalExpenses = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      
      return {
        month: format(month, 'MMM', { locale: ptBR }),
        incomes: totalIncomes,
        expenses: totalExpenses,
        balance: totalIncomes - totalExpenses,
        date: month
      }
    })
  }, [incomes, expenses, filters])

  const incomeCategories = useMemo(() => {
    const filteredIncomes = filterDataByDate(incomes)
    const categoryMap = new Map<string, number>()
    
    filteredIncomes.forEach(income => {
      const categoryName = income.categories?.name || 'Sem categoria'
      const currentValue = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, currentValue + Number(income.amount))
    })
    
    const colors = [
      'hsl(var(--success))',
      'hsl(var(--brand-orange))',
      'hsl(var(--warning))',
      'hsl(var(--primary))',
      'hsl(var(--muted-foreground))'
    ]
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
      type: 'income' as const
    }))
  }, [incomes, filters])

  const expenseCategories = useMemo(() => {
    const filteredExpenses = filterDataByDate(expenses)
    const categoryMap = new Map<string, number>()
    
    filteredExpenses.forEach(expense => {
      const categoryName = expense.categories?.name || 'Sem categoria'
      const currentValue = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, currentValue + Number(expense.amount))
    })
    
    const colors = [
      'hsl(var(--destructive))',
      'hsl(var(--warning))',
      'hsl(var(--brand-orange))',
      'hsl(var(--primary))',
      'hsl(var(--muted-foreground))'
    ]
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
      type: 'expense' as const
    }))
  }, [expenses, filters])

  const patrimonyData = useMemo(() => {
    // Calculate patrimony evolution based on cumulative balance
    let runningTotal = 10000 // Starting amount (could be configurable)
    
    return monthlyData.map(month => {
      runningTotal += month.balance
      return {
        month: month.month,
        value: Math.max(0, runningTotal), // Ensure non-negative
        date: month.date
      }
    })
  }, [monthlyData])

  const filterDataByDate = (data: any[]) => {
    if (!filters.startDate && !filters.endDate) return data
    
    return data.filter(item => {
      const itemDate = parseISO(item.date)
      
      if (filters.startDate && itemDate < parseISO(filters.startDate)) return false
      if (filters.endDate && itemDate > parseISO(filters.endDate)) return false
      
      return true
    })
  }

  // Totals
  const totals = useMemo(() => {
    const filteredIncomes = filterDataByDate(incomes)
    const filteredExpenses = filterDataByDate(expenses)
    
    const totalIncomes = filteredIncomes.reduce((sum, income) => sum + Number(income.amount), 0)
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    const balance = totalIncomes - totalExpenses
    
    // Calculate growth percentage
    const firstMonthBalance = monthlyData[0]?.balance || 0
    const lastMonthBalance = monthlyData[monthlyData.length - 1]?.balance || 0
    const growth = firstMonthBalance !== 0 ? ((lastMonthBalance - firstMonthBalance) / Math.abs(firstMonthBalance)) * 100 : 0
    
    return {
      totalIncomes,
      totalExpenses,
      balance,
      growth
    }
  }, [incomes, expenses, filters, monthlyData])

  const updateFilters = (newFilters: Partial<ReportsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const exportToPDF = async () => {
    toast({
      title: "Exportação em desenvolvimento",
      description: "Funcionalidade de exportação PDF será implementada em breve."
    })
  }

  const exportToExcel = async () => {
    toast({
      title: "Exportação em desenvolvimento", 
      description: "Funcionalidade de exportação Excel será implementada em breve."
    })
  }

  return {
    loading,
    filters,
    monthlyData,
    incomeCategories,
    expenseCategories,
    patrimonyData,
    totals,
    categories,
    updateFilters,
    exportToPDF,
    exportToExcel,
    refreshData: fetchAllData
  }
}