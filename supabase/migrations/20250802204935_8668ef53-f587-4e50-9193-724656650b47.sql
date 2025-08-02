-- Inserir dados mockados de clientes para demonstração
-- Primeiro, inserir perfis de usuários fictícios
INSERT INTO public.profiles (id, user_id, full_name, email, phone, user_type) VALUES
(gen_random_uuid(), gen_random_uuid(), 'João Silva Santos', 'joao.silva@empresa1.com.br', '+55 11 99999-1111', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Maria Oliveira Lima', 'maria.oliveira@empresa2.com.br', '+55 11 99999-2222', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Carlos Roberto Souza', 'carlos.souza@empresa3.com.br', '+55 11 99999-3333', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Ana Paula Costa', 'ana.costa@empresa4.com.br', '+55 11 99999-4444', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Pedro Henrique Alves', 'pedro.alves@empresa5.com.br', '+55 11 99999-5555', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Fernanda Santos', 'fernanda.santos@empresa6.com.br', '+55 11 99999-6666', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Ricardo Pereira', 'ricardo.pereira@empresa7.com.br', '+55 11 99999-7777', 'client'),
(gen_random_uuid(), gen_random_uuid(), 'Juliana Ferreira', 'juliana.ferreira@empresa8.com.br', '+55 11 99999-8888', 'client');

-- Inserir clientes fictícios baseados nos perfis criados
INSERT INTO public.clients (id, profile_id, client_type, company_name, subscription_status, subscription_plan, monthly_fee, trial_start_date, trial_end_date, can_upgrade) 
SELECT 
  gen_random_uuid(),
  p.id,
  'business',
  CASE 
    WHEN p.full_name = 'João Silva Santos' THEN 'Empresa ABC Ltda'
    WHEN p.full_name = 'Maria Oliveira Lima' THEN 'Tech Solutions S.A.'
    WHEN p.full_name = 'Carlos Roberto Souza' THEN 'Consultoria XYZ'
    WHEN p.full_name = 'Ana Paula Costa' THEN 'Digital Marketing Pro'
    WHEN p.full_name = 'Pedro Henrique Alves' THEN 'Construções PDH'
    WHEN p.full_name = 'Fernanda Santos' THEN 'Advocacia Santos & Associados'
    WHEN p.full_name = 'Ricardo Pereira' THEN 'Contabilidade RP'
    WHEN p.full_name = 'Juliana Ferreira' THEN 'Design Studio JF'
  END,
  CASE 
    WHEN random() < 0.3 THEN 'trial'
    WHEN random() < 0.7 THEN 'active'
    ELSE 'suspended'
  END,
  CASE 
    WHEN random() < 0.5 THEN 'basic'
    ELSE 'premium'
  END,
  CASE 
    WHEN random() < 0.5 THEN 29.90
    ELSE 59.90
  END,
  now() - interval '30 days',
  now() + interval '7 days',
  true
FROM public.profiles p
WHERE p.full_name IN ('João Silva Santos', 'Maria Oliveira Lima', 'Carlos Roberto Souza', 'Ana Paula Costa', 'Pedro Henrique Alves', 'Fernanda Santos', 'Ricardo Pereira', 'Juliana Ferreira');

-- Inserir faturas fictícias para os clientes criados
INSERT INTO public.invoices (id, client_id, invoice_number, amount, currency, due_date, issue_date, status, payment_method, payment_date, description)
SELECT 
  gen_random_uuid(),
  c.id,
  'FAT-2024' || LPAD(FLOOR(random() * 99 + 1)::text, 2, '0') || '-' || LPAD(FLOOR(random() * 9999 + 1)::text, 4, '0'),
  CASE 
    WHEN random() < 0.3 THEN c.monthly_fee
    WHEN random() < 0.6 THEN c.monthly_fee * 2
    ELSE c.monthly_fee * 3
  END,
  'BRL',
  now() + interval '30 days' * random(),
  now() - interval '30 days' * random(),
  CASE 
    WHEN random() < 0.4 THEN 'pendente'
    WHEN random() < 0.7 THEN 'paga'
    WHEN random() < 0.9 THEN 'vencida'
    ELSE 'cancelada'
  END,
  CASE 
    WHEN random() < 0.3 THEN 'PIX'
    WHEN random() < 0.6 THEN 'Boleto'
    WHEN random() < 0.8 THEN 'Cartão de Crédito'
    ELSE 'Transferência'
  END,
  CASE 
    WHEN random() < 0.4 THEN now() - interval '15 days' * random()
    ELSE NULL
  END,
  'Mensalidade do sistema de gestão financeira'
FROM public.clients c
CROSS JOIN generate_series(1, 3) -- Gerar 3 faturas por cliente

UNION ALL

-- Adicionar mais algumas faturas variadas
SELECT 
  gen_random_uuid(),
  c.id,
  'FAT-2024' || LPAD(FLOOR(random() * 99 + 1)::text, 2, '0') || '-' || LPAD(FLOOR(random() * 9999 + 1)::text, 4, '0'),
  FLOOR(random() * 500 + 50)::numeric,
  'BRL',
  now() + interval '60 days' * random(),
  now() - interval '60 days' * random(),
  CASE 
    WHEN random() < 0.5 THEN 'pendente'
    ELSE 'paga'
  END,
  CASE 
    WHEN random() < 0.4 THEN 'PIX'
    WHEN random() < 0.7 THEN 'Boleto'
    ELSE 'Cartão de Crédito'
  END,
  CASE 
    WHEN random() < 0.5 THEN now() - interval '30 days' * random()
    ELSE NULL
  END,
  'Taxa adicional de suporte técnico'
FROM public.clients c
WHERE random() < 0.6; -- Nem todos os clientes terão essa taxa adicional