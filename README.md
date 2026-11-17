# 🚚 FastFrete

🔗 **Link em Produção:** [Aguardando Deploy na Nuvem]

👨‍💻 **Autor:** Rian Custódio de Souza Beltrão

## 🎯 1. Visão Geral
Aplicação web voltada para a solicitação e oferta de fretes urbanos de pequeno porte. O FastFrete atua como uma ponte direta entre clientes e motoristas autônomos (fretistas). O sistema organiza os anúncios, permite candidaturas aos fretes e fornece atalhos de contato direto (WhatsApp/Telefone) para a negociação e pagamento "em mãos". A plataforma dispensa intermediários financeiros, focando na agilidade e na construção de confiança através de um sistema de avaliações.

## 📚 2. Documentação Oficial (Docs as Code)
Toda a especificação e planejamento do sistema estão versionados na pasta `/docs`:
* 📄 **[PRD (Product Requirements Document)](./docs/prd.md):** Visão do produto, Atores, Histórias de Usuário priorizadas (MoSCoW) para o MVP e Regras de Negócio.
* 📐 **[SDD (Software Design Document)](./docs/sdd.md):** Arquitetura Monorepo, Diagrama Entidade-Relacionamento (Mermaid) do banco de dados, DTOs e Stack definida.
* 🗂️ **[Backlog e Sprints](./docs/backlog-sprints.md):** Status atual do desenvolvimento, backlog priorizado e sprints.

## 🛠 3. Stack Tecnológica
* **Arquitetura:** Monorepo com npm Workspaces (`apps/api` e `apps/web`).
* **Backend (API):** NestJS 11, TypeScript, JWT + Passport (autenticação) e RBAC (autorização por perfil e permissão).
* **Banco de Dados:** PostgreSQL 16 rodando localmente via Docker, gerenciado pelo Prisma ORM com migrations versionadas.
* **Frontend (Web App):** Nuxt (Vue 3, Composition API), Pinia (estado) e Tailwind CSS (estilização responsiva, mobile-first).
* **Documentação da API:** Swagger (OpenAPI) em `/api/docs`.
* **Testes:** Jest.

## 🚀 4. Quick Start (Como Executar)

### Pré-requisitos
* Node.js 20 ou superior
* Docker e Docker Compose

### 1. Clone o repositório
```bash
git clone https://github.com/utfpr-gp/fastfrete.git
cd fastfrete
```

### 2. Instale as dependências
Instale os pacotes de todo o monorepo de uma só vez, a partir da raiz:
```bash
npm install
```

### 3. Suba o banco de dados
```bash
npm run docker:up
```
O PostgreSQL fica disponível em `localhost:5432` (usuário, senha e banco: `fastfrete`).

### 4. Configure as variáveis de ambiente
```bash
cp apps/api/.env-example apps/api/.env
cp apps/web/.env-example apps/web/.env
```
Ajuste o `DATABASE_URL` em `apps/api/.env` para o banco local, por exemplo:
`postgresql://fastfrete:fastfrete@localhost:5432/fastfrete`. O `API_URL` do frontend aponta para `http://localhost:3000`.

### 5. Aplique as migrations e popule o banco
Execute a partir de `apps/api`:
```bash
cd apps/api
npx prisma migrate dev
npm run prisma:seed
cd ../..
```
> ⚠️ Use sempre `prisma migrate dev`, nunca `prisma db push`, para manter o histórico de migrations consistente.

> 🔁 O seed é idempotente. Rode `npm run prisma:seed` novamente sempre que novas permissões forem adicionadas (por exemplo, após atualizar a branch `develop`), pois elas são lidas do banco a cada requisição.

O seed cria a cidade (Guarapuava), os perfis e permissões, as categorias de veículo, os veículos de demonstração e os usuários abaixo (somente para desenvolvimento):

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| Administrador | `admin@fastfrete.com` | `admin123456` |
| Cliente | `john.doe@example.com` | `password123` |
| Fretista | `jane.smith@example.com` | `password123` |

### 6. Execute em desenvolvimento
Em dois terminais, a partir da raiz:
```bash
# Backend (NestJS) em http://localhost:3000
npm run dev:api

# Frontend (Nuxt) em http://localhost:3001
npm run dev:web
```

A documentação interativa da API (Swagger) fica em **http://localhost:3000/api/docs**.

## 🧭 5. Áreas do Sistema
| Perfil | Rota inicial | O que faz |
| :--- | :--- | :--- |
| Cliente | `/client` | Publica e gerencia fretes, recebe propostas, escolhe fretista, avalia e consulta o catálogo de fretistas (`/client/carrier-catalog`) |
| Fretista | `/carrier` | Vê fretes abertos, candidata-se, gerencia veículos (`/carrier/vehicles`) e acompanha candidaturas |
| Administrador | `/admin` | Painel de métricas, gestão de usuários (suspender/reativar) em `/admin/users` e listagem de fretes em `/admin/freights` |
| Todos | `/profile` e `/users/:id` | Meu perfil (edição de dados) e perfil público com avaliações e comentários |

## 🧪 6. Testes
```bash
cd apps/api
npm test
```
Os testes de integração em `apps/api/test/integration` exigem o banco de dados ativo.
