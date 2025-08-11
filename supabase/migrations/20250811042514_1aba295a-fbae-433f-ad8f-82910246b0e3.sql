-- Permitir que usuários autenticados criem suas próprias faturas
CREATE POLICY "Users can create invoices for their clients"
ON public.invoices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN clients c ON c.profile_id = p.id
    WHERE c.id = invoices.client_id 
    AND p.user_id = auth.uid()
  )
);