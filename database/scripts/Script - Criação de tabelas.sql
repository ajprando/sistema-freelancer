CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "freelancer" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" varchar(255) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "senha" varchar(255) NOT NULL,
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "cliente" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" varchar(255) NOT NULL,
  "email" varchar(255),
  "telefone" varchar(20),
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "projeto" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" varchar(255) NOT NULL,
  "descricao" text,
  "status" varchar(50) NOT NULL CHECK (
       status IN ('planejamento', 'ativo', 'concluido', 'cancelado')
  ),
  "valor_total" decimal(10,2) DEFAULT 0,
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "freelancer_id" uuid NOT NULL,
  "cliente_id" uuid NOT NULL
);

CREATE TABLE "atividade" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "descricao" varchar(255) NOT NULL,
  "valor_hora" decimal(10,2) NOT NULL CHECK (valor_hora >= 0),
  "status" varchar(50) NOT NULL CHECK (
      status IN ('pendente', 'em_andamento', 'concluida')
  ),
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "projeto_id" uuid NOT NULL
);

CREATE TABLE "registro_horas" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "inicio" timestamp NOT NULL,
  "fim" timestamp NOT NULL,
  "duracao_minutos" int NOT NULL CHECK (duracao_minutos > 0),
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atividade_id" uuid NOT NULL
);

CREATE TABLE "pagamento" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "valor" decimal(10,2) NOT NULL CHECK (valor > 0),
  "status" varchar(50) NOT NULL CHECK (
      status IN ('pendente', 'pago', 'cancelado')
  ),
  "codigo_pix" varchar(255),
  "criado_em" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "projeto_id" uuid NOT NULL
);

ALTER TABLE "projeto" 
ADD FOREIGN KEY ("freelancer_id") 
REFERENCES "freelancer" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "projeto" 
ADD FOREIGN KEY ("cliente_id") 
REFERENCES "cliente" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "atividade" 
ADD FOREIGN KEY ("projeto_id") 
REFERENCES "projeto" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "registro_horas" 
ADD FOREIGN KEY ("atividade_id") 
REFERENCES "atividade" ("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pagamento" 
ADD FOREIGN KEY ("projeto_id") 
REFERENCES "projeto" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
