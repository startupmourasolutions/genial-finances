-- Ativar realtime para as tabelas de transações financeiras
ALTER TABLE transactions REPLICA IDENTITY FULL;
ALTER TABLE incomes REPLICA IDENTITY FULL;
ALTER TABLE expenses REPLICA IDENTITY FULL;

-- Adicionar as tabelas à publication do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE incomes;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;