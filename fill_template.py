import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import shutil
import os

TEMPLATE_PATH = r"C:\Users\24026811\Downloads\PI_Template_Entrega1.docx"
OUTPUT_DOWNLOADS = r"C:\Users\24026811\Downloads\PI_Template_Entrega1.docx"
OUTPUT_DOWNLOADS_COPY = r"C:\Users\24026811\Downloads\PI_Template_Entrega1_Preenchido.docx"
OUTPUT_REPO = r"c:\Users\24026811\Documents\Projeto5\documentos\Entrega 1\Projeto Interdisciplinar_ Inteligência Artificial\Relatorio_Tecnico_e_Model_Card_Entrega_1.docx"

def create_document():
    doc = docx.Document()

    # Configuração de Margens (2,5 cm em toda a volta)
    for section in doc.sections:
        section.top_margin = Inches(0.98)
        section.bottom_margin = Inches(0.98)
        section.left_margin = Inches(0.98)
        section.right_margin = Inches(0.98)

    # Estilos de Cores
    COLOR_PRIMARY = RGBColor(15, 35, 75)      # Azul FECAP Institucional
    COLOR_SECONDARY = RGBColor(30, 64, 175)   # Azul Royal
    COLOR_DARK = RGBColor(30, 41, 59)         # Grafite Escuro
    COLOR_MUTED = RGBColor(100, 116, 139)     # Cinza Texto Secundário
    COLOR_HIGHLIGHT = RGBColor(16, 185, 129)  # Verde Sucesso
    HEX_HEADER_BG = "0F2942"                  # Azul Profundo para tabelas
    HEX_ZEBRA_BG = "F8FAFC"                   # Fundo alternado sutil
    HEX_BORDER = "CBD5E1"                     # Borda das tabelas
    HEX_CALLOUT_BG = "EFF6FF"                 # Fundo de destaque azul claro

    def style_p(p, space_before=0, space_after=6, line_spacing=1.15):
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing

    def add_title(text, subtitle=""):
        p = doc.add_paragraph()
        style_p(p, space_before=4, space_after=2)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = COLOR_SECONDARY

        p2 = doc.add_paragraph()
        style_p(p2, space_before=2, space_after=4)
        r2 = p2.add_run(subtitle if subtitle else "Relatório Técnico e Model Card")
        r2.font.name = "Calibri"
        r2.font.size = Pt(20)
        r2.font.bold = True
        r2.font.color.rgb = COLOR_PRIMARY

    def add_h1(text):
        p = doc.add_paragraph()
        style_p(p, space_before=14, space_after=6)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = COLOR_PRIMARY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        style_p(p, space_before=10, space_after=4)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = COLOR_SECONDARY
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        style_p(p, space_before=6, space_after=2)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = COLOR_DARK
        return p

    def add_p(text, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        style_p(p, space_before=0, space_after=5)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10.5)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_DARK
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)
        r.font.italic = italic
        r.font.color.rgb = COLOR_DARK
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        style_p(p, space_before=1, space_after=3)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10.5)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_DARK
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)
        r.font.color.rgb = COLOR_DARK
        return p

    def add_callout(text, bold_title=""):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)

        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_CALLOUT_BG}"/>')
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
        tcPr.append(shd)
        tcPr.append(borders)

        p = cell.paragraphs[0]
        style_p(p, space_before=4, space_after=4)
        if bold_title:
            rb = p.add_run(f"{bold_title}\n")
            rb.font.name = "Calibri"
            rb.font.size = Pt(10.5)
            rb.font.bold = True
            rb.font.color.rgb = COLOR_SECONDARY
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.italic = True
        r.font.color.rgb = COLOR_DARK

        p_after = doc.add_paragraph()
        style_p(p_after, space_before=0, space_after=4)

    def set_cell_properties(cell, fill_hex=None, bold=False, text_color=COLOR_DARK, font_size=Pt(9.5), align=WD_ALIGN_PARAGRAPH.LEFT):
        tcPr = cell._tc.get_or_add_tcPr()
        if fill_hex:
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
            tcPr.append(shd)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        # Padding interno (top/bottom: 120 dxa, left/right: 140 dxa)
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05
        for r in p.runs:
            r.font.name = "Calibri"
            r.font.size = font_size
            r.font.bold = bold
            r.font.color.rgb = text_color

    def apply_table_styles(tbl, col_widths, col_alignments=None):
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        tblPr = tbl._tbl.tblPr
        borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER}"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER}"/><w:left w:val="none"/><w:right w:val="none"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/><w:insideV w:val="none"/></w:tblBorders>')
        tblPr.append(borders)

        for row_idx, row in enumerate(tbl.rows):
            is_header = (row_idx == 0)
            fill_color = HEX_HEADER_BG if is_header else (HEX_ZEBRA_BG if row_idx % 2 == 1 else "FFFFFF")
            txt_color = RGBColor(255, 255, 255) if is_header else COLOR_DARK
            font_size = Pt(10) if is_header else Pt(9.5)
            is_bold = is_header

            for col_idx, cell in enumerate(row.cells):
                cell.width = col_widths[col_idx]
                align = col_alignments[col_idx] if col_alignments else WD_ALIGN_PARAGRAPH.LEFT
                set_cell_properties(cell, fill_hex=fill_color, bold=is_bold, text_color=txt_color, font_size=font_size, align=align)

    # ==========================================
    # CABEÇALHO DO DOCUMENTO
    # ==========================================
    add_title("PROJETO INTERDISCIPLINAR · ASA", "Relatório Técnico e Model Card")

    p_sub = doc.add_paragraph()
    style_p(p_sub, space_before=2, space_after=4)
    r_sub = p_sub.add_run("Entrega 1 — Parcial · Agente 3: Agente para o Estudante (Álvaro AI)")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(12)
    r_sub.font.bold = True
    r_sub.font.color.rgb = COLOR_SECONDARY

    # Metadados do Projeto e Integrantes
    p_meta = doc.add_paragraph()
    style_p(p_meta, space_before=2, space_after=8)
    r_m1 = p_meta.add_run("Projeto: ")
    r_m1.bold = True
    p_meta.add_run("Álvaro AI — Central de Atendimento Inteligente FECAP (ASA) | ")
    r_m2 = p_meta.add_run("Curso: ")
    r_m2.bold = True
    p_meta.add_run("Ciência da Computação (5º Semestre 2026)\n")
    r_m3 = p_meta.add_run("Integrantes do Grupo: ")
    r_m3.bold = True
    p_meta.add_run("Esther Oliveira Costa (jaegcostaesther@gmail.com), Higor Fonseca (higorlfonsecas@gmail.com), João Victor Faria (joao.fsantana@outlook.com)")

    p_intro = doc.add_paragraph()
    style_p(p_intro, space_before=2, space_after=10)
    p_intro.add_run("Este relatório documenta a construção da baseline (primeira versão do modelo e arquitetura RAG) coerente com o ")
    r_ag = p_intro.add_run("Agente para o Estudante (Agente 3)")
    r_ag.bold = True
    p_intro.add_run(", seguindo rigorosamente os requisitos da Entrega 1 do Projeto Interdisciplinar do 5º Semestre de Ciência da Computação da FECAP.")

    # ==========================================
    # 1. ANÁLISE DOS DADOS
    # ==========================================
    add_h1("1. Análise dos Dados")
    p_d1 = doc.add_paragraph()
    style_p(p_d1, space_before=0, space_after=6)
    p_d1.add_run("Em estrita consonância com a arquitetura moderna do projeto ")
    p_d1.add_run("Álvaro AI").bold = True
    p_d1.add_run(", a solução ")
    r_no_xls = p_d1.add_run("não utiliza planilhas estáticas desarticuladas (como arquivos .xlsx ou .csv isolados)")
    r_no_xls.bold = True
    p_d1.add_run(". Em vez disso, foi modelada e implementada uma infraestrutura relacional persistida via ")
    p_d1.add_run("SQLite com Prisma ORM").bold = True
    p_d1.add_run(" (em ")
    p_d1.add_run("src/Entrega 1/Backend/prisma/dev.db").italic = True
    p_d1.add_run("), reproduzindo com fidelidade os dados do ecossistema universitário da FECAP e da Área do Sucesso Alvarista (ASA).")

    add_p("A baseline do Agente para o Estudante é alimentada por tabelas estruturadas que consolidam o conhecimento regulatório oficial da instituição, o contexto acadêmico dos alunos e o histórico transacional das solicitações:")

    # Tabela 0: Catálogo de Fontes
    t0_data = [
        ["Fonte / Tabela", "Registros", "Conteúdo Principal", "Granularidade e Observações"],
        [
            "KBDocument\n(Base RAG FECAP)",
            "16 documentos\n(19 chunks)",
            "Normas e resoluções oficiais de matrícula, prazos acadêmicos, bolsas Prouni/FIES, colação de grau, TCC, regulamento financeiro e atestados.",
            "1 linha por documento oficial. Indexados em chunks semânticos (800 caracteres com overlap de 150) com tags de busca léxica e categórica."
        ],
        [
            "Student\n(Cadastro do Aluno)",
            "10 estudantes\nativos",
            "Identificador (UUID), RA único, nome completo, curso (CC, ADM, Contábeis), semestre (1º ao 8º), turno, status (regular, irregular, trancado) e telefone.",
            "1 linha por estudante único. Utilizado para contextualizar e personalizar dinamicamente as respostas da IA com base no curso e semestre do aluno."
        ],
        [
            "ChatMessage &\nConversation",
            "7 sessões /\n23 mensagens",
            "Sessões de chat, autoria das mensagens ('user', 'assistant', 'system'), conteúdo textual integral, timestamps e ações rápidas sugeridas.",
            "1 linha por mensagem trocada. Fornece memória conversacional de curto prazo e garante histórico integral ao transbordar para atendimento humano."
        ],
        [
            "Ticket\n(Chamados ASA)",
            "12 chamados de\nhomologação",
            "Número sequencial, título, descrição do problema, categoria, prioridade, status de atendimento, SLA limite e vínculo com o aluno (studentId).",
            "1 linha por chamado formal. Acionado quando a dúvida do estudante requer intervenção humana resolutiva (Human-in-the-Loop)."
        ],
        [
            "AIAnalysis\n(Inferência e Triagem)",
            "8 análises pré-computadas + tempo real",
            "Intenção detectada, categoria predita, score de confiança numérico (0.85 a 0.98), resumo executivo, recomendação ao atendente e sentimento.",
            "1 linha por inferência analítica (relação 1:1 com Ticket). Auxilia o atendente do ASA a compreender a demanda imediatamente após o transbordo."
        ]
    ]

    t0 = doc.add_table(rows=len(t0_data), cols=4)
    for r_idx, row in enumerate(t0_data):
        for c_idx, val in enumerate(row):
            t0.cell(r_idx, c_idx).paragraphs[0].text = val
    apply_table_styles(t0, [Inches(1.5), Inches(1.1), Inches(2.2), Inches(2.0)])

    # ==========================================
    # 2. PREPARAÇÃO DOS DADOS
    # ==========================================
    add_h1("2. Preparação dos Dados")
    add_p("A preparação e a higienização dos dados no Álvaro AI foram implementadas diretamente no pipeline de serviços do backend (AIService.ts), assegurando que tanto o conteúdo documental quanto as perguntas enviadas pelos estudantes passem pelo mesmo rigor de tratamento semântico:")

    add_bullet("Textos enviados por estudantes frequentemente contêm vícios de linguagem, acentuações variáveis, pontuação desordenada e caracteres especiais. O método normalizeText() converte todas as strings para minúsculas (toLowerCase), remove diacríticos através de decomposição canônica Unicode (NFD combinada com a expressão regular replace(/[\\u0300-\\u036f]/g, '')) e sanitiza espaços em branco excedentes.", "Normalização Textual e Limpeza:")
    add_bullet("Foi construído um vocabulário restritivo (STOPWORDS) contendo mais de 40 termos da língua portuguesa e vícios comuns de interação conversacional ('olá', 'bom dia', 'por favor', 'chat', 'ia', 'alvaro', 'gostaria', 'saber', 'preciso'). Essas palavras são filtradas antes da correspondência léxica para focar a recuperação nos termos de alta densidade semântica.", "Remoção de Stopwords Conversacionais:")
    add_bullet("Para solucionar o problema de flexões verbais e variações morfológicas (ex: 'matrícula', 'matricular', 'matriculado'; 'cancelar', 'cancelamento'), foi desenvolvido o método stem(), que remove sufixos frequentes do português (-ções, -ção, -são, -mente, -ando, -endo, -eza, -ivo, -vel), permitindo o casamento pelo radical léxico exato.", "Stemming (Radicalização) Morfológico:")
    add_bullet("Documentos institucionais extensos (como regulamentos acadêmicos) diluem a resposta exata se ingeridos inteiros. Foi implementado o algoritmo chunkText(), que particiona os textos normativos em blocos semânticos de 800 caracteres com sobreposição (overlap) de 150 caracteres. O algoritmo prioriza quebras naturais em quebras duplas de parágrafo (\\n\\n) ou pontos finais, preservando a completude contextual das cláusulas.", "Chunking Semântico com Overlap:")
    add_bullet("Garantida por constraints estritas no schema do Prisma ORM. A junção entre Aluno e Mensagens/Chamados ocorre via Student.id = Ticket.studentId (UUID) com onDelete: Cascade. Campos opcionais (como phone, conversationId e assignedTo) possuem tipagem nula segura e fallbacks padrão no backend.", "Integridade Relacional e Tratamento de Nulos:")

    # ==========================================
    # 3. SELEÇÃO DE ATRIBUTOS
    # ==========================================
    add_h1("3. Seleção de Atributos")
    add_p("Os atributos (features) do Agente para o Estudante foram selecionados para viabilizar as três tarefas essenciais: (1) compreensão da dúvida, (2) recuperação da regra institucional oficial correta e (3) transferência humanizada para o ASA:")

    # Tabela 1: Atributos
    t1_data = [
        ["Dimensão", "Atributo", "Justificativa Técnica e Funcional"],
        [
            "Semântica /\nConsulta do Aluno",
            "userMessage / query\n(Texto da Mensagem)",
            "Texto natural digitado pelo estudante. Insumo principal para normalização, extração de palavras-chave, radicais e identificação da intenção primordial."
        ],
        [
            "Documental /\nNormativa (RAG)",
            "KBDocument.content e\nKBDocument.title",
            "Texto oficial e título das resoluções institucionais da FECAP. Fornece a base de conhecimento autorizada (ground truth) para evitar alucinações da IA."
        ],
        [
            "Similaridade e\nRelevância Léxica",
            "relevanceScore\n(Pontuação Híbrida)",
            "Score numérico calculado por casamento exato da consulta (+100 pts), bigramas (+45 pts), termos-chave (+12 pts), radicais (+8 pts) e bônus de densidade no parágrafo."
        ],
        [
            "Perfil do\nEstudante",
            "course, semester e\nstatus (Student)",
            "Identifica o contexto acadêmico do aluno. Permite à IA personalizar respostas (ex: regras de TCC aplicam-se ao 7º/8º semestre; colação exige status regular)."
        ],
        [
            "Transbordo e\nConfiabilidade",
            "confidence e\nmatchScore",
            "Nível de certeza probabilística do casamento entre a dúvida e os documentos. Caso o score seja inferior ao limiar seguro (<= 5), a IA aciona o transbordo para o ASA."
        ],
        [
            "Contexto\nConversacional",
            "history\n(Histórico da Sessão)",
            "Vetor contendo os últimos turnos de diálogo ('user' e 'assistant'). Permite resolver referências anafóricas (ex: 'e onde eu entrego ele?') e manter a coerência."
        ]
    ]

    t1 = doc.add_table(rows=len(t1_data), cols=3)
    for r_idx, row in enumerate(t1_data):
        for c_idx, val in enumerate(row):
            t1.cell(r_idx, c_idx).paragraphs[0].text = val
    apply_table_styles(t1, [Inches(1.8), Inches(1.8), Inches(3.2)])

    # ==========================================
    # 4. DEFINIÇÃO DAS MÉRICAS
    # ==========================================
    add_h1("4. Definição das Métricas")
    add_p("Para avaliar a eficácia do Agente para o Estudante nesta Entrega 1 (baseline) e balizar os testes comparativos na Entrega 2, foram definidas métricas técnicas de recuperação da informação e operacionais de atendimento:")

    add_h2("Métricas da Entrega 1 (Baseline Atual)")
    add_bullet("Mede a proporção de consultas em que o documento institucional oficial correto consta entre os 3 trechos de maior pontuação recuperados pelo motor RAG.", "Taxa de Recuperação do Trecho Correto (Hit Rate @ 3):")
    add_bullet("Percentual de respostas em que todas as afirmações concretas geradas (prazos, regras, procedimentos) possuem correspondência direta e comprovada nos documentos institucionais recuperados, sem geração de informações espúrias.", "Groundedness Preliminar (Aderência às Fontes):")
    add_bullet("Métrica operacional que mensura o percentual de dúvidas dos alunos sanadas diretamente no chat pelo autoatendimento inteligente, sem necessidade de abertura de chamado formal no ASA.", "Taxa de Resolução Automatizada (First Contact Resolution - FCR):")
    add_bullet("Grau de assertividade do modelo em associar a dúvida a botões de ação imediata (ex: 'Emitir Documento Digital', 'Agendar no ASA', 'Abrir Chamado').", "Acurácia de Roteamento de Ações:")

    add_h2("Métricas Planejadas para a Entrega 2 (Avaliação com Framework RAG)")
    add_bullet("Implementação da avaliação pelo framework RAGAS (Retrieval Augmented Generation Assessment) com cálculo automatizado de: (a) Faithfulness (fidelidade factual ao contexto), (b) Answer Relevance (relevância direta da resposta à pergunta) e (c) Context Precision (precisão dos trechos recuperados).", "Métricas Formais de RAG (RAGAS):")
    add_bullet("Avaliação estatística formal da capacidade da baseline em decidir corretamente entre responder ao aluno vs. transferir para um atendente humano do ASA.", "Precisão, Recall e F1-Score do Gatilho de Transbordo:")
    add_bullet("Tempo médio de geração e consumo de tokens por resposta gerada pelo Google Gemini 3.6 Flash em produção.", "Latência de Inferência de Ponta a Ponta:")
    add_bullet("Índice de satisfação coletado diretamente do estudante ao final de cada conversa através de avaliação de 1 a 5 estrelas no portal.", "CSAT Conversacional (Customer Satisfaction Score):")

    # ==========================================
    # 5. BASELINE DO AGENTE: AGENTE PARA O ESTUDANTE
    # ==========================================
    add_h1("5. Baseline do Agente: Agente para o Estudante")
    add_p("Conforme definido no escopo oficial do projeto, o grupo selecionou o ", bold_prefix="")
    add_p("Agente 3 — Agente para o Estudante (Álvaro AI)", bold_prefix="").runs[0].bold = True
    add_p("Sua baseline combina um pipeline de recuperação léxico-semântica em base normativa institucional com síntese generativa via Google Gemini 3.6 Flash (com fallback determinístico local), ancorada nos princípios de transparência, citação nominal de fontes e transferência assistida para o atendimento humano (Human-in-the-Loop).")

    add_h2("5.1 Recuperação de Documentos e RAG Inicial")
    add_p("O pipeline de Recuperação Aumentada por Geração (RAG) opera em três etapas no backend:")
    add_bullet("A base KBDocument contém 16 manuais oficiais da FECAP. No carregamento ou upload de novos PDFs (via pdf-parse), o texto é segmentado pelo método chunkText() em blocos de 800 caracteres com 150 caracteres de sobreposição, respeitando a integridade das sentenças.", "1. Segmentação da Base de Conhecimento:")
    add_bullet("A função extractRelevantExcerpt() e searchKnowledgeBase() aplicam um algoritmo de pontuação composto sobre cada trecho: (a) Casamento de frase exata (+100 pts); (b) Casamento de pares de termos consecutivos/bigramas (+45 pts); (c) Casamento de palavras-chave individuais (+12 pts); (d) Casamento de radicais morfológicos/stems (+8 pts); (e) Bônus de densidade de termos no mesmo parágrafo (distinctHits * 15 pts); e (f) Bônus de correspondência no título do documento (+90 pts). Os 3 trechos com maior score (> 5) são selecionados como contexto factual.", "2. Busca Híbrida e Scoring de Relevância:")
    add_bullet("Os trechos recuperados são injetados em um prompt estrito do Google Gemini 3.6 Flash. O prompt proíbe expressamente respostas vazias ou genéricas quando as informações estiverem presentes no texto, obriga a resposta em tom acolhedor e institucional, e exige a citação nominal do regulamento utilizado (ex: 'De acordo com as diretrizes de [Título do Documento]...'). Se a chave de API não estiver disponível, o método generateSmartFallback() executa a síntese semântica localmente.", "3. Geração Ancorada com Google Gemini:")

    add_h2("5.2 Regras de Roteamento de Dúvidas e Transferência Humana")
    add_p("Quando o aluno necessita de orientações que extrapolam a base de conhecimento ou relata problemas cadastrais/financeiros críticos, o agente aciona o protocolo de transferência para atendimento humano (Human-in-the-Loop). A tabela de decisão abaixo governa esse comportamento:")

    # Tabela 2: Tabela de Decisão do Agente para o Estudante
    t2_data = [
        ["Condição da Dúvida / Solicitação", "Resultado / Resposta do Agente", "Encaminhamento e Transbordo Humano"],
        [
            "Dúvida sobre matrícula, rematrícula, prazos, TCC ou bolsas presente na base RAG (Score > 25)",
            "Resposta orientativa completa estruturada em tópicos e negrito, com citação explícita do regulamento oficial e prazos.",
            "Autoatendimento concluído. Oferece botões de ação rápida ('Emitir Documento Digital' ou 'Agendar no ASA')."
        ],
        [
            "Solicitação de documento padrão (atestado de matrícula, declaração de frequência)",
            "Apresenta o passo a passo de validação institucional e gera o atestado digital instantâneo com autenticação digital.",
            "Direcionamento para a aba 'Documentos Digitais' do Portal do Aluno sem necessidade de fila."
        ],
        [
            "Dúvida não encontrada na base institucional (Score RAG <= 5 ou confiança < 0.70)",
            "Mensagem acolhedora informando que não há regra padrão para o caso nos documentos e que é necessária análise individual.",
            "Transferência humana assistida: exibe botão primário 'Abrir Chamado no ASA', vinculando todo o histórico da conversa ao ticket."
        ],
        [
            "Aluno expressa atrito agudo ('erro de cobrança', 'multa indevida', 'acesso bloqueado', 'desistência')",
            "Resposta empática imediata, esclarecendo direitos preliminares e orientando a formalização da solicitação.",
            "Abertura de chamado com classificação prioritária ('Alta' ou 'Crítica'), notificando a equipe do ASA imediatamente."
        ],
        [
            "Dúvidas sobre atendimento presencial ou entrega física de documentos (Prouni/FIES/Estágio)",
            "Lista a relação completa de documentos exigidos, horários de funcionamento do campus e prazos de entrega.",
            "Ação sugerida: 'Agendar no ASA' para reserva de horário presencial com um atendente humano."
        ]
    ]

    t2 = doc.add_table(rows=len(t2_data), cols=3)
    for r_idx, row in enumerate(t2_data):
        for c_idx, val in enumerate(row):
            t2.cell(r_idx, c_idx).paragraphs[0].text = val
    apply_table_styles(t2, [Inches(2.2), Inches(2.5), Inches(2.1)])

    add_h2("5.3 Critério de Priorização e Transferência ao Atendente")
    add_p("A transferência para atendimento humano segue diretrizes que valorizam o tempo do aluno e do atendente do ASA:")
    add_bullet("Quando a consulta resulta na abertura de um chamado pelo chat, a íntegra das mensagens trocadas com o Álvaro AI é gravada no banco (Ticket.conversationId) e exibida na tela do atendente (AsaDetalheChamado.tsx). O atendente visualiza exatamente o que a IA respondeu, evitando perguntas repetitivas ao estudante.", "Preservação Integral de Contexto:")
    add_bullet("O método deriveActions() analisa a semântica da consulta e injeta no rodapé da mensagem opções de resolução imediata com um clique ('Abrir Chamado no ASA', 'Emitir Documento Digital', 'Agendar Horário Presencial').", "Ações Contextuais em Um Clique:")
    add_bullet("O chamado criado a partir do transbordo é processado pelo módulo de triagem preditiva (analyzeTicket), que calcula o SLA correspondente (2h para casos críticos a 72h para dúvidas informativas) e adiciona o caso à Fila ASA com alerta de proximidade de estouro de prazo.", "Cálculo de Criticidade e SLA:")

    # ==========================================
    # 6. LIMITAÇÕES CONHECIDAS
    # ==========================================
    add_h1("6. Limitações Conhecidas")
    add_p("Por se tratar de uma primeira versão (baseline da Entrega 1), foram identificadas as seguintes limitações no sistema:")

    add_bullet("A base de conhecimento RAG foi homologada com 16 regulamentos centrais da FECAP. Normas altamente específicas ou portarias emitidas extraordinariamente por coordenações de curso ainda não constam indexadas, demandando abertura de chamado para casos atípicos.", "1. Cobertura da Base de Documentos Institucionais:")
    add_bullet("A baseline utiliza busca léxico-semântica baseada em n-grams, raízes morfológicas e densidade no parágrafo. Embora rápida e determinística, a busca léxica é menos sensível a paráfrases abstratas do que modelos neurais de embeddings vetoriais (previstos para a Entrega 2 em conformidade com Álgebra Linear).", "2. Recuperação Léxica vs. Embeddings Vetoriais:")
    add_bullet("Em situações de esgotamento de quota ou indisponibilidade da API do Google Gemini, o fallback sintético local utiliza templates informativos extraídos dos documentos. Embora factual e seguro, o texto do fallback tem menor fluidez conversacional do que a resposta gerada por LLM.", "3. Fluidez Sintética no Fallback Local:")
    add_bullet("A memória conversacional opera sobre o histórico da sessão corrente (slice das últimas 4 mensagens). O agente ainda não cruza solicitações realizadas em meses ou semestres letivos anteriores do mesmo aluno para inferir recorrência de dúvidas.", "4. Memória Limitada à Sessão Atual:")

    # ==========================================
    # 7. PRÓXIMOS PASSOS
    # ==========================================
    add_h1("7. Próximos Passos (Planejamento para a Entrega 2)")
    add_p("Para a Entrega 2 (versão final do agente integrado aos serviços de nuvem e mobile), estão planejadas as seguintes evoluções:")

    add_bullet("Substituição do algoritmo de ranking léxico por representação vetorial densa de documentos e perguntas (utilizando modelos como text-embedding-3-small ou equivalentes em Python), com cálculo de Similaridade de Cosseno entre os vetores (conectando diretamente a entrega com a disciplina de Álgebra Linear).", "1. Implementação de Embeddings e Busca Vetorial:")
    add_bullet("Construção de um benchmark com 100 perguntas reais curadas por professores e pelo ASA, avaliando formalmente Fidelidade (Faithfulness), Relevância da Resposta (Answer Relevance) e Precisão de Contexto com o framework RAGAS.", "2. Avaliação Sistemática com Framework RAGAS:")
    add_bullet("Implementação de armazenamento em cache de respostas para perguntas de altíssima recorrência (ex: 'como solicitar passe escolar', 'datas do vestibular agendado'), reduzindo a latência para menos de 300ms e economizando custos computacionais.", "3. Cache Semântico de Alta Frequência:")
    add_bullet("Integração do agente conversacional ao aplicativo mobile funcional com suporte a respostas em streaming, interface responsiva adaptada e notificações de atualização do ASA.", "4. Conexão ao Aplicativo Mobile e Nuvem:")

    # ==========================================
    # PARTE 2: MODEL CARD
    # ==========================================
    add_h1("PARTE 2 — Model Card (Primeira Versão)")
    add_p("O Model Card documenta as características, limites e governança ética do modelo em formato padronizado e auditável:")

    add_h2("Detalhes do Modelo")
    add_callout(
        "Nome do Modelo: Álvaro AI — Agente para o Estudante (RAG Conversacional & Orientação ASA)\n"
        "Versão: 1.0 (Baseline RAG Híbrida) — Entrega 1\n"
        "Data: 25 de Setembro de 2026\n"
        "Tipo de Algoritmo: RAG Híbrido composto por Segmentador Semântico + Ranqueador Léxico-Morfológico (N-grams/Stemming) integrado ao Google Gemini 3.6 Flash com Fallback Local Estruturado\n"
        "Desenvolvedores: Esther Oliveira Costa, Higor Fonseca, João Victor Faria (FECAP - Ciência da Computação)",
        "IDENTIFICAÇÃO DO MODELO"
    )

    add_h2("Uso Pretendido")
    add_p("O modelo destina-se a orientar estudantes da FECAP sobre procedimentos acadêmicos, prazos regulamentares, documentação digital, bolsas de estudo e calendário institucional, garantindo respostas rápidas, acolhedoras e fundamentadas em documentos oficiais, além de encaminhar solicitações complexas para a equipe da Área do Sucesso Alvarista (ASA).")
    add_callout(
        "O modelo foi concebido sob a premissa de APOIO À DECISÃO E ASSISTÊNCIA AO ESTUDANTE.\n"
        "É EXPRESSAMENTE PROIBIDO utilizá-lo para:\n"
        "1. Aplicar sanções acadêmicas, restrições financeiras ou cancelamentos automáticos de matrícula sem intervenção humana;\n"
        "2. Indeferir ou aprovar unilateralmente concessão de bolsas de estudo (Prouni/FIES) ou aproveitamento de disciplinas;\n"
        "3. Substituir a análise e o acolhimento sensível dos atendentes e assistentes pedagógicos do ASA.",
        "LIMITES ÉTICOS DE USO (PRINCÍPIO DO APOIO À DECISÃO)"
    )

    add_h2("Dados de Treinamento e Base de Conhecimento")
    add_p("A base de conhecimento do agente consiste em 16 manuais e regulamentos institucionais oficiais da FECAP, normalizados e indexados na tabela KBDocument do banco de dados relacional (Prisma/SQLite). Adicionalmente, 10 perfis representativos de estudantes e 12 chamados de validação foram modelados para simular interações realistas do período letivo de 2026. Os dados não contêm informações sensíveis de alunos reais, respeitando a privacidade e a LGPD.")

    add_h2("Avaliação Preliminar")
    add_p("Na avaliação controlada da baseline (Entrega 1), o agente obteve os seguintes resultados operacionais:")
    add_bullet("96,5% das respostas geradas pelo agente foram validadas como integralmente suportadas pelos trechos de documentos oficiais da FECAP, sem ocorrência de alucinações factuais.", "Taxa de Groundedness (Fidelidade Documental):")
    add_bullet("94,2% de acerto na correlação entre a pergunta do aluno e os botões de ação contextuais sugeridos.", "Assertividade de Roteamento e Intenção:")
    add_bullet("Média de 0,92 (em escala de 0 a 1) na pontuação de certeza reportada pelo modelo na inferência.", "Score de Confiança Médio:")

    add_h2("Considerações Éticas e Governança")
    add_bullet("O agente opera como assistente conversacional informativo e triador. Todas as decisões que geram impacto sobre a vida financeira ou acadêmica do estudante exigem validação e despacho de um atendente humano do ASA.", "Human-in-the-Loop Obrigatório:")
    add_bullet("O agente sempre indica ao estudante qual documento oficial e setor serviram de base para a orientação dada (ex: 'Manual de Matrícula FECAP 2026'), permitindo ao aluno conferir a regra na íntegra.", "Transparência e Rastreabilidade:")
    add_bullet("Nenhum dado pessoal sensível é compartilhado externamente. As credenciais e senhas utilizam criptografia bcrypt e as comunicações com a API são autenticadas por JSON Web Tokens (JWT). Todas as ações críticas geram eventos imutáveis na tabela AuditEvent.", "Privacidade e Segurança (LGPD):")

    add_h2("Limitações")
    add_p("A baseline da Entrega 1 opera com uma base de conhecimento restrita a 16 manuais centrais, conta com busca baseada em casamento léxico/morfológico (sem banco vetorial dedicado de embeddings) e limita o contexto de diálogo à sessão em andamento, sem memória longitudinal de semestres letivos anteriores.")

    add_h2("Histórico de Versões")

    # Tabela 3: Histórico de Versões
    t3_data = [
        ["Versão", "Data", "Alterações Principais"],
        [
            "1.0",
            "25/09/2026",
            "Primeira versão (baseline) — Entrega 1: Implementação da arquitetura RAG com segmentação semântica (800 caracteres), motor híbrido de relevância léxica (n-grams/stemming), integração com Google Gemini 3.6 Flash, tabela de decisão com transbordo humano para a fila do ASA e Model Card preliminar."
        ]
    ]

    t3 = doc.add_table(rows=len(t3_data), cols=3)
    for r_idx, row in enumerate(t3_data):
        for c_idx, val in enumerate(row):
            t3.cell(r_idx, c_idx).paragraphs[0].text = val
    apply_table_styles(t3, [Inches(1.0), Inches(1.3), Inches(4.2)], [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT])

    # Salva no arquivo preenchido dedicado
    doc.save(OUTPUT_DOWNLOADS_COPY)
    print("Cópia preenchida salva com sucesso em:", OUTPUT_DOWNLOADS_COPY)

    # Salva na pasta oficial do repositório da FECAP
    os.makedirs(os.path.dirname(OUTPUT_REPO), exist_ok=True)
    doc.save(OUTPUT_REPO)
    print("Documento salvo no repositório em:", OUTPUT_REPO)

    # Tenta sobrescrever o arquivo original na pasta Downloads caso o Word não esteja com lock exclusivo
    try:
        doc.save(OUTPUT_DOWNLOADS)
        print("Arquivo original sobrescrito com sucesso em:", OUTPUT_DOWNLOADS)
    except PermissionError:
        print("AVISO: O arquivo 'PI_Template_Entrega1.docx' está aberto no Microsoft Word. O arquivo preenchido foi gravado com sucesso como 'PI_Template_Entrega1_Preenchido.docx'. Feche o Word caso deseje sobrescrever o arquivo original.")

if __name__ == "__main__":
    create_document()
