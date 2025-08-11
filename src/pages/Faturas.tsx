import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DollarSign, Calendar, CreditCard, Mail, QrCode, FileText, Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscriberData } from "@/hooks/useSubscriberData";
import { useAuth } from "@/hooks/useAuth";

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
  next_close_date?: string;
}


export default function Faturas() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { subscriberData, invoices, loading, error } = useSubscriberData();

  // Definir método de pagamento com base na assinatura
  const [paymentMethod, setPaymentMethod] = useState("Cartão de Crédito");
  const [billingEmail, setBillingEmail] = useState("");

  useEffect(() => {
    if (profile?.email) {
      setBillingEmail(profile.email);
    }
  }, [profile]);

  // Fatura atual (mais recente com status pendente ou a primeira da lista)
  const currentInvoice = invoices.find(inv => inv.status === 'pendente') || invoices[0];

  // Últimas 12 faturas ordenadas por data de emissão (mais recente primeiro)
  const last12Invoices = invoices
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
    .slice(0, 12);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados da assinatura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const processPayment = () => {
    toast({
      title: "Pagamento Processado", 
      description: `Fatura ${selectedInvoice?.invoice_number} paga com sucesso`
    });
    setIsPaymentDialogOpen(false);
    setSelectedInvoice(null);
  };

  const updatePaymentSettings = () => {
    toast({
      title: "Configurações Atualizadas",
      description: "Método de pagamento e email de cobrança atualizados com sucesso"
    });
  };

  const generatePIXQRCode = () => {
    toast({
      title: "QR Code PIX Gerado",
      description: "QR Code para pagamento via PIX gerado com sucesso"
    });
  };

  const downloadBoleto = () => {
    toast({
      title: "Boleto Baixado",
      description: "Boleto bancário baixado com sucesso"
    });
  };

  const sendBoletoByEmail = () => {
    toast({
      title: "Boleto Enviado",
      description: `Boleto enviado para ${billingEmail}`
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'paga': return 'bg-green-100 text-green-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Aguardando Pagamento';
      case 'paga': return 'Paga';
      case 'vencida': return 'Vencida';
      default: return status;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && currentInvoice?.status === 'pendente';
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minhas Faturas</h1>
      </div>

      {/* Fatura em Destaque */}
      {currentInvoice && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Fatura Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                <div className="flex items-center text-3xl font-bold text-primary">
                  <DollarSign className="w-6 h-6 mr-1" />
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(currentInvoice.amount)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge className={`${getStatusBadgeColor(currentInvoice.status)} text-lg px-3 py-1`}>
                  {getStatusLabel(currentInvoice.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {currentInvoice.status === 'paga' ? 'Paga em' : isOverdue(currentInvoice.due_date) ? 'Venceu em' : 'Vence em'}
                </Label>
                <div className="flex items-center text-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  {currentInvoice.status === 'paga' && currentInvoice.payment_date 
                    ? format(new Date(currentInvoice.payment_date), "dd/MM/yyyy", { locale: ptBR })
                    : format(new Date(currentInvoice.due_date), "dd/MM/yyyy", { locale: ptBR })
                  }
                </div>
                {isDueSoon(currentInvoice.due_date) && currentInvoice.status === 'pendente' && (
                  <p className="text-sm text-orange-600 font-medium">Vence em breve!</p>
                )}
                {isOverdue(currentInvoice.due_date) && (
                  <p className="text-sm text-red-600 font-medium">Fatura vencida!</p>
                )}
              </div>

              {subscriberData?.subscription_end && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Próximo Fechamento</Label>
                  <div className="flex items-center text-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(subscriberData.subscription_end), "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </div>
              )}
            </div>

            {/* Só mostra botão de pagar se não for cartão de crédito ou se não tiver assinatura ativa */}
            {currentInvoice.status === 'pendente' && (!subscriberData?.subscribed || paymentMethod !== 'Cartão de Crédito') && (
              <div className="mt-6">
                <Button 
                  size="lg" 
                  onClick={() => handlePayInvoice(currentInvoice)}
                  className="w-full md:w-auto"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar Fatura
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configurações de Pagamento - Só mostra se não for cartão de crédito */}
      {subscriberData && !subscriberData.subscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Método de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Boleto">Boleto Bancário</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {paymentMethod === 'Boleto' && (
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Email para Cobrança</Label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{billingEmail}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button onClick={updatePaymentSettings} variant="outline">
                Atualizar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status da Assinatura para usuários com cartão de crédito */}
      {subscriberData && subscriberData.subscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Plano Ativo</Label>
                <div className="text-lg font-semibold text-green-600">
                  {subscriberData.subscription_tier || 'Premium'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Método de Pagamento</Label>
                <div className="flex items-center text-lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Cartão de Crédito
                </div>
              </div>
              
              {subscriberData.subscription_end && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Próxima Cobrança</Label>
                  <div className="flex items-center text-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(subscriberData.subscription_end), "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Portal do Cliente",
                  description: "Redirecionando para o portal de gerenciamento..."
                });
              }}>
                Gerenciar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturas (Últimos 12 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {last12Invoices.map((invoice) => (
                <TableRow key={invoice.id} className={invoice.id === currentInvoice?.id ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
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
                      {/* Só mostra botão de pagar se não for cartão de crédito ou se não tiver assinatura ativa */}
                      {invoice.status === 'pendente' && (!subscriberData?.subscribed || paymentMethod !== 'Cartão de Crédito') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePayInvoice(invoice)}
                          title="Pagar"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Pagamento */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagar Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">Fatura: {selectedInvoice?.invoice_number}</h3>
              <p className="text-lg font-bold mt-2">
                {selectedInvoice && new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(selectedInvoice.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Vencimento: {selectedInvoice && format(new Date(selectedInvoice.due_date), "dd/MM/yyyy")}
              </p>
            </div>

            <div className="space-y-3">
              <Label>Método de Pagamento: {paymentMethod}</Label>
              
              {paymentMethod === 'PIX' && (
                <div className="space-y-3">
                  <Button onClick={generatePIXQRCode} className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code PIX
                  </Button>
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <QrCode className="w-24 h-24 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-muted-foreground">QR Code será gerado aqui</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'Boleto' && (
                <div className="space-y-3">
                  <Button onClick={downloadBoleto} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Boleto
                  </Button>
                  <Button onClick={sendBoletoByEmail} variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Boleto por Email
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Será enviado para: {billingEmail}
                  </p>
                </div>
              )}

              {paymentMethod === 'Cartão de Crédito' && (
                <div className="space-y-3">
                  <Button onClick={processPayment} className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar com Cartão
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Você será redirecionado para o ambiente seguro de pagamento
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}