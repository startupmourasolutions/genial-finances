-- Corrigir search_path da função update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';