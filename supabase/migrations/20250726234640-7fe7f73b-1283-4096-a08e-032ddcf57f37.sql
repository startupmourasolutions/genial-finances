-- Habilitar RLS na tabela documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Criar função security definer para verificar se o usuário é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN super_administrators sa ON p.id = sa.profile_id 
    WHERE p.user_id = auth.uid() 
    AND sa.role IN ('administrator', 'super_administrator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar política para super admins verem todos os perfis
CREATE POLICY "Super admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (public.is_super_admin());

-- Política para super admins verem todos os super_administrators
CREATE POLICY "Super admins can view all super_administrators" 
ON super_administrators 
FOR SELECT 
USING (public.is_super_admin());

-- Política básica para documentos
CREATE POLICY "Users can view documents" 
ON documents 
FOR SELECT 
USING (true);