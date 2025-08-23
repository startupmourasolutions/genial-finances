import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, BarChart3, Users, PiggyBank, TrendingUp, ArrowRight, LogIn, MessageSquare, Clock, Banknote, Smartphone, Target, Brain, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { TopNavigation } from "@/components/TopNavigation";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelection = (planId: string) => {
    navigate(`/payment?plan=${planId}&cycle=${billingCycle}`);
  };

  const handleTrialSignup = () => {
    navigate('/auth?trial=true');
  };

  const whatsAppUrl = "https://wa.me/5591985389056?text=" + encodeURIComponent("Olá! Gostaria de conhecer mais sobre o Gênio Financeiro.");

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-background dark:via-blue-950/20 dark:to-indigo-950/30">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-fade-in">
                  Tenha um <span className="text-primary">assessor pessoal</span> trabalhando <span className="text-primary">24 horas por dia</span> pra você
                </h1>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ASSISTENTE</p>
                    <p className="text-xs text-muted-foreground">via WhatsApp</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">SITE PRO</p>
                    <p className="text-xs text-muted-foreground">Plataforma web</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">INTEGRADO</p>
                    <p className="text-xs text-muted-foreground">Sistema completo</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg animate-scale-in" onClick={handleTrialSignup}>
                Quero ter meu assessor!
              </Button>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Placeholder para 3 telefones mostrando o app */}
                <div className="flex space-x-4">
                  <div className="w-24 h-48 bg-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-white text-xs text-center p-2">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      WhatsApp
                    </div>
                  </div>
                  <div className="w-24 h-48 bg-gray-800 rounded-xl flex items-center justify-center -mt-4">
                    <div className="text-white text-xs text-center p-2">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                      Dashboard
                    </div>
                  </div>
                  <div className="w-24 h-48 bg-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-white text-xs text-center p-2">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      Relatórios
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sem Esforço Section */}
      <section className="w-full py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Sem esforço
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 opacity-90">
            Com o Gênio Financeiro, você não precisa mais se preocupar com planilhas, anotações ou lembrar de todas as suas movimentações financeiras. 
            Nosso assistente inteligente trabalha 24 horas por dia para você, organizando tudo automaticamente.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">IA Avançada</h3>
              <p className="text-sm opacity-80">Inteligência artificial que aprende seus padrões</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Automático</h3>
              <p className="text-sm opacity-80">Tudo funciona sem você precisar fazer nada</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Seguro</h3>
              <p className="text-sm opacity-80">Seus dados protegidos com criptografia avançada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Controle Financeiro + Compromissos Section */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 shadow-lg hover-scale">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Badge className="mb-4 bg-blue-100 text-blue-800">CONTROLE</Badge>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Tenha controle financeiro sem complicação
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Nosso sistema foi desenvolvido para pessoas que querem ter controle total das finanças, 
                    mas não têm tempo para ficar fazendo planilhas e anotações manuais.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lançamentos automáticos via WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Relatórios inteligentes e visuais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Análise de padrões de gastos</span>
                    </li>
                  </ul>
                </div>
                <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📱 Foto do controle financeiro</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-lg hover-scale">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Badge className="mb-4 bg-purple-100 text-purple-800">LEMBRETES</Badge>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Nunca mais esqueça seus compromissos
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    O Gênio te avisa sobre todas as contas a pagar, recebimentos esperados e metas financeiras 
                    diretamente no seu WhatsApp, no momento certo.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Alertas personalizados no WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lembretes de vencimentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Acompanhamento de metas</span>
                    </li>
                  </ul>
                </div>
                <div className="w-48 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xs">📱 Foto dos compromissos</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">WHATSAPP</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Registre tudo no WhatsApp
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Mande uma mensagem, áudio ou foto e o Gênio organiza tudo automaticamente. 
                É como ter um assistente pessoal que nunca dorme.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Por texto</h4>
                    <p className="text-sm text-muted-foreground">Digite: "Gastei 50 reais no supermercado"</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Por áudio</h4>
                    <p className="text-sm text-muted-foreground">Fale naturalmente sobre seus gastos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Por foto</h4>
                    <p className="text-sm text-muted-foreground">Tire foto da nota fiscal ou recibo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📱 Screenshot do WhatsApp com conversas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Profissional */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">💻 Screenshot do Dashboard</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-blue-100 text-blue-800">DASHBOARD</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Painel profissional
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Acesse sua plataforma web com gráficos interativos, relatórios detalhados e 
                visão completa da sua vida financeira.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Gráficos interativos em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Relatórios customizáveis e exportáveis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Análises preditivas e insights inteligentes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Acesso de qualquer dispositivo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compartilhe Acesso */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-800">COLABORATIVO</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Compartilhe acesso com outras pessoas
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Ideal para casais, famílias ou equipes. Cada pessoa pode acessar e contribuir 
                com as informações financeiras, mantendo tudo sincronizado.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span>Múltiplos usuários simultâneos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span>Permissões personalizadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span>Sincronização em tempo real</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-purple-600">👥 Screenshots de usuários compartilhados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias Personalizadas */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                <span className="text-orange-600">🏷️ Screenshots das categorias</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-orange-100 text-orange-800">PERSONALIZAÇÃO</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Categorias personalizadas
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Organize seus gastos da forma que faz sentido para você. Crie categorias 
                customizadas e veja exatamente para onde vai seu dinheiro.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span>Categorias ilimitadas e editáveis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Subcategorias para detalhamento</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Cores e ícones personalizados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Metas por categoria</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lançamentos Editáveis */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-100 text-red-800">FLEXIBILIDADE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Lançamentos editáveis
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Errou algo? Sem problema! Todos os lançamentos podem ser editados, corrigidos 
                ou até mesmo deletados quando necessário.
              </p>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">✏️ Edição completa</h4>
                  <p className="text-sm text-muted-foreground">Modifique valor, categoria, data e descrição</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">🔄 Histórico de alterações</h4>
                  <p className="text-sm text-muted-foreground">Veja todas as modificações feitas</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">🗑️ Exclusão segura</h4>
                  <p className="text-sm text-muted-foreground">Delete lançamentos com confirmação</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                <span className="text-red-600">✏️ Screenshots da edição</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integração Google Agenda */}
      <section className="w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/30">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800">INTEGRAÇÃO</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Integração com Google Agenda
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Todos os seus compromissos financeiros aparecem automaticamente na sua agenda do Google. 
            Nunca mais perca um vencimento importante.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sincronização automática</h3>
              <p className="text-sm text-muted-foreground">Seus compromissos financeiros aparecem na agenda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lembretes inteligentes</h3>
              <p className="text-sm text-muted-foreground">Notificações no momento certo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Planejamento integrado</h3>
              <p className="text-sm text-muted-foreground">Veja tudo em um só lugar</p>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-96 h-64 bg-white rounded-lg shadow-lg flex items-center justify-center border">
              <span className="text-gray-600">📅 Screenshot da integração com Google Agenda</span>
            </div>
          </div>

          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4" onClick={handleTrialSignup}>
            Conectar minha agenda
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="w-full py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Clientes que <span className="text-yellow-300">transformaram</span> suas vidas com o Assessor
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Mais de 10.000 pessoas já revolucionaram suas finanças com nosso sistema. 
            Seja a próxima história de sucesso.
          </p>
          
          {/* Seção de depoimentos - placeholder */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
              <p className="text-sm mb-4">"Revolucionou minha vida financeira completamente!"</p>
              <p className="font-semibold">Maria Silva</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
              <p className="text-sm mb-4">"Nunca mais esqueci de pagar uma conta."</p>
              <p className="font-semibold">João Santos</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
              <p className="text-sm mb-4">"O melhor investimento que já fiz."</p>
              <p className="font-semibold">Ana Costa</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button size="lg" variant="secondary" className="px-12 py-4 text-lg bg-white text-green-600 hover:bg-gray-100" onClick={handleTrialSignup}>
              Começar agora - 7 dias grátis
            </Button>
            <p className="text-sm opacity-80">Sem compromisso • Cancele a qualquer momento</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Gênio Financeiro</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seu assessor pessoal trabalhando 24 horas por dia para transformar sua vida financeira.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href={whatsAppUrl} target="_blank" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(91) 98538-9056</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>suporte@geniofinanceiro.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Gênio Financeiro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}