-- Inserir categorias padrão para despesas e receitas
INSERT INTO public.categories (name, type, color, icon) VALUES
-- Categorias de Despesas
('Moradia', 'expense', '#ef4444', 'Home'),
('Transporte', 'expense', '#3b82f6', 'Car'),
('Alimentação', 'expense', '#22c55e', 'Utensils'),
('Saúde', 'expense', '#f59e0b', 'Heart'),
('Educação', 'expense', '#8b5cf6', 'BookOpen'),
('Lazer e Entretenimento', 'expense', '#ec4899', 'Gamepad2'),
('Vestuário e Cuidados Pessoais', 'expense', '#06b6d4', 'Shirt'),
('Dívidas e Empréstimos', 'expense', '#dc2626', 'CreditCard'),
('Investimentos', 'expense', '#10b981', 'TrendingUp'),
('Despesas Diversas', 'expense', '#6b7280', 'Package'),
('Outros', 'expense', '#9ca3af', 'MoreHorizontal'),

-- Categorias de Receitas
('Salário', 'income', '#22c55e', 'Banknote'),
('Freelance', 'income', '#3b82f6', 'Laptop'),
('Investimentos', 'income', '#10b981', 'TrendingUp'),
('Aluguéis', 'income', '#f59e0b', 'Building'),
('Vendas', 'income', '#8b5cf6', 'ShoppingCart'),
('Prêmios', 'income', '#ec4899', 'Award'),
('Outros', 'income', '#9ca3af', 'MoreHorizontal');