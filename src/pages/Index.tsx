import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, BarChart3, Users, PiggyBank, TrendingUp, ArrowRight, LogIn, MessageSquare, Clock, Banknote, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelection = (planId: string) => {
    // Redireciona para tela de pagamento quando vem da escolha de plano
    navigate(`/payment?plan=${planId}&cycle=${billingCycle}`);
  };

  const handleTrialSignup = () => {
    // Redireciona para cadastro normal com 7 dias grátis
    navigate('/auth?trial=true');
  };

  const features = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Controle via WhatsApp",
      description: "Gerencie suas finanças por texto, áudio e imagem no WhatsApp"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Gráficos Interativos",
      description: "Sistema web com relatórios visuais e análises detalhadas"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Lembretes Automáticos",
      description: "Alertas de contas a pagar/receber direto no seu WhatsApp"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestão Compartilhada",
      description: "Perfeito para casais, famílias e equipes"
    },
    {
      icon: <Banknote className="h-6 w-6" />,
      title: "Contas Ilimitadas",
      description: "Conecte múltiplas contas bancárias e cartões"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Suporte Humanizado",
      description: "Atendimento VIP por WhatsApp e ligação"
    }
  ];

  const plans = [
    {
      id: "basico",
      name: "Básico",
      monthlyPrice: 19.99,
      yearlyPrice: 179.90,
      description: "Perfeito para gestão financeira pessoal",
      features: [
        "Sistema web com gráficos interativos e gestão financeira",
        "Controle de gastos via WhatsApp (texto, áudio e imagem)",
        "Transações ilimitadas via WhatsApp",
        "Categorias personalizáveis para organização",
        "Até 3 contas bancárias vinculadas",
        "Lembretes automáticos de contas a pagar/receber (WhatsApp)",
        "Gestão individual ou compartilhada (ex: casais)",
        "Exportação de dados (Excel, PDF)",
        "Suporte prioritário por WhatsApp e ligação"
      ],
      popular: false
    },
    {
      id: "genio",
      name: "Gênio",
      monthlyPrice: 45.99,
      yearlyPrice: 413.90,
      description: "Ideal para famílias e equipes",
      features: [
        "Tudo do Plano Básico",
        "Contas bancárias ilimitadas",
        "Gestão compartilhada avançada (ideal para famílias ou times)",
        "+1 usuário grátis (adicione membros sem custo extra)",
        "Alertas personalizados por membro (cada um recebe no seu WhatsApp)",
        "Dashboard centralizado e atualizado em tempo real para todos",
        "Suporte humanizado VIP (WhatsApp e ligação)"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/20">
        <div className="w-full max-w-none px-6 py-20 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-blue-700 bg-clip-text text-transparent font-inter">
              Gênio Financeiro
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-inter">
              A plataforma mais inteligente para gestão financeira pessoal e empresarial
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-3 text-lg font-inter" asChild>
                  <Link to="/dashboard">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-3 text-lg font-inter" asChild>
                    <Link to="/auth">
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-inter" asChild>
                    <Link to="/auth">
                      <LogIn className="mr-2 h-5 w-5" />
                      Fazer Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-muted/30">
        <div className="w-full max-w-none px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter">
              Recursos que transformam sua vida financeira
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
              Descubra como nossa plataforma pode revolucionar a forma como você gerencia suas finanças
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 font-inter">{feature.title}</h3>
                <p className="text-muted-foreground font-inter">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-20">
        <div className="w-full max-w-none px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter">
              Planos do Sistema de Gestão Financeira
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-inter">
              Escolha entre mensal ou anual (25% de desconto)
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-inter ${billingCycle === 'monthly' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                Mensal
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 p-1"
              >
                <div className={`absolute w-6 h-6 bg-primary rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
              </Button>
              <span className={`text-lg font-inter ${billingCycle === 'yearly' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                Anual
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">-25%</Badge>
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const equivalentMonthlyPrice = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : null;
              
              return (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary font-inter">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2 font-inter">
                      📌 Plano {plan.name}
                    </CardTitle>
                    <CardDescription className="text-base font-inter">{plan.description}</CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold font-inter">
                          R$ {currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-muted-foreground font-inter">
                          /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && equivalentMonthlyPrice && (
                        <p className="text-sm text-green-600 font-medium font-inter">
                          Equivale a R$ {equivalentMonthlyPrice.toFixed(2).replace('.', ',')}/mês
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600 font-inter">✅ Inclui:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="text-green-600 mr-2 text-sm">✔</span>
                            <span className="text-sm leading-relaxed font-inter">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full font-inter ${plan.popular ? 'bg-primary hover:bg-blue-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handlePlanSelection(plan.id)}
                    >
                      Escolher Plano - Pagar Agora
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="w-full max-w-none px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl mb-8 opacity-90 font-inter">
            Junte-se a milhares de usuários que já revolucionaram sua vida financeira
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-inter" asChild>
            <Link to="/auth">
              Começar Agora - Grátis por 7 dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-muted/30">
        <div className="w-full max-w-none px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent font-inter">
              Gênio Financeiro
            </h3>
            <p className="text-muted-foreground mt-2 font-inter">
              Sua gestão financeira inteligente
            </p>
          </div>
          <p className="text-sm text-muted-foreground font-inter">
            © 2024 Gênio Financeiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}