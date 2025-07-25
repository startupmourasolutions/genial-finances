-- Corrigir função handle_new_user com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Inserir perfil básico (será completado no processo de cadastro)
  INSERT INTO public.profiles (user_id, user_type, full_name, email)
  VALUES (
    new.id,
    'client', -- padrão para novos usuários
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Usuário'),
    new.email
  );
  RETURN new;
END;
$$;

-- Corrigir função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;