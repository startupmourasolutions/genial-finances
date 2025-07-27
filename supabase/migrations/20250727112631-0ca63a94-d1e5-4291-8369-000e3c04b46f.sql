-- Limpar dados de exemplo e criar estrutura completa

-- Deletar dados de exemplo existentes
DELETE FROM public.expenses;
DELETE FROM public.incomes;
DELETE FROM public.transactions;
DELETE FROM public.vehicle_expenses;
DELETE FROM public.vehicle_maintenance;
DELETE FROM public.vehicles;
DELETE FROM public.categories WHERE client_id IS NOT NULL;
DELETE FROM public.debts;
DELETE FROM public.financial_goals;

-- Corrigir políticas RLS para expenses - permitir inserção com client_id
DROP POLICY IF EXISTS "Clients can manage their expenses" ON public.expenses;
CREATE POLICY "Clients can manage their expenses" ON public.expenses
FOR ALL 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin())
WITH CHECK (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Corrigir políticas RLS para incomes - permitir inserção com client_id  
DROP POLICY IF EXISTS "Clients can manage their incomes" ON public.incomes;
CREATE POLICY "Clients can manage their incomes" ON public.incomes
FOR ALL 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin())
WITH CHECK (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Corrigir políticas RLS para transactions - permitir inserção com client_id
DROP POLICY IF EXISTS "Clients can manage their transactions" ON public.transactions;
CREATE POLICY "Clients can manage their transactions" ON public.transactions
FOR ALL 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin())
WITH CHECK (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Criar tabela de relatórios personalizados
CREATE TABLE IF NOT EXISTS public.custom_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID,
  name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'income', 'expense', 'balance', 'category', 'custom'
  filters JSONB DEFAULT '{}'::jsonb,
  date_range JSONB DEFAULT '{}'::jsonb,
  configuration JSONB DEFAULT '{}'::jsonb,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS para custom_reports
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can manage their custom reports" ON public.custom_reports
FOR ALL 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin())
WITH CHECK (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Atualizar tabela de metas financeiras (já existe mas vamos garantir estrutura)
ALTER TABLE public.financial_goals 
ADD COLUMN IF NOT EXISTS category_id UUID,
ADD COLUMN IF NOT EXISTS auto_contribution BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS contribution_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS contribution_frequency TEXT DEFAULT 'monthly';

-- Atualizar tabela de dívidas com mais campos
ALTER TABLE public.debts
ADD COLUMN IF NOT EXISTS creditor_name TEXT,
ADD COLUMN IF NOT EXISTS debt_type TEXT DEFAULT 'loan', -- loan, credit_card, financing, other
ADD COLUMN IF NOT EXISTS original_amount NUMERIC,
ADD COLUMN IF NOT EXISTS payment_frequency TEXT DEFAULT 'monthly';

-- Criar tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  client_id UUID,
  currency TEXT DEFAULT 'BRL',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  notifications JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  dashboard_layout JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS para user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings" ON public.user_settings
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Trigger para updated_at nas novas tabelas
CREATE TRIGGER update_custom_reports_updated_at
BEFORE UPDATE ON public.custom_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();