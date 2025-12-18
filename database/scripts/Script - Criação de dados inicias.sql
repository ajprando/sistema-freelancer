-- Inserir freelancers
INSERT INTO "freelancer" (nome, email, senha)
VALUES 
('Mariana Santos', 'mariana.santos@email.com', 'senha123'),
('Carlos Almeida', 'carlos.almeida@email.com', 'senha456');

-- Inserir clientes
INSERT INTO "cliente" (nome, email, telefone)
VALUES
('Empresa TechWave', 'contato@techwave.com', '(11) 91234-5678'),
('Empresa Soluções Alpha', 'alpha@empresaalpha.com', '(21) 99876-5432');

-- Inserir projetos
INSERT INTO "projeto" (nome, descricao, status, valor_total, freelancer_id, cliente_id)
VALUES
(
  'Sistema Web de Gestão', 
  'Desenvolvimento de plataforma completa em React.', 
  'ativo', 
  15000.00, 
  (SELECT id FROM freelancer LIMIT 1), 
  (SELECT id FROM cliente LIMIT 1)
),
(
  'Landing Page Promocional', 
  'Criação de landing page otimizada para vendas.', 
  'planejamento', 
  3500.00, 
  (SELECT id FROM freelancer ORDER BY id DESC LIMIT 1), 
  (SELECT id FROM cliente ORDER BY id DESC LIMIT 1)
);

-- Inserir atividades
INSERT INTO "atividade" (descricao, valor_hora, status, projeto_id)
VALUES
(
  'Desenvolvimento Frontend', 
  120.00, 
  'em_andamento', 
  (SELECT id FROM projeto LIMIT 1)
),
(
  'Criação de Layout', 
  95.00, 
  'pendente', 
  (SELECT id FROM projeto ORDER BY id DESC LIMIT 1)
);

-- Inserir registro de horas
INSERT INTO "registro_horas" (inicio, fim, duracao_minutos, atividade_id)
VALUES
(
  '2025-01-10 09:00:00', 
  '2025-01-10 12:00:00', 
  180, 
  (SELECT id FROM atividade LIMIT 1)
),
(
  '2025-01-11 14:00:00', 
  '2025-01-11 17:30:00', 
  210, 
  (SELECT id FROM atividade ORDER BY id DESC LIMIT 1)
);

-- Inserir pagamentos
INSERT INTO "pagamento" (valor, status, codigo_pix, projeto_id)
VALUES
(
  5000.00, 
  'pago', 
  'PIX-123456789', 
  (SELECT id FROM projeto LIMIT 1)
),
(
  1200.00, 
  'pendente', 
  'PIX-987654321', 
  (SELECT id FROM projeto ORDER BY id DESC LIMIT 1)
);
