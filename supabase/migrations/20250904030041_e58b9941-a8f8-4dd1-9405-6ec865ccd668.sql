-- Atualizar trial_end_date para 2 dias após o cadastro para todos os clientes
UPDATE clients 
SET trial_end_date = trial_start_date + interval '2 days'
WHERE trial_start_date IS NOT NULL;

-- Atualizar a função handle_new_user para definir trial de 2 dias
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert basic profile (will be completed in registration process)
  INSERT INTO public.profiles (user_id, user_type, full_name, email)
  VALUES (
    new.id,
    'client', -- default for new users
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Usuário'),
    new.email
  );
  RETURN new;
END;
$$;

-- Atualizar para 2 dias de trial quando criar novo cliente
CREATE OR REPLACE FUNCTION public.ensure_user_has_client()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Find profiles without clients and create clients for them
    FOR profile_record IN 
        SELECT p.id as profile_id, p.user_id, p.full_name
        FROM profiles p 
        LEFT JOIN clients c ON c.profile_id = p.id 
        WHERE c.id IS NULL AND p.user_type = 'client'
    LOOP
        -- Create client for this profile with 2 days trial
        INSERT INTO clients (
            profile_id,
            client_type,
            trial_start_date,
            trial_end_date,
            subscription_active,
            subscription_status
        ) VALUES (
            profile_record.profile_id,
            'personal',
            now(),
            now() + interval '2 days',  -- Alterado de 7 para 2 dias
            false,
            'trial'
        );
        
        RAISE NOTICE 'Created client for profile % (user %)', profile_record.profile_id, profile_record.user_id;
    END LOOP;
END;
$$;