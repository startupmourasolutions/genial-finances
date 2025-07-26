-- Criar tabela de clientes separada da profiles
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  client_type client_type NOT NULL DEFAULT 'personal',
  company_name TEXT,
  subscription_plan TEXT,
  subscription_active BOOLEAN DEFAULT false,
  monthly_fee NUMERIC,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar enum para tipo de cliente
CREATE TYPE client_type AS ENUM ('personal', 'business');

-- Recriar a tabela com o enum
DROP TABLE IF EXISTS public.clients;

CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  client_type client_type NOT NULL DEFAULT 'personal',
  company_name TEXT,
  subscription_plan TEXT,
  subscription_active BOOLEAN DEFAULT false,
  monthly_fee NUMERIC,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Clients can view their own data" ON public.clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = clients.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert their own data" ON public.clients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = clients.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update their own data" ON public.clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = clients.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();