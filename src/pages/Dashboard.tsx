import { useEffect } from "react"
import DashboardPessoal from "./DashboardPessoal"
import DashboardEmpresarial from "./DashboardEmpresarial"
import DashboardSuperAdmin from "./DashboardSuperAdmin"
import { useProfileContext } from "@/components/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

export default function Dashboard() {
  const { currentProfile } = useProfileContext();
  const { profile } = useAuth();
  
  // Verifica se é super administrador
  const isSuperAdmin = profile?.user_type === 'super_administrator';

  // Se for super admin, mostra dashboard específico
  if (isSuperAdmin) {
    return <DashboardSuperAdmin />;
  }

  // Limpeza automática de duplicidades de pagamentos/despesas de hoje
  useEffect(() => {
    const cleanupDuplicates = async () => {
      try {
        if (!profile) return;
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle();
        if (!clientData) return;
        const today = new Date().toISOString().split('T')[0];

        // debt_payments de hoje
        const { data: payments } = await supabase
          .from('debt_payments')
          .select('id, debt_id, amount, payment_date, created_at')
          .eq('client_id', clientData.id)
          .eq('payment_date', today)
          .order('created_at', { ascending: true });

        const idsToDeletePayments: string[] = [];
        const groupsP = new Map<string, string[]>();
        (payments || []).forEach((p: any) => {
          const key = `${p.debt_id}|${p.payment_date}|${p.amount}`;
          const arr = groupsP.get(key) || [];
          arr.push(p.id);
          groupsP.set(key, arr);
        });
        groupsP.forEach((ids) => {
          if (ids.length > 1) idsToDeletePayments.push(...ids.slice(1));
        });
        if (idsToDeletePayments.length > 0) {
          await supabase.from('debt_payments').delete().in('id', idsToDeletePayments);
        }

        // expenses de hoje (geradas por pagamento)
        const { data: expenses } = await supabase
          .from('expenses')
          .select('id, title, amount, date, created_at')
          .eq('client_id', clientData.id)
          .eq('date', today)
          .ilike('title', 'Pagamento:%')
          .order('created_at', { ascending: true });

        const idsToDeleteExpenses: string[] = [];
        const groupsE = new Map<string, string[]>();
        (expenses || []).forEach((e: any) => {
          const key = `${e.title}|${e.date}|${e.amount}`;
          const arr = groupsE.get(key) || [];
          arr.push(e.id);
          groupsE.set(key, arr);
        });
        groupsE.forEach((ids) => {
          if (ids.length > 1) idsToDeleteExpenses.push(...ids.slice(1));
        });
        if (idsToDeleteExpenses.length > 0) {
          await supabase.from('expenses').delete().in('id', idsToDeleteExpenses);
        }
      } catch (e) {
        console.error('Cleanup duplicates failed', e);
      }
    };
    cleanupDuplicates();
  }, [profile?.id]);

  // Para clientes, mostra dashboard baseado no perfil
  return (
    <div className="space-y-6">
      {/* Dynamic Dashboard Content */}
      <div>
        {currentProfile === "Pessoal" ? (
          <DashboardPessoal />
        ) : (
          <DashboardEmpresarial />
        )}
      </div>
    </div>
  )
}