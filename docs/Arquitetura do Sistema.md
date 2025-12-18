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
    - [API de Pagamento PIX (Mercado Pago)](#api-de-pagamento-pix-mercado-pago)
  - [5. Arquitetura Física](#5-arquitetura-física)
  - [6. Tecnologias Utilizadas](#6-tecnologias-utilizadas)
  - [7. Segurança](#7-segurança)

# 1. Visão Geral

O sistema de gestão de serviços freelancers será desenvolvido como um aplicação web, com separação entre front-end, back-end e camada de persistência de dados. O sistema permite o gerenciamento de clientes, projetos, atividades, controle de horas trabalhadas em tempo real e pagamento via PIX.

A arquitetura foi definida com foco em: 
* Separação de responsabilidades.
* Escalabilidade e manutenção.
* Aderência aos requisitos funcionais e técnicos do projeto.
* Facilidade de integração entre os componentes.

# 2. Objetivos da Arquitetura

* Garantir integração entre Front-end e Back-end via API REST.
* Implementar os requisitos funcionais RF01 a RF05 de forma clara e testável.
* Permitir comunicação em tempo real utilizando WebSocket.
* Utilizar banco de dados relacional PostgreSQL para persistência.
* Facilitar testes, manutenção, e evolução do sistema.
* Atender aos requisitos acadêmicos e técnicos do projeto.

# 3. Visão Geral da Arquitetura 

O sistema adota uma arquitetura em camadas, utilizando tecnologias modernas amplamente adotadas no mercado.
A arquitetura será organizada nas seguintes camadas:
1. Camada de Apresentação (Front-end).
2. Camada de Aplicação (Back-end / API REST).
3. Camada de Comunicação em tempo Real (WebSocket).
4. Camada de Persistência (Banco de Dados Relacional).
5. Integrações Externas (API de Pagamento PIX).

Essa separação reduz acoplamento e facilita manutenção e testes.

# 4. Arquitetura Lógica

## 4.1 Camada de Apresentação (Front-end)

Implementada com React + TypeScript, esta camada é responsável pela interação com o usuário.

Principais responsabilidades:
* Implementar as telas relacionadas aos requisitos funcionais RF01 a RF05.
* Exibir telas de cadastro de consulta de clientes, projetos e atividades.
* Permitir o controle de cronômetro de atividades em tempo real (RF03 e RF04).
* Consumir a API REST desenvolvida em NestJS.
* Estabelecer conexão WebSocket para atualização em tempo real.
* Realizar validações de dados no lado do cliente.

O front-end se comunica exclusivamente com o back-end por meio de requisições HTTP (REST) e WebSocket.

## 4.2 Camada de Aplicação (Back-end)

Implementada com NestJS + TypeScript, esta camada concentra as regras de negócios e a orquestração do sistema.
Principais responsabilidades:
* Expor endpoints REST para atender aos requisitos funcionais RF01 a RF05.
* Implementar validações e regras de negócios.
* Processar dados recebidas do front-end.
* Gerenciar persistência dos dados no PostgreSQL.
* Integrar com a API do Mercado Pago para pagamentos via PIX (RF05).
* Gerenciar conexões WebSocket para comunicação em tempo real (RF03 e RF04).

O Back-end segue a arquitetura interna baseada em:
* Controllers (camada de entrada).
* Services (regras de negócios).
* Repositories (acesso a dados).

## 4.3 Camada de Comunicação em Tempo Real (WebSocket)

Esta camada atende aos requisitos funcionais RF03 e RF04, permitindo o acompanhamento em tempo real da execução das atividades.

Principais responsabilidades:
* Iniciar e encerrar cronômetros de atividades.
* Enviar atualizações de tempo em tempo real ao front-end.
* Registrar automaticamente os tempos trabalhadas no banco de dados.

A implementação é realizada no back-end NestJS, utilizando WebSocket integrado a lógica de negócio.

## 4.4 Camada de Persistência 

Responsável pelo armazenamento dos dados do sistema.

Características:
* Banco de dados relacional PostgreSQL.
* Uso de chaves primárias e estrangeiras.
* Relacionamentos 1:N e N:N.
* Garantia de integridade referencial.

Entidades persistidas: 
* Cliente (RF01).
* Projeto (RF02).
* Atividade (RF03).
* Registro de Horas (RF03 e RF04).
* Pagamento (RF05).
* Freelancer.

## 4.5 Integrações Externas

### API de Pagamento PIX (Mercado Pago)

A integração com pagamento é realizada por meio da API do Mercado Pago, utilizando o método PIX, atendendo ao requisito funcional RF05.

Responsabilidades:
* Gerar cobranças PIX associadas a projetos.
* Armazenar código e status do pagamento.
* Atualizar o status do pagamento conforme retorno da API.

A comunicação ocorre via API REST, seguindo as boas práticas definidas pelo provedor.

## 5. Arquitetura Física

A aplicação é composta por: 
* Front-end hospedado em ambiente web.
* Back-end hospedado em servidor de aplicação.
* Banco de dados relacional em servidor dedicado ou serviço gerenciado.

Todos os componentes se comunicam através da internet utilizando protocolos HTTP/HTTPS e WebSocket.

## 6. Tecnologias Utilizadas

1. Front-end: React + TypeScript.
2. Back-end: NestJS + TypeScript.
3. Banco de dados:  PostgreSQL.
4. Comunicação em tempo real: WebSocket.
5. Integração de pagamentos: API Mercado Pago (PIX).
6. Controle de versão: Git e GitHub.
7. Documentação: Notion.
8. Gerenciamento do projeto: Jira.

## 7. Segurança

Medidas adotadas:
* Validações de dados de entrada.
* Separação de responsabilidades entre camadas.
* Controle de acesso as funcionalidades do sistema.
* Uso de HTTPS para comunicação.

