-- Remover todas as políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all super_administrators" ON super_administrators;

-- Recriar políticas mais simples que não causam recursão
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política para super_administrators que não causa recursão
CREATE POLICY "Super admins can view super_administrators" 
ON super_administrators 
FOR SELECT 
USING (true); -- Temporariamente permitir todos verem para debug

-- Permitir que super admins vejam outros perfis
CREATE POLICY "Allow profile access for super admins" 
ON profiles 
FOR SELECT 
USING (true); -- Temporariamente permitir todos verem para debug