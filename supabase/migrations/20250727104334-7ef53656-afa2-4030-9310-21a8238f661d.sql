-- Multi-tenant structure for client accounts
-- First, add client_id to all existing tables that need client isolation

-- Add client_id to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to expenses table  
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to incomes table
ALTER TABLE public.incomes ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to transactions table
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to debts table
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to financial_goals table
ALTER TABLE public.financial_goals ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to vehicles table
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to vehicle_expenses table
ALTER TABLE public.vehicle_expenses ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Add client_id to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;

-- Create WhatsApp integrations table for automation
CREATE TABLE IF NOT EXISTS public.whatsapp_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  whatsapp_number TEXT NOT NULL,
  webhook_url TEXT,
  api_token TEXT,
  integration_status TEXT DEFAULT 'active',
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, whatsapp_number)
);

-- Create automation events table for N8n integration
CREATE TABLE IF NOT EXISTS public.automation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  source_platform TEXT DEFAULT 'whatsapp',
  processed BOOLEAN DEFAULT false,
  processing_result JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create function to get current user's client_id
CREATE OR REPLACE FUNCTION public.get_user_client_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT c.id 
    FROM public.clients c
    JOIN public.profiles p ON p.id = c.profile_id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles p 
    JOIN public.super_administrators sa ON p.id = sa.profile_id 
    WHERE p.user_id = auth.uid() 
    AND sa.role IN ('administrator', 'super_administrator')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to process automation events
CREATE OR REPLACE FUNCTION public.process_automation_event(
  p_client_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}',
  p_source_platform TEXT DEFAULT 'whatsapp'
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.automation_events (
    client_id,
    event_type,
    event_data,
    source_platform
  ) VALUES (
    p_client_id,
    p_event_type,
    p_event_data,
    p_source_platform
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.whatsapp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for WhatsApp integrations
CREATE POLICY "Clients can view their WhatsApp integrations"
ON public.whatsapp_integrations FOR SELECT
USING (
  client_id = public.get_user_client_id() OR public.is_super_admin()
);

CREATE POLICY "Clients can manage their WhatsApp integrations"
ON public.whatsapp_integrations FOR ALL
USING (
  client_id = public.get_user_client_id() OR public.is_super_admin()
);

-- RLS Policies for automation events
CREATE POLICY "Clients can view their automation events"
ON public.automation_events FOR SELECT
USING (
  client_id = public.get_user_client_id() OR public.is_super_admin()
);

CREATE POLICY "Allow automation event creation"
ON public.automation_events FOR INSERT
WITH CHECK (true); -- Allows external systems to create events

CREATE POLICY "Clients can update their automation events"
ON public.automation_events FOR UPDATE
USING (
  client_id = public.get_user_client_id() OR public.is_super_admin()
);

-- Update RLS policies for existing tables to include client isolation

-- Categories policies
DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Clients can view their categories"
ON public.categories FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their categories"
ON public.categories FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Expenses policies
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

CREATE POLICY "Clients can view their expenses"
ON public.expenses FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their expenses"
ON public.expenses FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Incomes policies
DROP POLICY IF EXISTS "Users can view their own incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can create their own incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can update their own incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can delete their own incomes" ON public.incomes;

CREATE POLICY "Clients can view their incomes"
ON public.incomes FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their incomes"
ON public.incomes FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

CREATE POLICY "Clients can view their transactions"
ON public.transactions FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their transactions"
ON public.transactions FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Debts policies
DROP POLICY IF EXISTS "Users can view their own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can create their own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can update their own debts" ON public.debts;
DROP POLICY IF EXISTS "Users can delete their own debts" ON public.debts;

CREATE POLICY "Clients can view their debts"
ON public.debts FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their debts"
ON public.debts FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Financial goals policies
DROP POLICY IF EXISTS "Users can view their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can create their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can update their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can delete their own financial goals" ON public.financial_goals;

CREATE POLICY "Clients can view their financial goals"
ON public.financial_goals FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their financial goals"
ON public.financial_goals FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Vehicles policies
DROP POLICY IF EXISTS "Users can view their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can create their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON public.vehicles;

CREATE POLICY "Clients can view their vehicles"
ON public.vehicles FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their vehicles"
ON public.vehicles FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Vehicle expenses policies
DROP POLICY IF EXISTS "Users can view their own vehicle expenses" ON public.vehicle_expenses;
DROP POLICY IF EXISTS "Users can create their own vehicle expenses" ON public.vehicle_expenses;
DROP POLICY IF EXISTS "Users can update their own vehicle expenses" ON public.vehicle_expenses;
DROP POLICY IF EXISTS "Users can delete their own vehicle expenses" ON public.vehicle_expenses;

CREATE POLICY "Clients can view their vehicle expenses"
ON public.vehicle_expenses FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can manage their vehicle expenses"
ON public.vehicle_expenses FOR ALL
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Clients can view their notifications"
ON public.notifications FOR SELECT
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

CREATE POLICY "Clients can update their notifications"
ON public.notifications FOR UPDATE
USING (
  (client_id = public.get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  public.is_super_admin()
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for new tables
CREATE TRIGGER update_whatsapp_integrations_updated_at
  BEFORE UPDATE ON public.whatsapp_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_client_id ON public.categories(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_client_id ON public.expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_incomes_client_id ON public.incomes(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_debts_client_id ON public.debts(client_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_client_id ON public.financial_goals(client_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_client_id ON public.vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_client_id ON public.vehicle_expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON public.notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_integrations_client_id ON public.whatsapp_integrations(client_id);
CREATE INDEX IF NOT EXISTS idx_automation_events_client_id ON public.automation_events(client_id);
CREATE INDEX IF NOT EXISTS idx_automation_events_processed ON public.automation_events(processed, created_at);