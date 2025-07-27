-- Atualizar categorias existentes e adicionar as novas
-- Primeiro, atualizar o tipo de todas as categorias existentes para 'unified'
UPDATE public.categories SET type = 'unified';

-- Remover categorias duplicadas mantendo apenas uma de cada por cliente
-- Depois, inserir as novas categorias unificadas para cada cliente existente
DO $$
DECLARE
    client_record RECORD;
    category_exists BOOLEAN;
BEGIN
    -- Para cada cliente existente, inserir as categorias unificadas se não existirem
    FOR client_record IN SELECT id, profile_id FROM public.clients
    LOOP
        -- Verificar e inserir cada categoria se não existir
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Moradia' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Moradia', 'unified', '#ef4444', 'Home', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Transporte' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Transporte', 'unified', '#3b82f6', 'Car', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Alimentação' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Alimentação', 'unified', '#22c55e', 'Utensils', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Saúde/Beleza' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Saúde/Beleza', 'unified', '#f59e0b', 'Heart', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Educação' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Educação', 'unified', '#8b5cf6', 'BookOpen', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Lazer e Entretenimento' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Lazer e Entretenimento', 'unified', '#ec4899', 'Gamepad2', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Vestuário e Calçados' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Vestuário e Calçados', 'unified', '#06b6d4', 'Shirt', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Dívidas e Empréstimos' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Dívidas e Empréstimos', 'unified', '#dc2626', 'CreditCard', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Investimentos' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Investimentos', 'unified', '#10b981', 'TrendingUp', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Despesas Diversas' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Despesas Diversas', 'unified', '#6b7280', 'Package', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Pet' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Pet', 'unified', '#f97316', 'Heart', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Outros' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Outros', 'unified', '#9ca3af', 'MoreHorizontal', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;
    END LOOP;
END $$;