-- Inserir clientes mockados diretamente na tabela clients
-- usando profiles fictícios com user_id nulo (para demonstração)
WITH mock_profiles AS (
  INSERT INTO public.profiles (id, user_id, full_name, email, phone, user_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', NULL, 'João Silva Santos', 'joao.silva@empresa1.com.br', '+55 11 99999-1111', 'client'),
  ('550e8400-e29b-41d4-a716-446655440002', NULL, 'Maria Oliveira Lima', 'maria.oliveira@empresa2.com.br', '+55 11 99999-2222', 'client'),
  ('550e8400-e29b-41d4-a716-446655440003', NULL, 'Carlos Roberto Souza', 'carlos.souza@empresa3.com.br', '+55 11 99999-3333', 'client'),
  ('550e8400-e29b-41d4-a716-446655440004', NULL, 'Ana Paula Costa', 'ana.costa@empresa4.com.br', '+55 11 99999-4444', 'client'),
  ('550e8400-e29b-41d4-a716-446655440005', NULL, 'Pedro Henrique Alves', 'pedro.alves@empresa5.com.br', '+55 11 99999-5555', 'client'),
  ('550e8400-e29b-41d4-a716-446655440006', NULL, 'Fernanda Santos', 'fernanda.santos@empresa6.com.br', '+55 11 99999-6666', 'client'),
  ('550e8400-e29b-41d4-a716-446655440007', NULL, 'Ricardo Pereira', 'ricardo.pereira@empresa7.com.br', '+55 11 99999-7777', 'client'),
  ('550e8400-e29b-41d4-a716-446655440008', NULL, 'Juliana Ferreira', 'juliana.ferreira@empresa8.com.br', '+55 11 99999-8888', 'client')
  RETURNING id, full_name
),
mock_clients AS (
  INSERT INTO public.clients (id, profile_id, client_type, company_name, subscription_status, subscription_plan, monthly_fee, trial_start_date, trial_end_date, can_upgrade) 
  SELECT 
    ('650e8400-e29b-41d4-a716-44665544000' || row_number() OVER())::uuid,
    mp.id,
    'business',
    CASE 
      WHEN mp.full_name = 'João Silva Santos' THEN 'Empresa ABC Ltda'
      WHEN mp.full_name = 'Maria Oliveira Lima' THEN 'Tech Solutions S.A.'
      WHEN mp.full_name = 'Carlos Roberto Souza' THEN 'Consultoria XYZ'
      WHEN mp.full_name = 'Ana Paula Costa' THEN 'Digital Marketing Pro'
      WHEN mp.full_name = 'Pedro Henrique Alves' THEN 'Construções PDH'
      WHEN mp.full_name = 'Fernanda Santos' THEN 'Advocacia Santos & Associados'
      WHEN mp.full_name = 'Ricardo Pereira' THEN 'Contabilidade RP'
      WHEN mp.full_name = 'Juliana Ferreira' THEN 'Design Studio JF'
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
  FROM mock_profiles mp
  RETURNING id
)
-- Inserir faturas fictícias para os clientes criados
INSERT INTO public.invoices (id, client_id, invoice_number, amount, currency, due_date, issue_date, status, payment_method, payment_date, description)
SELECT 
  gen_random_uuid(),
  mc.id,
  'FAT-2024' || LPAD((row_number() OVER())::text, 2, '0') || '-' || LPAD(FLOOR(random() * 9999 + 1)::text, 4, '0'),
  CASE 
    WHEN row_number() OVER() % 3 = 0 THEN 29.90
    WHEN row_number() OVER() % 3 = 1 THEN 59.90
    ELSE 89.90
  END,
  'BRL',
  now() + interval '30 days',
  now() - interval '5 days',
  CASE 
    WHEN row_number() OVER() % 4 = 0 THEN 'pendente'
    WHEN row_number() OVER() % 4 = 1 THEN 'paga'
    WHEN row_number() OVER() % 4 = 2 THEN 'vencida'
    ELSE 'cancelada'
  END,
  CASE 
    WHEN row_number() OVER() % 3 = 0 THEN 'PIX'
    WHEN row_number() OVER() % 3 = 1 THEN 'Boleto'
    ELSE 'Cartão de Crédito'
  END,
  CASE 
    WHEN row_number() OVER() % 4 = 1 THEN now() - interval '2 days'
    ELSE NULL
  END,
  'Mensalidade do sistema de gestão financeira'
FROM mock_clients mc
CROSS JOIN generate_series(1, 2); -- 2 faturas por cliente