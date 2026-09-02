# 🎓 Álvaro AI — Central de Atendimento Inteligente FECAP

<p align="center">
  <img src="https://camo.githubusercontent.com/9640a318074cf476f8f30d06059763c45be295736ae6e618e824b21b031e74dc/68747470733a2f2f656e637279707465642d74626e302e677374617469632e636f6d2f696d616765733f713d74626e3a414e6439476352685a5072526138394b6d61305a5a6f67786d3070692d74436e5f544c4b65484756787977702d4c584146475233423144506f75414a5948674b5a4756305854456634414526757371703d434155" alt="Logo Álvaro AI">
</p>

> **Projeto Interdisciplinar — Inteligência Artificial & Engenharia de Software**  
> **Fundação Escola de Comércio Álvares Penteado (FECAP)**  
> **Curso:** Ciência da Computação / Engenharia de Software <br>
> <a href="https://vercel.com/tech-snack/projeto5/projeto5-rose.vercel.app">Acesso</a>
---

## 📌 Sobre o Projeto

O **Álvaro AI** é uma plataforma full-stack de atendimento universitário integrada para o **ASA (Área do Sucesso Alvarista)** da FECAP. A solução combina um assistente conversacional inteligente potencializado por **Inteligência Artificial Generativa (Google Gemini 3.6 Flash)** e **RAG (*Retrieval-Augmented Generation*)** com um sistema completo de gestão de chamados acadêmicos e atendimento humano (*Human-in-the-Loop*).

---

## 👥 Integrantes do Grupo

* **Esther Oliveira Costa** — [@estherolvr](https://github.com/estherolvr) (`jaegcostaesther@gmail.com`)
* **Higor Fonseca** — [@higor-f](https://github.com/higor-f) (`higorlfonsecas@gmail.com`)
* **João Victor Faria** — [@joaovictorfaria](https://github.com/joaovictorfaria) (`joao.fsantana@outlook.com`)

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

### **Frontend**
* **React 19** + **TypeScript** + **Vite**
* **Tailwind CSS** para estilização moderna e responsiva
* **Framer Motion** para animações fluidas
* **Lucide React** para iconografia
* **React Markdown** + **Remark GFM** para renderização rica de tabelas e tópicos
* **Zustand** para gerenciamento de estado global com persistência

### **Backend & Banco de Dados**
* **Node.js** + **Express** com arquitetura RESTful modular
* **Prisma ORM** + **SQLite** para persistência relacional
* **JWT (JSON Web Tokens)** + **Bcrypt** para autenticação e controle de acesso por perfis (`aluno`, `asa`, `admin`)
* **Multer** para upload de arquivos multipart/form-data

### **Inteligência Artificial & RAG**
* **Google Gemini 3.6 Flash** (`@google/generative-ai`)
* **pdf-parse** para extração de texto em PDFs institucionais
* **Semantic Chunking & Hybrid Search** para indexação e recuperação no banco

---

## 📦 Como Instalar e Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/2026-2-NCC5/Projeto5.git
cd Projeto5
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```env
PORT=3001
JWT_SECRET=alvaro-ai-super-secret-jwt-key-2026-fecap
GEMINI_API_KEY=sua_chave_gemini_aqui
DATABASE_URL="file:./dev.db"
```

### 4. Inicializar o Banco de Dados e Seeds
```bash
npx prisma db push
npx prisma generate
npx tsx server/src/seed.ts
```

### 5. Iniciar a Aplicação (Frontend + Backend)
```bash
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)

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
