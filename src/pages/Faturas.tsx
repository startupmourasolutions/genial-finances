import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DollarSign, Calendar, CreditCard, Mail, QrCode, FileText, Download, Eye, Loader2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscriberData } from "@/hooks/useSubscriberData";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentSettingsModal } from "@/components/PaymentSettingsModal";

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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { subscriberData, invoices, loading, error, refreshData } = useSubscriberData();
  const isMobile = useIsMobile();

  // Configurações de pagamento (em produção viriam do banco)
  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethod: "Cartão de Crédito",
    dueDay: 11
  });

  // Definir método de pagamento com base na assinatura
  const [paymentMethod, setPaymentMethod] = useState(paymentSettings.paymentMethod);
  const [billingEmail, setBillingEmail] = useState("");

  useEffect(() => {
    if (profile?.email) {
      setBillingEmail(profile.email);
    }
  }, [profile]);

  // Fatura atual (mais recente com status pendente ou a primeira da lista)
  const currentInvoice = invoices.find(inv => inv.status === 'pendente') || invoices[0];

  // Calcular datas de fechamento e vencimento com base nas configurações
  const calculateBillingDates = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Vencimento baseado na configuração do usuário
    let dueDate = new Date(currentYear, currentMonth, paymentSettings.dueDay);
    
    // Se já passou o dia de vencimento, próximo vencimento é mês que vem
    if (today.getDate() > paymentSettings.dueDay) {
      dueDate = new Date(currentYear, currentMonth + 1, paymentSettings.dueDay);
    }
    
    // Fechamento é 5 dias antes do vencimento
    const closeDate = new Date(dueDate);
    closeDate.setDate(closeDate.getDate() - 5);
    
    return { closeDate, dueDate };
  };

  const { closeDate, dueDate } = calculateBillingDates();
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Últimas 12 faturas ordenadas por data de emissão (mais recente primeiro)
  const last12Invoices = invoices
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
    .slice(0, 12);

  // Handler para salvar configurações
  const handleSaveSettings = (settings: { paymentMethod: string; dueDay: number }) => {
    setPaymentSettings(settings);
    setPaymentMethod(settings.paymentMethod);
    
    // Aqui você faria a chamada para salvar no banco de dados
    // await supabase.from('user_settings').update({ payment_settings: settings })
    
    toast({
      title: "Configurações atualizadas",
      description: "Suas preferências foram salvas com sucesso.",
    });
  };


  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className={`ml-2 ${isMobile ? 'text-sm' : ''}`}>Carregando dados da assinatura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center text-red-600">
          <p className={isMobile ? 'text-sm' : ''}>Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailDialogOpen(true);
  };

  const processPayment = () => {
    toast({
      title: "Pagamento Processado", 
      description: `Fatura ${selectedInvoice?.invoice_number} paga com sucesso`
    });
    setIsPaymentDialogOpen(false);
    setSelectedInvoice(null);
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
    <div className={`w-full space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Minhas Faturas</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsSettingsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configurações de Pagamento
        </Button>
      </div>

      {/* Fatura em Destaque */}
      {currentInvoice && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Fatura Atual
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={refreshData}
              >
                <Loader2 className="w-4 h-4" />
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                <div className={`flex items-center ${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(currentInvoice.amount)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge className={`${getStatusBadgeColor(currentInvoice.status)} ${isMobile ? 'text-base' : 'text-lg'} px-3 py-1`}>
                  {getStatusLabel(currentInvoice.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {currentInvoice.status === 'paga' ? 'Paga em' : isOverdue(currentInvoice.due_date) ? 'Venceu em' : 'Vence em'}
                </Label>
                <div className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'}`}>
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Data de Fechamento</Label>
                <div className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(currentInvoice.issue_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                <p className="text-xs text-muted-foreground">Gerada 5 dias antes do vencimento</p>
              </div>
            </div>

            {/* Só mostra botão de pagar se não for cartão de crédito ou se não tiver assinatura ativa */}
            {currentInvoice.status === 'pendente' && (!subscriberData?.subscribed || paymentMethod !== 'Cartão de Crédito') && (
              <div className="mt-6">
                <Button 
                  size={isMobile ? "default" : "lg"}
                  onClick={() => handlePayInvoice(currentInvoice)}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar Fatura
                </Button>
              </div>
            )}
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
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Plano Ativo</Label>
                <div className="text-lg font-semibold text-green-600">
                  {subscriberData.subscription_tier || 'Premium'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Método de Pagamento</Label>
                <div className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'}`}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Cartão de Crédito
                </div>
              </div>
              
              {subscriberData.subscription_end && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Próxima Cobrança</Label>
                  <div className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'}`}>
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
          {isMobile ? (
            // Layout para mobile - Cards em vez de tabela
            <div className="space-y-4">
              {last12Invoices.map((invoice) => (
                <Card key={invoice.id} className={`${invoice.id === currentInvoice?.id ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Número</p>
                          <p className="font-semibold">{invoice.invoice_number}</p>
                        </div>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Descrição</p>
                          <p className="text-sm">{invoice.description}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Vencimento</p>
                          <p className="text-sm">{format(new Date(invoice.due_date), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Valor</p>
                        <p className="text-lg font-bold text-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(invoice.amount)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        {invoice.status === 'pendente' && (!subscriberData?.subscribed || paymentMethod !== 'Cartão de Crédito') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePayInvoice(invoice)}
                            className="flex-1"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pagar
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Layout desktop - Tabela normal
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
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(invoice.amount)}
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
                        onClick={() => handleViewInvoice(invoice)}
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
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes da Fatura */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedInvoice && (
              <>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Número</Label>
                    <p className="font-medium">{selectedInvoice.invoice_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge className={getStatusBadgeColor(selectedInvoice.status)}>
                      {getStatusLabel(selectedInvoice.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                    <p className="text-lg font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(selectedInvoice.amount)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Moeda</Label>
                    <p>{selectedInvoice.currency}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Emissão</Label>
                    <p>{format(new Date(selectedInvoice.issue_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Vencimento</Label>
                    <p>{format(new Date(selectedInvoice.due_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  {selectedInvoice.payment_date && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Data de Pagamento</Label>
                        <p>{format(new Date(selectedInvoice.payment_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Método de Pagamento</Label>
                        <p>{selectedInvoice.payment_method || 'Não informado'}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedInvoice.description && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                    <p className="p-3 bg-muted rounded-md">{selectedInvoice.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
      {/* Modal de Configurações de Pagamento */}
      <PaymentSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentSettings={paymentSettings}
        onSave={handleSaveSettings}
      />
    </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}