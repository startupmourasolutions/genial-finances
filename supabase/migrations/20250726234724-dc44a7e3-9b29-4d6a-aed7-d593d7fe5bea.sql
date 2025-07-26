-- Corrigir o search_path das funções para segurança
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.is_super_admin() SET search_path = 'public';