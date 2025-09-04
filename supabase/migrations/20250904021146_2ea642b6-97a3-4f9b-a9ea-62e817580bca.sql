-- Adicionar campo para identificar se a categoria é do sistema ou do usuário
ALTER TABLE public.categories 
ADD COLUMN is_system BOOLEAN DEFAULT false;

-- Marcar todas as categorias existentes como do sistema
UPDATE public.categories SET is_system = true WHERE client_id IS NULL;

-- Adicionar categoria Combustível
INSERT INTO public.categories (name, type, color, icon, is_system)
VALUES ('Combustível', 'expense', '#FF5722', '⛽', true);

-- Atualizar políticas RLS para categorias
DROP POLICY IF EXISTS "Allow authenticated users to view categories" ON public.categories;
DROP POLICY IF EXISTS "Public SELECT" ON public.categories;

-- Permitir visualização de categorias do sistema e do próprio cliente
CREATE POLICY "Users can view system and own categories" 
ON public.categories 
FOR SELECT 
USING (
  is_system = true OR 
  (client_id = get_user_client_id() AND auth.uid() IS NOT NULL) OR 
  is_super_admin()
);

-- Permitir que clientes criem suas próprias categorias
CREATE POLICY "Clients can create own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (
  is_system = false AND 
  client_id = get_user_client_id() AND 
  auth.uid() IS NOT NULL
);

-- Permitir que clientes editem suas próprias categorias
CREATE POLICY "Clients can update own categories" 
ON public.categories 
FOR UPDATE 
USING (
  is_system = false AND 
  client_id = get_user_client_id() AND 
  auth.uid() IS NOT NULL
);

-- Permitir que clientes deletem suas próprias categorias
CREATE POLICY "Clients can delete own categories" 
ON public.categories 
FOR DELETE 
USING (
  is_system = false AND 
  client_id = get_user_client_id() AND 
  auth.uid() IS NOT NULL
);