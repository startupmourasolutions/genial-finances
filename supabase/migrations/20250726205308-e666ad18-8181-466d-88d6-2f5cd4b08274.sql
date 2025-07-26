-- Criar tabela de leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  lead_source TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'qualificado', 'convertido', 'perdido')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Criar tabela de faturas
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  due_date DATE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida', 'cancelada')),
  payment_method TEXT,
  payment_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Políticas para leads (apenas super admins)
CREATE POLICY "Super admins can manage leads" ON public.leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      JOIN public.super_administrators sa ON p.id = sa.profile_id 
      WHERE p.user_id = auth.uid()
    )
  );

-- Políticas para faturas (apenas super admins)
CREATE POLICY "Super admins can manage invoices" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      JOIN public.super_administrators sa ON p.id = sa.profile_id 
      WHERE p.user_id = auth.uid()
    )
  );

-- Triggers para updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);