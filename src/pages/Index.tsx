import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Shield, TrendingUp, 
         Smartphone, Calendar, MessageSquare, CreditCard, 
         BarChart3, Target, PiggyBank, Receipt, Car, 
         CheckCircle2, Facebook, Instagram, Linkedin, 
         Youtube, Mail, MapPin, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { WhatsAppAnimation } from "@/components/WhatsAppAnimation";

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
              <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Planos
              </a>
              <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contato
              </a>
              <Link to="/payment?plan=basico&cycle=monthly">
                <Button 
                  className="bg-brand-blue hover:bg-brand-blue-glow text-white font-medium px-6 py-2 rounded-lg transition-all hover-scale"
                >
                  Começar Agora
                </Button>
              </Link>
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
                <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Planos
                </a>
              <Link to="/payment?plan=basico&cycle=monthly">
                <Button className="bg-brand-blue text-white w-full">
                  Começar Agora
                </Button>
              </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Logo/Brand */}
              <div className="animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                <h1 className="font-poppins text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span 
                    className="bg-gradient-to-r from-brand-blue via-brand-orange to-brand-green bg-clip-text text-transparent animate-text-gradient"
                    style={{ 
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Gênio
                  </span>
                  <br />
                  <span className="text-black font-poppins font-bold">Financeiro</span>
                </h1>
              </div>

              {/* Tagline */}
              <div className="animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
                <h2 className="font-poppins text-xl lg:text-2xl xl:text-3xl font-normal text-black leading-relaxed">
                  Simples de usar, poderoso nos resultados
                </h2>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start gap-3 group hover:scale-105 transition-transform duration-200">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-blue mt-2"></div>
                  <p className="font-poppins text-black font-medium">Controle total de entradas e saídas</p>
                </div>
                <div className="flex items-start gap-3 group hover:scale-105 transition-transform duration-200">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                  <p className="font-poppins text-black font-medium">Relatórios automáticos e inteligentes</p>
                </div>
                <div className="flex items-start gap-3 group hover:scale-105 transition-transform duration-200">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-orange mt-2"></div>
                  <p className="font-poppins text-black font-medium">Lembretes para não esquecer prazos</p>
                </div>
                <div className="flex items-start gap-3 group hover:scale-105 transition-transform duration-200">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-blue mt-2"></div>
                  <p className="font-poppins text-black font-medium">Integração direta com WhatsApp</p>
                </div>
                <div className="flex items-start gap-3 group hover:scale-105 transition-transform duration-200 sm:col-span-2">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                  <p className="font-poppins text-black font-medium">Gestão pessoal e empresarial em um só lugar</p>
                </div>
              </div>

              {/* CTA Statement */}
              <div className="animate-fade-in-right" style={{ animationDelay: '0.8s' }}>
                <p className="font-poppins text-lg lg:text-xl text-black font-bold border-l-4 border-brand-orange pl-6 py-2 bg-gradient-to-r from-brand-orange/5 to-transparent rounded">
                  Mais do que uma ferramenta: um parceiro financeiro que nunca descansa.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-scale-in-bounce" style={{ animationDelay: '1s' }}>
                <Link to="#planos">
                  <Button 
                    size="lg" 
                    className="bg-black hover:bg-gray-800 text-white font-poppins font-normal px-8 py-4 text-lg transition-all hover-scale rounded-lg shadow-xl"
                  >
                    Ver Planos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in-right scale-75" style={{ animationDelay: '0.3s' }}>
              <WhatsAppAnimation />
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
              
              <Link to="/payment?plan=basico&cycle=monthly">
                <Button 
                  className="bg-brand-green hover:bg-brand-green/90 text-white font-medium px-8 py-3 hover-scale rounded-lg"
                >
                  Começar Agora
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Features Detailed Section */}
      <section id="recursos" className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Conheça todas as funcionalidades
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos completos para gestão financeira pessoal e empresarial
            </p>
          </div>

          {/* Feature 1: Dashboard Intuitivo */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Dashboard Intuitivo e Completo
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Visualize todas as suas informações financeiras de forma clara, organizada e em tempo real. 
                  Gráficos intuitivos, métricas importantes e uma interface que facilita a tomada de decisões.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Relatórios visuais em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Métricas personalizáveis por perfil</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Alertas inteligentes de gastos</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 rounded-2xl p-8 border border-border aspect-[4/3] flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto">
                    <BarChart3 className="w-10 h-10 text-brand-blue" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    [GIF: Dashboard em ação]
                  </p>
                  <p className="text-sm text-muted-foreground opacity-70">
                    Demonstração interativa do dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: WhatsApp Integration */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-brand-green/5 to-brand-green/10 rounded-2xl p-8 border border-border aspect-[4/3] flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageSquare className="w-10 h-10 text-brand-green" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    [GIF: Registro via WhatsApp]
                  </p>
                  <p className="text-sm text-muted-foreground opacity-70">
                    Processo de registro de transação
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Gênio no WhatsApp
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Registre transações, dívidas e configure lembretes diretamente pelo WhatsApp. 
                  Nossa IA processa suas mensagens e organiza tudo automaticamente no sistema.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Registro de transações via mensagem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Cadastro de dívidas e parcelamentos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Lembretes automáticos de vencimentos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Processamento por inteligência artificial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Financial Goals */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Metas Financeiras Inteligentes
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Defina e acompanhe suas metas financeiras com progresso em tempo real. 
                  Receba notificações e sugestões personalizadas para alcançar seus objetivos.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Acompanhamento visual do progresso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Notificações inteligentes de progresso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Sugestões personalizadas de economia</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-orange/5 to-brand-orange/10 rounded-2xl p-8 border border-border aspect-[4/3] flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="w-10 h-10 text-brand-orange" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    [GIF: Metas em ação]
                  </p>
                  <p className="text-sm text-muted-foreground opacity-70">
                    Criação e acompanhamento de metas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Multi-Profile Management */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 rounded-2xl p-8 border border-border aspect-[4/3] flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-10 h-10 text-brand-blue" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    [GIF: Gestão de perfis]
                  </p>
                  <p className="text-sm text-muted-foreground opacity-70">
                    Alternando entre perfis e permissões
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Gestão Multi-Perfil Avançada
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Gerencie diferentes perfis de usuário com permissões específicas. 
                  Ideal para empresas que precisam controlar acesso às informações financeiras.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Controle granular de permissões</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Perfis personalizados por função</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                  <span className="text-foreground">Auditoria completa de acessos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Summary */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              E muito mais funcionalidades
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra todos os recursos que fazem do Gênio a melhor escolha
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
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                  <CreditCard className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Registro de Dívida</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registre e acompanhe suas dívidas através do WhatsApp 
                  ou dashboard com controle total de vencimentos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                  <Calendar className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Lembretes Inteligentes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receba lembretes automáticos de pagamentos e 
                  vencimentos através do WhatsApp e dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gradient-to-br from-secondary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Escolha o plano ideal para você
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme sua gestão financeira com os recursos que você precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Básico */}
            <Card className="relative hover-scale group border-2 border-border">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground">Básico</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-foreground">R$ 14,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">ou R$ 134,10/ano (25% desconto)</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Sistema web com gráficos interativos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Controle via WhatsApp (texto, áudio, imagem)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Transações ilimitadas via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Até 3 contas bancárias vinculadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Lembretes automáticos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Exportação de dados (Excel, PDF)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Suporte prioritário</span>
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <Link to="/payment?plan=basico&cycle=monthly">
                    <Button className="w-full bg-brand-blue hover:bg-brand-blue-glow text-white font-medium">
                      Começar com Plano Mensal
                    </Button>
                  </Link>
                  <Link to="/payment?plan=basico&cycle=yearly">
                    <Button variant="outline" className="w-full border-brand-green text-brand-green hover:bg-brand-green/10">
                      Economizar com Plano Anual
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Plano Gênio */}
            <Card className="relative hover-scale group border-2 border-brand-orange shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-orange text-white px-4 py-1">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground">Gênio</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-foreground">R$ 45,99</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">ou R$ 413,90/ano (25% desconto)</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Tudo do Plano Básico</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Contas bancárias ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Gestão compartilhada avançada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">+1 usuário grátis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Alertas personalizados por membro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Dashboard em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    <span className="text-foreground">Suporte humanizado VIP</span>
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <Link to="/payment?plan=genio&cycle=monthly">
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-medium">
                      Começar com Plano Mensal
                    </Button>
                  </Link>
                  <Link to="/payment?plan=genio&cycle=yearly">
                    <Button variant="outline" className="w-full border-brand-green text-brand-green hover:bg-brand-green/10">
                      Economizar com Plano Anual
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos os planos incluem 7 dias de teste gratuito
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro • Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-orange via-brand-orange to-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/95 via-brand-orange/90 to-brand-blue/95"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Transforme suas finanças hoje mesmo
          </h2>
          <p className="text-lg lg:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de usuários que já revolucionaram sua gestão financeira. 
            Simples de usar, poderoso nos resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/payment?plan=basico&cycle=monthly">
              <Button 
                size="lg" 
                className="px-10 py-4 text-lg font-semibold hover-scale bg-white text-brand-orange hover:bg-gray-50"
              >
                Começar por R$ 14,90/mês
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/payment?plan=genio&cycle=monthly">
              <Button 
                size="lg" 
                variant="outline"
                className="px-10 py-4 text-lg font-semibold hover-scale border-white text-white hover:bg-white/20"
              >
                Plano Gênio - R$ 45,99/mês
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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