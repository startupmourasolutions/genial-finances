import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, BarChart3, Users, PiggyBank, TrendingUp, ArrowRight, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: <PiggyBank className="h-6 w-6" />,
      title: "Controle Financeiro Completo",
      description: "Gerencie receitas, despesas e investimentos em um só lugar"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Relatórios Inteligentes",
      description: "Análises avançadas com insights baseados em IA"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Previsões Precisas",
      description: "Projete seu futuro financeiro com algoritmos avançados"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança Máxima",
      description: "Seus dados protegidos com criptografia de nível bancário"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestão Empresarial",
      description: "Ferramentas específicas para empresas e freelancers"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automação Inteligente",
      description: "Categorização automática e lembretes personalizados"
    }
  ];

  const plans = [
    {
      name: "Pessoal",
      price: "R$ 29",
      period: "/mês",
      description: "Perfeito para pessoas físicas",
      features: [
        "Controle de receitas e despesas",
        "Relatórios básicos",
        "Metas financeiras",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Empresarial",
      price: "R$ 99",
      period: "/mês",
      description: "Ideal para empresas e freelancers",
      features: [
        "Tudo do plano Pessoal",
        "Gestão de múltiplas contas",
        "Relatórios avançados com IA",
        "Controle de veículos",
        "Análise de mercado",
        "Suporte prioritário"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-orange-50/30 dark:to-orange-950/20">
        <div className="w-full max-w-none px-6 py-20 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              🚀 Novo: Dashboard com IA integrada
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              Gênio Financeiro
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A plataforma mais inteligente para gestão financeira pessoal e empresarial
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg" asChild>
                  <Link to="/dashboard">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg" asChild>
                    <Link to="/auth">
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos que transformam sua vida financeira
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra como nossa plataforma pode revolucionar a forma como você gerencia suas finanças
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-orange-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-20">
        <div className="w-full max-w-none px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece com 7 dias grátis, sem compromisso
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-orange-500 shadow-xl' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-orange-600 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/auth">
                      Começar Teste Grátis
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="w-full max-w-none px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de usuários que já revolucionaram sua vida financeira
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" asChild>
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
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              Gênio Financeiro
            </h3>
            <p className="text-muted-foreground mt-2">
              Sua gestão financeira inteligente
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Gênio Financeiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}