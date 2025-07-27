-- Remover políticas antigas da tabela categories
DROP POLICY IF EXISTS "Clients can manage their categories" ON categories;
DROP POLICY IF EXISTS "Clients can view their categories" ON categories;

-- Criar nova política para permitir que todos os usuários autenticados vejam as categorias
CREATE POLICY "Allow authenticated users to view categories"
ON categories
FOR SELECT
TO authenticated
USING (true);

-- Como as categorias agora são padrão/globais, não permitir insert/update/delete para usuários
-- Apenas administradores poderão gerenciar categorias (se necessário no futuro)