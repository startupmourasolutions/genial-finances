import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Shield, TrendingUp, 
         Smartphone, Calendar, MessageSquare, CreditCard, 
         BarChart3, Target, PiggyBank, Receipt, Car, 
         CheckCircle2, Facebook, Instagram, Linkedin, 
         Youtube, Mail, MapPin, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCTAClick = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Gênio Financeiro.', '_blank');
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/src/assets/genio-logo.png" 
                alt="Gênio Financeiro" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Como Funciona
              </a>
              <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contato
              </a>
              <Button 
                onClick={handleCTAClick} 
                className="bg-brand-blue hover:bg-brand-blue-glow text-white font-medium px-6 py-2 rounded-lg transition-all hover-scale"
              >
                Começar Agora
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Recursos
                </a>
                <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Como Funciona
                </a>
                <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Dashboard
                </a>
                <Button onClick={handleCTAClick} className="bg-brand-blue text-white w-full">
                  Começar Agora
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit text-sm">
                  Nova versão disponível
                </Badge>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Gerencie suas 
                  <span className="text-brand-blue"> finanças </span>
                  de forma 
                  <span className="text-brand-orange"> simples </span>
                  e inteligente
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Controle total das suas finanças pessoais e empresariais. 
                  Relatórios automáticos, integração WhatsApp e muito mais.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleCTAClick}
                  className="bg-brand-blue hover:bg-brand-blue-glow text-white font-medium px-8 py-4 text-lg transition-all hover-scale rounded-lg"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg hover-scale rounded-lg border-border"
                >
                  Ver Demonstração
                </Button>
              </div>
            </div>
            
            <div className="relative">
              {/* Placeholder for hero image/screenshot */}
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-2xl p-8 border border-border aspect-[4/3] flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto">
                    <BarChart3 className="w-10 h-10 text-brand-blue" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    [Placeholder para imagem do aplicativo]
                  </p>
                  <p className="text-sm text-muted-foreground opacity-70">
                    Screenshot principal do dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Integration Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-r from-accent/5 to-brand-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Veja como é fácil registrar transações pelo WhatsApp
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Registre suas transações de forma rápida e prática diretamente pelo WhatsApp. 
              Sem complicações, sem burocracias.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Placeholder for mobile app screenshot */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-border/20 aspect-[9/16] max-w-sm mx-auto flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-brand-green" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    [Screenshot da conversa WhatsApp]
                  </p>
                  <p className="text-xs text-muted-foreground opacity-70">
                    Interface de registro via WhatsApp
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Como funciona o Monitoramento
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-lg">Envie uma mensagem</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Digite sua transação de forma natural pelo WhatsApp. 
                      Ex: "Almoço R$ 25,00" ou "Recebi R$ 500,00 consultoria"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-lg">Processamento inteligente</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Nossa IA categoriza automaticamente e registra a transação 
                      no sistema sem erros
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-lg">Relatório atualizado</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Veja em tempo real no dashboard todas as informações 
                      organizadas e categorizadas
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCTAClick}
                className="bg-brand-green hover:bg-brand-green/90 text-white font-medium px-8 py-3 hover-scale rounded-lg"
              >
                Testar Gratuitamente
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Visualize suas finanças com um só olhar
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dashboard completo com análises detalhadas, gráficos intuitivos e relatórios 
              profissionais para tomada de decisões estratégicas.
            </p>
          </div>
          
          <div className="relative">
            {/* Placeholder for dashboard screenshot */}
            <div className="bg-gradient-to-br from-secondary/30 to-secondary/50 rounded-2xl p-8 border border-border aspect-[16/9] flex items-center justify-center shadow-2xl">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto">
                  <BarChart3 className="w-12 h-12 text-brand-blue" />
                </div>
                <p className="text-lg text-muted-foreground font-medium">
                  [Screenshot do Dashboard Completo]
                </p>
                <p className="text-sm text-muted-foreground opacity-70">
                  Interface principal com relatórios e gráficos
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-brand-green mb-2">R$ 5.350,00</div>
                <div className="text-sm text-muted-foreground">Receitas do Mês</div>
                <div className="text-xs text-brand-green mt-1">↗ +12% vs mês anterior</div>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-destructive mb-2">R$ 3.763,25</div>
                <div className="text-sm text-muted-foreground">Despesas do Mês</div>
                <div className="text-xs text-destructive mt-1">↗ +5% vs mês anterior</div>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-brand-blue mb-2">R$ 1.586,75</div>
                <div className="text-sm text-muted-foreground">Saldo Atual</div>
                <div className="text-xs text-brand-green mt-1">↗ +8% vs mês anterior</div>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-brand-orange mb-2">70,3%</div>
                <div className="text-sm text-muted-foreground">Margem de Lucro</div>
                <div className="text-xs text-brand-green mt-1">↗ +3% vs mês anterior</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Tudo o que você precisa para controlar suas finanças
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos completos para gestão financeira pessoal e empresarial
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Dashboard Intuitivo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize todas as suas informações financeiras de forma clara, 
                  organizada e em tempo real.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                  <Users className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Controle de Acesso</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gerencie diferentes perfis de usuário com permissões 
                  específicas para cada equipe.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                  <Receipt className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Categorias Personalizadas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Organize suas transações com categorias customizadas 
                  para seu tipo de negócio.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                  <MessageSquare className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Integração WhatsApp</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registre transações diretamente pelo WhatsApp de forma 
                  rápida, prática e automatizada.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                  <Calendar className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Google Calendar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sincronize lembretes de pagamentos e compromissos 
                  financeiros automaticamente.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                  <Target className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Metas Financeiras</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Defina e acompanhe o progresso das suas metas 
                  financeiras com relatórios detalhados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue via-brand-blue-glow to-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-brand-blue-glow/95"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Simples de usar, poderoso nos resultados
          </h2>
          <p className="text-lg lg:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Comece hoje mesmo a transformar a gestão das suas finanças. 
            Milhares de usuários já confiam no Gênio Financeiro.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleCTAClick}
              className="px-10 py-4 text-lg font-semibold hover-scale bg-white text-brand-blue hover:bg-gray-50"
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-10 py-4 text-lg font-semibold hover-scale border-white/30 text-white hover:bg-white/10"
            >
              Falar com Consultor
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="mt-16 grid grid-cols-3 gap-8 opacity-80">
            <div className="text-center">
              <div className="text-2xl font-bold">5.000+</div>
              <div className="text-sm opacity-75">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99,9%</div>
              <div className="text-sm opacity-75">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-75">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-6">
              <img 
                src="/src/assets/genio-logo.png" 
                alt="Gênio Financeiro" 
                className="h-8 w-auto"
              />
              <p className="text-gray-300 leading-relaxed">
                Transformando a gestão financeira com tecnologia, 
                inteligência artificial e simplicidade.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-gray-400 hover:text-brand-orange cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                <Youtube className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Produto</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Suporte</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Contato</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-brand-blue" />
                  <span>contato@geniofinanceiro.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brand-green" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-brand-orange" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gênio Financeiro. Todos os direitos reservados. | 
              <a href="#" className="hover:text-white transition-colors ml-2">Política de Privacidade</a> | 
              <a href="#" className="hover:text-white transition-colors ml-2">Termos de Uso</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}