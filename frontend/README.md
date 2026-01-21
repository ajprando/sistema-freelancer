# 💻 Frontend

## Visão Geral

O frontend do **Sistema Freelancer** é responsável pela interface do usuário, consumo das APIs do backend e interação em tempo real quando aplicável. A aplicação foi construída com **Vite**, **TypeScript** e **Tailwind CSS**, seguindo uma arquitetura modular.

## Principais Tecnologias

* **Vite**
* **TypeScript**
* **Tailwind CSS**
* **Node.js**
* Comunicação via **API REST** e **WebSocket**

## Estrutura de Pastas

```
frontend/
├─ client/        # Aplicação cliente
├─ server/        # Configurações de servidor (se aplicável)
├─ shared/        # Código e tipos compartilhados
├─ tailwind.config.ts
├─ vite.config.ts
├─ .env           # Variáveis de ambiente
└─ package.json
```

## Pré-requisitos

* Node.js (versão recomendada: LTS)
* Gerenciador de pacotes (**npm** ou **pnpm**)

## Configuração do Ambiente

1. Acesse a pasta do frontend:

   ```bash
   cd frontend
   ```
2. Instale as dependências:

   ```bash
   npm install
   # ou
   pnpm install
   ```
3. Configure o arquivo `.env` com a URL do backend, por exemplo:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

## Executando a Aplicação

* Ambiente de desenvolvimento:

  ```bash
  npm run dev
  ```
* Build para produção:

  ```bash
  npm run build
  npm run preview
  ```

## Integração com Backend

* As chamadas HTTP utilizam a URL configurada em `VITE_API_URL`
* Para funcionalidades em tempo real, o frontend se conecta ao WebSocket exposto pelo backend

## Padrões e Boas Práticas

* Componentes reutilizáveis
* Separação de responsabilidades por domínio
* Estilização centralizada com Tailwind



