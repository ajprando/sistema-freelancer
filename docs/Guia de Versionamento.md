# 📑 Guia de Versionamento

**Este documento estabelece o padrão oficial de versionamento utilizado no desenvolvimento do projeto, garantindo organização, rastreabilidade e clareza no histórico do repositório.**

## Sumário
- [1. Nomenclatura de Branch](#1-nomenclatura-de-branch)
    - [1.1 main](#11-main)
    - [1.2 develop](#12-develop)
    - [1.3 feature/\[nome-da-feature\]](#13-featurenome-da-feature)
    - [1.4 bugfix/\[descricao-breve\]](#14-bugfixdescricao-breve)
    - [1.5 hotfix/\[descricao-breve\]](#15-hotfixdescricao-breve)
    - [1.6 release/\[versao\]](#16-releaseversao)
- [2. Nomenclatura de Commmit](#2-nomenclatura-de-commmit)
- [3. Fluxo de Trabalho](#3-fluxo-de-trabalho)

## 1. Nomenclatura de Branch

A convenção de branches foi definida para manter o fluxo de desenvolvimento estruturado, padronizado e de fácil compreensão para todos os envolvidos no projeto e na banca avaliadora.
A estrutura adotada é:

### 1.1 main
Contêm a versão estável do projeto, sempre pronta para apresentação ou deploy.

### 1.2 develop
Branch central de desenvolvimento, onde novas funcionalidades são integradas e validadas antes de irem para produção.

### 1.3 feature/[nome-da-feature]
Utilizada para desenvolvimento de novas funcionalidades. 

Exemplo: `feature/fluxo-pagamentos`

### 1.4 bugfix/[descricao-breve]

Utilizada para correção de bugs encontradas durante o desenvolvimento (não em produção).

Exemplo: `bugfix/validacao-email-cliente`

### 1.5 hotfix/[descricao-breve]

Para correções urgentes feitas diretamente na branch main.

Exemplo: `hotfix/correcao-calculo-horas`

### 1.6 release/[versao]

Utilizada para estabilizar funcionalidades concluídas antes do merge na main.

Exemplo: `release/1.0.0`

## 2. Nomenclatura de Commmit

Cada commit deve refletir de forma clara e objetiva o que foi alterado no código para facilitar a leitura do histórico do projeto.

A convenção utilizada segue o formato:

```
<tipo>(<escopo>): <descricao breve>
```

Tipos aceitos: 
* feat: nova funcionalidade.
* fix: correção de bug.
* docs: alterações em documentação.
* style: ajustes sem impacto funcional (formatação, indentação, etc).
* refactor: refatoração sem mudar comportamento.
* test: criação ou alteração de testes.
* chore: manutenção, dependências e tarefas auxiliares.

## 3. Fluxo de Trabalho

O projeto segue um fluxo de trabalho baseado em Git Flow, garantindo qualidade no desenvolvimento e rastreabilidade total.

Etapas do processo:

1. Criar uma branch a partir de develop com o nome apropriado (ex:feature/cadastro-cliente).
2. Desenvolver a funcionalidade e realizar commits seguindo o padrão estabelecido.
3. Abrir um Pull Request (PR) para a branch develop, solicitando revisão de código.
4. Após a aprovação, realizar o merge e remover a branch utilizada.
5. Quando o conjunto de funcionalidades estiver pronto, criar uma release e integrá-la à branch main.
6. Em caso de correções urgentes em produção, criar uma branch hotfix a partir da main, corrigir o problema e mesclar novamente em main e develop.

