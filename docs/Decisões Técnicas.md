# 📑 Decisões Técnicas

**Este documento apresenta as decisões técnicas adotadas no desenvolvimento do sistema, descrevendo as tecnologias, ferramentas e abordagens arquiteturais escolhidas, bem como justificativas para cada escolha. O objetivo é evidenciar os critérios técnicos considerados, como organização de código, escalabilidade, manutenção, desempenho e aderência aos requisitos do projeto. As decisões aqui registradas servem como referência para a implementação, testes, deploy e evolução do sistema, garantindo transparência e coerência técnica ao longo do desenvolvimento.**

## Sumário
- [1. Back-end](#1-back-end)
  - [1.1 Tecnologias](#11-tecnologias)
  - [1.2 Justificativa](#12-justificativa)
- [2. Front-end](#2-front-end)
  - [2.1 Tecnologias](#21-tecnologias)
  - [2.2 Justificativa](#22-justificativa)
- [3. Banco de dados](#3-banco-de-dados)
  - [3.1 Tecnologias](#31-tecnologias)
  - [3.2 Justificativa](#32-justificativa)
- [4. Comunicação em Tempo Real](#4-comunicação-em-tempo-real)
  - [4.1 Tecnologias](#41-tecnologias)
  - [4.2 Justificativa](#42-justificativa)
- [5. Integração com PIX](#5-integração-com-pix)
  - [5.1 Tecnologias](#51-tecnologias)
  - [5.2 Justificativa](#52-justificativa)
- [6. Deploy e Infraestrutura](#6-deploy-e-infraestrutura)
  - [6.1 Tecnologias](#61-tecnologias)
  - [6.2 Justificativa](#62-justificativa)

# 1. Back-end

## 1.1 Tecnologias

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/-NestJs-ea2845?style=flat-square&logo=nestjs&logoColor=white">

## 1.2 Justificativa

O backend da aplicação foi desenvolvido utilizando NestJS em conjunto com TypeScript. Essa escolha se justifica pela necessidade de uma arquitetura bem estruturada, modular e escalável, facilitando a separação de responsabilidade e a manutençõa do código ao longo do projeto. O NestJS oferece suporte nativo a construção de APIs REST e a comunicação em tempo real por meio do WebSocket, atendendo diretamente aos requisitos técnicos estabelecidos. Além disso, o uso do TypeScript contribui para a redução de erros em tempo de execução, proporcionado maior segurança e previsibilidade no desenvolvimento.

# 2. Front-end

## 2.1 Tecnologias

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black">

## 2.2 Justificativa 

No frontend, foi adotado a biblioteca React, também utilizando TypeScript, devido a sua abordagem baseada em componentes e a ampla aceitação no mercado. Essa combinação permite a criação de interfaces reutilizáveis, organizadas e de fácil manutenção, além de facilitar a integração com APIs REST e serviços WebSocket. A escolha do React também se deve a sua performance e ao vasto ecossistema de bibliotecas e ferramentas que aceleram o desenvolvimento e aprimoram a experiência do usuário.

# 3. Banco de dados

## 3.1 Tecnologias

<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white">

## 3.2 Justificativa

Como sistema de gerenciamento de banco de dados, foi utilizado o PostgreSQL, um banco de dados relacional robusto e confiável, amplamente utilizado em aplicações de médio e grande porte. Essa escolha está alinhada com a necessidade de modelar relacionamentos complexos entre entidades, garantirr integridade referencial e atender aos requisitos de consistência dos dados. O PostgreSQL oferece excelente desempenho, suporte ao padrão SQL e compatibilidade com ferramentas de mapeamento objeto-relacional, tornando-o adequado para o contexto do projeto.

# 4. Comunicação em Tempo Real

## 4.1 Tecnologias

<img src="https://img.shields.io/badge/WebSocket-4353FF?style=flat&logo=socket.io&logoColor=white">

## 4.2 Justificativa

Para a comunicação em tempo real, foi utilizada a tecnologia WebSocket, que é um protocolo de comunicação que permite troca de dados contínua, persistente e bidirecional entre cliente e servidor. Essa abordagem é essencial para funcionalidades que exigem atualização imediata de dados, como o acompanhamento do tempo de execução das atividades, proporcionando uma experiência mais fluida e responsiva ao usuário em comparação com requisições HTTP tradicionais. 

# 5. Integração com PIX

## 5.1 Tecnologias

<img src="https://img.shields.io/badge/Mercado%20Pago-00B1EA?style=flat&logo=mercadopago&logoColor=white">
<img src="https://img.shields.io/badge/Abacate%20Pay-4CAF50?style=flat&logo=wallet&logoColor=white">

## 5.2 Justificativa

Para a integração com pagamentos via PIX, foram utilizadas as APIs do Mercado Pago e do Abacate Pay, ambas escolhidas por oferecerem suporte nativo ao PIX, documentação acessível e facilidade de integração com aplicações web. O Mercado Pago foi adotado por sua estabilidade e ampla utilização no mercado, enquanto o Abacate Pay foi incluído como uma alternativa mais simples, adequada ao contexto acadêmico do projeto. As duas soluções permitem a geração de cobranças, o armazenamento das informações de pagamento e o acompanhamento do status das transações, atendendo de forma eficiente aos requisitos de faturamento do sistema.

# 6. Deploy e Infraestrutura

## 6.1 Tecnologias

<img src="https://img.shields.io/badge/Railway-0B0D0E?style=flat&logo=railway&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white">

---

## 6.2 Justificativa

O deploy da aplicação foi realizado utilizando a plataforma Railway. Ele foi escolhido por oferecer uma solução simples e eficiente de *Platform as a Service (PaaS)*, com suporte nativo a aplicações Node.js e banco de dados PostgreSQL. A plataforma permite integração direta com o GitHub, possibilitando deploy automático a cada atualização do código, além da configuração centralizada de variáveis de ambiente, garantindo segurança e praticidade no gerenciamento da infraestrutura. Essa escolha atende adequadamente às necessidades do projeto, reduzindo a complexidade de deploy e manutenção.

