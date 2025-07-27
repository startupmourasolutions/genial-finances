-- Remover todas as categorias existentes e criar as novas categorias unificadas
DELETE FROM public.categories;

-- Inserir as novas categorias unificadas para cada cliente existente
DO $$
DECLARE
    client_record RECORD;
BEGIN
    -- Para cada cliente existente, inserir as categorias unificadas
    FOR client_record IN SELECT id, profile_id FROM public.clients
    LOOP
        -- Obter o user_id do perfil e inserir as categorias unificadas
        INSERT INTO public.categories (name, type, color, icon, user_id, client_id) 
        SELECT 
            category_name,
            'unified', -- tipo unificado para todas as categorias
            category_color,
            category_icon,
            p.user_id,
            client_record.id
        FROM (VALUES
            ('Moradia', '#ef4444', 'Home'),
            ('Transporte', '#3b82f6', 'Car'),
            ('Alimentação', '#22c55e', 'Utensils'),
            ('Saúde/Beleza', '#f59e0b', 'Heart'),
            ('Educação', '#8b5cf6', 'BookOpen'),
            ('Lazer e Entretenimento', '#ec4899', 'Gamepad2'),
            ('Vestuário e Calçados', '#06b6d4', 'Shirt'),
            ('Dívidas e Empréstimos', '#dc2626', 'CreditCard'),
            ('Investimentos', '#10b981', 'TrendingUp'),
            ('Despesas Diversas', '#6b7280', 'Package'),
            ('Pet', '#f97316', 'Heart'),
            ('Outros', '#9ca3af', 'MoreHorizontal')
        ) AS unified_categories(category_name, category_color, category_icon)
        JOIN public.profiles p ON p.id = client_record.profile_id;
    END LOOP;
END $$;