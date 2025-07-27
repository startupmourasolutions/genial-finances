-- Limpar dados de exemplo e criar categorias padrão do sistema

-- Limpar dados de exemplo
DELETE FROM public.custom_reports;
DELETE FROM public.debts;
DELETE FROM public.financial_goals;

-- Criar categorias padrão para todos os clientes existentes
DO $$
DECLARE
    client_record RECORD;
    category_exists BOOLEAN;
BEGIN
    -- Para cada cliente existente, inserir as categorias padrão se não existirem
    FOR client_record IN SELECT id, profile_id FROM public.clients
    LOOP
        -- Moradia
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Moradia' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Moradia', 'expense', '#ef4444', 'Home', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Transporte
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Transporte' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Transporte', 'expense', '#3b82f6', 'Car', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Alimentação
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Alimentação' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Alimentação', 'expense', '#22c55e', 'Utensils', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Saúde
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Saúde' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Saúde', 'expense', '#f59e0b', 'Heart', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Educação
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Educação' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Educação', 'expense', '#8b5cf6', 'BookOpen', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Lazer e Entretenimento
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Lazer e Entretenimento' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Lazer e Entretenimento', 'expense', '#ec4899', 'Gamepad2', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Vestuário e Cuidados Pessoais
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Vestuário e Cuidados Pessoais' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Vestuário e Cuidados Pessoais', 'expense', '#06b6d4', 'Shirt', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Dívidas e Empréstimos
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Dívidas e Empréstimos' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Dívidas e Empréstimos', 'expense', '#dc2626', 'CreditCard', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Investimentos
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Investimentos' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Investimentos', 'expense', '#10b981', 'TrendingUp', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Despesas Diversas
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Despesas Diversas' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Despesas Diversas', 'expense', '#6b7280', 'Package', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;

        -- Outros
        SELECT EXISTS(SELECT 1 FROM public.categories WHERE name = 'Outros' AND client_id = client_record.id) INTO category_exists;
        IF NOT category_exists THEN
            INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
            SELECT 'Outros', 'expense', '#64748b', 'MoreHorizontal', p.user_id, client_record.id
            FROM public.profiles p WHERE p.id = client_record.profile_id;
        END IF;
    END LOOP;
END $$;