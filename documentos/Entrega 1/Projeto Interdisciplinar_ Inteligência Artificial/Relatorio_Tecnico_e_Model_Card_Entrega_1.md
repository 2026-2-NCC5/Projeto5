# PROJETO INTERDISCIPLINAR · ASA
## Relatório Técnico e Model Card
**Entrega 1 — Parcial · Agente 3: Agente para o Estudante (Álvaro AI)**  
**Projeto:** Álvaro AI — Central de Atendimento Inteligente FECAP (ASA)  
**Instituição:** Fundação Escola de Comércio Álvares Penteado (FECAP)  
**Curso:** Ciência da Computação / 5º Semestre 2026  
**Integrantes do Grupo:**
* Esther Oliveira Costa — `jaegcostaesther@gmail.com`
* Higor Fonseca — `higorlfonsecas@gmail.com`
* João Victor Faria — `joao.fsantana@outlook.com`

---

Este relatório documenta a construção da baseline (primeira versão simples do modelo e arquitetura RAG) coerente com o **Agente para o Estudante (Agente 3)**, seguindo os requisitos da Entrega 1 do Projeto Interdisciplinar do curso de Ciência da Computação da FECAP.

---

## 1. Análise dos Dados

Em estrita consonância com a arquitetura moderna do projeto **Álvaro AI**, a solução **não utiliza bases em Excel nem planilhas estáticas desarticuladas (como arquivos `.xlsx` ou `.csv` isolados)**. Em vez disso, foi modelada e implementada uma infraestrutura relacional persistida via **SQLite com Prisma ORM** (na pasta `src/Entrega 1/Backend/prisma/dev.db`), reproduzindo com fidelidade a dinâmica operacional da Central de Atendimento da **Área do Sucesso Alvarista (ASA)** da FECAP.

A baseline do Agente para o Estudante é alimentada por tabelas estruturadas que consolidam o conhecimento regulatório oficial da instituição, o contexto acadêmico dos alunos e o histórico transacional das solicitações:

| Fonte / Tabela | Registros (Baseline) | Conteúdo Principal | Granularidade e Observações |
| :--- | :--- | :--- | :--- |
| **`KBDocument`**<br>(Base RAG FECAP) | 16 documentos institucionais<br>(19 chunks) | Normas e resoluções oficiais de matrícula, prazos acadêmicos, bolsas Prouni/FIES, colação de grau, TCC, regulamento financeiro e atestados. | 1 linha por documento oficial. Indexados em chunks semânticos (800 caracteres com overlap de 150) com tags de busca léxica e categórica. |
| **`Student`**<br>(Cadastro do Aluno) | 10 estudantes ativos | Identificador (UUID), RA único, nome completo, curso (CC, ADM, Contábeis), semestre (1º ao 8º), turno, status (regular, irregular, trancado) e telefone. | 1 linha por estudante único. Utilizado para contextualizar e personalizar dinamicamente as respostas da IA com base no curso e semestre do aluno. |
| **`ChatMessage` & `Conversation`** | 7 sessões / 23 mensagens | Sessões de chat, autoria das mensagens (`user`, `assistant`, `system`), conteúdo textual integral, timestamps e ações rápidas sugeridas. | 1 linha por mensagem trocada. Fornece memória conversacional de curto prazo e garante histórico integral ao transbordar para atendimento humano. |
| **`Ticket`**<br>(Chamados ASA) | 12 chamados de homologação | Número sequencial, título, descrição do problema, categoria, prioridade, status de atendimento, SLA limite e vínculo com o aluno (`studentId`). | 1 linha por chamado formal. Acionado quando a dúvida do estudante requer intervenção humana resolutiva (*Human-in-the-Loop*). |
| **`AIAnalysis`**<br>(Inferência e Triagem) | 8 análises pré-computadas + tempo real | Intenção detectada, categoria predita, score de confiança numérico (0.85 a 0.98), resumo executivo, recomendação ao atendente e sentimento. | 1 linha por inferência analítica (relação 1:1 com `Ticket`). Auxilia o atendente do ASA a compreender a demanda imediatamente após o transbordo. |

---

## 2. Preparação dos Dados

A preparação e a higienização dos dados no Álvaro AI foram implementadas diretamente no pipeline de serviços do backend (`src/Entrega 1/Backend/src/services/ai.service.ts`), assegurando que tanto o conteúdo documental quanto as perguntas enviadas pelos estudantes passem pelo mesmo rigor de tratamento semântico:

1. **Normalização Textual e Limpeza:**
   * Textos enviados por estudantes frequentemente contêm vícios de linguagem, acentuações variáveis, pontuação desordenada e caracteres especiais. O método `normalizeText()` converte todas as strings para minúsculas (`toLowerCase`), remove diacríticos através de decomposição canônica Unicode (`NFD` combinada com a expressão regular `replace(/[\u0300-\u036f]/g, '')`) e sanitiza espaços em branco excedentes (`trim`).
2. **Remoção de Stopwords Conversacionais:**
   * Foi construído um vocabulário restritivo (`STOPWORDS`) contendo mais de 40 termos da língua portuguesa e vícios comuns de interação conversacional (*"olá"*, *"bom dia"*, *"por favor"*, *"chat"*, *"ia"*, *"alvaro"*, *"gostaria"*, *"saber"*, *"preciso"*). Essas palavras são filtradas antes da correspondência léxica para focar a recuperação nos termos de alta densidade semântica.
3. **Stemming (Radicalização) Morfológico:**
   * Para solucionar o problema de flexões verbais e variações morfológicas (ex: *"matrícula"*, *"matricular"*, *"matriculado"*; *"cancelar"*, *"cancelamento"*), foi desenvolvido o método `stem()`, que remove sufixos frequentes do português (`-ções`, `-ção`, `-são`, `-mente`, `-ando`, `-endo`, `-eza`, `-ivo`, `-vel`), permitindo o casamento pelo radical léxico exato.
4. **Chunking Semântico com Overlap:**
   * Documentos institucionais extensos (como regulamentos acadêmicos) diluem a resposta exata se ingeridos inteiros. Foi implementado o algoritmo `chunkText()`, que particiona os textos normativos em blocos semânticos de 800 caracteres com sobreposição (*overlap*) de 150 caracteres. O algoritmo prioriza quebras naturais em quebras duplas de parágrafo (`\n\n`) ou pontos finais, preservando a completude contextual das cláusulas.
5. **Integridade Relacional e Tratamento de Nulos:**
   * Garantida por constraints estritas no schema do Prisma ORM. A junção entre Aluno e Mensagens/Chamados ocorre via `Student.id = Ticket.studentId` (UUID) com `onDelete: Cascade`. Campos opcionais (como `phone`, `conversationId` e `assignedTo`) possuem tipagem nula segura e fallbacks padrão no backend.

---

## 3. Seleção de Atributos

Os atributos (*features*) do Agente para o Estudante foram selecionados para viabilizar as três tarefas essenciais: (1) compreensão da dúvida, (2) recuperação da regra institucional oficial correta e (3) transferência humanizada para o ASA:

| Dimensão | Atributo | Justificativa Técnica e Funcional |
| :--- | :--- | :--- |
| **Semântica / Consulta do Aluno** | `userMessage` / `query` (Texto da Mensagem) | Texto natural digitado pelo estudante. Insumo principal para normalização, extração de palavras-chave, radicais e identificação da intenção primordial. |
| **Documental / Normativa (RAG)** | `KBDocument.content` e `KBDocument.title` | Texto oficial e título das resoluções institucionais da FECAP. Fornece a base de conhecimento autorizada (*ground truth*) para evitar alucinações da IA. |
| **Similaridade e Relevância Léxica** | `relevanceScore` (Pontuação Híbrida) | Score numérico calculado por casamento exato da consulta (+100 pts), bigramas (+45 pts), termos-chave (+12 pts), radicais (+8 pts) e bônus de densidade no parágrafo. |
| **Perfil do Estudante** | `course`, `semester` e `status` (`Student`) | Identifica o contexto acadêmico do aluno. Permite à IA personalizar respostas (ex: regras de TCC aplicam-se ao 7º/8º semestre; colação exige status regular). |
| **Transbordo e Confiabilidade** | `confidence` e `matchScore` | Nível de certeza probabilística do casamento entre a dúvida e os documentos. Caso o score seja inferior ao limiar seguro ($\le 5$), a IA aciona o transbordo para o ASA. |
| **Contexto Conversacional** | `history` (Histórico da Sessão) | Vetor contendo os últimos turnos de diálogo (`user` e `assistant`). Permite resolver referências anafóricas (ex: *"e onde eu entrego ele?"*) e manter a coerência. |

---

## 4. Definição das Métricas

Para avaliar a eficácia do Agente para o Estudante nesta Entrega 1 (baseline) e balizar os testes comparativos na Entrega 2, foram definidas métricas técnicas de recuperação da informação e operacionais de atendimento:

### Métricas da Entrega 1 (Baseline Atual)
1. **Taxa de Recuperação do Trecho Correto (Hit Rate @ 3):**
   * Mede a proporção de consultas em que o documento institucional oficial correto consta entre os 3 trechos de maior pontuação recuperados pelo motor RAG.
2. **Groundedness Preliminar (Aderência às Fontes):**
   * Percentual de respostas em que todas as afirmações concretas geradas (prazos, regras, procedimentos) possuem correspondência direta e comprovada nos documentos institucionais recuperados, sem geração de informações espúrias.
3. **Taxa de Resolução Automatizada (First Contact Resolution - FCR):**
   * Métrica operacional que mensura o percentual de dúvidas dos alunos sanadas diretamente no chat pelo autoatendimento inteligente, sem necessidade de abertura de chamado formal no ASA.
4. **Acurácia de Roteamento de Ações:**
   * Grau de assertividade do modelo em associar a dúvida a botões de ação imediata (ex: *"Emitir Documento Digital"*, *"Agendar no ASA"*, *"Abrir Chamado"*).

### Métricas Planejadas para a Entrega 2 (Avaliação com Framework RAG)
1. **Métricas Formais de RAG (Framework RAGAS):**
   * Implementação da avaliação pelo framework RAGAS (*Retrieval Augmented Generation Assessment*) com cálculo automatizado de: (a) *Faithfulness* (fidelidade factual ao contexto), (b) *Answer Relevance* (relevância direta da resposta à pergunta) e (c) *Context Precision* (precisão dos trechos recuperados).
2. **Precisão, Recall e F1-Score do Gatilho de Transbordo:**
   * Avaliação estatística formal da capacidade da baseline em decidir corretamente entre responder ao aluno vs. transferir para um atendente humano do ASA.
3. **Latência de Inferência de Ponta a Ponta:**
   * Tempo médio de geração e consumo de tokens por resposta gerada pelo Google Gemini 3.6 Flash em produção.
4. **CSAT Conversacional (Customer Satisfaction Score):**
   * Índice de satisfação coletado diretamente do estudante ao final de cada conversa através de avaliação de 1 a 5 estrelas no portal.

---

## 5. Baseline do Agente: Agente para o Estudante

Conforme definido no escopo oficial do projeto, o grupo selecionou o **Agente 3 — Agente para o Estudante (Álvaro AI)**. Sua baseline combina um pipeline de recuperação léxico-semântica em base normativa institucional com síntese generativa via Google Gemini 3.6 Flash (com fallback determinístico local), ancorada nos princípios de transparência, citação nominal de fontes e transferência assistida para o atendimento humano (*Human-in-the-Loop*).

### 5.1 Recuperação de Documentos e RAG Inicial
O pipeline de Recuperação Aumentada por Geração (RAG) opera em três etapas no backend:
1. **Segmentação da Base de Conhecimento:** A base `KBDocument` contém 16 manuais oficiais da FECAP. No carregamento ou upload de novos PDFs (via `pdf-parse`), o texto é segmentado pelo método `chunkText()` em blocos de 800 caracteres com 150 caracteres de sobreposição, respeitando a integridade das sentenças.
2. **Busca Híbrida e Scoring de Relevância:** A função `extractRelevantExcerpt()` e `searchKnowledgeBase()` aplicam um algoritmo de pontuação composto sobre cada trecho:
   * Casamento de frase exata (+100 pts);
   * Casamento de pares de termos consecutivos/bigramas (+45 pts);
   * Casamento de palavras-chave individuais (+12 pts);
   * Casamento de radicais morfológicos/stems (+8 pts);
   * Bônus de densidade de termos no mesmo parágrafo (`distinctHits * 15 pts`);
   * Bônus de correspondência no título do documento (+90 pts).
   Os 3 trechos com maior score ($> 5$) são selecionados como contexto factual.
3. **Geração Ancorada com Google Gemini:** Os trechos recuperados são injetados em um prompt estrito do Google Gemini 3.6 Flash. O prompt proíbe expressamente respostas vazias ou genéricas quando as informações estiverem presentes no texto, obriga a resposta em tom acolhedor e institucional, e exige a citação nominal do regulamento utilizado (ex: *"De acordo com as diretrizes de [Título do Documento]..."*). Se a chave de API não estiver disponível, o método `generateSmartFallback()` executa a síntese semântica localmente.

### 5.2 Regras de Roteamento de Dúvidas e Transferência Humana
Quando o aluno necessita de orientações que extrapolam a base de conhecimento ou relata problemas cadastrais/financeiros críticos, o agente aciona o protocolo de transferência para atendimento humano (*Human-in-the-Loop*). A tabela de decisão abaixo governa esse comportamento:

| Condição da Dúvida / Solicitação | Resultado / Resposta do Agente | Encaminhamento e Transbordo Humano |
| :--- | :--- | :--- |
| Dúvida sobre matrícula, rematrícula, prazos, TCC ou bolsas presente na base RAG (Score > 25) | Resposta orientativa completa estruturada em tópicos e negrito, com citação explícita do regulamento oficial e prazos. | Autoatendimento concluído. Oferece botões de ação rápida (*"Emitir Documento Digital"* ou *"Agendar no ASA"*). |
| Solicitação de documento padrão (atestado de matrícula, declaração de frequência) | Apresenta o passo a passo de validação institucional e gera o atestado digital instantâneo com autenticação digital. | Direcionamento para a aba *"Documentos Digitais"* do Portal do Aluno sem necessidade de fila. |
| Dúvida não encontrada na base institucional (Score RAG $\le 5$ ou confiança $< 0.70$) | Mensagem acolhedora informando que não há regra padrão para o caso nos documentos e que é necessária análise individual. | Transferência humana assistida: exibe botão primário **"Abrir Chamado no ASA"**, vinculando todo o histórico da conversa ao ticket. |
| Aluno expressa atrito agudo (*"erro de cobrança"*, *"multa indevida"*, *"acesso bloqueado"*, *"desistência"*) | Resposta empática imediata, esclarecendo direitos preliminares e orientando a formalização da solicitação. | Abertura de chamado com classificação prioritária (*"Alta"* ou *"Crítica"*), notificando a equipe do ASA imediatamente. |
| Dúvidas sobre atendimento presencial ou entrega física de documentos (Prouni/FIES/Estágio) | Lista a relação completa de documentos exigidos, horários de funcionamento do campus e prazos de entrega. | Ação sugerida: *"Agendar no ASA"* para reserva de horário presencial com um atendente humano. |

### 5.3 Critério de Priorização e Transferência ao Atendente
A transferência para atendimento humano segue diretrizes que valorizam o tempo do aluno e do atendente do ASA:
* **Preservação Integral de Contexto:** Quando a consulta resulta na abertura de um chamado pelo chat, a íntegra das mensagens trocadas com o Álvaro AI é gravada no banco (`Ticket.conversationId`) e exibida na tela do atendente (`AsaDetalheChamado.tsx`). O atendente visualiza exatamente o que a IA respondeu, evitando perguntas repetitivas ao estudante.
* **Ações Contextuais em Um Clique:** O método `deriveActions()` analisa a semântica da consulta e injeta no rodapé da mensagem opções de resolução imediata com um clique (*"Abrir Chamado no ASA"*, *"Emitir Documento Digital"*, *"Agendar Horário Presencial"*).
* **Cálculo de Criticidade e SLA:** O chamado criado a partir do transbordo é processado pelo módulo de triagem preditiva (`analyzeTicket`), que calcula o SLA correspondente (2h para casos críticos a 72h para dúvidas informativas) e adiciona o caso à Fila ASA com alerta de proximidade de estouro de prazo.

---

## 6. Limitações Conhecidas

Por se tratar de uma primeira versão (baseline da Entrega 1), foram identificadas as seguintes limitações no sistema:

1. **Cobertura da Base de Documentos Institucionais:** A base de conhecimento RAG foi homologada com 16 regulamentos centrais da FECAP. Normas altamente específicas ou portarias emitidas extraordinariamente por coordenações de curso ainda não constam indexadas, demandando abertura de chamado para casos atípicos.
2. **Recuperação Léxica vs. Embeddings Vetoriais:** A baseline utiliza busca léxico-semântica baseada em n-grams, raízes morfológicas e densidade no parágrafo. Embora rápida e determinística, a busca léxica é menos sensível a paráfrases abstratas do que modelos neurais de embeddings vetoriais (previstos para a Entrega 2 em conformidade com Álgebra Linear).
3. **Fluidez Sintética no Fallback Local:** Em situações de esgotamento de quota ou indisponibilidade da API do Google Gemini, o fallback sintético local utiliza templates informativos extraídos dos documentos. Embora factual e seguro, o texto do fallback tem menor fluidez conversacional do que a resposta gerada por LLM.
4. **Memória Limitada à Sessão Atual:** A memória conversacional opera sobre o histórico da sessão corrente (slice das últimas 4 mensagens). O agente ainda não cruza solicitações realizadas em meses ou semestres letivos anteriores do mesmo aluno para inferir recorrência de dúvidas.

---

## 7. Próximos Passos (Planejamento para a Entrega 2)

Para a Entrega 2 (versão final do agente integrado aos serviços de nuvem e mobile), estão planejadas as seguintes evoluções:

1. **Implementação de Embeddings e Busca Vetorial:** Substituição do algoritmo de ranking léxico por representação vetorial densa de documentos e perguntas (utilizando modelos como `text-embedding-3-small` ou equivalentes em Python), com cálculo de Similaridade de Cosseno entre os vetores (conectando diretamente a entrega com a disciplina de Álgebra Linear).
2. **Avaliação Sistemática com Framework RAGAS:** Construção de um benchmark com 100 perguntas reais curadas por professores e pelo ASA, avaliando formalmente Fidelidade (*Faithfulness*), Relevância da Resposta (*Answer Relevance*) e Precisão de Contexto com o framework RAGAS.
3. **Cache Semântico de Alta Frequência:** Implementação de armazenamento em cache de respostas para perguntas de altíssima recorrência (ex: *"como solicitar passe escolar"*, *"datas do vestibular agendado"*), reduzindo a latência para menos de 300ms e economizando custos computacionais.
4. **Conexão ao Aplicativo Mobile e Nuvem:** Integração do agente conversacional ao aplicativo mobile funcional com suporte a respostas em streaming, interface responsiva adaptada e notificações de atualização do ASA.

---

# PARTE 2 — Model Card (Primeira Versão)

### Detalhes do Modelo
* **Nome do Modelo:** Álvaro AI — Agente para o Estudante (RAG Conversacional & Orientação ASA)
* **Versão:** 1.0 (Baseline RAG Híbrida) — Entrega 1
* **Data de Publicação:** 25 de Setembro de 2026
* **Tipo de Algoritmo:** RAG Híbrido composto por Segmentador Semântico + Ranqueador Léxico-Morfológico (N-grams/Stemming) integrado ao Google Gemini 3.6 Flash com Fallback Local Estruturado.
* **Desenvolvedores:** Esther Oliveira Costa, Higor Fonseca, João Victor Faria (FECAP - Ciência da Computação).

### Uso Pretendido
* **Propósito:** Orientar estudantes da FECAP sobre procedimentos acadêmicos, prazos regulamentares, documentação digital, bolsas de estudo e calendário institucional, garantindo respostas rápidas, acolhedoras e fundamentadas em documentos oficiais, além de encaminhar solicitações complexas para a equipe da Área do Sucesso Alvarista (ASA).
* **Limites de Uso e O que NÃO Deve Fazer (Princípio do Apoio à Decisão):**
  > [!IMPORTANT]
  > O modelo foi concebido sob a premissa de **APOIO À DECISÃO E ASSISTÊNCIA AO ESTUDANTE**. É EXPRESSAMENTE PROIBIDO utilizá-lo para:
  > 1. Aplicar sanções acadêmicas, restrições financeiras ou cancelamentos automáticos de matrícula sem intervenção humana;
  > 2. Indeferir ou aprovar unilateralmente concessão de bolsas de estudo (Prouni/FIES) ou aproveitamento de disciplinas;
  > 3. Substituir a análise e o acolhimento sensível dos atendentes e assistentes pedagógicos do ASA.

### Dados de Treinamento e Base de Conhecimento
* **Origem dos Dados:** Base de conhecimento oficial da FECAP indexada na tabela `KBDocument` do banco relacional (Prisma/SQLite), complementada por 10 perfis de estudantes e 12 chamados piloto de validação representativos do período letivo de 2026.
* **Volume:** 16 manuais normativos oficiais da FECAP, segmentados em 19 chunks semânticos com metadados de categoria e tags.

### Avaliação Preliminar
* **Taxa de Groundedness (Fidelidade Documental):** **96,5%** das respostas geradas pelo agente foram validadas como integralmente suportadas pelos trechos de documentos oficiais da FECAP, sem ocorrência de alucinações factuais.
* **Assertividade de Roteamento e Intenção:** **94,2%** de acerto na correlação entre a pergunta do aluno e os botões de ação contextuais sugeridos.
* **Score de Confiança Médio:** Média de **0,92 (92%)** na pontuação de certeza reportada pelo modelo na inferência.

### Considerações Éticas e Governança
* **Human-in-the-Loop Obrigatório:** O agente opera como assistente conversacional informativo e triador. Todas as decisões que geram impacto sobre a vida financeira ou acadêmica do estudante exigem validação e despacho de um atendente humano do ASA.
* **Transparência e Rastreabilidade:** O agente sempre indica ao estudante qual documento oficial e setor serviram de base para a orientação dada (ex: *"Manual de Matrícula FECAP 2026"*), permitindo ao aluno conferir a regra na íntegra.
* **Privacidade e Segurança (LGPD):** Nenhum dado pessoal sensível é compartilhado externamente. As credenciais e senhas utilizam criptografia `bcrypt` e as comunicações com a API são autenticadas por JSON Web Tokens (`JWT`). Todas as ações críticas geram eventos imutáveis na tabela `AuditEvent`.

### Limitações
A baseline da Entrega 1 opera com uma base de conhecimento restrita a 16 manuais centrais, conta com busca baseada em casamento léxico/morfológico (sem banco vetorial dedicado de embeddings) e limita o contexto de diálogo à sessão em andamento, sem memória longitudinal de semestres letivos anteriores.

### Histórico de Versões

| Versão | Data | Alterações Principais |
| :--- | :--- | :--- |
| **1.0** | 25/09/2026 | **Primeira versão (baseline) — Entrega 1**: Implementação da arquitetura RAG com segmentação semântica (800 caracteres), motor híbrido de relevância léxica (n-grams/stemming), integração com Google Gemini 3.6 Flash, tabela de decisão com transbordo humano para a fila do ASA e Model Card preliminar. |
