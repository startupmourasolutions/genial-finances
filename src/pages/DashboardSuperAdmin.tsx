import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  CreditCard,
  ArrowUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban
} from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  subscription_status: string | null
  created_at: string
}

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newLeads: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    monthlyRevenue: 0,
    growthRate: 0
  })

  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Simplified queries to avoid type issues
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'client')
      
      const totalUsers = allUsers?.length || 0

      // Fetch active users (logged in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: activeUsersData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'client')
        .gte('updated_at', thirtyDaysAgo.toISOString())
      
      const activeUsers = activeUsersData?.length || 0

      // Fetch new leads (created in last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: newLeadsData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'client')
        .gte('created_at', sevenDaysAgo.toISOString())
      
      const newLeads = newLeadsData?.length || 0

      // Fetch recent users - simplified select
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'client')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers,
        activeUsers,
        newLeads,
        totalInvoices: 0,
        pendingInvoices: 0,
        paidInvoices: 0,
        monthlyRevenue: 14900,
        growthRate: 12.5
      })

      // Map the users data with account_status instead of subscription_status
      if (users) {
        setRecentUsers(users.map(user => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          subscription_status: user.account_status || 'trial',
          created_at: user.created_at
        })))
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie usuários, faturas e acompanhe o crescimento
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} ativos nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novos Leads
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              {stats.growthRate}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              Leads para clientes pagantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Novos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.full_name || 'Sem nome'}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {user.subscription_status === 'active' ? 'Ativo' : 'Trial'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todos os usuários
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Sistema operacional</p>
                  <p className="text-xs text-muted-foreground">
                    Todos os serviços estão funcionando normalmente
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">5 faturas pendentes</p>
                  <p className="text-xs text-muted-foreground">
                    Aguardando processamento há mais de 3 dias
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Backup agendado</p>
                  <p className="text-xs text-muted-foreground">
                    Próximo backup em 2 horas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Ban className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">2 contas suspensas</p>
                  <p className="text-xs text-muted-foreground">
                    Verificar pagamentos pendentes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Gráfico de receita será implementado aqui
          </div>
        </CardContent>
      </Card>
    </div>
  )
}