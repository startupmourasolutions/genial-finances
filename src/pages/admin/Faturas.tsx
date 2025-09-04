import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, Edit, Trash2, CalendarIcon, Receipt, DollarSign, Calendar as CalendarCheck, Users, FileText, CreditCard, Mail, Clock, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  subscription_plan: string | null;
  monthly_fee: number | null;
  subscription_status: string;
  subscription_active: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  created_at: string;
  payment_method?: string;
  billing_email?: string;
  due_day?: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  issue_date: string;
  status: string;
  payment_method?: string;
  payment_date?: string;
  description?: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_company?: string;
  client_plan?: string;
}


export default function Faturas() {
  const [view, setView] = useState<"faturas" | "clientes">("faturas");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [selectedInvoiceInDetail, setSelectedInvoiceInDetail] = useState<Invoice | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newBillingEmail, setNewBillingEmail] = useState("");
  const [newDueDay, setNewDueDay] = useState<number>(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Buscar clientes reais
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select(`
        id,
        company_name,
        subscription_plan,
        subscription_status,
        subscription_active,
        monthly_fee,
        trial_start_date,
        trial_end_date,
        created_at,
        profiles!clients_profile_id_fkey(
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (clientsError) {
      console.error('Erro ao buscar clientes:', clientsError);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } else if (clientsData) {
      const formattedClients = clientsData.map(client => ({
        id: client.id,
        full_name: client.profiles?.full_name || 'Sem nome',
        email: client.profiles?.email || '',
        phone: client.profiles?.phone || null,
        company_name: client.company_name,
        subscription_plan: client.subscription_plan,
        monthly_fee: client.monthly_fee,
        subscription_status: client.subscription_status || 'trial',
        subscription_active: client.subscription_active || false,
        trial_start_date: client.trial_start_date,
        trial_end_date: client.trial_end_date,
        created_at: client.created_at,
        payment_method: 'PIX', // Default
        billing_email: client.profiles?.email || '',
        due_day: 10 // Default
      }));
      setClients(formattedClients);
    }

    // Buscar faturas reais
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients!invoices_client_id_fkey(
          id,
          company_name,
          subscription_plan,
          profiles!clients_profile_id_fkey(
            full_name,
            email
          )
        )
      `)
      .order('issue_date', { ascending: false });

    if (invoicesError) {
      console.error('Erro ao buscar faturas:', invoicesError);
      toast({
        title: "Erro",
        description: "Erro ao carregar faturas",
        variant: "destructive"
      });
    } else if (invoicesData) {
      const formattedInvoices = invoicesData.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        amount: typeof invoice.amount === 'string' ? parseFloat(invoice.amount) : invoice.amount,
        currency: invoice.currency || 'BRL',
        due_date: invoice.due_date,
        issue_date: invoice.issue_date,
        status: invoice.status || 'pendente',
        payment_method: invoice.payment_method,
        payment_date: invoice.payment_date,
        description: invoice.description,
        client_id: invoice.client_id,
        client_name: invoice.clients?.profiles?.full_name || 'Sem nome',
        client_email: invoice.clients?.profiles?.email || '',
        client_company: invoice.clients?.company_name || 'Sem empresa',
        client_plan: invoice.clients?.subscription_plan || 'Sem plano'
      }));
      setInvoices(formattedInvoices);
    }

    setLoading(false);
  };

  // Função para verificar status do trial
  const getTrialStatus = (client: Client) => {
    if (!client.trial_end_date) return null;
    
    const now = new Date();
    const trialEnd = new Date(client.trial_end_date);
    const daysLeft = differenceInDays(trialEnd, now);
    
    if (daysLeft < 0) {
      return { expired: true, daysLeft: 0 };
    }
    
    return { expired: false, daysLeft };
  };

  const getClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const getClientInvoices = (clientId: string) => {
    return invoices.filter(inv => inv.client_id === clientId);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    return invoice.invoice_number?.toLowerCase().includes(searchLower) ||
           invoice.client_name?.toLowerCase().includes(searchLower) ||
           invoice.client_company?.toLowerCase().includes(searchLower) ||
           invoice.client_email?.toLowerCase().includes(searchLower);
  });

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return client.full_name?.toLowerCase().includes(searchLower) ||
           (client.company_name?.toLowerCase() || '').includes(searchLower) ||
           client.email?.toLowerCase().includes(searchLower);
  });

  const handlePayForClient = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleManageClient = (client: Client) => {
    setSelectedClient(client);
    setNewPaymentMethod(client.payment_method || 'PIX');
    setNewBillingEmail(client.billing_email || client.email);
    setNewDueDay(client.due_day || 10);
    setIsClientDialogOpen(true);
  };

  const handleViewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoiceForDetail(invoice);
    setIsInvoiceDetailOpen(true);
  };

  const handleViewClientDetails = (client: Client) => {
    setSelectedClientForView(client);
    // Sempre abrir com a fatura mais atual (mais recente)
    const clientInvoices = getClientInvoices(client.id);
    const latestInvoice = clientInvoices.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())[0];
    setSelectedInvoiceInDetail(latestInvoice || null);
  };

  const processPayment = async () => {
    if (!selectedInvoice) return;
    
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paga',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Administrador'
      })
      .eq('id', selectedInvoice.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Pagamento Processado", 
        description: `Fatura ${selectedInvoice?.invoice_number} paga com sucesso pelo administrador`
      });
      setIsPaymentDialogOpen(false);
      setSelectedInvoice(null);
      fetchData(); // Recarregar dados
    }
  };

  const updateClientSettings = () => {
    toast({
      title: "Configurações Atualizadas",
      description: `Dados do cliente ${selectedClient?.company_name} atualizados com sucesso`
    });
    setIsClientDialogOpen(false);
    setSelectedClient(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'paga': return 'bg-green-100 text-green-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      case 'cancelada': return 'bg-gray-100 text-gray-800';
      case 'active': case 'ativo': return 'bg-green-100 text-green-800';
      case 'suspended': case 'suspenso': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'paga': return 'Paga';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      case 'active': case 'ativo': return 'Ativo';
      case 'suspended': case 'suspenso': return 'Suspenso';
      case 'trial': return 'Trial';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Faturas e Clientes</h1>
        <div className="flex gap-2">
          <Button 
            variant={view === "faturas" ? "default" : "outline"}
            onClick={() => setView("faturas")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Faturas
          </Button>
          <Button 
            variant={view === "clientes" ? "default" : "outline"}
            onClick={() => setView("clientes")}
          >
            <Users className="w-4 h-4 mr-2" />
            Clientes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder={view === "faturas" ? "Buscar faturas..." : "Buscar clientes..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {view === "faturas" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Forma Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Fechamento</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const closingDate = subDays(new Date(invoice.due_date), 5);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.client_company || 'Sem empresa'}</div>
                          <div className="text-sm text-muted-foreground">{invoice.client_name}</div>
                          <div className="text-sm text-muted-foreground">{invoice.client_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invoice.client_plan || 'Sem plano'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{invoice.payment_method || 'Não definido'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(invoice.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(closingDate, "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(invoice.due_date), "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {(invoice.status === 'pendente' || invoice.status === 'vencida') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePayForClient(invoice)}
                              title="Pagar pelo cliente"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          )}
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => handleViewInvoiceDetails(invoice)}
                             title="Ver detalhes da fatura"
                           >
                             <Eye className="w-4 h-4" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Mensalidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const trialStatus = getTrialStatus(client);
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.company_name || 'Pessoa Física'}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.full_name}</div>
                          <div className="text-sm text-muted-foreground">{client.phone || 'Sem telefone'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.subscription_plan || 'Sem plano'}</Badge>
                      </TableCell>
                      <TableCell>
                        {client.monthly_fee ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(client.monthly_fee) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusBadgeColor(client.subscription_status)}>
                            {getStatusLabel(client.subscription_status)}
                          </Badge>
                          {trialStatus && client.subscription_status === 'trial' && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-yellow-600" />
                              <span className={`text-xs ${trialStatus.expired ? 'text-red-600 font-semibold' : trialStatus.daysLeft <= 1 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                {trialStatus.expired 
                                  ? 'Trial Expirado!' 
                                  : trialStatus.daysLeft === 0 
                                  ? 'Último dia de trial'
                                  : `${trialStatus.daysLeft} dias restantes`}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewClientDetails(client)}
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManageClient(client)}
                            title="Gerenciar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para pagamento pelo admin */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagar Fatura pelo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">Fatura: {selectedInvoice?.invoice_number}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cliente: {selectedInvoice?.client_company || selectedInvoice?.client_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Plano: {selectedInvoice?.client_plan || 'Sem plano'}
              </p>
              <p className="text-sm text-muted-foreground">
                Forma de Pagamento: {selectedInvoice?.payment_method || 'Não definido'}
              </p>
              <p className="text-lg font-bold mt-2">
                {selectedInvoice && new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(selectedInvoice.amount)}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Ao confirmar, esta fatura será marcada como paga pelo administrador.
              O cliente será notificado sobre o pagamento.
            </div>
            <div className="flex gap-2">
              <Button onClick={processPayment} className="flex-1">
                <CreditCard className="w-4 h-4 mr-2" />
                Confirmar Pagamento
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">{selectedClient?.company_name}</h3>
              <p className="text-sm text-muted-foreground">{selectedClient?.full_name}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_method">Forma de Pagamento</Label>
              <Select value={newPaymentMethod} onValueChange={setNewPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_email">Email de Cobrança</Label>
              <Input
                value={newBillingEmail}
                onChange={(e) => setNewBillingEmail(e.target.value)}
                placeholder="Email para envio de faturas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_day">Dia de Vencimento</Label>
              <Select value={newDueDay.toString()} onValueChange={(value) => setNewDueDay(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>Dia {day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={updateClientSettings} className="flex-1">
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar detalhes do cliente */}
      <Dialog open={!!selectedClientForView} onOpenChange={(open) => !open && setSelectedClientForView(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente - {selectedClientForView?.company_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-2">
                    <div><span className="font-medium">Empresa:</span> {selectedClientForView?.company_name || 'Pessoa Física'}</div>
                    <div><span className="font-medium">Responsável:</span> {selectedClientForView?.full_name}</div>
                    <div><span className="font-medium">Email:</span> {selectedClientForView?.email}</div>
                    <div><span className="font-medium">Telefone:</span> {selectedClientForView?.phone || 'Não informado'}</div>
                    <div><span className="font-medium">Plano:</span> {selectedClientForView?.subscription_plan || 'Sem plano'}</div>
                    <div><span className="font-medium">Mensalidade:</span> {selectedClientForView?.monthly_fee ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(selectedClientForView.monthly_fee) : '-'}</div>
                    {(() => {
                      const trialStatus = selectedClientForView ? getTrialStatus(selectedClientForView) : null;
                      if (trialStatus && selectedClientForView?.subscription_status === 'trial') {
                        return (
                          <div className="pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <AlertCircle className={`w-4 h-4 ${trialStatus.expired ? 'text-red-600' : 'text-yellow-600'}`} />
                              <span className={`font-medium ${trialStatus.expired ? 'text-red-600' : 'text-yellow-600'}`}>
                                {trialStatus.expired 
                                  ? 'Trial Expirado!' 
                                  : `Trial: ${trialStatus.daysLeft} dias restantes`}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Cobrança</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-2">
                    <div><span className="font-medium">Forma de Pagamento:</span> {selectedClientForView?.payment_method || 'Não definido'}</div>
                    <div><span className="font-medium">Email de Cobrança:</span> {selectedClientForView?.billing_email || selectedClientForView?.email}</div>
                    <div><span className="font-medium">Dia de Vencimento:</span> Dia {selectedClientForView?.due_day || 10}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusBadgeColor(selectedClientForView?.subscription_status || "")}`}>
                        {getStatusLabel(selectedClientForView?.subscription_status || "")}
                      </Badge>
                    </div>
                  </CardContent>
              </Card>
            </div>

            {/* Fatura em Destaque */}
            {selectedInvoiceInDetail && (
              <Card className="border-2 border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Fatura Selecionada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(selectedInvoiceInDetail.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">Valor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">
                        <Badge className={getStatusBadgeColor(selectedInvoiceInDetail.status)}>
                          {getStatusLabel(selectedInvoiceInDetail.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">
                        {selectedInvoiceInDetail.status === 'vencida' ? 'Venceu em' : 
                         selectedInvoiceInDetail.status === 'paga' ? 'Pago em' : 'Vence em'}: 
                        <br />{format(new Date(selectedInvoiceInDetail.due_date), "dd/MM/yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedInvoiceInDetail.status === 'vencida' ? 'Vencimento' : 
                         selectedInvoiceInDetail.status === 'paga' ? 'Pagamento' : 'Vencimento'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">
                        Próxima: {selectedClientForView?.due_day}/
                        {format(new Date(), "MM/yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">Próximo Fechamento</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClientForView && getClientInvoices(selectedClientForView.id).map((invoice) => (
                      <TableRow 
                        key={invoice.id}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          selectedInvoiceInDetail?.id === invoice.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                        onClick={() => setSelectedInvoiceInDetail(invoice)}
                      >
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(invoice.amount)}
                        </TableCell>
                        <TableCell>{format(new Date(invoice.due_date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{invoice.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para detalhes da fatura */}
      <Dialog open={isInvoiceDetailOpen} onOpenChange={setIsInvoiceDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Fatura</DialogTitle>
          </DialogHeader>
          {selectedInvoiceForDetail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações da Fatura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><span className="font-medium">Número:</span> {selectedInvoiceForDetail.invoice_number}</div>
                    <div><span className="font-medium">Valor:</span> {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(selectedInvoiceForDetail.amount)}</div>
                    <div><span className="font-medium">Fechamento:</span> {format(subDays(new Date(selectedInvoiceForDetail.due_date), 5), "dd/MM/yyyy")}</div>
                    <div><span className="font-medium">Vencimento:</span> {format(new Date(selectedInvoiceForDetail.due_date), "dd/MM/yyyy")}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusBadgeColor(selectedInvoiceForDetail.status)}`}>
                        {getStatusLabel(selectedInvoiceForDetail.status)}
                      </Badge>
                    </div>
                    {selectedInvoiceForDetail.payment_date && (
                      <div><span className="font-medium">Data Pagamento:</span> {format(new Date(selectedInvoiceForDetail.payment_date), "dd/MM/yyyy")}</div>
                    )}
                    <div><span className="font-medium">Forma de Pagamento:</span> {selectedInvoiceForDetail.payment_method}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><span className="font-medium">Empresa:</span> {selectedInvoiceForDetail.client_company || 'Pessoa Física'}</div>
                    <div><span className="font-medium">Responsável:</span> {selectedInvoiceForDetail.client_name}</div>
                    <div><span className="font-medium">Email:</span> {selectedInvoiceForDetail.client_email}</div>
                    <div><span className="font-medium">Plano:</span> {selectedInvoiceForDetail.client_plan || 'Sem plano'}</div>
                  </CardContent>
                </Card>
              </div>

              {selectedInvoiceForDetail.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedInvoiceForDetail.description}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsInvoiceDetailOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}