-- Adicionar campo profile_type para separar dados pessoais e empresariais
ALTER TABLE public.expenses ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.incomes ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.transactions ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.debts ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.financial_goals ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.vehicles ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.vehicle_expenses ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';
ALTER TABLE public.vehicle_maintenance ADD COLUMN profile_type text NOT NULL DEFAULT 'personal';

-- Adicionar constraints para garantir valores válidos
ALTER TABLE public.expenses ADD CONSTRAINT expenses_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.incomes ADD CONSTRAINT incomes_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.transactions ADD CONSTRAINT transactions_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.debts ADD CONSTRAINT debts_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.financial_goals ADD CONSTRAINT financial_goals_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.vehicle_expenses ADD CONSTRAINT vehicle_expenses_profile_type_check CHECK (profile_type IN ('personal', 'business'));
ALTER TABLE public.vehicle_maintenance ADD CONSTRAINT vehicle_maintenance_profile_type_check CHECK (profile_type IN ('personal', 'business'));