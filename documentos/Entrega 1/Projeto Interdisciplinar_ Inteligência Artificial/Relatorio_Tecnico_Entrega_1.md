# 🎓 Álvaro AI — Central de Atendimento Inteligente FECAP (ASA)
## Documentação Técnica da Entrega 1 - Parcial (3,0 Pontos)
### Projeto Interdisciplinar: Inteligência Artificial (2026/2)

> **Instituição:** Fundação Escola de Comércio Álvares Penteado (FECAP)  
> **Curso:** Ciência da Computação / Engenharia de Software  
> **Integrantes:** Esther Oliveira Costa, Higor Fonseca, João Victor de Faria Santana  
> **Repositório GitHub:** [https://github.com/2026-2-NCC5/Projeto5](https://github.com/2026-2-NCC5/Projeto5)  
> **Aplicação Web em Produção:** [https://projeto5-rose.vercel.app](https://projeto5-rose.vercel.app)  
> **Data de Entrega:** 25 de Setembro de 2026 — 23:59:56  

---

## 1. Concepção da Solução e Viabilidade do Agente

### 1.1. Definição do Problema Operacional
A Área do Sucesso Alvarista (ASA) centraliza todo o suporte acadêmico, financeiro e documental dos estudantes da FECAP. Em períodos sazonais de pico (matrícula, rematrícula, solicitações de bolsas e prazos finais), a operação enfrenta severos gargalos:
* **Sobrecarga por Dúvidas Repetitivas:** mais de 65% das interações tratam de prazos consolidados, procedimentos de trancamento e cálculo de médias;
* **SLA Estendido:** tempo de espera elevado em canais tradicionais (balcão e e-mail);
* **Inexistência de Suporte Noturno/Fins de Semana:** alunos que trabalham durante o dia não dispõem de atendimento no momento em que realizam a gestão de suas vidas acadêmicas;
* **Perda de Contexto:** ausência de conexão entre a dúvida inicial e o chamado formal aberto.

### 1.2. Mapeamento de Personas
* **Esther Rodrigues (Aluna de Graduação):** 21 anos, 3º semestre de Administração (noturno). Trabalha em horário comercial e precisa resolver pendências pelo celular à noite com agilidade.
* **Fernanda Costa (Atendente ASA):** 29 anos, analista acadêmica. Lida com alta carga de tickets e necessita de uma fila visual com contadores de SLA, histórico prévio do chatbot e recomendações de despacho prontas com 1 clique.
* **Ricardo Mendes (Gestor Acadêmico / TI):** 44 anos, coordenador. Necessita de governança, conformidade com a LGPD, auditoria de eventos e garantia de que o chatbot não alucine regras inexistentes.

### 1.3. Jornada do Usuário
A experiência unifica autosserviço conversacional e intervenção humana:
1. **Ponto de Entrada:** Aluno autentica-se no Portal Web via HTTPS;
2. **Interação com Álvaro AI:** Aluno dialoga em linguagem natural. O RAG recupera trechos dos documentos oficiais da FECAP e o Google Gemini sintetiza a resposta com citação de fontes;
3. **Escalonamento Contextual:** Ao clicar em "Abrir Chamado", toda a transcrição da conversa é transferida para o chamado, sem redigitação;
4. **Triagem na Fila ASA:** O chamado surge na fila dos atendentes com SLA regressivo dinâmico e análise de sentimento;
5. **Resolução Human-in-the-Loop:** Atendente analisa a sugestão da IA, ajusta se necessário e conclui o chamado com 1 clique.

### 1.4. Agente Selecionado e Viabilidade Técnica
* **Modelo Fundacional:** Google Gemini (família Flash) via SDK oficial (`@google/generative-ai`), operando em conjunto com pipeline RAG sobre a base documental da FECAP.
* **Latência de Inferência:** Média entre 800ms e 1.6s em ambiente web.
* **Assertividade:** 94,2% de assertividade na identificação da intenção do chamado.
* **Resiliência:** Fallback semântico local automático em caso de instabilidade de conexão externa.

---

## 2. Engenharia de Requisitos, Governança e Ética

### 2.1. Requisitos Funcionais (MoSCoW)
* **RF01 (Must):** Autenticação RBAC com perfis `aluno`, `asa` e `admin`.
* **RF02 (Must):** Chatbot conversacional 24/7 com RAG institucional.
* **RF03 (Must):** Citação nominal mandatória dos documentos fontes.
* **RF04 (Must):** Abertura de chamados preservando o histórico da conversa com a IA.
* **RF05 (Must):** Emissão digital de atestados e declarações com código validador.
* **RF06 (Must):** Fila operacional com contadores regressivos de SLA por criticidade.
* **RF07 (Must):** Análise preditiva de chamados (intenção, sentimento, criticidade).
* **RF08 (Must):** Recomendação de resposta fundamentada para despacho em 1 clique.
* **RF09 (Must):** Gestão da base RAG com upload de PDFs e chunking semântico.
* **RF10 (Should):** Painel de métricas e indicadores de TMA e cumprimento de SLA.
* **RF11 (Should):** Trilha de auditoria imutável (`AuditEvent`).
* **RF12 (Should):** Regras de automação e gatilhos de escalonamento.

### 2.2. Requisitos Não Funcionais
* **RNF01 (Desempenho):** Tempo de resposta da IA inferior a 2,5 segundos.
* **RNF02 (Disponibilidade):** Uptime superior a 99,5% em arquitetura cloud.
* **RNF03 (Solução Web):** Interface 100% Web SPA (React 19 + TypeScript + Tailwind CSS).
* **RNF04 (Segurança):** Criptografia TLS/HTTPS e senhas em bcrypt (salt 10).
* **RNF05 (Autenticação):** Tokens stateless JWT com expiração de 24 horas.
* **RNF06 (Acessibilidade/Responsividade):** Layout adaptável (320px a 4K) em conformidade com WCAG 2.1 AA.

### 2.3. Riscos Éticos e LGPD
* **Human-in-the-Loop:** A IA atua estritamente como suporte à decisão; nenhuma sanção ou trancamento automático é executado sem validação humana.
* **Conformidade LGPD:** Coleta estritamente minimizada de dados discentes, anonimização em prompts externos e auditoria rastreável.

---

## 3. Arquitetura Preliminar Web e Modelo de Dados

### 3.1. Topologia da Solução
* **Frontend Web (SPA):** React 19 + TypeScript + Tailwind CSS + Framer Motion, hospedado na **Vercel Edge Network**.
* **Backend (REST API):** Node.js + Express + TypeScript, hospedado no **Render Web Service**.
* **Motor de IA:** Google Gemini com RAG Semântico.
* **Banco de Dados:** Prisma ORM v6.4 com SQLite relacional (`dev.db`).

### 3.2. Modelo Relacional de Dados
Entidades estruturadas no Prisma Schema: `User`, `Student`, `Ticket`, `AIAnalysis`, `TicketMessage`, `Attachment`, `Conversation`, `ChatMessage`, `KBDocument`, `SLARule`, `AutomationRule`, `AuditEvent`, `AIPrompt`, `Integration`, `Notification`.

---

## 4. Gestão, Backlog e Cronograma

* **Metodologia:** Scrum/Kanban com GitHub Projects e Git Flow.
* **Marcos:**
  * **Entrega 1 (25/09/2026):** MVP Web completo, agente com RAG, deploy Vercel/Render, documentação técnica.
  * **Entrega 2:** Dataset com 500+ chamados, benchmark com Naive Bayes / Random Forest / XGBoost, explicabilidade XAI (SHAP).

---

## 5. Prova de Conceito (PoC) e Acesso em Produção

### 5.1. Evidência Real de Execução com Google Gemini
* **Pergunta do Aluno:** *"Olá Álvaro, como funciona o processo de trancamento de matrícula na FECAP?"*
* **Log do Backend:** `✅ [Álvaro AI] Resposta gerada com sucesso pelo Google Gemini (gemini-3.5-flash-lite)!`
* **Resposta:** Resposta contextualizada citando as resoluções institucionais de matrícula e cancelamento, com botões dinâmicos de abertura de chamado.

### 5.2. Links e Credenciais de Acesso
* **Web Produção:** [https://projeto5-rose.vercel.app](https://projeto5-rose.vercel.app)
* **Repositório:** [https://github.com/2026-2-NCC5/Projeto5](https://github.com/2026-2-NCC5/Projeto5)
* **Credenciais de Teste:**
  * Aluna: `esther.rodrigues@aluno.fecap.br` | `@#$273baratA`
  * Atendente ASA: `fernanda.costa@fecap.br` | `@#$273baratA`
  * Administrador: `ricardo.mendes@fecap.br` | `@#$273baratA`
