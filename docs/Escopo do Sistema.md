# 📑 Escopo do Sistema

**Este documento apresenta o escopo do sistema, descrevendo de forma geral os objetivos, o público-alvo, as funcionalidades e as limitações da aplicação. O escopo tem como finalidade estabelecer uma visão clara do que o sistema se proprõe a resolver, definindo quais funcionalidades fazem parte do projeto e quais estão fora do domínio, servindo como base para o levantamento dos requisitos.**

## Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Público-Alvo](#2-público-alvo)
- [3. Funcionalidades do Sistema](#3-funcionalidades-do-sistema)
- [4. Limites do Sistema](#4-limites-do-sistema-fora-do-escopo)

# 1. Visão Geral

O sistema tem como objetivo apoiar profissionais freelancers na gestão de seus serviços, permitindo o controle estruturado de clientes, projetos, atividades executadas, horas trabalhadas e pagamentos realizados via PIX.

A aplicação oferece acompanhamento do tempo de execução das atividades em tempo real, por meio de comunicação via WebSocket, além de uma integração clara entre frontend e backend para o gerenciamento completo das informações operacionais.

# 2. Público-Alvo

* Profissionais freelancers que prestam serviços por projeto ou por hora.
* Pequenos prestadores de serviços que necessitam de controle básico de tempo, organização de demandas e faturamento.

# 3. Funcionalidades do Sistema

O sistema contempla as seguintes funcionalidades principais:
1. Cadastro, edição, listagem e remoção de clientes.
2. Cadastro e gerenciamento de projetos associados a clientes.
3. Cadastro e controle de atividades vinculadas a projetos.
4. Registro de horas trabalhadas por atividade, utilizando cronômetro.
5. Acompanhamento do tempo de execução das atividades em tempo real (WebSocket).
6. Geração e acompanhamento do status de pagamentos via PIX.

# 4. Limites do Sistema (Fora do Escopo)

As seguintes funcionalidades NÃO fazem parte do escopo do sistema:
* Emissão de nota fiscal ou documentos fiscais.
* Integração com sistemas contábeis ou governamentais.
* Módulo de gestão financeira avançada (fluxo de caixa, relatórios financeiros complexos, conciliação bancária).
* Aplicativo mobile nativo.
