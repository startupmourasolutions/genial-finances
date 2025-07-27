-- Criar tabela de manutenções para veículos
CREATE TABLE public.vehicle_maintenance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  client_id UUID,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  due_km INTEGER,
  current_km INTEGER,
  due_date DATE,
  completed_date DATE,
  cost NUMERIC,
  notes TEXT,
  system_category TEXT, -- Motor, Freios, Suspensão, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas que faltam na tabela vehicles
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS acquisition_date DATE,
ADD COLUMN IF NOT EXISTS current_km INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Criar tabela de planos de assinatura
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  features JSONB DEFAULT '[]'::jsonb,
  max_vehicles INTEGER,
  max_users INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas de assinatura na tabela clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS current_plan_id UUID,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS can_upgrade BOOLEAN DEFAULT true;

-- Inserir planos padrão
INSERT INTO public.subscription_plans (name, description, price, features, max_vehicles, max_users) VALUES
('Pessoal', 'Plano para uso pessoal', 0, '["Gestão básica de finanças", "Até 2 veículos", "Relatórios básicos"]'::jsonb, 2, 1),
('Empresarial', 'Plano para empresas', 49.90, '["Gestão completa de finanças", "Veículos ilimitados", "Relatórios avançados", "Múltiplos usuários", "Suporte prioritário"]'::jsonb, NULL, 10);

-- Enable RLS nas novas tabelas
ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policies para vehicle_maintenance
CREATE POLICY "Clients can manage their vehicle maintenance" ON public.vehicle_maintenance
FOR ALL 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

CREATE POLICY "Clients can view their vehicle maintenance" ON public.vehicle_maintenance
FOR SELECT 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Policies para subscription_plans (todos podem ver os planos)
CREATE POLICY "Everyone can view subscription plans" ON public.subscription_plans
FOR SELECT 
USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_vehicle_maintenance_updated_at
BEFORE UPDATE ON public.vehicle_maintenance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();