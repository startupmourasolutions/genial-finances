import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { DebtFormModal } from "@/components/DebtFormModal";
import { DebtPaymentHistoryModal } from "@/components/DebtPaymentHistoryModal";
import { useDebts } from "@/hooks/useDebts";
import { Plus, Filter, BarChart3, Table as TableIcon, AlertTriangle, Calendar, DollarSign, Edit, Trash2, CreditCard } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
const Dividas = () => {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<any>(null);
  const [deleteDebtId, setDeleteDebtId] = useState<string | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedDebtForHistory, setSelectedDebtForHistory] = useState<any>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    debts,
    categories,
    debtPayments,
    loading,
    createDebt,
    updateDebt,
    deleteDebt,
    makePayment
  } = useDebts();

  // Filter debts
  const filteredDebts = debts.filter(debt => {
    const matchesSearch = !searchFilter || debt.title.toLowerCase().includes(searchFilter.toLowerCase()) || debt.categories?.name && debt.categories.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || debt.category_id === categoryFilter;
    const matchesStatus = statusFilter === "all" || debt.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const chartData = filteredDebts.map(debt => ({
    name: debt.title,
    valor: Number(debt.total_amount || 0),
    status: debt.status
  }));

  // Group debts by category for pie chart
  const debtsByCategory = filteredDebts.reduce((acc, debt) => {
    const category = debt.categories?.name || 'Sem categoria';
    acc[category] = (acc[category] || 0) + Number(debt.total_amount || 0);
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(debtsByCategory).map(([category, value], index) => ({
    name: category,
    value,
    fill: ["hsl(24, 95%, 53%)",
    // Laranja vibrante  
    "hsl(0, 84%, 60%)",
    // Vermelho
    "hsl(38, 92%, 50%)",
    // Amarelo/dourado
    "hsl(142, 76%, 36%)",
    // Verde
    "hsl(221, 83%, 53%)",
    // Azul
    "hsl(271, 81%, 56%)",
    // Roxo
    "hsl(168, 76%, 42%)" // Turquesa
    ][index % 7]
  }));
  const totalDividas = filteredDebts.reduce((sum, debt) => sum + Number(debt.total_amount || 0), 0);
  const dividasVencidas = filteredDebts.filter(d => d.due_date && new Date(d.due_date) < new Date()).length;
  const proximosVencimentos = filteredDebts.filter(d => {
    if (!d.due_date) return false;
    const dueDate = new Date(d.due_date);
    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return dueDate <= oneWeekFromNow && dueDate >= new Date();
  }).length;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-success text-success-foreground";
      case 'active':
        return "bg-warning text-warning-foreground";
      case 'overdue':
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paga';
      case 'active':
        return 'Ativa';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };
  const handleSubmit = async (formData: any) => {
    try {
      let result;
      if (editingDebt) {
        result = await updateDebt(editingDebt.id, formData);
      } else {
        result = await createDebt(formData);
      }
      if (!result.error) {
        setIsModalOpen(false);
        setEditingDebt(null);
      }
      return {
        error: result.error
      };
    } catch (error) {
      console.error('Error saving debt:', error);
      return {
        error: error
      };
    }
  };
  const handleEdit = (debt: any) => {
    setEditingDebt(debt);
    setIsModalOpen(true);
  };
  const handleDelete = async () => {
    if (deleteDebtId) {
      await deleteDebt(deleteDebtId);
      setDeleteDebtId(null);
    }
  };
  const handlePayment = async (debtId: string, amount: number) => {
    try {
      await makePayment(debtId, amount);
      toast.success('Pagamento registrado com sucesso!');
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  const handleViewHistory = (debt: any) => {
    setSelectedDebtForHistory(debt);
    setHistoryModalOpen(true);
  };
  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };
  return <div className="p-2 sm:p-4 lg:p-8 space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dívidas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gerencie e acompanhe suas obrigações financeiras</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Dívida
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6 px-[15px] py-[29px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-destructive/10 rounded-lg">
                <DollarSign className="w-4 h-4 lg:w-6 lg:h-6 text-destructive" />
              </div>
              <div className="min-w-0 flex-1 px-0 mx-0">
                <p className="text-xs lg:text-sm text-muted-foreground">Total em Dívidas</p>
                <p className="text-lg text-foreground truncate my-0 py-0 mx-px px-0 font-bold lg:text-2xl">
                  R$ {totalDividas.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 lg:w-6 lg:h-6 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Dívidas Vencidas</p>
                <p className="text-lg lg:text-2xl font-bold text-destructive">{dividasVencidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-warning/10 rounded-lg">
                <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Vencem em 7 dias</p>
                <p className="text-lg lg:text-2xl font-bold text-warning">{proximosVencimentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover-scale">
          <CardContent className="p-3 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 lg:p-3 bg-brand-orange/10 rounded-lg">
                <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-brand-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Total de Dívidas</p>
                <p className="text-lg lg:text-2xl font-bold text-brand-orange">{filteredDebts.length}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <Input placeholder="Buscar dívida..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(category => <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>)}
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
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")} className="flex-1 px-2">
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Lista</span>
              </Button>
              <Button variant={viewMode === "chart" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chart")} className="flex-1 px-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Gráfico</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {viewMode === "table" ? <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Lista de Dívidas - ocupa mais espaço no desktop */}  
          <div className="xl:col-span-3">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Lista de Dívidas</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setStatusFilter(statusFilter === "paid" ? "all" : "paid")}>
                  {statusFilter === "paid" ? "Ver Todas" : "Histórico Pagas"}
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {loading ? <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando dívidas...</p>
                    </div> : filteredDebts.length === 0 ? <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhuma dívida encontrada</p>
                    </div> : filteredDebts.map(debt => <div key={debt.id} className="p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all">
                         <div className="flex items-start justify-between gap-4">
                           <div className="flex items-start gap-3 flex-1 min-w-0">
                             {/* Indicador visual de status mais claro */}
                             <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${debt.status === 'paid' ? 'bg-green-500 shadow-lg shadow-green-500/50' : isOverdue(debt.due_date) ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'}`} />
                             
                             <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <h4 className="font-semibold text-foreground">{debt.title}</h4>
                                 <Badge variant="secondary" className={`text-xs font-medium ${debt.status === 'paid' ? 'bg-success/15 text-success border-success/30' : isOverdue(debt.due_date) ? 'bg-destructive/15 text-destructive border-destructive/30' : 'bg-warning/15 text-warning border-warning/30'}`}>
                                   {debt.status === 'paid' ? '✓ PAGA' : isOverdue(debt.due_date) ? '⚠ VENCIDA' : '⏳ PENDENTE'}
                                 </Badge>
                               </div>
                               
                               <p className="text-sm text-muted-foreground mb-2">
                                 {debt.categories?.name || debt.description}
                               </p>
                               
                               {/* Informações de pagamento mais detalhadas */}
                               <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                 {debt.due_date && <div className="flex items-center gap-1">
                                     <Calendar className="w-3 h-3" />
                                     <span className={`${isOverdue(debt.due_date) ? 'text-destructive font-medium' : ''}`}>
                                       {debt.status === 'paid' ? 'Paga em' : 'Vence em'}: {new Date(debt.due_date).toLocaleDateString('pt-BR')}
                                     </span>
                                   </div>}
                                 <div className="flex items-center gap-1">
                                   <span>Frequência: {debt.payment_frequency === 'monthly' ? 'Mensal' : debt.payment_frequency === 'weekly' ? 'Semanal' : 'Única'}</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="text-right flex-shrink-0">
                             <div className={`text-lg font-bold mb-1 ${debt.status === 'paid' ? 'text-success' : 'text-destructive'}`}>
                               R$ {Number(debt.total_amount || 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                             </div>
                             
                             <div className="flex gap-2">
                               {debt.status !== 'paid' && <Button size="sm" variant="default" className="text-xs px-3" onClick={() => handlePayment(debt.id, Number(debt.total_amount || 0))}>
                                   💳 Pagar
                                 </Button>}
                               <Button size="sm" variant="secondary" className="text-xs px-3" onClick={() => handleViewHistory(debt)}>
                                 📋 Histórico
                               </Button>
                               <Button size="sm" variant="outline" className="text-xs px-2" onClick={() => handleEdit(debt)}>
                                 <Edit className="w-3 h-3" />
                               </Button>
                               <Button size="sm" variant="destructive" className="text-xs px-2" onClick={() => setDeleteDebtId(debt.id)}>
                                 <Trash2 className="w-3 h-3" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       </div>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo lateral - mais compacto */}
          <div className="xl:col-span-1">
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Situação Atual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <p className="text-sm font-medium text-destructive">Vencidas</p>
                    </div>
                    <p className="text-2xl font-bold text-destructive">{dividasVencidas}</p>
                    <p className="text-xs text-muted-foreground">precisam atenção</p>
                  </div>
                  
                  <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-warning" />
                      <p className="text-sm font-medium text-warning">Próximos</p>
                    </div>
                    <p className="text-2xl font-bold text-warning">{proximosVencimentos}</p>
                    <p className="text-xs text-muted-foreground">em 7 dias</p>
                  </div>
                  
                  <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-success" />
                      <p className="text-sm font-medium text-success">Pagas</p>
                    </div>
                    <p className="text-2xl font-bold text-success">
                      {debts.filter(d => d.status === 'paid').length}
                    </p>
                    <p className="text-xs text-muted-foreground">este período</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="px-[9px] mx-px py-0">
                  <CardTitle className="text-lg">Por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="h-48 px-0 mx-0 py-[27px] my-[2px]">
                    <ChartContainer config={{
                  value: {
                    label: "Valor",
                    color: "hsl(var(--primary))"
                  }
                }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={60} dataKey="value">
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}`, "Valor"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="space-y-2 mt-3">
                    {pieData.slice(0, 3).map((item, index) => <div key={index} className="flex items-center justify-between text-xs px-[14px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                      backgroundColor: item.fill
                    }} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="font-medium px-[6px]">
                          R$ {Number(item.value).toLocaleString('pt-BR', {
                      minimumFractionDigits: 0
                    })}
                        </span>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div> : (/* Modo Gráfico - Layout otimizado para desktop */
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Valores por Dívida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{
              valor: {
                label: "Valor",
                color: "hsl(var(--brand-orange))"
              }
            }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}`, "Valor"]} />
                      <Bar dataKey="valor" fill="hsl(var(--brand-orange))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={{
              value: {
                label: "Valor",
                color: "hsl(var(--primary))"
              }
            }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                    name,
                    percent
                  }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}`, "Valor"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-2 mt-4">
                {pieData.map((item, index) => <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: item.fill
                }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {Number(item.value).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
                    </span>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>)}

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <DebtFormModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleSubmit} categories={categories} initialData={editingDebt} mode={editingDebt ? 'edit' : 'create'} />

      <DebtPaymentHistoryModal open={historyModalOpen} onOpenChange={setHistoryModalOpen} debt={selectedDebtForHistory} />

      <DeleteConfirmationDialog isOpen={!!deleteDebtId} onClose={() => setDeleteDebtId(null)} onConfirm={handleDelete} title="Excluir Dívida" description="Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita." />
    </div>;
};
export default Dividas;