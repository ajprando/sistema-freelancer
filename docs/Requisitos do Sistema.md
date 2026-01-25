# 📑 Requisitos do Sistema

**Este documento descreve os requisitos do sistema, especificando de maneira detalhada os requisitos funcionais e não funcionais que orientam o desenvolvimento da aplicação. Os requisitos funcionais definem os comportamentos e funcionalidades que o sistema deve oferecer, enquanto os requisitos não funcionais estabelecem restrições e características de qualidade, como desempenho, segurança, arquitetura e validação de dados. Este conjunto de requisitos serve como referência para implementação, testes e validação do sistema.**

## Sumário
- [1. Requisitos Funcionais](#1-requisitos-funcionais)
  - [RF01 - Gerenciar Clientes](#rf01---gerenciar-clientes)
  - [RF02 - Gerenciar Projetos](#rf02---gerenciar-projetos)
  - [RF03 - Gerenciar Atividades](#rf03---gerenciar-atividades)
  - [RF04 - Registrar Horas Trabalhadas](#rf04---registrar-horas-trabalhadas)
  - [RF05 - Realizar Pagamento via PIX](#rf05---realizar-pagamento-via-pix)
- [2. Requisitos Não Funcionais](#2-requisitos-não-funcionais)
  - [RNF01 - Arquitetura](#rnf01---arquitetura)
  - [RNF02 - Banco de Dados](#rnf02---banco-de-dados)
  - [RNF03 - Desempenho](#rnf03---desempenho)
  - [RNF04 - Validação de Dados](#rnf04---validação-de-dados)
  - [RNF05 - Segurança](#rnf05---segurança)

# 1. Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deve disponibilizar aos usuários.

## RF01 - Gerenciar Clientes

O sistema deve permitir o cadastro, listagem, edição e remoção de clientes, garantindo que não existam clientes duplicados com o mesmo e-mail.

## RF02 - Gerenciar Projetos

O sistema deve permitir o cadastro e gerenciamento de projetos associados a um cliente. Cada projeto deve conter, no mínimo, as seguintes informações: nome do projeto, descrição, data de início e data de término.

## RF03 - Gerenciar Atividades

O sistema deve permitir o cadastro, edição, listagem e remoção de atividades vinculadas a um projeto. Cada atividade deve conter uma descrição e o valor da hora trabalhada.

## RF04 - Registrar Horas Trabalhadas

O sistema deve permitir o registro do tempo trabalhado em uma atividade por meio de um cronômetro. O tempo registrado deve ser atualizado em tempo real para o usuário, utilizando comunicação via WebSocket.

## RF05 - Realizar Pagamento via PIX

O sistema deve permitir a geração de cobranças via PIX para projetos concluídos, bem como a consulta e o acompanhamento do status do pagamento (pendente, pago ou expirado).

# 2. Requisitos Não Funcionais

Os requisitos não funcionais descrevem critérios de qualidade, restrições técnicas e padrões que o sistema deve atender.

## RNF01 - Arquitetura

O sistema deve ser desenvolvido utilizando arquitetura baseada em serviços REST para comunicação entre frontend e backend.

## RNF02 - Banco de Dados

O sistema deve utilizar um banco de dados relacional para a persistência das informações, garantindo integridade referencial entre clientes, projetos, atividades e registros de horas.

## RNF03 - Desempenho

As atualizações de tempo realizadas via WebSocket devem ocorrer em tempo real, com latência mínima perceptível ao usuário, garantindo uma experiência fluida durante o uso do cronômetro.

## RNF04 - Validação de Dados

Todos os dados de entrada devem ser validados no backend antes de serem persistidos no banco de dados, assegurando consistência e integridade das informações.

## RNF05 - Segurança

O sistema deve garantir que apenas usuários autenticados e autorizados possam acessar e modificar os dados cadastrados, respeitando as permissões definidas por perfil de acesso.
