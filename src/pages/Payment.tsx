import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import InputMask from "react-input-mask";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  QrCode, 
  Receipt, 
  ArrowLeft, 
  Check, 
  Smartphone,
  Clock,
  Users,
  Banknote,
  Shield
} from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");

  // Detecta se é CPF (11 dígitos) ou CNPJ (14 dígitos)
  const getDocumentMask = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length <= 11 ? '999.999.999-99' : '99.999.999/9999-99';
  };

  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle');

  const plans = {
    basico: {
      name: "Básico",
      monthlyPrice: 19.99,
      yearlyPrice: 179.90,
      features: [
        "Sistema web com gráficos interativos",
        "Controle via WhatsApp (texto, áudio, imagem)",
        "Transações ilimitadas via WhatsApp",
        "Até 3 contas bancárias vinculadas",
        "Lembretes automáticos",
        "Exportação de dados (Excel, PDF)",
        "Suporte prioritário"
      ]
    },
    genio: {
      name: "Gênio",
      monthlyPrice: 45.99,
      yearlyPrice: 413.90,
      features: [
        "Tudo do Plano Básico",
        "Contas bancárias ilimitadas",
        "Gestão compartilhada avançada",
        "+1 usuário grátis",
        "Alertas personalizados por membro",
        "Dashboard em tempo real",
        "Suporte humanizado VIP"
      ]
    }
  };

  const selectedPlan = planId ? plans[planId as keyof typeof plans] : null;
  const currentPrice = selectedPlan && cycle 
    ? (cycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice)
    : 0;
  const equivalentMonthlyPrice = cycle === 'yearly' && selectedPlan 
    ? selectedPlan.yearlyPrice / 12 
    : null;

  const paymentMethods = [
    {
      id: "pix",
      name: "PIX",
      icon: <QrCode className="w-6 h-6" />,
      description: "Pagamento instantâneo",
      processingTime: "Imediato"
    },
    {
      id: "credit-card",
      name: "Cartão de Crédito",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Visa, Mastercard, Elo",
      processingTime: "Até 2 dias úteis"
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      icon: <Receipt className="w-6 h-6" />,
      description: "Vencimento em 3 dias",
      processingTime: "Até 3 dias úteis"
    }
  ];

  useEffect(() => {
    if (!planId || !cycle || !selectedPlan) {
      navigate('/');
    }
  }, [planId, cycle, selectedPlan, navigate]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para continuar");
        navigate('/auth');
        return;
      }

      toast.success("Redirecionando para o pagamento...");
      
      // Call Stripe checkout
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planType: planId,
          cycle: cycle
        }
      });
      
      if (error) {
        console.error('Stripe error:', error);
        toast.error("Erro ao processar pagamento. Tente novamente.");
        return;
      }
      
      if (data?.url) {
        // Try different approaches to escape iframe restrictions
        try {
          // Method 1: Open in parent window
          window.open(data.url, '_parent');
        } catch (error) {
          try {
            // Method 2: Open in top window
            window.open(data.url, '_top');
          } catch (error2) {
            // Method 3: Regular new window as fallback
            window.open(data.url, '_blank', 'noopener,noreferrer');
          }
        }
      } else {
        toast.error("URL de pagamento não encontrada");
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Finalizar Assinatura</h1>
            <p className="text-muted-foreground">Escolha sua forma de pagamento</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Plano */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📌 Plano {selectedPlan.name}
                  {planId === 'genio' && (
                    <Badge className="bg-orange-600">Mais Popular</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Cobrança {cycle === 'monthly' ? 'mensal' : 'anual'}
                  {cycle === 'yearly' && (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      -25% desconto
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    R$ {currentPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-muted-foreground">
                    /{cycle === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                
                {equivalentMonthlyPrice && (
                  <p className="text-sm text-green-600 font-medium">
                    Equivale a R$ {equivalentMonthlyPrice.toFixed(2).replace('.', ',')}/mês
                  </p>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3 text-green-600">✅ Recursos inclusos:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {selectedPlan.features.length > 5 && (
                      <li className="text-sm text-muted-foreground">
                        E mais {selectedPlan.features.length - 5} recursos...
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Garantias */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Garantias
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    7 dias de garantia incondicional
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Cancele quando quiser
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Dados seguros e criptografados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Suporte especializado
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Formas de Pagamento */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
                <CardDescription>
                  Escolha como deseja pagar sua assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPaymentMethod === method.id 
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20' 
                        : ''
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="text-orange-600">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Processamento: {method.processingTime}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === method.id
                          ? 'border-orange-600 bg-orange-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados de Cobrança</CardTitle>
                <CardDescription>
                  Informações para emissão da nota fiscal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" placeholder="Seu sobrenome" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  >
                    {(inputProps: any) => (
                      <Input
                        {...inputProps}
                        id="phone"
                        placeholder="(11) 99999-9999"
                        className="w-full"
                      />
                    )}
                  </InputMask>
                </div>
                <div>
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <InputMask
                    mask={getDocumentMask(document)}
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                  >
                    {(inputProps: any) => (
                      <Input
                        {...inputProps}
                        id="document"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        className="w-full"
                      />
                    )}
                  </InputMask>
                </div>
              </CardContent>
            </Card>

            {/* Botão de Pagamento */}
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || isProcessing}
            >
              {isProcessing ? (
                "Processando..."
              ) : (
                `Pagar R$ ${currentPrice.toFixed(2).replace('.', ',')}`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao finalizar o pagamento, você concorda com nossos{' '}
              <span className="text-orange-600 cursor-pointer hover:underline">
                Termos de Uso
              </span>{' '}
              e{' '}
              <span className="text-orange-600 cursor-pointer hover:underline">
                Política de Privacidade
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}