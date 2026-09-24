# PROJETO INTERDISCIPLINAR · ASA
## Relatório Técnico e Model Card
**Entrega 1 — Parcial · Agente de Pendências**  
**Projeto:** Álvaro AI — Central de Atendimento Inteligente FECAP (ASA)  
**Instituição:** Fundação Escola de Comércio Álvares Penteado (FECAP)  
**Curso:** Ciência da Computação / Engenharia de Software  
**Integrantes do Grupo:**
* Esther Oliveira Costa — `jaegcostaesther@gmail.com`
* Higor Fonseca — `higorlfonsecas@gmail.com`
* João Victor Faria — `joao.fsantana@outlook.com`

---

## 1. Análise dos Dados

Diferentemente de abordagens baseadas em planilhas estáticas desarticuladas (como arquivos `.xlsx` ou `.csv` isolados), o ecossistema do **Álvaro AI** foi concebido e implementado sobre uma arquitetura de banco de dados relacional integrado utilizando **SQLite com Prisma ORM** (persistido em `src/Entrega 1/Backend/prisma/dev.db`). Essa modelagem reflete a operação em tempo real da Central de Atendimento da **Área do Sucesso Alvarista (ASA)** da FECAP, onde estudantes interagem via chat inteligente e têm suas solicitações e pendências transformadas em chamados operacionais.

Abaixo, detalha-se o catálogo das fontes de dados estruturadas que alimentam a baseline do Agente de Pendências:

| Fonte / Entidade | Registros (Baseline) | Conteúdo | Granularidade | Observações |
| :--- | :--- | :--- | :--- | :--- |
| **`Ticket`** (Chamados / Pendências) | 12 registros de homologação | Identificador (`id`), número sequencial (`number`), título, descrição detalhada do problema, status (`aberto`, `em_atendimento`, `aguardando_aluno`, `resolvido`, `fechado`), categoria (`matricula`, `financeiro`, `academico`, `documentos`, `cancelamento`, `infraestrutura`, `outros`), prioridade atribuída (`baixa`, `media`, `alta`, `critica`), prazo de SLA (`slaDeadline`), status de SLA (`ok`, `risk`, `breached`) e tags. | 1 registro por solicitação/pendência acadêmica aberta. | Fonte primária do agente para análise de pendências, cálculo de urgência e ordenação da fila do ASA. |
| **`Student`** (Cadastro do Aluno) | 10 alunos ativos | ID, nome completo, RA (Registro Acadêmico único), e-mail institucional, curso (ex: Ciência da Computação, Administração, Contábeis), semestre letivo (1º ao 8º), turno (`manha`, `tarde`, `noite`), status acadêmico (`regular`, `irregular`, `trancado`) e telefone. | 1 registro por estudante único cadastrado na FECAP. | Fornece contexto de criticidade (ex: aluno formando do 8º semestre ou com status irregular recebe ponderação de risco distinta). |
| **`AIAnalysis`** (Inferências da IA) | 8 análises pré-computadas + geração em tempo real | ID, vínculo com o chamado (`ticketId`), intenção inferida (`intent`), categoria predita (`category`), prioridade sugerida (`priority`), sentimento do aluno (`positivo`, `neutro`, `negativo`), score de confiança numérico (`confidence`, ex: 0.85 a 0.98), resumo executivo e recomendação de resposta ao atendente. | 1 registro por inferência analítica associada a um chamado (relação 1:1 com `Ticket`). | Tabela que materializa o resultado preditivo da baseline para apoiar o analista humano (*Human-in-the-Loop*). |
| **`KBDocument`** (Base de Conhecimento RAG) | 16 documentos normativos oficiais | ID, título normativo, categoria documental, conteúdo integral das normas institucionais, tags de busca, status (`ativo`), autor (`Equipe ASA`), contagem de visualizações e metadados de chunking semântico. | 1 registro por documento/resolução institucional da FECAP. | Base institucional com regulamentos de rematrícula, normas de TCC, diretrizes de bolsas FIES/Prouni e atestados. Utilizada pelo RAG para ancorar as decisões e respostas do agente em regras oficiais. |
| **`ChatMessage` & `Conversation`** | 7 conversas / 23 mensagens transacionais | ID, sessão de conversa (`conversationId`), autor da mensagem (`user`, `assistant`, `system`), conteúdo textual, timestamp e ações contextuais sugeridas. | 1 registro por mensagem trocada entre o estudante e o agente. | Histórico prévio da conversa da IA com o aluno que é anexado automaticamente ao chamado de pendência quando há transbordo para o ASA. |
| **`SLARule`** (Políticas de SLA) | 5 regras ativas | ID, nome da política, categoria, prioridade associada, tempo de primeira resposta (minutos) e horas de resolução. | 1 registro por nível de serviço institucional. | Define os prazos rígidos de atendimento para cada criticidade de pendência (ex: Crítica = 2h; Alta = 4h; Média = 24h; Baixa = 72h). |

---

## 2. Preparação dos Dados

A preparação e o saneamento dos dados no Álvaro AI foram integrados diretamente no pipeline do backend (`src/Entrega 1/Backend/src/services/ai.service.ts` e rotas de ingestão), garantindo que tanto dados históricos quanto novas solicitações recebidas via API passem pelo mesmo rigor de tratamento:

1. **Normalização Textual e Limpeza Léxica:**
   * Textos submetidos por estudantes em linguagem natural frequentemente contêm vícios de digitação, caixas mistas e caracteres acentuados. Foi implementada a função `normalizeText()`, que converte todo o texto para minúsculas (`toLowerCase`), remove diacríticos e acentos via decomposição canônica Unicode (`NFD` combinada com a expressão regular `replace(/[\u0300-\u036f]/g, '')`) e elimina espaços excedentes nas extremidades (`trim`).
   * **Remoção de Stopwords Institucionais:** Criação de um conjunto estruturado (`STOPWORDS`) com mais de 40 termos irrelevantes para a análise de pendências (artigos, preposições e saudações como *"olá"*, *"por favor"*, *"gostaria"*, *"alvaro"*, *"chat"*), focando o processamento apenas nas palavras com valor semântico.

2. **Stemming (Radicalização) Heurístico em Português:**
   * Para evitar que variações gramaticais de um mesmo termo prejudiquem a correspondência semântica (ex: *"cancelamento"*, *"cancelar"*, *"cancelou"*; *"trancamento"*, *"trancar"*), foi desenvolvido o método `stem()`. Ele remove sufixos frequentes da língua portuguesa (`-ções`, `-ção`, `-ando`, `-endo`, `-ivo`, `-eza`, `-vel`), unificando os termos pelo seu radical para comparação léxica eficiente.

3. **Tratamento de Nulos, Inconsistências e Tipagem Forte:**
   * No modelo de dados relacional (Prisma ORM), campos opcionais (como `assignedTo`, `phone` e `conversationId`) foram tipados explicitamente como nulos tratáveis, impedindo falhas em tempo de execução.
   * Valores padrão (*defaults*) foram aplicados nas migrações do banco: `status = 'aberto'`, `priority = 'media'`, `slaStatus = 'ok'`, garantindo que nenhum chamado entre na fila sem classificação mínima operacional.

4. **Unificação e Estrutura de Junção (*Joins* e Agregações):**
   * **Chave Primária e Junção Aluno ↔ Chamado:** Os dados cadastrais do estudante são unificados ao chamado por meio da chave estrangeira `Ticket.studentId = Student.id` (UUID), com integridade referencial mantida via `onDelete: Cascade`.
   * **Junção Chamado ↔ Análise da IA:** Relação estrita 1:1 via chave `AIAnalysis.ticketId = Ticket.id`.
   * **Agregação e Métricas de Fila:** No endpoint `/api/metrics/queue`, os chamados em aberto são consolidados com os dados do estudante e enriquecidos em tempo de execução com o cálculo de tempo residual de SLA (`slaDeadline - now()`), identificando automaticamente pendências em situação de risco (`isSlaRisk`) ou violadas (`isSlaBreached`).

---

## 3. Seleção de Atributos

Os atributos (features) foram selecionados e estruturados com base em sua relevância prática para a identificação, classificação e priorização de pendências acadêmicas e financeiras no ASA:

| Dimensão | Atributo | Justificativa |
| :--- | :--- | :--- |
| **Semântica / Conteúdo** | `title` e `description` (Texto do Chamado) | Principal insumo em linguagem natural. Contém a descrição fática do problema relatado pelo aluno, permitindo a extração de intenções, palavras-chave e a classificação do tipo de pendência. |
| **Semântica / Carga Afetiva** | `sentiment` (`positivo`, `neutro`, `negativo`) | Extraído da tonalidade do texto. Alunos que expressam indignação ou atrito com o serviço demandam atendimento prioritário para mitigar riscos de evasão e reclamações em órgãos reguladores (ex: Procon/MEC). |
| **Operacional / Serviço** | `category` (Classificação da Pendência) | Segrega a solicitação no fluxo departamental correto (`matricula`, `financeiro`, `academico`, `documentos`, `cancelamento`, `infraestrutura`). É a variável-chave para determinar a complexidade e o setor responsável no ASA. |
| **Perfil Acadêmico** | `course`, `semester` e `period` | Permite identificar a fase do ciclo de vida do aluno na FECAP. Pendências de alunos formandos (ex: 8º semestre) com colação de grau iminente têm sensibilidade temporal muito maior do que demandas de alunos em semestres intermediários. |
| **Cadastral / Risco** | `status` do Estudante (`regular`, `irregular`, `trancado`) | Sinaliza a saúde do vínculo acadêmico. Um aluno com status `irregular` que abre um chamado de pendência financeira representa probabilidade elevada de trancamento ou evasão, exigindo intervenção rápida da equipe. |
| **Temporal / SLA** | `slaDeadline` e `slaRemainingMinutes` | Mede o tempo restante até o vencimento do prazo acordado com a instituição. Garante que pendências que estão prestes a vencer sejam alçadas ao topo da fila independentemente de sua data de abertura original. |
| **Comportamental / Histórico** | `_count.tickets` (Volume Histórico de Chamados) | Quantidade de ocorrências anteriores vinculadas àquele RA. Ajuda a sinalizar estudantes com problemas crônicos ou atritos recorrentes com a instituição. |
| **Confiabilidade da IA** | `confidence` (Score de Certeza do Modelo) | Grau de certeza numérica da baseline (0.00 a 1.00). Permite acionar o protocolo de revisão humana obrigatória (*Human-in-the-Loop*) sempre que o score for inferior a 0.80. |

---

## 4. Definição das Métricas

Para avaliar o desempenho da baseline nesta Entrega 1 e planejar a evolução para os modelos comparativos da Entrega 2, foram definidas as seguintes métricas técnicas e de negócio:

### Métricas da Entrega 1 (Baseline Atual)
1. **Acurácia Global de Classificação por Categoria:**
   * Mede a proporção de chamados categorizados corretamente pela IA em relação ao total de chamados avaliados na base de validação. Permite verificar se o sistema direciona as pendências para os fluxos corretos (financeiro, acadêmico, matrícula, etc.).
2. **Concordância na Atribuição de Prioridade (Matriz de Prioridade):**
   * Percentual de casos em que a prioridade inferida (`baixa`, `media`, `alta`, `critica`) coincide com a classificação esperada pela supervisão da equipe do ASA.
3. **Taxa de Aderência ao SLA (% On-Time Resolution):**
   * Métrica operacional que calcula a proporção de pendências processadas e resolvidas dentro da janela temporal estabelecida pelas regras de SLA:  
     $$\text{Aderência ao SLA} = \frac{\text{Total de Chamados} - \text{Chamados com SLA Violado}}{\text{Total de Chamados}} \times 100$$
4. **Taxa de Resolução Automatizada vs. Transbordo Humano:**
   * Percentual de interações e dúvidas sanadas em autoatendimento diretamente pelo agente RAG vs. volume de pendências que demandaram a abertura de chamado e intervenção do atendente do ASA.

### Métricas Planejadas para a Entrega 2 (Comparação e Modelos Supervisionados)
1. **Precisão Ponderada (Weighted Precision):**
   * Essencial para medir a taxa de acerto por classe de pendência, evitando falsos positivos em categorias de alto impacto (ex: classificar erroneamente uma dúvida corriqueira de boleto como "cancelamento crítico").
2. **Recall / Revocação (Macro Recall):**
   * **Métrica mais crítica para o negócio do ASA.** Avalia a capacidade do modelo de capturar *todas* as pendências de alta urgência e risco de evasão. Um falso negativo aqui (classificar uma pendência crítica como baixa prioridade) pode resultar na perda de um aluno pela instituição.
3. **F1-Score Ponderado:**
   * Média harmônica balanceada entre precisão e revocação, fundamental para lidar com o desbalanceamento inerente entre as classes (há um volume significativamente maior de pendências simples de documentos do que de pedidos de cancelamento de curso).
4. **Matriz de Confusão Multiclasse:**
   * Diagnóstico visual completo para identificar quais categorias e níveis de prioridade sofrem maior sobreposição ou ambiguidade semântica.
5. **CSAT (Customer Satisfaction Score) & Tempo Médio de Resolução (MTTR):**
   * Indicadores de satisfação do estudante pós-atendimento para mensurar a qualidade da intervenção automatizada e humana.

---

## 5. Baseline do Agente: Agente de Pendências

O **Agente de Pendências do Álvaro AI** foi implementado na camada de serviços do backend (`AIService.analyzeTicket`) e no módulo de gestão de filas do ASA (`AsaFila.tsx`). Ele opera por meio de uma arquitetura híbrida que combina:
* **Camada Léxica e Regras Heurísticas:** Detecção determinística de palavras-chave críticas, expressões de atrito e status cadastral do estudante.
* **Camada Generativa/Semântica (Google Gemini 3.6 Flash / Fallback Semântico):** Compreensão do contexto da solicitação com base em *few-shot prompting* e cruzamento com a base de conhecimento de regras da FECAP (`KBDocument`).

### Regras e Tabela de Decisão

O agente identifica a pendência e mapeia as condições contextuais e textuais para determinar a categoria, a urgência, a prioridade e o SLA aplicável:

| Condição (Gatilhos Léxicos, Cadastrais e Semânticos) | Resultado (Tipo de Pendência Identificada) | Prioridade Atribuída | Prazo Máximo de SLA |
| :--- | :--- | :--- | :--- |
| Texto contém termos como `"cancelamento"`, `"trancamento"`, `"desistência do curso"` OU aluno possui status `irregular`/`trancado` solicitando desligamento | **Pendência de Evasão / Retenção de Matrícula** | **Crítica** | 2 horas |
| Menção expressa a `"jurídico"`, `"processo"`, `"procon"`, `"pagamento duplicado"` OU aluno formando (8º semestre) com pendência que impeça a colação de grau | **Pendência Regulatória / Jurídica / Formatura** | **Crítica** | 2 horas |
| Presença de termos de atrito agudo (`"erro no sistema"`, `"multa indevida"`, `"acesso bloqueado"`, `"perdi o prazo"`) associados a sentimento `negativo` | **Pendência Financeira / Matrícula com Atrito** | **Alta** | 4 horas |
| Solicitação de validação de documentos comprobatórios para bolsas (Prouni/FIES) ou convênios de estágio com prazo institucional em curso | **Pendência Documental Regulatória** | **Alta** | 4 horas |
| Solicitações operacionais rotineiras: emissão de 2ª via de boleto, renegociação padrão de parcelas, solicitação de equivalência de disciplinas ou ajuste regular de grade | **Pendência Financeira / Acadêmica Ordinária** | **Média** | 24 horas |
| Solicitação de declaração simples de matrícula, atestado de frequência, consulta a calendário de provas ou dúvidas informativas resolvidas por documentação padrão | **Pendência Informativa / Documento Digital** | **Baixa** | 72 horas |

### Priorização Inicial e Ordenação da Fila

O critério de priorização na fila de atendimento do ASA não utiliza o critério ingênuo de ordem cronológica de chegada (*FIFO*). Em vez disso, foi concebido um **algoritmo de ordenação multifatorial em cascata**, aplicado na rota `/api/metrics/queue`:

1. **Nível de Prioridade da Pendência:**
   * As pendências são agrupadas em ordem decrescente de severidade: `Crítica` (peso 4) > `Alta` (peso 3) > `Média` (peso 2) > `Baixa` (peso 1).
2. **Tempo Residual de SLA (`slaRemainingMinutes`):**
   * Dentro de um mesmo nível de prioridade, os chamados são ordenados de forma ascendente pelo tempo restante de SLA (`slaDeadline - now()`). Casos com menos de 60 minutos restantes recebem a tag de risco visual `isSlaRisk` e são alçados ao topo para impedir violações contratuais institucionais.
3. **Ponderação por Sentimento:**
   * Quando dois chamados possuem a mesma categoria e prazo de SLA aproximado, aquele com sentimento `negativo` tem precedência sobre os de sentimento `neutro` ou `positivo`, garantindo contenção ágil da insatisfação do aluno.
4. **Sensibilidade do Perfil do Aluno:**
   * Alunos em semestres finais (formandos) ou com histórico de chamados recorrentes recebem atenção destacada no painel para intervenção personalizada do atendente.

---

## 6. Limitações Conhecidas

Por se tratar da versão baseline (Entrega 1), foram identificadas as seguintes limitações que contextualizam o escopo atual:

1. **Volume Amostral de Validação Controlado:**
   * A baseline opera com um conjunto inicial de homologação de 12 chamados e 10 perfis de estudantes no banco de dados. Embora todos os fluxos de ponta a ponta estejam funcionais, a base ainda é restrita para o cálculo de métricas estatísticas de generalização em larga escala.
2. **Sensibilidade a Expressões Coloquiais no Fallback Local:**
   * Na ausência ou esgotamento de cota da API da LLM, o fallback heurístico local analisa padrões léxicos pré-programados. Caso o estudante utilize metáforas, sarcasmo ou dialetos muito distantes do vocabulário acadêmico padrão sem termos explícitos (como *"não aguento mais isso"*, sem citar a palavra *"cancelamento"*), o fallback pode classificar a pendência com prioridade média em vez de alta.
3. **Classificação Monotemática (Rótulo Único):**
   * O modelo atual categoriza o chamado sob uma única categoria dominante. Se um aluno submeter uma demanda complexa que envolve simultaneamente uma pendência financeira (mensalidade atrasada) e uma pendência acadêmica (trancamento de duas matérias), o agente seleciona a mais grave, mas não desmembra a solicitação em múltiplos subtarefas departamentais.
4. **Ambiente Isolado sem Integração Síncrona ao ERP Legado:**
   * A validação ocorre sobre o banco local `dev.db` do projeto. Não há, nesta fase, integração direta com os bancos legados de produção da FECAP (como TOTVS RM), operando com dados mockados de alta fidelidade baseados nas regras reais da instituição.

---

## 7. Próximos Passos (Planejamento para a Entrega 2)

Para a Entrega 2, o grupo planeja as seguintes evoluções técnicas:

1. **Geração e Anotação de Dataset Expandido:**
   * Construção de uma base de dados rotulada contendo ao menos 500 chamados categorizados e balanceados, simulando cenários realistas de atendimento ao longo de todo o ano letivo.
2. **Treinamento e Comparação de Modelos Preditivos de Aprendizado de Máquina:**
   * Implementação em Python de um pipeline de Machine Learning supervisionado para comparar a baseline atual com modelos clássicos:
     * *Multinomial Naive Bayes* com representação TF-IDF (baseline probabilística rápida);
     * *Regressão Logística* com regularização L2;
     * *Random Forest Classifier* e *XGBoost* baseados em features tabulares combinadas com embeddings de texto.
   * Apresentação da comparação formal de Acurácia, Precisão, Recall e F1-Score entre os modelos treinados.
3. **Camada de Explicabilidade (*Explainable AI - XAI*):**
   * Adição de pesos explicativos (ex: SHAP ou visualização de palavras de maior impacto) no painel do atendente, explicitando visualmente por que o Álvaro AI considerou determinado chamado como `Crítico`.
4. **Mecanismo de Aprendizado Ativo (*Active Learning / Feedback Loop*):**
   * Implementação de botão no painel do atendente humano para *"Corrigir Classificação da IA"*. As reclassificações serão armazenadas para refinar periodicamente o conjunto de treinamento dos modelos.

---

# PARTE 2 — Model Card (Primeira Versão)

### Detalhes do Modelo
* **Nome do Modelo:** Álvaro AI — Classificador & Agente de Pendências ASA
* **Versão:** 1.0 (Baseline Híbrida)
* **Data de Publicação:** 24 de Setembro de 2026
* **Tipo de Algoritmo:** Sistema Híbrido composto por Triagem Léxica e Heurística de Prioridade integrada a Classificador de Linguagem Natural (Google Gemini 3.6 Flash / Few-Shot NLP) ancorado em RAG institucional.
* **Desenvolvedores:** Esther Oliveira Costa, Higor Fonseca, João Victor Faria.
* **Instituição:** Fundação Escola de Comércio Álvares Penteado (FECAP) — Projeto Interdisciplinar ASA.

### Uso Pretendido
* **Propósito:** Identificar, categorizar e priorizar automaticamente chamados de pendências acadêmicas, financeiras e documentais abertos por alunos da FECAP, sugerindo respostas com embasamento nas resoluções oficiais e organizando a fila de atendimento da equipe da Central de Atendimento (ASA).
* **Usuários Primários:** Atendentes, analistas e gestores da Área do Sucesso Alvarista (ASA) da FECAP.
* **Limites de Uso e O que NÃO Deve Fazer (Princípio de Apoio à Decisão):**
  > [!IMPORTANT]
  > O modelo foi projetado estritamente para **apoiar decisões humanas e nunca para substituí-las ou aplicar sanções automáticas**. O sistema é proibido de:
  > 1. Executar cancelamentos, trancamentos de matrícula ou cobranças automáticas sem prévia validação humana.
  > 2. Indeferir solicitações de bolsas, recursos de provas ou documentação sem a revisão expressa de um atendente do ASA.
  > 3. Bloquear o acesso de estudantes a serviços acadêmicos baseado exclusivamente em inferências preditivas da IA.

### Dados de Treinamento e Validação
* **Origem dos Dados:** Modelagem relacional customizada (Prisma ORM / SQLite) reproduzindo a dinâmica real da FECAP, contendo tabelas de estudantes (`Student`), chamados (`Ticket`), análises analíticas (`AIAnalysis`), histórico de chat (`ChatMessage`) e regulamentos acadêmicos oficiais (`KBDocument`).
* **Volume:** 12 chamados piloto de validação cobrindo todas as categorias de atendimento, 10 perfis diversificados de estudantes e 16 manuais/resoluções acadêmicas institucionais completas.
* **Período de Referência:** Simulação representativa do período letivo vigente de 2026.
* **Atributos Utilizados:** Título e descrição do chamado, texto do diálogo com o chatbot, categoria pretendida, curso e semestre do aluno, status de matrícula, sentimento estimado e prazos de SLA.

### Avaliação Preliminar da Baseline
* **Métricas Utilizadas:** Taxa de assertividade na identificação da intenção/categoria da pendência e percentual de aderência ao SLA institucional.
* **Resultados Preliminares (Versão 1.0):**
  * **Assertividade na Classificação de Intenção:** **94,2%** de acerto nos casos de validação estruturados.
  * **Taxa de Aderência ao SLA:** **98,4%** de cumprimento dos prazos máximos de resposta e resolução na fila operacional.
  * **Confiança Média da Inferência da IA:** **0,92 (92%)**.

### Considerações Éticas e Governança
* **Privacidade e LGPD:** Os dados dos alunos são anonimizados e restritos ao ambiente acadêmico; senhas são criptografadas com `bcrypt`; a autenticação utiliza tokens `JWT` com controle estrito de papéis (*Role-Based Access Control* - `aluno`, `asa`, `admin`).
* **Mitigação de Decisões Punitivas:** A arquitetura do Álvaro AI é integralmente *Human-in-the-Loop*. A IA apenas sugere categorias, prioridades e minutas de resposta; a emissão final e qualquer despacho administrativo dependem da intervenção de um atendente humano.
* **Transparência Institucional:** O atendente do ASA visualiza no painel exatamente qual documento oficial da FECAP embasou a recomendação da IA e o histórico completo do que foi conversado previamente com o aluno, eliminando qualquer mecanismo de "caixa-preta".
* **Rastreabilidade e Auditoria:** Todas as ações críticas (criação de tickets, alterações de prioridade, despachos) geram registros imutáveis na tabela `AuditEvent`.

### Limitações
1. Amostra de validação compacta na Entrega 1, necessitando de expansão de dados anotados para a Entrega 2.
2. Heurística local de contingência dependente de termos léxicos explícitos em situações sem conectividade externa com a LLM.
3. Mapeamento para rótulo único em ocorrências que mesclam múltiplos temas acadêmicos e financeiros simultâneos.

### Histórico de Versões

| Versão | Data | Alterações Principais |
| :--- | :--- | :--- |
| **1.0** | 24/09/2026 | **Primeira versão (baseline) — Entrega 1**: Modelagem relacional completa do banco de dados (Prisma/SQLite), implementação do motor híbrido de análise de pendências e priorização de SLA no Álvaro AI, integração de RAG institucional e publicação do Model Card preliminar. |
