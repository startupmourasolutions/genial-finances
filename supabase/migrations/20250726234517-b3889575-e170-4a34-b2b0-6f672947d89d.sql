-- Verificar e ajustar as políticas RLS para super_administrators
-- A política atual requer que o usuário esteja autenticado e seja o próprio usuário
-- Vamos criar uma política que permite super_administrators verem todos os registros

-- Remover política existente restritiva
DROP POLICY IF EXISTS "Super admins can view their own data" ON super_administrators;

-- Criar nova política que permite super admins verem todos os registros
CREATE POLICY "Super admins can view all super_administrators" 
ON super_administrators 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN super_administrators sa ON p.id = sa.profile_id 
    WHERE p.user_id = auth.uid() 
    AND sa.role IN ('administrator', 'super_administrator')
  )
);

-- Também permitir que super admins vejam todos os perfis
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN super_administrators sa ON p.id = sa.profile_id 
    WHERE p.user_id = auth.uid() 
    AND sa.role IN ('administrator', 'super_administrator')
  )
);