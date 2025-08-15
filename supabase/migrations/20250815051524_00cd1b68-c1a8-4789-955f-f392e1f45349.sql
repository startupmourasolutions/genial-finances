-- Adicionar coluna profile_type na tabela shared_accounts
ALTER TABLE public.shared_accounts 
ADD COLUMN profile_type TEXT NOT NULL DEFAULT 'personal';

-- Atualizar registros existentes para personal (assumindo que foram criados no modo pessoal)
UPDATE public.shared_accounts 
SET profile_type = 'personal' 
WHERE profile_type IS NULL;