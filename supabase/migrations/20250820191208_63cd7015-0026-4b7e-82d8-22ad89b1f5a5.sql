-- Alterar a tabela debts conforme solicitado
-- Remover campos desnecessários
ALTER TABLE public.debts 
DROP COLUMN IF EXISTS creditor_name,
DROP COLUMN IF EXISTS remaining_amount,
DROP COLUMN IF EXISTS interest_rate,
DROP COLUMN IF EXISTS monthly_payment;

-- Adicionar campo category_id para usar as mesmas categorias das despesas
ALTER TABLE public.debts 
ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- Alterar total_amount para ser opcional (não obrigatório)
ALTER TABLE public.debts 
ALTER COLUMN total_amount DROP NOT NULL;