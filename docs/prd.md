📄 Product Requirements Document (PRD) - FastFrete
Projeto: FastFrete (Conexão Direta para Fretes Urbanos)

Versão: 1.0.0 (MVP Acadêmico - TCC)

Status: 🟢 Definido (MVP)

🎯 1. Visão Geral e Objetivo
A contratação de pequenos fretes urbanos hoje depende de indicações informais ou de buscas desestruturadas em redes sociais, gerando atrito tanto para quem precisa do serviço quanto para o motorista autônomo que busca clientes. O FastFrete é uma aplicação web que organiza esse processo, conectando clientes a fretistas locais de forma ágil e transparente. O objetivo do MVP é focar na conexão (match) e na negociação direta (sem intermediar pagamentos), atuando inicialmente apenas no município de Guarapuava, validando a demanda e construindo uma base de confiança através de um sistema de avaliações.

📖 2. Glossário Ubíquo
Fretista (TAC): Transportador Autônomo de Cargas. O motorista cadastrado que possui um ou mais veículos para prestar o serviço.

Anúncio de Frete (Solicitação): Pedido publicado por um cliente detalhando o que precisa ser transportado, origem, destino e prazo.

Janela de Disponibilidade: Período flexível de tempo em que o frete pode ser realizado (ex: "Qualquer fim de semana", "Esta semana"), em oposição a uma data/hora cravada.

Candidatura (Proposta): Ação do fretista demonstrando interesse em um anúncio de frete, enviando um valor proposto e qual veículo será utilizado.

Pagamento em Mãos (Externo): Acordo financeiro realizado estritamente fora da plataforma, diretamente entre as partes.

👤 3. Atores e Permissões
Administrador (Admin): Monitora a saúde da plataforma, visualiza métricas gerais, gerencia o cadastro de usuários e aplica suspensões em caso de violação de regras.

Cliente: Solicita fretes através de anúncios, busca motoristas no catálogo, entra em contato para negociação e avalia o serviço após a conclusão.

Fretista: Cadastra seu perfil e veículos, visualiza os anúncios abertos na sua região, candidata-se aos serviços e avalia o comportamento do cliente.

📝 4. Escopo Funcional, Histórias de Usuário e Critérios de Aceitação (MoSCoW)
Instrução para a IA/Desenvolvedor: Cada bloco abaixo representa uma necessidade de negócio. Uma história só é considerada "Done" quando todos os seus critérios de aceitação forem atendidos no sistema.

### 🔴 US01 - Autenticação de Usuário (Must Have)
**Ator:** Todos | **História:** Como cliente, fretista ou administrador, quero fazer login, logout e recuperar senha, para acessar as funcionalidades conforme meu papel.

**✅ Critérios de Aceitação:**
* [x] Formulário com campos obrigatórios: e-mail e senha.
* [x] Exibir mensagem de erro em caso de credenciais inválidas.
* [x] Função "Esqueci minha senha" deve enviar link de redefinição por e-mail.
* [x] Direcionar o usuário para sua área inicial após login.

### 🔴 US02 - Cadastro de Cliente (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero criar uma conta informando meus dados pessoais, para solicitar fretes.

**✅ Critérios de Aceitação:**
* [x] Campos obrigatórios: nome, telefone, cidade, e-mail e senha.
* [x] A cidade disponível deve ser apenas Guarapuava.
* [x] Validar se o e-mail informado já está cadastrado.
* [x] Exibir mensagem de confirmação após conclusão do cadastro.

### 🔴 US03 - Cadastro de Fretista (Must Have)
**Ator:** Fretista | **História:** Como fretista, quero criar uma conta com meus dados pessoais, tipo de veículo e capacidade de carga, para receber solicitações de clientes.

**✅ Critérios de Aceitação:**
* [ ] Campos obrigatórios: nome, telefone, cidade, e-mail, senha, tipo de veículo e capacidade.
* [x] A cidade disponível deve ser apenas Guarapuava.
* [x] Possibilidade de cadastrar mais de um tipo de veículo.
* [ ] Permitir atualização dos dados do perfil após o cadastro.

### 🔴 US04 - Lista de Fretistas (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero visualizar fretistas filtrando por tipo de veículo, para encontrar rapidamente quem pode atender meu frete.

**✅ Critérios de Aceitação:**
* [x] Exibir nome, veículo, capacidade e contatos.
* [x] Permitir filtro por categoria de veículo.
* [x] Abrir o WhatsApp ao clicar no botão dedicado.

### 🔴 US05 - Publicar Anúncio de Frete (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero criar um anúncio com descrição e fotos, para que o fretista compreenda o serviço.

**✅ Critérios de Aceitação:**
* [x] Campos obrigatórios: título, descrição, categoria de veículo, endereço de origem e de destino.
* [ ] Escolha entre data/horário exato ou janela de disponibilidade (hoje, amanhã, esta semana, etc.).
* [x] Sistema deve permitir upload de até três fotos.
* [x] Após o cadastro, o frete deve aparecer em "Meus Fretes" com status (ativo, concluído ou cancelado) e contagem de candidatos.

### 🔴 US06 - Contato Direto (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero entrar em contato com o fretista por WhatsApp ou telefone, para negociar valores e detalhes.

**✅ Critérios de Aceitação:**
* [ ] Cada fretista deve exibir botões de "Ligar" e "WhatsApp".
* [ ] Os aplicativos correspondentes devem abrir automaticamente ao clicar.

### 🔴 US07 - Pagamento Direto em Mãos (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero pagar diretamente ao fretista, para evitar taxas e agilizar o processo.

**✅ Critérios de Aceitação:**
* [ ] Informar claramente que o pagamento ocorre fora da plataforma.
* [x] O valor negociado não deve ser registrado no sistema.

### 🔴 US08 - Avaliação Simples (Must Have)
**Ator:** Cliente ou Fretista | **História:** Como cliente ou fretista, quero avaliar a outra parte com nota e comentário, para orientar futuros usuários.

**✅ Critérios de Aceitação:**
* [x] Solicitar avaliação após a finalização do frete.
* [x] Nota (1 a 5) obrigatória; comentário opcional.
* [ ] Exibir avaliações no perfil do usuário.

### 🔴 US09 - Dashboard do Administrador (Must Have)
**Ator:** Administrador | **História:** Como administrador, quero gerenciar usuários, solicitações e avaliações, para manter a plataforma organizada.

**✅ Critérios de Aceitação:**
* [x] Exibir lista de clientes e fretistas com filtros e campo de busca.
* [ ] Exibir lista de solicitações de frete com status (ativo, concluído, cancelado).
* [ ] Permitir visualizar as avaliações recebidas por cada usuário.

### 🔴 US10 - Suspender Usuários Problemáticos (Must Have)
**Ator:** Administrador | **História:** Como administrador, quero suspender usuários que violem regras, para manter a confiabilidade da plataforma.

**✅ Critérios de Aceitação:**
* [x] Permitir suspender e reativar contas.
* [ ] Usuários suspensos não podem acessar o sistema.
* [x] Registrar o motivo da suspensão.

### 🔴 US11 - Meus Fretes (Cliente) (Must Have)
**Ator:** Cliente | **História:** Como cliente, quero visualizar uma lista dos fretes que cadastrei, para acompanhar meus anúncios e acessar seus detalhes.

**✅ Critérios de Aceitação:**
* [x] Listar fretes do cliente logado, organizados em "Ativos" e "Concluídos".
* [ ] Cada cartão deve exibir título, categoria de veículo, status e quantidade de candidatos.
* [ ] Ao clicar, abrir detalhes com candidatos e sugestões de fretistas.

### 🔴 US12 - Lista de Fretes Disponíveis (Fretista) (Must Have)
**Ator:** Fretista | **História:** Como fretista, quero visualizar fretes disponíveis cadastrados por clientes, para identificar oportunidades de serviço.

**✅ Critérios de Aceitação:**
* [x] Exibir lista de fretes disponíveis em formato de cartões na tela inicial.
* [ ] Filtrar por cidade e categoria de veículo compatível com o fretista.
* [ ] Exibir título, categoria de veículo e valor sugerido no cartão.

### 🔴 US13 - Detalhes do Frete (Fretista) (Must Have)
**Ator:** Fretista | **História:** Como fretista, quero visualizar os detalhes de um frete, para avaliar se desejo me candidatar.

**✅ Critérios de Aceitação:**
* [ ] Exibir descrição completa, categoria, data, horário e fotos (se houver).
* [x] Endereço deve ser parcial (bairro e rua sem número) para proteção de dados.
* [x] Dados de contato do cliente não devem ser exibidos nesta etapa.

### 🔴 US14 - Candidatar-se a Frete (Must Have)
**Ator:** Fretista | **História:** Como fretista, quero me candidatar a um frete informando o veículo e o valor proposto, para disputar a prestação do serviço.

**✅ Critérios de Aceitação:**
* [x] Permitir candidatura a partir da lista ou página de detalhes.
* [x] Fretista deve selecionar um de seus veículos cadastrados e informar um valor proposto.
* [x] Candidatura deve ficar disponível para visualização do cliente na área do frete.
* [x] Contatos do cliente não devem ser liberados apenas pela candidatura.


🛡️ 5. Regras de Negócio (Constraints)
RN01 (Geolocalização Restrita do MVP): Para validar o modelo de negócio localmente, o MVP aceitará apenas cadastros de usuários e endereços de fretes pertencentes ao município de Guarapuava/PR.

RN02 (Zero Intermediação Financeira): A plataforma não cadastra cartões de crédito, não cobra taxas por transação e não processa pagamentos. Todo acordo financeiro é considerado "Pagamento em Mãos" (via PIX, Dinheiro ou Maquininha do próprio motorista).

RN03 (Privacidade Gradual): O endereço completo da coleta/entrega do cliente (número da residência) e seu telefone só devem ser revelados ao fretista após a formalização do contato ou avanço da candidatura, garantindo a segurança do cliente.

RN04 (Requisito Mínimo Operacional): Um usuário com perfil "Fretista" não pode se candidatar a nenhum frete enquanto não tiver, no mínimo, um (1) veículo com status ativo cadastrado em seu perfil.

🚫 6. Fora de Escopo (Non-goals)
Processamento de pagamentos on-line (Gateway de pagamento, split de PIX, estornos).

Rastreamento veicular em tempo real via mapa (estilo Uber).

Fornecimento de Seguros de Carga, apólices ou garantias financeiras sobre os itens transportados.

Geração de contratos digitais com validade jurídica entre as partes.

Serviços de logística reversa ou empacotamento.

⚙️ 7. Requisitos Não Funcionais (Qualidade)
Desempenho de Imagens: O sistema deve comprimir automaticamente as imagens anexadas nos anúncios de frete antes do upload para a nuvem/servidor, garantindo carregamento rápido e economia de banda.

Mobile-First: A interface de cliente e fretista deve ser desenhada primordialmente para telas de smartphones, com botões grandes e leitura fácil sob luz do sol, podendo ser empacotada como PWA.

Arquitetura Escalável: O projeto deve utilizar padrão Monorepo (Vue/Nuxt + NestJS), mantendo uma separação clara entre a camada de apresentação e a API REST, facilitando futuras manutenções e o desenvolvimento futuro de apps nativos.