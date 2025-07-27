-- Primeiro vamos verificar os tipos existentes e remover a constraint se necessário
-- Atualizar as categorias existentes para usar tipos válidos e adicionar as novas

-- Atualizar categorias existentes para manter compatibilidade
UPDATE public.categories SET type = 'expense' WHERE type NOT IN ('income', 'expense');

-- Agora adicionar as novas categorias unificadas para cada cliente
DO $$
DECLARE
    client_record RECORD;
    category_exists BOOLEAN;
BEGIN
    -- Para cada cliente existente, inserir as categorias unificadas se não existirem
    FOR client_record IN SELECT id, profile_id FROM public.clients
    LOOP
        -- Verificar e inserir cada categoria se não existir (usando 'expense' como tipo padrão)
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Saúde/Beleza' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Saúde/Beleza', 'expense', '#f59e0b', 'Heart', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Vestuário e Calçados' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Vestuário e Calçados', 'expense', '#06b6d4', 'Shirt', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Pet' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Pet', 'expense', '#f97316', 'Heart', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Atualizar categorias existentes para os nomes corretos
        UPDATE public.categories SET name = 'Saúde/Beleza' WHERE name = 'Saúde' AND client_id = client_record.id;
        UPDATE public.categories SET name = 'Vestuário e Calçados' WHERE name = 'Vestuário e Cuidados Pessoais' AND client_id = client_record.id;
    END LOOP;
END $$;