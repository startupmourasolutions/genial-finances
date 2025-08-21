import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatInTimeZone } from 'date-fns-tz';
import { useCurrentProfile } from "@/contexts/ProfileContext";

interface DynamicHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  isCurrentMonth: boolean;
  onNewTransaction: () => void;
}

export function DynamicHeader({ 
  selectedMonth, 
  selectedYear, 
  isCurrentMonth, 
  onNewTransaction 
}: DynamicHeaderProps) {
  const { profile } = useAuth();
  const { currentProfile } = useCurrentProfile();
  
  const timeZone = 'America/Belem';
  
  // Saudação dinâmica por horário
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = parseInt(formatInTimeZone(now, timeZone, 'HH'));
    
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  // Nome ou empresa
  const displayName = useMemo(() => {
    if (currentProfile === 'Empresarial') {
      // Para empresarial, usar nome da empresa se disponível
      return profile?.company_name || profile?.full_name?.split(' ')[0] || 'Empresa';
    }
    // Para pessoal, usar primeiro nome
    return profile?.full_name ? profile.full_name.split(' ')[0] : '';
  }, [profile, currentProfile]);

  // Frase de efeito rotativa (determinística por dia)
  const dailyPhrase = useMemo(() => {
    const phrases = [
      "Gênio Financeiro faz magia no seu financeiro.",
      "Registre por texto ou voz e veja tudo organizado.",
      "Relatórios em 1 toque. Zero planilhas, zero estresse.",
      "Seu dinheiro, do caos ao controle em minutos."
    ];
    
    const today = new Date();
    const dayOfMonth = today.getDate();
    const phraseIndex = (dayOfMonth - 1) % phrases.length;
    
    return phrases[phraseIndex];
  }, []);

  // Texto da saudação completa
  const fullGreeting = displayName ? `${greeting}, ${displayName}` : 'Olá';

  // Mês selecionado em português
  const getSelectedMonthName = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[selectedMonth]} ${selectedYear}`;
  };

  // WhatsApp message
  const whatsAppMessage = encodeURIComponent(
    `Olá! Sou ${displayName || 'usuário'}. Quero falar com o Gênio sobre minhas finanças.`
  );
  
  const whatsAppUrl = `https://wa.me/559185389056?text=${whatsAppMessage}`;

  return (
    <div className="flex flex-col gap-4 mb-6 p-6 bg-background rounded-lg border shadow-card">
      <div className="flex flex-col gap-4">
        {/* Greeting and Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-inter tracking-tight">
            {fullGreeting}
          </h1>
          <p className="text-sm sm:text-base text-success font-medium font-inter">
            {getSelectedMonthName()}
            {!isCurrentMonth && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Histórico
              </Badge>
            )}
          </p>
          {/* Daily phrase with sparkle */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-inter">
            <span className="mr-1" aria-hidden="true">✨</span>
            {dailyPhrase}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <Button 
            onClick={onNewTransaction}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-inter font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:border-emerald-300 font-inter font-medium transition-colors"
          >
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              {/* WhatsApp SVG icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.215"/>
              </svg>
              Chame o Gênio no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}