# 📑 Arquitetura do Sistema

**Este documento define a arquitetura base do sistema, servindo como referência para o desenvolvimento, testes, deploy e apresentação final. A estrutura proposta atende aos requisitos técnicos e funcionais do projeto, garantindo clareza, organização e escalabilidade.**

## Sumário
- [1. Visão Geral](#1-visão-geral)
- [2. Objetivos da Arquitetura](#2-objetivos-da-arquitetura)
- [3. Visão Geral da Arquitetura](#3-visão-geral-da-arquitetura)
- [4. Arquitetura Lógica](#4-arquitetura-lógica)
  - [4.1 Camada de Apresentação (Front-end)](#41-camada-de-apresentação-front-end)
  - [4.2 Camada de Aplicação (Back-end)](#42-camada-de-aplicação-back-end)
  - [4.3 Camada de Comunicação em Tempo Real (WebSocket)](#43-camada-de-comunicação-em-tempo-real-websocket)
  - [4.4 Camada de Persistência](#44-camada-de-persistência)
  - [4.5 Integrações Externas](#45-integrações-externas)
    - [API de Pagamento PIX (Mercado Pago / Abacate Pay)](#api-de-pagamento-pix-mercado-pago--abacate-pay)
- [5. Arquitetura Física](#5-arquitetura-física)
- [6. Tecnologias Utilizadas](#6-tecnologias-utilizadas)
- [7. Deploy da Aplicação](#7-deploy-da-aplicação)
- [8. Segurança](#8-segurança)

---

## 1. Visão Geral

O sistema de gestão de serviços freelancers será desenvolvido como uma aplicação web, com separação entre front-end, back-end e camada de persistência de dados. O sistema permite o gerenciamento de clientes, projetos, atividades, controle de horas trabalhadas em tempo real e pagamento via PIX.

A arquitetura foi definida com foco em:
- Separação de responsabilidades.
- Facilidade de manutenção e evolução.
- Aderência aos requisitos funcionais e não funcionais.
- Suporte à comunicação síncrona (REST) e assíncrona (WebSocket).

---

## 2. Objetivos da Arquitetura

- Garantir integração entre front-end e back-end via API REST.
- Implementar os requisitos funcionais RF01 a RF05 de forma clara, testável e rastreável.
- Permitir comunicação em tempo real para controle de horas utilizando WebSocket.
- Utilizar banco de dados relacional PostgreSQL para persistência e integridade dos dados.
- Facilitar testes, manutenção e evolução do sistema.
- Atender aos requisitos acadêmicos e técnicos do projeto.

---

## 3. Visão Geral da Arquitetura

O sistema adota uma arquitetura em camadas, utilizando tecnologias modernas amplamente adotadas no mercado. A arquitetura está organizada nas seguintes camadas:

1. Camada de Apresentação (Front-end).
2. Camada de Aplicação (Back-end / API REST).
3. Camada de Comunicação em Tempo Real (WebSocket).
4. Camada de Persistência (Banco de Dados Relacional).
5. Integrações Externas (API de Pagamento PIX).

Essa separação reduz o acoplamento entre os componentes, favorecendo a testabilidade e a manutenção do sistema.

---

## 4. Arquitetura Lógica

### 4.1 Camada de Apresentação (Front-end)

Implementada com React e TypeScript, esta camada é responsável pela interação direta com o usuário.

Principais responsabilidades:
- Implementar as telas relacionadas aos requisitos funcionais RF01 a RF05.
- Disponibilizar telas de cadastro, edição, listagem e consulta de clientes, projetos e atividades.
- Permitir o controle do cronômetro de atividades e visualização do tempo em tempo real.
- Consumir a API REST desenvolvida em NestJS.
- Estabelecer conexão WebSocket para recebimento de atualizações em tempo real.
- Realizar validações básicas de dados no lado do cliente.

O front-end se comunica exclusivamente com o back-end por meio de requisições HTTP (REST) e WebSocket.

---

### 4.2 Camada de Aplicação (Back-end)

Implementada com NestJS e TypeScript, esta camada concentra as regras de negócio e a orquestração das funcionalidades do sistema.

Principais responsabilidades:
- Expor endpoints REST para atender aos requisitos funcionais RF01 a RF05.
- Implementar validações e regras de negócio.
- Processar dados recebidos do front-end.
- Gerenciar a persistência dos dados no PostgreSQL.
- Integrar com APIs de pagamento via PIX para geração e acompanhamento de pagamentos.
- Gerenciar conexões WebSocket para comunicação em tempo real.

O back-end segue a arquitetura interna baseada em:
- Controllers (camada de entrada).
- Services (regras de negócio).
- Repositories (acesso a dados).

---

### 4.3 Camada de Comunicação em Tempo Real (WebSocket)

Esta camada atende aos requisitos funcionais relacionados ao registro e acompanhamento de horas trabalhadas.

Principais responsabilidades:
- Iniciar e encerrar cronômetros de atividades.
- Enviar atualizações de tempo em tempo real ao front-end.
- Registrar automaticamente os tempos trabalhados no banco de dados.

A implementação é realizada no back-end com NestJS, utilizando suporte nativo a WebSocket integrado à lógica de negócio.

---

### 4.4 Camada de Persistência

Responsável pelo armazenamento e gerenciamento dos dados do sistema.

Características:
- Banco de dados relacional PostgreSQL.
- Uso de chaves primárias e estrangeiras.
- Relacionamentos do tipo 1:N e N:N.
- Garantia de integridade referencial.

Entidades persistidas:
- Cliente.
- Projeto.
- Atividade.
- Registro de Horas.
- Pagamento.
- Freelancer.

---

### 4.5 Integrações Externas

#### API de Pagamento PIX (Mercado Pago / Abacate Pay)

A integração com pagamento é realizada por meio das APIs do Mercado Pago e Abacate Pay, utilizando o método PIX, atendendo ao requisito funcional RF05.

Responsabilidades:
- Gerar cobranças PIX associadas a projetos concluídos.
- Armazenar informações do pagamento e seu status.
- Atualizar o status do pagamento conforme retorno da API.

A comunicação ocorre via API REST, seguindo as boas práticas definidas pelos provedores.

---

## 5. Arquitetura Física

A aplicação é composta por:
- Front-end hospedado em ambiente web.
- Back-end hospedado em servidor de aplicação.
- Banco de dados relacional em servidor dedicado ou serviço gerenciado.

Todos os componentes se comunicam através da internet utilizando os protocolos HTTP/HTTPS e WebSocket.

---

## 6. Tecnologias Utilizadas

1. Front-end: React + TypeScript.
2. Back-end: NestJS + TypeScript.
3. Banco de dados: PostgreSQL.
4. Comunicação em tempo real: WebSocket.
5. Integração de pagamentos: API Mercado Pago e Abacate Pay (PIX).
6. Controle de versão: Git e GitHub.
7. Documentação: Notion.
8. Gerenciamento do projeto: Jira.
9. Deploy: Railway.

---

## 7. Deploy da Aplicação

O deploy da aplicação foi realizado utilizando a plataforma Railway, que oferece infraestrutura como serviço (PaaS), simplificando o processo de publicação, gerenciamento e escalabilidade da aplicação.

A estratégia de deploy adotada contempla:
- Deploy do back-end NestJS como um serviço web, configurado para execução em ambiente Node.js.
- Deploy do banco de dados PostgreSQL como serviço gerenciado pela própria plataforma Railway.
- Configuração de variáveis de ambiente sensíveis (credenciais de banco de dados, chaves das APIs de pagamento e segredos de autenticação) diretamente na plataforma.
- Integração contínua com o repositório GitHub, permitindo deploy automático a cada push na branch principal.

A comunicação entre os serviços ocorre por meio de endpoints públicos fornecidos pela Railway, utilizando protocolos HTTP/HTTPS e WebSocket.

---

## 8. Segurança

Medidas adotadas:
- Validação de dados de entrada no back-end.
- Separação de responsabilidades entre camadas.
- Controle de acesso às funcionalidades do sistema.
- Uso de HTTPS para comunicação segura entre os componentes.
