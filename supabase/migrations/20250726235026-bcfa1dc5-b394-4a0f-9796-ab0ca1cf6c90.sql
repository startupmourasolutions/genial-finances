-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all super_administrators" ON super_administrators;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile access for super admins" ON profiles;
DROP POLICY IF EXISTS "Super admins can view super_administrators" ON super_administrators;

-- Criar políticas simples sem recursão
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Permitir que todos vejam super_administrators temporariamente
CREATE POLICY "Allow view super_administrators" 
ON super_administrators 
FOR SELECT 
USING (true);

-- Permitir que todos vejam todos os perfis temporariamente para debug
CREATE POLICY "Allow view all profiles" 
ON profiles 
FOR SELECT 
USING (true);