import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PiggyBank, BarChart3 } from "lucide-react";

interface Transaction {
  id: string;
  text: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  x: number;
  y: number;
  visible: boolean;
}

export const HeroAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", text: "PIX", amount: "R$ 82,90", type: "expense", category: "Mercado", x: 10, y: 15, visible: false },
    { id: "2", text: "Salário", amount: "+R$ 2.300", type: "income", category: "Entrada", x: 75, y: 20, visible: false },
    { id: "3", text: "Aluguel", amount: "-R$ 1.200", type: "expense", category: "Moradia", x: 45, y: 75, visible: false }
  ]);
  const [chartProgress, setChartProgress] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  useEffect(() => {
    const animationLoop = () => {
      // Reset all states
      setAnimationPhase(0);
      setBalance(0);
      setTransactions(prev => prev.map(t => ({ ...t, visible: false })));
      setChartProgress(0);
      setGoalProgress(0);

      // Phase 1: Show transactions (1-3s)
      setTimeout(() => {
        setAnimationPhase(1);
        setTransactions(prev => prev.map((t, index) => ({
          ...t,
          visible: true,
          x: t.x + Math.sin(Date.now() / 1000 + index) * 5,
          y: t.y + Math.cos(Date.now() / 1000 + index) * 5
        })));
      }, 1000);

      // Phase 2: Count-up and chart (3-4.5s)
      setTimeout(() => {
        setAnimationPhase(2);
        let currentBalance = 0;
        const targetBalance = 1182.90;
        const increment = targetBalance / 30;
        
        const countUp = setInterval(() => {
          currentBalance += increment;
          if (currentBalance >= targetBalance) {
            currentBalance = targetBalance;
            clearInterval(countUp);
          }
          setBalance(currentBalance);
        }, 50);

        // Animate chart drawing
        let progress = 0;
        const chartInterval = setInterval(() => {
          progress += 2;
          setChartProgress(progress);
          if (progress >= 100) clearInterval(chartInterval);
        }, 30);
      }, 3000);

      // Phase 3: Goal completion (4.5-6.5s)
      setTimeout(() => {
        setAnimationPhase(3);
        let progress = 0;
        const goalInterval = setInterval(() => {
          progress += 3;
          setGoalProgress(progress);
          if (progress >= 72) {
            setGoalProgress(72);
            clearInterval(goalInterval);
          }
        }, 50);
      }, 4500);

      // Loop back (8s)
      setTimeout(animationLoop, 8000);
    };

    animationLoop();
  }, []);

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Central Dashboard */}
      <Card className="relative z-10 w-72 h-52 bg-card border border-border shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg font-inter flex items-center justify-center gap-2 text-card-foreground">
            <PiggyBank className="h-5 w-5 text-primary" />
            Gênio Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-inter">Saldo Total</p>
            <p className="text-2xl font-bold text-primary font-inter">
              R$ {balance.toFixed(2).replace('.', ',')}
            </p>
          </div>
          
          {/* Mini Chart */}
          <div className="h-16 bg-muted/30 rounded-lg flex items-center justify-center p-2">
            <svg width="100%" height="100%" viewBox="0 0 200 60" className="overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <polyline
                points="10,45 30,35 50,25 70,20 90,15 110,30 130,20 150,15 170,10 190,15"
                fill="none"
                stroke="url(#chartGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset={300 - (chartProgress * 3)}
                className="transition-all duration-1000 ease-out"
              />
              {/* Data points */}
              {animationPhase >= 2 && (
                <g>
                  <circle cx="10" cy="45" r="2" fill="hsl(var(--primary))" opacity={chartProgress > 10 ? 1 : 0} />
                  <circle cx="50" cy="25" r="2" fill="hsl(var(--primary))" opacity={chartProgress > 30 ? 1 : 0} />
                  <circle cx="90" cy="15" r="2" fill="hsl(var(--primary))" opacity={chartProgress > 60 ? 1 : 0} />
                  <circle cx="150" cy="15" r="2" fill="hsl(var(--primary))" opacity={chartProgress > 80 ? 1 : 0} />
                </g>
              )}
            </svg>
          </div>

          {/* Goal Progress */}
          {animationPhase >= 3 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-inter">Meta Economia</span>
                <span className="font-inter font-medium">{goalProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Transactions - Fixed positioning */}
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className={`absolute transition-all duration-1000 transform hero-float-${index} z-20 ${
            transaction.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            left: `calc(${transaction.x}% - 80px)`,
            top: `calc(${transaction.y}% - 40px)`,
            minWidth: '160px',
          }}
        >
          <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-lg">
            <CardContent className="p-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-inter text-card-foreground">{transaction.text}</span>
                  <span className={`text-sm font-bold font-inter ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount}
                  </span>
                </div>
                {animationPhase >= 1 && (
                  <Badge variant="secondary" className="text-xs w-fit font-inter">
                    {transaction.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Report Chip */}
      {animationPhase >= 3 && (
        <div className="absolute bottom-4 right-4 animate-fade-in z-20">
          <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium font-inter">Relatório em 1 toque</span>
              </div>
              <p className="text-xs mt-1 font-inter opacity-90">Economia 72% da meta</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};