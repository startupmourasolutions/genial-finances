-- Criar tabela para histórico de pagamentos de dívidas
CREATE TABLE public.debt_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id uuid NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  client_id uuid,
  amount numeric NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para debt_payments
CREATE POLICY "Clients can view their debt payments" 
ON public.debt_payments 
FOR SELECT 
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

CREATE POLICY "Clients can manage their debt payments" 
ON public.debt_payments 
FOR ALL
USING (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin())
WITH CHECK (((client_id = get_user_client_id()) AND (auth.uid() IS NOT NULL)) OR is_super_admin());

-- Trigger para updated_at
CREATE TRIGGER update_debt_payments_updated_at
BEFORE UPDATE ON public.debt_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Remover campo debt_type da tabela debts
ALTER TABLE public.debts DROP COLUMN IF EXISTS debt_type;