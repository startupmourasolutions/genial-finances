-- Atualizar política para permitir que super administradores vejam todos os clientes
DROP POLICY IF EXISTS "Super administrators can view all clients" ON clients;

CREATE POLICY "Super administrators can view all clients"
ON clients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN super_administrators sa ON p.id = sa.profile_id
    WHERE p.user_id = auth.uid()
    AND sa.role IN ('administrator', 'super_administrator')
  )
);

-- Atualizar política para permitir que super administradores gerenciem todos os clientes
DROP POLICY IF EXISTS "Super administrators can manage all clients" ON clients;

CREATE POLICY "Super administrators can manage all clients"
ON clients
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN super_administrators sa ON p.id = sa.profile_id
    WHERE p.user_id = auth.uid()
    AND sa.role IN ('administrator', 'super_administrator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN super_administrators sa ON p.id = sa.profile_id
    WHERE p.user_id = auth.uid()
    AND sa.role IN ('administrator', 'super_administrator')
  )
);