import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  type: "income" | "expense" | "balance";
  visible: boolean;
}

export const HeroAnimation = () => {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([
    { id: "income", label: "Receitas", value: 0, type: "income", visible: false },
    { id: "expenses", label: "Despesas", value: 0, type: "expense", visible: false },
    { id: "balance", label: "Saldo", value: 0, type: "balance", visible: false }
  ]);

  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const startAnimation = () => {
      // Reset
      setCurrentPhase(0);
      setMetrics(prev => prev.map(m => ({ ...m, value: 0, visible: false })));

      // Phase 1: Show metrics cards (0-1s)
      setTimeout(() => {
        setCurrentPhase(1);
        setMetrics(prev => prev.map(m => ({ ...m, visible: true })));
      }, 300);

      // Phase 2: Animate values (1-4s)
      setTimeout(() => {
        setCurrentPhase(2);
        
        // Animate income
        animateValue("income", 4700, 1500);
        
        // Animate expenses  
        setTimeout(() => {
          animateValue("expense", 1480, 1000);
        }, 800);
        
        // Animate balance
        setTimeout(() => {
          animateValue("balance", 3220, 1200);
        }, 1600);
      }, 1000);

      // Phase 3: Show insights (4-6s)
      setTimeout(() => {
        setCurrentPhase(3);
      }, 4000);

      // Restart loop
      setTimeout(startAnimation, 7000);
    };

    const animateValue = (type: "income" | "expense" | "balance", target: number, duration: number) => {
      const start = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOut
        const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
        
        setMetrics(prev => prev.map(m => 
          m.type === type ? { ...m, value: currentValue } : m
        ));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    startAnimation();
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto h-96 flex items-center justify-center">
      {/* Central Dashboard */}
      <div className="relative z-10 w-full space-y-4">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`transition-all duration-1000 ${currentPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-lg font-bold text-card-foreground font-inter mb-2">Dashboard Inteligente</h3>
            <p className="text-sm text-muted-foreground font-inter">Gestão automatizada em tempo real</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-3">
          {metrics.map((metric, index) => (
            <Card 
              key={metric.id} 
              className={`transition-all duration-700 border border-border ${
                metric.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.type === "income" && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                    {metric.type === "expense" && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                    {metric.type === "balance" && <TrendingUp className="h-4 w-4 text-primary" />}
                    <span className="text-sm font-medium text-card-foreground font-inter">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold font-inter ${
                      metric.type === "income" ? "text-green-600" :
                      metric.type === "expense" ? "text-red-600" : "text-primary"
                    }`}>
                      {metric.type === "expense" ? "-" : ""}R$ {metric.value.toLocaleString('pt-BR')}
                    </p>
                    {currentPhase >= 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-inter animate-fade-in"
                      >
                        {metric.type === "income" ? "+15%" : 
                         metric.type === "expense" ? "-8%" : "↗ +23%"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className={`transition-all duration-1000 ${currentPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground font-inter">Meta do Mês</span>
                <span className="text-sm font-medium text-primary font-inter">
                  {currentPhase >= 3 ? "87%" : "0%"}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-2000 ease-out"
                  style={{ 
                    width: currentPhase >= 3 ? "87%" : "0%",
                    transitionDelay: currentPhase >= 3 ? "500ms" : "0ms"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Insights */}
        {currentPhase >= 3 && (
          <Card className="border border-primary/20 bg-primary/5 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary font-inter">Insight Inteligente</span>
              </div>
              <p className="text-xs text-muted-foreground font-inter">
                Você está economizando 23% mais que o mês passado. Continue assim!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};