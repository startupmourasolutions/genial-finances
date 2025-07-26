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

-- Política básica para documentos
CREATE POLICY "Users can view documents" 
ON documents 
FOR SELECT 
USING (true);