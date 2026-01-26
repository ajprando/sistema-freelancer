# 💼 Sistema Freelancer

O **Sistema Freelancer** é uma aplicação web desenvolvida para auxiliar profissionais freelancers na gestão de seus serviços, permitindo o controle de clientes, projetos, atividades, registro de horas trabalhadas e geração de cobranças via PIX.

O sistema foi projetado com foco em organização, simplicidade e acompanhamento em tempo real do trabalho executado, oferecendo uma visão centralizada das atividades e dos pagamentos associados a cada projeto.

## 📌 Funcionalidades principais

- Cadastro e gerenciamento de clientes.
- Cadastro e gerenciamento de projetos vinculados a clientes.
- Cadastro de atividades com definição de valor por hora.
- Registro e acompanhamento do tempo trabalhado por atividade em tempo real.
- Comunicação em tempo real utilizando WebSocket para controle de horas.
- Geração e acompanhamento de cobranças via PIX.
- Integração com gateways de pagamento Mercado Pago e Abacate Pay.
- Controle de acesso às funcionalidades do sistema.

## 📁 Organização do Repositório
O repositório está organizado nas seguintes pastas: docs, diagrams, sprints, database, backend, frontend.

### 📁 docs/
Reúne toda a documentação do projeto.

 - **Escopo do Sistema:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/sprints/Sprint%201.md

 - **Requisitos do Sistema:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/Requisitos%20do%20Sistema.md

 - **Decisões Técnicas:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/Decis%C3%B5es%20T%C3%A9cnicas.md

 - **Arquitetura do Sistema:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/Arquitetura%20do%20Sistema.md

 - **Guia de Versionamento:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/Guia%20de%20Versionamento.md

 - **Deploy:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/Deploy%20no%20Railway.md

 - **JSON do postman:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/docs/sistema-freelancer.postman_collection.json


### 📁 diagrams/
Contém os diagramas do sistema.

 - **Diagrama de Classes:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20Classes.png

 - **Diagrama Entidade-Relacionamento:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20Entidade-Relacionamento.png

 - **Diagramas de Atividades:**  
  → Freelancer: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20Atividade%20-%20Freelancer.png

   → Cliente: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20Atividade%20-%20Cliente.png

 - **Diagramas de Sequências:**  
  → Login: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20sequencia%20-%20Login.png

   → Criar projetos: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20sequencia%20-%20Criar%20projeto.png

   → Registrar horas: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20sequencia%20-%20Gerar%20pagamento.png

   → Gerar pagamento: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20sequencia%20-%20Gerar%20pagamento.png

   → Realizar pagamento: https://github.com/ajprando/sistema-freelancer/blob/main/diagrams/Diagrama%20de%20sequencia%20-%20Realizar%20pagamento.png


### 📁 sprints/
Contém os materiais relacionados ao planejamento e acompanhamento das sprints.

 - **Sprint 1:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/sprints/Sprint%201.md

  - **Sprint 2:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/sprints/Sprint%202.md

  - **Sprint 3:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/sprints/Sprint%203.md

  - **Sprint 4:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/sprints/Sprint%204.md
  

### 📁 database/
Contém os artefatos relacionados ao banco de dados, incluindo scripts SQL iniciais.

 - **Script - Criação de dados iniciais:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/database/scripts/Script%20-%20Cria%C3%A7%C3%A3o%20de%20dados%20inicias.sql

 - **Script - Criação de tabelas:**  
  → https://github.com/ajprando/sistema-freelancer/blob/main/database/scripts/Script%20-%20Cria%C3%A7%C3%A3o%20de%20tabelas.sql


### 📁 backend/
Contém a aplicação back-end desenvolvida em NestJS, responsável pela implementação da API REST, regras de negócio, comunicação em tempo real via WebSocket, persistência de dados e integrações externas.

Além da documentação completa do backend, com instruções de uso: 
https://github.com/ajprando/sistema-freelancer/blob/main/backend/README.md


### 📁 frontend/
Contém a aplicação front-end desenvolvida em React, responsável pela interface com o usuário, consumo da API REST, comunicação via WebSocket e apresentação das funcionalidades do sistema.

Além da documentação completa do frontend, com instruções de uso: https://github.com/ajprando/sistema-freelancer/blob/main/frontend/README.md




