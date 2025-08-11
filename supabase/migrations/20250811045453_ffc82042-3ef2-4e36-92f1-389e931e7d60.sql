-- Primeiro, remover a política problemática que permite acesso público
DROP POLICY IF EXISTS "Public SELECT" ON public.invoices;

-- Criar política para que clientes vejam apenas suas próprias faturas
CREATE POLICY "Clients can view their own invoices" ON public.invoices
FOR SELECT 
USING (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  is_super_admin()
);

-- Criar política para que clientes possam atualizar suas próprias faturas (se necessário)
CREATE POLICY "Clients can update their own invoices" ON public.invoices
FOR UPDATE 
USING (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  is_super_admin()
);

-- Criar política para que clientes possam deletar suas próprias faturas (se necessário)
CREATE POLICY "Clients can delete their own invoices" ON public.invoices
FOR DELETE 
USING (
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  is_super_admin()
);