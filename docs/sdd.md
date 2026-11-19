# 📐 Software Design Document (SDD) - FastFrete

**Projeto:** FastFrete  
**Versão:** 1.0.0 (MVP)  
**Status:** 🟢 Em Planejamento  
**Stack Principal:** Vue.js 3+ (Frontend) & NestJS 10+ (Backend API). *PostgreSQL como banco de dados relacional.*

---

## 🏗️ 1. Arquitetura do Sistema (Estrutura Monorepo Full-Stack)

O projeto adota uma arquitetura de Monorepo, centralizando o código do cliente e do servidor no mesmo repositório para facilitar o compartilhamento de tipagens (TypeScript) e a manutenção. A separação de responsabilidades é estrita entre apresentação (SPA/PWA) e lógica de negócios (API REST).

* **`apps/web`**: Aplicação Client principal (Vue.js 3+). Responsável pela interface do usuário, consumo da API, gerenciamento de estado local e regras de apresentação (mobile-first).
* **`apps/api`**: Servidor Backend (NestJS 10+). Responsável por toda a regra de negócio, autenticação, autorização de perfis e persistência de dados.
* **Infraestrutura de Banco de Dados (PostgreSQL)**:
  * **Desenvolvimento Local:** Instância isolada rodando via Docker (`docker-compose.yml`).
  * **Integração Contínua (CI):** Instância efêmera provisionada via GitHub Actions para execução automatizada da suíte de testes (TDD).
  * **Produção:** Banco de dados serverless hospedado na **Neon.tech**, garantindo escalabilidade e separação segura de ambientes.

## 🤖 2. Orquestração e Ecossistema de Contexto (MCP)

* **GitHub Projects MCP:** Utilizado para sincronizar o status das Histórias de Usuário (PRD) com o desenvolvimento técnico e o fluxo do GitFlow. As definições de "Done" devem seguir estritamente os Critérios de Aceitação das USs.
* **Component Generation MCP:** Utilizado para a prototipação e geração de componentes Vue.js. Os componentes devem seguir os padrões visuais definidos (Tailwind/Flowbite) e priorizar a responsividade para dispositivos móveis, além de garantir acessibilidade básica.

## 📦 3. Stack Tecnológica e Bibliotecas

### Core & Infraestrutura
* **Ambiente:** Node.js v20.x LTS ou superior.
* **Gerenciador de Pacotes:** npm (configurado com Workspaces).
* **ORM:** Prisma ORM (Geração de migrations, modelagem do schema e tipagem forte no NestJS).
* **Qualidade de Código & TDD:** Jest/Vitest integrados no pipeline do GitHub Actions para garantir a cobertura de testes antes de integrações na branch principal.

### Frontend (`apps/web`)
* **Framework:** Vue.js 3+ (Obrigatório o uso da `Composition API` com `<script setup>` para melhor reatividade e organização estrutural).
* **Gerenciamento de Estado:** Pinia (Substituindo o antigo Vuex para stores modulares e tipadas).
* **Roteamento:** `vue-router` (Configurado para navegação fluida entre os painéis de Cliente, Fretista e Admin).
* **Estilização:** Tailwind CSS (Para componentização visual responsiva e utilitária).
* **Bibliotecas e Utilitários:** * `maska` ou equivalente para formatação de inputs (Telefone, Valores Monetários "R$").
  * Biblioteca leve de compressão de imagens no lado do cliente (ex: `browser-image-compression`) antes do upload, cumprindo o requisito não funcional de otimização de tráfego.

### Backend (`apps/api`)
* **Framework:** NestJS (Arquitetura modular utilizando Controllers, Services e Modules).
* **Autenticação:** `@nestjs/jwt` e Passport para emissão e validação de tokens JWT (Login baseado em E-mail e Senha).
* **Validação de Dados:** `class-validator` e `class-transformer` para sanitização rigorosa dos payloads de entrada (DTOs).

## 🗄️ 4. Arquitetura de Dados (Banco de Dados Relacional)

O sistema utiliza um banco de dados relacional (PostgreSQL) centralizado. A modelagem garante a integridade referencial entre os perfis de usuários, seus ativos (veículos) e as transações de negócio (fretes e candidaturas), focando inicialmente nas operações restritas à região de Guarapuava, conforme especificado no MVP.

### 📖 4.1. Glossário Técnico (Mapeamento de Entidades)
| Entidade de Domínio | Tabela no Banco | Responsabilidade |
| :--- | :--- | :--- |
| Usuários | `users` | Armazena Clientes, Fretistas e Administradores. Gerencia credenciais, perfil (`role`) e status de suspensão. |
| Veículos | `vehicles` | Frota cadastrada pelos Fretistas. Vinculada obrigatoriamente a um `user_id`. |
| Fretes (Anúncios) | `freights` | Solicitações criadas por Clientes. Contém origem, destino, janela de disponibilidade e status. |
| Candidaturas | `applications` | Propostas de Fretistas para um Frete específico, contendo o veículo escolhido e o valor financeiro proposto. |
| Avaliações | `reviews` | Feedback cruzado após a conclusão do frete (Nota de 1 a 5 e comentário). |
| Fotos do Frete | `freight_photos` | URLs das imagens anexadas ao anúncio do Cliente (Máximo de 3 por frete). |

### 🗄️ 4.2. Modelagem de Dados

erDiagram
    cities {
        int id PK
        varchar name
        char state_code
    }

    users {
        int id PK
        int city_id FK
        varchar name
        varchar email
        varchar phone
        varchar password_hash
        varchar role
        boolean active
        text suspension_reason
        datetime created_at
    }

    vehicles {
        int id PK
        int user_id FK
        varchar vehicle_type
        int capacity_kg
        varchar plate
        varchar model
        varchar color
        boolean active
    }

    freights {
        int id PK
        int client_id FK
        int origin_city_id FK
        int destination_city_id FK
        varchar title
        text description
        varchar vehicle_category
        varchar origin_district
        varchar origin_street
        varchar origin_number
        varchar destination_district
        varchar destination_street
        varchar destination_number
        varchar date_mode
        datetime exact_datetime
        varchar availability_window
        varchar status
        datetime created_at
        datetime updated_at
    }

    freight_photos {
        int id PK
        int freight_id FK
        varchar file_url
        int sort_order
    }

    applications {
        int id PK
        int freight_id FK
        int freighter_id FK
        int vehicle_id FK
        decimal proposed_value
        varchar status
        datetime created_at
        datetime updated_at
    }

    reviews {
        int id PK
        int freight_id FK
        int reviewer_id FK
        int reviewed_id FK
        int rating
        text comment
        datetime created_at
    }

    %% Relacionamentos do Banco de Dados
    cities ||--o{ users : "cidade do usuario"
    cities ||--o{ freights : "cidade de origem"
    cities ||--o{ freights : "cidade de destino"
    
    users ||--o{ vehicles : "possui (1:N)"
    users ||--o{ freights : "solicita (1:N)"
    
    freights ||--o{ freight_photos : "contem (1:N)"
    
    freights ||--o{ applications : "recebe propostas (1:N)"
    users ||--o{ applications : "envia propostas (1:N)"
    vehicles ||--o{ applications : "alocado na proposta (1:N)"
    
    freights ||--o{ reviews : "gera avaliacoes (1:N)"
    users ||--o{ reviews : "escreve avaliacao (1:N)"
    users ||--o{ reviews : "recebe avaliacao (1:N)"`