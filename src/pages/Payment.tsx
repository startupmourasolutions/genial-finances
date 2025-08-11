import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import InputMask from "react-input-mask";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  QrCode, 
  Receipt, 
  ArrowLeft, 
  Check, 
  Shield,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  
  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleAuth = () => {
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    setIsProcessing(true);
    
    try {
      toast.success("Redirecionando para o pagamento...");
      
      // Call Stripe checkout SEM autenticação prévia
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planType: planId,
          cycle: cycle,
          email: email // Passar o email do step 1
        }
      });
      
      if (error) {
        console.error('Stripe error:', error);
        toast.error("Erro ao processar pagamento. Tente novamente.");
        return;
      }
      
      if (data?.url) {
        // Abrir janela do Stripe
        const paymentWindow = window.open(
          data.url, 
          'stripe_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,location=yes'
        );
        
        if (paymentWindow) {
          // Monitorar a janela para detectar quando o pagamento foi concluído
          const checkClosed = setInterval(() => {
            try {
              if (paymentWindow.closed) {
                clearInterval(checkClosed);
                // Aguardar um pouco antes de processar para garantir que o pagamento foi processado
                setTimeout(() => {
                  createAccountAndLogin();
                }, 2000);
              } else {
                // Verificar se voltou para nossa página de sucesso
                try {
                  const currentUrl = paymentWindow.location.href;
                  if (currentUrl.includes('/auth?payment=success') || 
                      currentUrl.includes('localhost:3000') ||
                      currentUrl.includes('lovableproject.com')) {
                    paymentWindow.close();
                    clearInterval(checkClosed);
                    createAccountAndLogin();
                  }
                } catch (e) {
                  // Erro de CORS é normal quando está no Stripe
                }
              }
            } catch (error) {
              // Continuar monitorando
            }
          }, 1000);
          
        } else {
          // Fallback se popup foi bloqueado
          toast.error("Popup bloqueado. Abrindo na mesma janela...");
          window.location.href = data.url;
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

  const createAccountAndLogin = async () => {
    try {
      toast.success("Pagamento confirmado! Criando sua conta...");
      
      // Criar conta com email e senha do step 1
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (signupError) {
        console.error('Signup error:', signupError);
        // Se der erro de "já existe", tenta fazer login
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (loginError) {
          toast.error("Erro ao criar conta. Tente novamente.");
          return;
        }
        
        // Se fez login com sucesso, usar os dados do login
        if (loginData.user) {
          await createClientAndInvoice(loginData.user.id);
        }
      } else if (authData.user) {
        // Se criou conta com sucesso, usar os dados da criação
        await createClientAndInvoice(authData.user.id);
      }
      
      toast.success("Conta criada e fatura gerada com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Account creation error:', error);
      toast.error("Erro ao criar conta. Entre em contato com o suporte.");
    }
  };

  const createClientAndInvoice = async (userId: string) => {
    try {
      // Buscar o perfil do usuário (criado automaticamente pelo trigger)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        throw new Error('Perfil não encontrado');
      }

      // Criar registro de cliente
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          profile_id: profile.id,
          client_type: 'personal',
          subscription_active: true,
          subscription_plan: planId,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: cycle === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          monthly_fee: cycle === 'monthly' ? currentPrice : currentPrice / 12
        })
        .select()
        .single();

      if (clientError) {
        throw new Error(`Erro ao criar cliente: ${clientError.message}`);
      }

      // Criar fatura como paga
      const today = new Date().toISOString().split('T')[0];
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          client_id: client.id,
          amount: currentPrice,
          due_date: today,
          issue_date: today,
          payment_date: today,
          status: 'pago',
          payment_method: selectedPaymentMethod,
          description: `Assinatura ${selectedPlan.name} - ${cycle === 'monthly' ? 'Mensal' : 'Anual'}`,
          invoice_number: `INV-${Date.now()}`,
          currency: 'BRL',
          created_by: userId
        });

      if (invoiceError) {
        throw new Error(`Erro ao criar fatura: ${invoiceError.message}`);
      }

      console.log('Cliente e fatura criados com sucesso');
      
    } catch (error) {
      console.error('Erro ao criar cliente e fatura:', error);
      throw error;
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`${currentStep === 1 ? 'max-w-md' : 'max-w-6xl'} mx-auto px-6 py-8`}>
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
            <p className="text-muted-foreground">
              {currentStep === 1 ? 'Preencha seus dados de acesso' : 'Escolha sua forma de pagamento'}
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              <User className="w-4 h-4" />
            </div>
            <div className={`h-px w-16 ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-6">
              <div>
                <Label htmlFor="auth-email" className="text-lg">E-mail</Label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent text-lg py-3 focus:border-orange-600"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="auth-password" className="text-lg">Senha</Label>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent text-lg py-3 focus:border-orange-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="auth-confirm-password" className="text-lg">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent text-lg py-3 focus:border-orange-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {email && password && confirmPassword && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleAuth}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                    disabled={authLoading}
                  >
                    {authLoading ? "Processando..." : "Próximo →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
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

            {/* Checkout */}
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

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Voltar
                </button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing}
                >
                  {isProcessing ? (
                    "Processando..."
                  ) : (
                    `Pagar R$ ${currentPrice.toFixed(2).replace('.', ',')}`
                  )}
                </Button>
              </div>

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
        )}
      </div>
    </div>
  );
}