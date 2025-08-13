import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { DebtFormModal } from "@/components/DebtFormModal"
import { useDebts } from "@/hooks/useDebts"
import { Plus, Filter, BarChart3, Table as TableIcon, AlertTriangle, Calendar, DollarSign, Edit, Trash2, CreditCard } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { toast } from "sonner"

const Dividas = () => {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<any>(null)
  const [deleteDebtId, setDeleteDebtId] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const { debts, loading, createDebt, updateDebt, deleteDebt, makePayment } = useDebts()

  // Filter debts
  const filteredDebts = debts.filter(debt => {
    const matchesSearch = !searchFilter || 
      debt.creditor_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      debt.title.toLowerCase().includes(searchFilter.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || debt.debt_type === categoryFilter
    const matchesStatus = statusFilter === "all" || debt.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const chartData = filteredDebts.map(debt => ({
    name: debt.creditor_name || debt.title,
    valor: Number(debt.remaining_amount),
    status: debt.status
  }))

  // Group debts by type for pie chart
  const debtsByType = filteredDebts.reduce((acc, debt) => {
    const type = debt.debt_type || 'outros'
    acc[type] = (acc[type] || 0) + Number(debt.remaining_amount)
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(debtsByType).map(([type, value], index) => ({
    name: type,
    value,
    fill: [
      "hsl(var(--brand-orange))",
      "hsl(var(--destructive))", 
      "hsl(var(--warning))",
      "hsl(var(--success))",
      "hsl(var(--primary))"
    ][index % 5]
  }))

  const totalDividas = filteredDebts.reduce((sum, debt) => sum + Number(debt.remaining_amount), 0)
  const dividasVencidas = filteredDebts.filter(d => d.due_date && new Date(d.due_date) < new Date()).length
  const proximosVencimentos = filteredDebts.filter(d => {
    if (!d.due_date) return false
    const dueDate = new Date(d.due_date)
    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return dueDate <= oneWeekFromNow && dueDate >= new Date()
  }).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-success text-success-foreground"
      case 'active': return "bg-warning text-warning-foreground" 
      case 'overdue': return "bg-destructive text-destructive-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paga'
      case 'active': return 'Ativa'
      case 'overdue': return 'Vencida'
      default: return status
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      let result
      if (editingDebt) {
        result = await updateDebt(editingDebt.id, formData)
      } else {
        result = await createDebt(formData)
      }
      
      if (!result.error) {
        setIsModalOpen(false)
        setEditingDebt(null)
      }
      
      return { error: result.error }
    } catch (error) {
      console.error('Error saving debt:', error)
      return { error: error }
    }
  }

  const handleEdit = (debt: any) => {
    setEditingDebt(debt)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (deleteDebtId) {
      await deleteDebt(deleteDebtId)
      setDeleteDebtId(null)
    }
  }

  const handlePayment = async (debtId: string, amount: number) => {
    try {
      await makePayment(debtId, amount)
      toast.success('Pagamento registrado com sucesso!')
    } catch (error) {
      console.error('Error making payment:', error)
    }
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dívidas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas obrigações financeiras</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-brand-orange hover:bg-brand-orange/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Dívida
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total em Dívidas</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalDividas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dívidas Vencidas</p>
                <p className="text-2xl font-bold text-destructive">{dividasVencidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencem em 7 dias</p>
                <p className="text-2xl font-bold text-warning">{proximosVencimentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Dívidas</p>
                <p className="text-2xl font-bold text-brand-orange">{filteredDebts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input 
              placeholder="Buscar dívida..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="loan">Empréstimo</SelectItem>
                <SelectItem value="credit_card">Cartão</SelectItem>
                <SelectItem value="financing">Financiamento</SelectItem>
                <SelectItem value="installment">Parcelamento</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paid">Paga</SelectItem>
                <SelectItem value="overdue">Vencida</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="média">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex-1"
              >
                <TableIcon className="w-4 h-4 mr-2" />
                Tabela
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className="flex-1"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Gráfico
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                {viewMode === "table" ? "Lista de Dívidas" : "Gráfico de Dívidas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando dívidas...</p>
                    </div>
                  ) : filteredDebts.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhuma dívida encontrada</p>
                    </div>
                  ) : (
                    filteredDebts.map((debt) => (
                      <div key={debt.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isOverdue(debt.due_date) ? 'bg-destructive' : debt.status === 'paid' ? 'bg-success' : 'bg-warning'}`} />
                            <div>
                              <h4 className="font-medium text-foreground">{debt.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {debt.creditor_name || debt.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className={getStatusColor(isOverdue(debt.due_date) ? 'overdue' : debt.status)}>
                            {isOverdue(debt.due_date) ? 'Vencida' : getStatusLabel(debt.status)}
                          </Badge>
                          {debt.due_date && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(debt.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-destructive">
                            R$ {Number(debt.remaining_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {debt.total_amount !== debt.remaining_amount && (
                            <p className="text-sm text-muted-foreground">
                              de R$ {Number(debt.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {debt.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="hover-scale"
                              onClick={() => handlePayment(debt.id, Number(debt.remaining_amount))}
                            >
                              Pagar
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="hover-scale"
                            onClick={() => handleEdit(debt)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="hover-scale"
                            onClick={() => setDeleteDebtId(debt.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="h-80">
                  <ChartContainer config={{
                    valor: {
                      label: "Valor",
                      color: "hsl(var(--brand-orange))",
                    },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="valor" fill="hsl(var(--brand-orange))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={{
                  financiamento: {
                    label: "Financiamento",
                    color: "hsl(var(--brand-orange))",
                  },
                  cartao: {
                    label: "Cartão",
                    color: "hsl(var(--destructive))",
                  },
                  emprestimo: {
                    label: "Empréstimo",
                    color: "hsl(var(--warning))",
                  },
                  parcelamento: {
                    label: "Parcelamento",
                    color: "hsl(var(--success))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DebtFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        initialData={editingDebt}
        mode={editingDebt ? 'edit' : 'create'}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteDebtId}
        onClose={() => setDeleteDebtId(null)}
        onConfirm={handleDelete}
        title="Excluir Dívida"
        description="Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Dividas