# 📦 Deploy no Railway 

**Este documento descreve o processo de deploy do Sistema Freelancer utilizando a plataforma Railway, servindo como referência técnica para reprodução do ambiente, validação do funcionamento e apresentação do projeto. O deploy foi estruturado com separação clara entre banco de dados, back-end e front-end, garantindo organização, escalabilidade e facilidade de manutenção.**

## Sumário

* [1. Visão Geral](#1-visão-geral)
* [2. Contexto do Deploy](#2-contexto-do-deploy)
* [3. Criação do Projeto no Railway](#3-criação-do-projeto-no-railway)
* [4. Configuração do Banco de Dados (PostgreSQL)](#4-configuração-do-banco-de-dados-postgresql)
* [5. Deploy do Back-end (NestJS + Prisma)](#5-deploy-do-back-end-nestjs--prisma)

  * [5.1 Criação do Serviço](#51-criação-do-serviço)
  * [5.2 Deploy via CLI](#52-deploy-via-cli)
  * [5.3 Variáveis de Ambiente](#53-variáveis-de-ambiente)
  * [5.4 Domínio Público do Back-end](#54-domínio-público-do-back-end)
* [6. Deploy do Front-end (React + Vite)](#6-deploy-do-front-end-react--vite)

  * [6.1 Estrutura e Configuração do Front-end](#61-estrutura-e-configuração-do-front-end)
  * [6.2 Criação do Serviço](#62-criação-do-serviço)
  * [6.3 Deploy via CLI](#63-deploy-via-cli)
  * [6.4 Variáveis de Ambiente](#64-variáveis-de-ambiente)
  * [6.5 Domínio Público do Front-end](#65-domínio-público-do-front-end)
* [7. Ajustes Finais (CORS)](#7-ajustes-finais-cors)
* [8. Validação e Testes](#8-validação-e-testes)
* [9. Problemas Encontrados e Soluções](#9-problemas-encontrados-e-soluções)
* [10. Anexo — Comandos Utilizados](#10-anexo--comandos-utilizados)

# 1. Visão Geral

O deploy do Sistema Freelancer foi realizado na plataforma Railway, utilizando um único projeto com múltiplos serviços independentes. A estratégia adotada garante separação de responsabilidades entre os componentes da aplicação e maior controle sobre configuração, logs e escalabilidade.

# 2. Contexto do Deploy

O projeto foi estruturado com três serviços principais dentro do Railway:

* Banco de dados PostgreSQL.
* Back-end desenvolvido em NestJS com Prisma ORM.
* Front-end desenvolvido em React com Vite, incluindo um servidor Node.js gerado no processo de build.

Cada componente foi configurado como um serviço independente dentro do mesmo projeto Railway.

# 3. Criação do Projeto no Railway

O processo iniciou com a criação de um projeto vazio:

* Acesso à plataforma Railway.
* Seleção da opção **New Project**.
* Criação de um **Empty Project**.

Em seguida, foi instalado e configurado o Railway CLI:

* Instalação global do CLI.
* Autenticação via terminal utilizando a conta Railway.

# 4. Configuração do Banco de Dados (PostgreSQL)

O banco de dados foi criado diretamente pela interface do Railway:

* Dentro do projeto, seleção de **+ New**.
* Opção **Database > Add PostgreSQL**.
* Aguardo da inicialização automática do serviço.

Após a criação, foi obtida a variável **DATABASE_URL**, utilizada posteriormente na configuração do back-end para conexão com o banco de dados.

# 5. Deploy do Back-end (NestJS + Prisma)

## 5.1 Criação do Serviço

Foi criado um serviço dedicado ao back-end:

* **+ New > Empty Service**.
* Renomeado para **Backend** para melhor organização.

## 5.2 Deploy via CLI

O deploy foi realizado via Railway CLI:

* Navegação até o diretório do back-end.
* Vinculação do diretório local ao serviço Backend no ambiente de produção.
* Execução do comando de deploy.

O processo de build e inicialização foi acompanhado pelos logs disponibilizados no painel do Railway.

## 5.3 Variáveis de Ambiente

As seguintes variáveis foram configuradas no serviço Backend:

* **DATABASE_URL**: string de conexão do PostgreSQL.
* **JWT_SECRET**: chave utilizada para autenticação JWT.
* **NODE_ENV**: definido como `production`.
* **CORS_ORIGIN**: configurado posteriormente com a URL pública do front-end.

## 5.4 Domínio Público do Back-end

Após o deploy, foi gerado um domínio público em:

* **Backend > Settings > Networking > Generate Domain**.

Este domínio passou a ser utilizado como base para consumo da API pelo front-end.

# 6. Deploy do Front-end (React + Vite)

## 6.1 Estrutura e Configuração do Front-end

O front-end não é apenas uma aplicação estática. O processo de build:

* Gera os arquivos estáticos do Vite.
* Cria um servidor Node.js (`dist/index.js`) utilizando esbuild.

O deploy utiliza Nixpacks para definição do ambiente e scripts de build e start apropriados.

## 6.2 Criação do Serviço

Foi criado um serviço independente para o front-end:

* **+ New > Empty Service**.
* Renomeado para **Frontend**.

## 6.3 Deploy via CLI

O fluxo de deploy seguiu o mesmo padrão do back-end:

* Navegação até o diretório do front-end.
* Vinculação ao serviço Frontend no Railway.
* Execução do comando de deploy.

## 6.4 Variáveis de Ambiente

No serviço Frontend, foram configuradas as variáveis:

* **VITE_API_URL**: URL pública do back-end (HTTPS).
* **NODE_ENV**: definido como `production`.

## 6.5 Domínio Público do Front-end

Após o deploy, foi gerado o domínio público do front-end:

* **Frontend > Settings > Networking > Generate Domain**.

# 7. Ajustes Finais (CORS)

Com o domínio do front-end disponível, o back-end foi atualizado para permitir requisições corretamente:

* Atualização da variável **CORS_ORIGIN** com o domínio público completo do front-end (HTTPS).

Esse ajuste foi essencial para evitar bloqueios de requisições por política de CORS.

# 8. Validação e Testes

Para validação do deploy, foram realizados os seguintes testes:

* Acesso ao domínio do front-end.
* Criação de um cadastro de teste no sistema.
* Verificação das requisições entre front-end e back-end.
* Análise dos logs do back-end em caso de falhas.

# 9. Problemas Encontrados e Soluções

Durante o processo de deploy, alguns problemas foram identificados e corrigidos:

* Erros de CORS devido à configuração incorreta da URL do front-end.
* Conflitos de dependências e versões de bibliotecas.
* Falhas de build por ausência dos arquivos de configuração `nixpacks.toml` e `.nvmrc`.

Todos os problemas foram resolvidos com ajustes de configuração e padronização do ambiente.

# 10. Anexo — Comandos Utilizados

Principais comandos executados durante o deploy:

* `railway login`
* `railway link`
* `railway up`
* `railway logs`
* `railway variables`
