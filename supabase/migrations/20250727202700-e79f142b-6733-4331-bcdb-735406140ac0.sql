-- Primeiro, remover as referências de category_id nas tabelas relacionadas
UPDATE public.incomes SET category_id = NULL WHERE category_id IS NOT NULL;
UPDATE public.expenses SET category_id = NULL WHERE category_id IS NOT NULL;
UPDATE public.transactions SET category_id = NULL WHERE category_id IS NOT NULL;
UPDATE public.financial_goals SET category_id = NULL WHERE category_id IS NOT NULL;

-- Remover a coluna user_id da tabela categories
ALTER TABLE public.categories DROP COLUMN IF EXISTS user_id;

-- Apagar todos os dados existentes na tabela
DELETE FROM public.categories;

-- Inserir categorias padrão de despesas
INSERT INTO public.categories (name, type, icon, color) VALUES
('Moradia', 'expense', '🏠', '#3B82F6'),
('Transporte', 'expense', '🚗', '#10B981'),
('Alimentação', 'expense', '🍽️', '#F59E0B'),
('Saúde', 'expense', '⚕️', '#EF4444'),
('Educação', 'expense', '📚', '#8B5CF6'),
('Lazer e Entretenimento', 'expense', '🎮', '#EC4899'),
('Vestuário e Cuidados Pessoais', 'expense', '👕', '#06B6D4'),
('Dívidas e Empréstimos', 'expense', '💳', '#F97316'),
('Investimentos', 'expense', '📈', '#84CC16'),
('Despesas Diversas', 'expense', '💡', '#6366F1'),
('Animais de Estimação', 'expense', '🐕', '#F59E0B');

-- Inserir categorias padrão de receitas
INSERT INTO public.categories (name, type, icon, color) VALUES
('Salário/Renda Principal', 'income', '💼', '#10B981'),
('Renda Extra', 'income', '💻', '#3B82F6'),
('Rendimentos de Investimentos', 'income', '📈', '#8B5CF6'),
('Presentes/Doações', 'income', '🎁', '#EC4899'),
('Reembolsos', 'income', '💰', '#F59E0B'),
('Outros', 'income', '💡', '#6366F1');