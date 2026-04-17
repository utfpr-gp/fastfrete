# 🚚 FastFrete

🔗 **Link em Produção:** [Aguardando Deploy na Nuvem]

👨‍💻 **Autor:** Rian Custódio de Souza Beltrão

## 🎯 1. Visão Geral
Aplicação web voltada para a solicitação e oferta de fretes urbanos de pequeno porte. O FastFrete atua como uma ponte direta entre clientes e motoristas autônomos (fretistas). O sistema organiza os anúncios, permite candidaturas aos fretes e fornece atalhos de contato direto (WhatsApp/Telefone) para a negociação e pagamento "em mãos". A plataforma dispensa intermediários financeiros, focando na agilidade e na construção de confiança através de um sistema de avaliações.

## 📚 2. Documentação Oficial (Docs as Code)
Toda a especificação e planejamento do sistema estão versionados na pasta `/docs`:
* 📄 **[PRD (Product Requirements Document)](./docs/prd.md):** Visão do produto, Atores, Histórias de Usuário priorizadas (MoSCoW) para o MVP e Regras de Negócio.
* 📐 **[SDD (Software Design Document)](./docs/sdd.md):** Arquitetura Monorepo, Diagrama Entidade-Relacionamento (Mermaid) do banco de dados, DTOs e Stack definida.

## 🛠 3. Stack Tecnológica
* **Arquitetura:** Monorepo (Backend e Frontend no mesmo repositório compartilhando código via Workspaces).
* **Backend (API):** NestJS, TypeScript, JWT (Autenticação e Autorização).
* **Banco de Dados:** PostgreSQL (nuvem via Neon) gerenciado pelo Prisma ORM.
* **Frontend (Web App):** Vue.js (Composition API), Pinia (Gerenciamento de Estado) e Tailwind CSS/Flowbite (Estilização responsiva).

## 🚀 4. Quick Start (Como Executar)

**1. Clone o repositório:**
```bash
git clone [https://github.com/seu-usuario/fastfrete.git](https://github.com/seu-usuario/fastfrete.git)
cd fastfrete

**2. Instalação Unificada:**
Instale as dependências de todos os pacotes do monorepo de uma só vez a partir da raiz:

npm install

**3. Configuração do Banco de Dados:**
Certifique-se de que configurou a sua ligação à Neon no ficheiro de ambiente da API:

# Copie o exemplo para o arquivo definitivo
cp apps/api/.env-example apps/api/.env

# Sincronize o esquema do Prisma com o banco de dados na nuvem
npx prisma db push --schema=apps/api/prisma/schema.prisma

**4. Execução em Desenvolvimento:**
Utilize a flag -w (workspace) para iniciar os servidores diretamente da raiz:

Iniciar o Backend (NestJS):
npm run start:dev -w api

Iniciar o Frontend (Vue.js):
npm run dev -w web