-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.get_user_client_id()
RETURNS UUID 
LANGUAGE plpgsql 
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN (
    SELECT c.id 
    FROM public.clients c
    JOIN public.profiles p ON p.id = c.profile_id
    WHERE p.user_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles p 
    JOIN public.super_administrators sa ON p.id = sa.profile_id 
    WHERE p.user_id = auth.uid() 
    AND sa.role IN ('administrator', 'super_administrator')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.process_automation_event(
  p_client_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}',
  p_source_platform TEXT DEFAULT 'whatsapp'
)
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.automation_events (
    client_id,
    event_type,
    event_data,
    source_platform
  ) VALUES (
    p_client_id,
    p_event_type,
    p_event_data,
    p_source_platform
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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