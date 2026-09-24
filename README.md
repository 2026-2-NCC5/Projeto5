# 🎓 Álvaro AI — Central de Atendimento Inteligente FECAP

<p align="center">
  <img src="https://camo.githubusercontent.com/9640a318074cf476f8f30d06059763c45be295736ae6e618e824b21b031e74dc/68747470733a2f2f656e637279707465642d74626e302e677374617469632e636f6d2f696d616765733f713d74626e3a414e6439476352685a5072526138394b6d61305a5a6f67786d3070692d74436e5f544c4b65484756787977702d4c584146475233423144506f75414a5948674b5a4756305854456634414526757371703d434155" alt="Logo Álvaro AI">
</p>

> **Projeto Interdisciplinar — Inteligência Artificial & Engenharia de Software**  
> **Fundação Escola de Comércio Álvares Penteado (FECAP)**  
> **Curso:** Ciência da Computação / Engenharia de Software <br>
> <a href="https://projeto5-rose.vercel.app">Acesso à Aplicação em Produção</a>
---

## 📌 Sobre o Projeto

O **Álvaro AI** é uma plataforma full-stack de atendimento universitário integrada para o **ASA (Área do Sucesso Alvarista)** da FECAP. A solução combina um assistente conversacional inteligente potencializado por **Inteligência Artificial Generativa (Google Gemini 3.6 Flash)** e **RAG (*Retrieval-Augmented Generation*)** com um sistema completo de gestão de chamados acadêmicos e atendimento humano (*Human-in-the-Loop*).

---

## 👥 Integrantes do Grupo

* **Esther Oliveira Costa** — [@estherolvr](https://github.com/estherolvr) (`jaegcostaesther@gmail.com`)
* **Higor Fonseca** — [@higor-f](https://github.com/higor-f) (`higorlfonsecas@gmail.com`)
* **João Victor Faria** — [@joaovictorfaria](https://github.com/joaovictorfaria) (`joao.fsantana@outlook.com`)

---

## 🏛️ Estrutura do Repositório (Padrão de Entregas FECAP)

O repositório segue rigorosamente a estrutura acadêmica definida pela FECAP:

```text
Projeto5/
├── documentos/
│   ├── Entrega 1/
│   │   ├── Inteligência Artifical e Aprendizado de Máquina/
│   │   ├── Projeto Interdisciplinar_ Inteligência Artificial/
│   │   ├── Psicologia, Liderança e Soft Skills/
│   │   ├── Sistemas Operacionais Computação em Nuvem/
│   │   └── Álgebra Linear, Vetores e Geometria Analítica/
│   └── Entrega 2/
├── imagens/
├── src/
│   ├── Entrega 1/
│   │   ├── Backend/          <-- Projeto Backend completo (Node.js, Express, Prisma, SQLite)
│   │   └── Frontend/         <-- Projeto Frontend completo (React 19, Vite, Tailwind CSS)
│   └── Entrega 2/
│       ├── Backend/
│       └── Frontend/
├── package.json              <-- Scripts de orquestração geral para desenvolvimento
└── README.md
```

---

## 🚀 Principais Módulos & Funcionalidades

### 1. 🎓 Portal do Aluno
* **Chatbot Álvaro AI 24/7:** Responde a dúvidas sobre regulamentos acadêmicos, prazos, bolsas, TCC, trancamento e financeiro com formatação rica em Markdown e citação nominal dos documentos institucionais.
* **Abertura de Chamados com Contexto (*Human-in-the-Loop*):** Ao solicitar a abertura de chamado pelo chat, todo o histórico de mensagens trocadas com a IA é automaticamente vinculado ao ticket.
* **Documentos Digitais:** Emissão instantânea de atestados de matrícula e declarações acadêmicas com validação digital.
* **Histórico de Chamados:** Acompanhamento do status (`Aberto`, `Em atendimento`, `Resolvido`), mensagens do atendente e previsão de SLA.

### 2. 🏛️ Painel do Atendente ASA
* **Fila de Atendimento em Tempo Real:** Visualização dinâmica dos chamados pendentes com contador decrescente de SLA e filtros por criticidade.
* **Visualização do Histórico Prévio da IA:** O atendente humano visualiza exatamente o que o aluno perguntou e o que a IA respondeu antes de abrir o ticket.
* **Análise Preditiva & Recomendação de Resposta:** A IA analisa a intenção do aluno, calcula o sentimento e sugere uma resposta pronta que pode ser inserida com 1 clique.
* **Gestão de Base de Conhecimento RAG:** Upload de arquivos PDF/TXT/MD institucionais com divisão automática em chunks semânticos e indexação no banco.

### 3. ⚙️ Painel Administrativo & Governança de IA
* **Central de Controle (Command Center):** Monitoramento de saúde das APIs, status dos atendentes e auditoria de eventos.
* **Métricas de Atendimento:** Volume de conversas, taxa de resolução por IA, tempo médio de resposta e cumprimento de SLA.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend** (`src/Entrega 1/Frontend`)
* **React 19** + **TypeScript** + **Vite**
* **Tailwind CSS** para estilização com tokens oficiais FECAP/ASA
* **Framer Motion** para animações fluidas
* **Lucide React** para iconografia
* **React Markdown** + **Remark GFM** para renderização de tabelas e tópicos
* **Zustand** para gerenciamento de estado global

### **Backend & Banco de Dados** (`src/Entrega 1/Backend`)
* **Node.js** + **Express** com arquitetura RESTful modular
* **Prisma ORM** + **SQLite** para persistência relacional
* **JWT (JSON Web Tokens)** + **Bcrypt** para autenticação e perfis (`aluno`, `asa`, `admin`)
* **Multer** para upload de arquivos
* **Google Gemini 3.6 Flash** (`@google/generative-ai`) para RAG e respostas inteligentes
* **pdf-parse** para extração de texto em PDFs institucionais

---

## 📦 Como Instalar e Executar Localmente

### Opção 1: Executar pelos Módulos Independentes (Padrão de Avaliação FECAP)

#### Backend (`src/Entrega 1/Backend`):
```bash
cd "src/Entrega 1/Backend"
npm install
cp .env.example .env
npm run db:push
npm run seed
npm run dev
```
* Servidor ativo em: `http://localhost:3001`
* Endpoint de teste: `http://localhost:3001/api/health`

#### Frontend (`src/Entrega 1/Frontend`):
```bash
cd "src/Entrega 1/Frontend"
npm install
npm run dev
```
* Aplicação web: `http://localhost:3000`

---

### Opção 2: Executar da Raiz do Projeto (Comando Único)

1. **Instalar dependências de ambos os módulos:**
   ```bash
   npm run install:all
   ```

2. **Inicializar banco de dados e seeds:**
   ```bash
   npm run db:push
   npm run seed
   ```

3. **Iniciar Frontend e Backend simultaneamente:**
   ```bash
   npm run dev
   ```

---

## 🔑 Credenciais de Demonstração

| Perfil | E-mail Institucional | Senha Global | Acesso |
| :--- | :--- | :--- | :--- |
| **Aluna** | `esther.rodrigues@aluno.fecap.br` | `@#$273baratA` | Portal do Aluno & Chatbot |
| **Atendente ASA** | `fernanda.costa@fecap.br` | `@#$273baratA` | Fila ASA & Base de Conhecimento |
| **Administrador** | `ricardo.mendes@fecap.br` | `@#$273baratA` | Central de Controle & Governança |

---

## 📄 Licença

Projeto desenvolvido para fins educacionais no curso de graduação da **FECAP (Fundação Escola de Comércio Álvares Penteado)**. Todos os direitos reservados © 2026.
