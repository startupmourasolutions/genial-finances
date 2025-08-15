-- Criar tabela para contas compartilhadas
CREATE TABLE public.shared_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.shared_accounts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Clients can manage their shared accounts" 
ON public.shared_accounts 
FOR ALL 
USING (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR is_super_admin()
)
WITH CHECK (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR is_super_admin()
);

CREATE POLICY "Clients can view their shared accounts" 
ON public.shared_accounts 
FOR SELECT 
USING (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR is_super_admin()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_shared_accounts_updated_at
BEFORE UPDATE ON public.shared_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();