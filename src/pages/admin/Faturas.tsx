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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, Edit, Trash2, CalendarIcon, Receipt, DollarSign, Calendar as CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  client: {
    id: string;
    profile: {
      full_name: string;
      email: string;
    };
    company_name?: string;
  };
}

export default function Faturas() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [paymentDate, setPaymentDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    client_id: "",
    invoice_number: "",
    amount: "",
    currency: "BRL",
    status: "pendente",
    payment_method: "",
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          currency,
          due_date,
          issue_date,
          status,
          payment_method,
          payment_date,
          description,
          client:clients(
            id,
            company_name,
            profile:profiles(
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de faturas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:profiles(
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `FAT-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const invoiceData = {
        ...formData,
        client_id: selectedClient,
        amount: parseFloat(formData.amount),
        due_date: dueDate?.toISOString().split('T')[0],
        payment_date: paymentDate?.toISOString().split('T')[0] || null,
        invoice_number: formData.invoice_number || generateInvoiceNumber()
      };

      if (editingInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoice.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Fatura atualizada com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('invoices')
          .insert([invoiceData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Fatura criada com sucesso"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchInvoices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar fatura",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingInvoice(null);
    setSelectedClient("");
    setDueDate(new Date());
    setPaymentDate(undefined);
    setFormData({
      client_id: "",
      invoice_number: "",
      amount: "",
      currency: "BRL",
      status: "pendente",
      payment_method: "",
      description: ""
    });
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSelectedClient(invoice.client.id);
    setDueDate(new Date(invoice.due_date));
    setPaymentDate(invoice.payment_date ? new Date(invoice.payment_date) : undefined);
    setFormData({
      client_id: invoice.client.id,
      invoice_number: invoice.invoice_number,
      amount: invoice.amount.toString(),
      currency: invoice.currency,
      status: invoice.status,
      payment_method: invoice.payment_method || "",
      description: invoice.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fatura removida com sucesso"
      });
      fetchInvoices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover fatura",
        variant: "destructive"
      });
    }
  };

  const markAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paga',
          payment_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', invoiceId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fatura marcada como paga"
      });
      fetchInvoices();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fatura",
        variant: "destructive"
      });
    }
  };

  const handleNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client?.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.client?.company_name && invoice.client.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'paga': return 'bg-green-100 text-green-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      case 'cancelada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'paga': return 'Paga';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faturas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Fatura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? 'Editar Fatura' : 'Criar Nova Fatura'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name || client.profile?.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_number">Número da Fatura</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                  placeholder="Deixe vazio para gerar automaticamente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="paga">Paga</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Forma de Pagamento</Label>
                <Input
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  placeholder="PIX, Cartão, Boleto..."
                />
              </div>

              {formData.status === 'paga' && (
                <div className="space-y-2">
                  <Label>Data do Pagamento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={setPaymentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição dos serviços/produtos"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingInvoice ? 'Atualizar Fatura' : 'Criar Fatura'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar faturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
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
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {invoice.client?.company_name || invoice.client?.profile?.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.client?.profile?.email}
                        </div>
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
                        {invoice.status === 'pendente' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsPaid(invoice.id)}
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(invoice)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}