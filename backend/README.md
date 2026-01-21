# 💻 Backend

## Visão Geral

Este backend é responsável por prover APIs REST e comunicação em tempo real para o **Sistema Freelancer**, incluindo autenticação, controle de acesso, persistência de dados e integrações externas. O projeto foi desenvolvido em **Node.js** utilizando **NestJS**, com **Prisma ORM** para acesso ao banco de dados.

## Principais Tecnologias

* **Node.js**
* **NestJS**
* **TypeScript**
* **Prisma ORM**
* **JWT** para autenticação
* **WebSocket** para comunicação em tempo real
* **PostgreSQL** (ou outro banco compatível configurado via Prisma)

## Estrutura de Pastas

```
backend/
├─ src/                # Código-fonte principal
├─ prisma/             # Schema e migrations do Prisma
├─ dist/               # Build da aplicação
├─ test-ws.html        # Página de teste para WebSocket
├─ .env                # Variáveis de ambiente
├─ package.json
└─ tsconfig.json
```

## Pré-requisitos

* Node.js (versão recomendada: LTS)
* Gerenciador de pacotes (**npm** ou **pnpm**)
* Banco de dados configurado (ex.: PostgreSQL)

## Configuração do Ambiente

1. Acesse a pasta do backend:

   ```bash
   cd backend
   ```
2. Instale as dependências:

   ```bash
   npm install
   # ou
   pnpm install
   ```
3. Configure o arquivo `.env` com as variáveis necessárias, por exemplo:

   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/sistema_freelancer
   JWT_SECRET=sua_chave_secreta
   ```


## Endpoints API REST

### Autenticação (/auth)

- POST /auth/register — Cadastro de usuário

- POST /auth/login — Autenticação e geração de JWT

### Clientes (/clientes)

- POST /clientes — Criar cliente

- GET /clientes — Listar clientes

- GET /clientes/:id — Buscar cliente por ID

- PATCH /clientes/:id — Atualizar cliente

- DELETE /clientes/:id — Remover cliente

### Freelancers (/freelancers)

- POST /freelancers — Criar freelancer

- GET /freelancers — Listar freelancers

- GET /freelancers/:id — Buscar freelancer por ID

- PATCH /freelancers/:id — Atualizar freelancer

- DELETE /freelancers/:id — Remover freelancer


### Projetos (/projetos)

- POST /projetos — Criar projeto

- GET /projetos — Listar projetos

- GET /projetos/:id — Buscar projeto por ID

- PATCH /projetos/:id — Atualizar projeto

- DELETE /projetos/:id — Remover projeto

### Atividades (/atividades)

- POST /atividades — Criar atividade

- GET /atividades — Listar atividades

- GET /atividades/:id — Buscar atividade por ID

- PATCH /atividades/:id — Atualizar atividade

- DELETE /atividades/:id — Remover atividade

### Registro de Horas (/registro-horas)

- POST /registro-horas — Registrar horas trabalhadas

- GET /registro-horas — Listar registros

- GET /registro-horas/:id — Buscar registro por ID

- PATCH /registro-horas/:id — Atualizar registro

- DELETE /registro-horas/:id — Remover registro

### Pagamentos (/pagamentos)

- POST /pagamentos — Criar pagamento

- GET /pagamentos — Listar pagamentos

- GET /pagamentos/:id — Buscar pagamento por ID

- PATCH /pagamentos/:id — Atualizar pagamento

- DELETE /pagamentos/:id — Remover pagamento

- POST /pagamentos/webhook — Webhook de pagamento

- POST /pagamentos/abacatepay/webhook — Webhook AbacatePay

### Contador / Tempo Real (/contador)

- GET /contador/status — Status do contador em tempo real


## Banco de Dados (Prisma)

* Gerar o cliente Prisma:

  ```bash
  npx prisma generate
  ```
* Executar migrations:

  ```bash
  npx prisma migrate dev
  ```

## Executando a Aplicação

* Ambiente de desenvolvimento:

  ```bash
  npm run start:dev
  ```
* Build para produção:

  ```bash
  npm run build
  npm run start:prod
  ```


## WebSocket

O backend possui suporte a WebSocket para funcionalidades em tempo real. O arquivo `test-ws.html` pode ser utilizado para validar a conexão e eventos.

## Boas Práticas

* Manter variáveis sensíveis apenas no `.env`
* Executar migrations antes de subir a aplicação
* Seguir o padrão de módulos do NestJS

