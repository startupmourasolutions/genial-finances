import { useState } from "react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, Edit, Trash2, CalendarIcon, Receipt, DollarSign, Calendar as CalendarCheck, Users, FileText, CreditCard, Mail, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  phone: string;
  subscription_plan: string;
  monthly_fee: number;
  status: string;
  payment_method: string;
  billing_email: string;
  due_day: number;
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
}

// Dados mockados de clientes
const mockClients: Client[] = [
  {
    id: "1",
    full_name: "João Silva Santos",
    email: "joao.silva@empresa1.com.br",
    company_name: "Empresa ABC Ltda",
    phone: "+55 11 99999-1111",
    subscription_plan: "Premium",
    monthly_fee: 59.90,
    status: "ativo",
    payment_method: "PIX",
    billing_email: "financeiro@empresa1.com.br",
    due_day: 10
  },
  {
    id: "2", 
    full_name: "Maria Oliveira Lima",
    email: "maria.oliveira@empresa2.com.br",
    company_name: "Tech Solutions S.A.",
    phone: "+55 11 99999-2222",
    subscription_plan: "Basic",
    monthly_fee: 29.90,
    status: "ativo",
    payment_method: "Boleto",
    billing_email: "cobranca@techsolutions.com.br",
    due_day: 5
  },
  {
    id: "3",
    full_name: "Carlos Roberto Souza", 
    email: "carlos.souza@empresa3.com.br",
    company_name: "Consultoria XYZ",
    phone: "+55 11 99999-3333",
    subscription_plan: "Premium",
    monthly_fee: 59.90,
    status: "suspenso",
    payment_method: "Cartão de Crédito",
    billing_email: "carlos.souza@empresa3.com.br",
    due_day: 15
  },
  {
    id: "4",
    full_name: "Ana Paula Costa",
    email: "ana.costa@empresa4.com.br", 
    company_name: "Digital Marketing Pro",
    phone: "+55 11 99999-4444",
    subscription_plan: "Basic",
    monthly_fee: 29.90,
    status: "trial",
    payment_method: "PIX",
    billing_email: "ana.costa@empresa4.com.br",
    due_day: 20
  },
  {
    id: "5",
    full_name: "Pedro Henrique Alves",
    email: "pedro.alves@empresa5.com.br",
    company_name: "Construções PDH", 
    phone: "+55 11 99999-5555",
    subscription_plan: "Premium",
    monthly_fee: 59.90,
    status: "ativo",
    payment_method: "Boleto",
    billing_email: "financeiro@construcoespdh.com.br",
    due_day: 1
  }
];

// Dados mockados de faturas
const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    invoice_number: "FAT-202401-0001",
    amount: 59.90,
    currency: "BRL",
    due_date: "2024-03-10",
    issue_date: "2024-02-10",
    status: "pendente",
    payment_method: "PIX",
    description: "Mensalidade Premium - Fevereiro/2024",
    client_id: "1"
  },
  {
    id: "inv2", 
    invoice_number: "FAT-202401-0002",
    amount: 29.90,
    currency: "BRL",
    due_date: "2024-03-05",
    issue_date: "2024-02-05",
    status: "paga",
    payment_method: "Boleto",
    payment_date: "2024-03-03",
    description: "Mensalidade Basic - Fevereiro/2024",
    client_id: "2"
  },
  {
    id: "inv3",
    invoice_number: "FAT-202401-0003", 
    amount: 59.90,
    currency: "BRL",
    due_date: "2024-02-15",
    issue_date: "2024-01-15",
    status: "vencida",
    payment_method: "Cartão de Crédito",
    description: "Mensalidade Premium - Janeiro/2024",
    client_id: "3"
  },
  {
    id: "inv4",
    invoice_number: "FAT-202401-0004",
    amount: 29.90,
    currency: "BRL", 
    due_date: "2024-03-20",
    issue_date: "2024-02-20",
    status: "pendente",
    payment_method: "PIX",
    description: "Mensalidade Basic - Fevereiro/2024",
    client_id: "4"
  },
  {
    id: "inv5",
    invoice_number: "FAT-202401-0005",
    amount: 59.90,
    currency: "BRL",
    due_date: "2024-03-01",
    issue_date: "2024-02-01", 
    status: "paga",
    payment_method: "Boleto",
    payment_date: "2024-02-28",
    description: "Mensalidade Premium - Fevereiro/2024",
    client_id: "5"
  },
  {
    id: "inv6",
    invoice_number: "FAT-202401-0006",
    amount: 59.90,
    currency: "BRL",
    due_date: "2024-04-10",
    issue_date: "2024-03-10",
    status: "pendente",
    payment_method: "PIX", 
    description: "Mensalidade Premium - Março/2024",
    client_id: "1"
  }
];

export default function Faturas() {
  const [view, setView] = useState<"faturas" | "clientes">("faturas");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newBillingEmail, setNewBillingEmail] = useState("");
  const [newDueDay, setNewDueDay] = useState<number>(1);
  const { toast } = useToast();

  const getClient = (clientId: string) => {
    return mockClients.find(c => c.id === clientId);
  };

  const getClientInvoices = (clientId: string) => {
    return mockInvoices.filter(inv => inv.client_id === clientId);
  };

  const filteredInvoices = mockInvoices.filter(invoice => {
    const client = getClient(invoice.client_id);
    return invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client?.company_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredClients = mockClients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayForClient = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleManageClient = (client: Client) => {
    setSelectedClient(client);
    setNewPaymentMethod(client.payment_method);
    setNewBillingEmail(client.billing_email);
    setNewDueDay(client.due_day);
    setIsClientDialogOpen(true);
  };

  const handleViewClientDetails = (client: Client) => {
    setSelectedClientForView(client);
  };

  const processPayment = () => {
    toast({
      title: "Pagamento Processado",
      description: `Fatura ${selectedInvoice?.invoice_number} paga com sucesso pelo administrador`
    });
    setIsPaymentDialogOpen(false);
    setSelectedInvoice(null);
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
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'suspenso': return 'bg-red-100 text-red-800';
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
      case 'ativo': return 'Ativo';
      case 'suspenso': return 'Suspenso';
      case 'trial': return 'Trial';
      default: return status;
    }
  };

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
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const client = getClient(invoice.client_id);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client?.company_name}</div>
                          <div className="text-sm text-muted-foreground">{client?.full_name}</div>
                          <div className="text-sm text-muted-foreground">{client?.email}</div>
                        </div>
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
                        {format(new Date(invoice.due_date), "dd/MM/yyyy")}
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
                            onClick={() => client && handleManageClient(client)}
                            title="Gerenciar cliente"
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
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.company_name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.full_name}</div>
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.subscription_plan}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(client.monthly_fee)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(client.status)}>
                        {getStatusLabel(client.status)}
                      </Badge>
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
                ))}
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
                Cliente: {getClient(selectedInvoice?.client_id || "")?.company_name}
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
                  <div><span className="font-medium">Empresa:</span> {selectedClientForView?.company_name}</div>
                  <div><span className="font-medium">Responsável:</span> {selectedClientForView?.full_name}</div>
                  <div><span className="font-medium">Email:</span> {selectedClientForView?.email}</div>
                  <div><span className="font-medium">Telefone:</span> {selectedClientForView?.phone}</div>
                  <div><span className="font-medium">Plano:</span> {selectedClientForView?.subscription_plan}</div>
                  <div><span className="font-medium">Mensalidade:</span> {selectedClientForView && new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(selectedClientForView.monthly_fee)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações de Cobrança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><span className="font-medium">Forma de Pagamento:</span> {selectedClientForView?.payment_method}</div>
                  <div><span className="font-medium">Email de Cobrança:</span> {selectedClientForView?.billing_email}</div>
                  <div><span className="font-medium">Dia de Vencimento:</span> Dia {selectedClientForView?.due_day}</div>
                  <div><span className="font-medium">Status:</span> 
                    <Badge className={`ml-2 ${getStatusBadgeColor(selectedClientForView?.status || "")}`}>
                      {getStatusLabel(selectedClientForView?.status || "")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimas Faturas</CardTitle>
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
                      <TableRow key={invoice.id}>
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
    </div>
  );
}