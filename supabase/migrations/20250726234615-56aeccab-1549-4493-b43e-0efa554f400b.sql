-- Primeiro, vamos habilitar RLS na tabela documents que não tem RLS ativado
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

-- Remover políticas problemáticas
DROP POLICY IF EXISTS "Super admins can view all super_administrators" ON super_administrators;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

-- Recriar política original para usuários verem seus próprios dados
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Criar política para super admins verem todos os perfis usando a função
CREATE POLICY "Super admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (public.is_super_admin());

-- Política para super admins verem todos os super_administrators
CREATE POLICY "Super admins can view all super_administrators" 
ON super_administrators 
FOR SELECT 
USING (public.is_super_admin());

-- Política básica para documentos (se necessário)
CREATE POLICY "Users can view documents" 
ON documents 
FOR SELECT 
USING (true);