import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { prisma } from '../db'

dotenv.config()

export interface KBChunkMatch {
  docId: string
  docTitle: string
  category: string
  content: string
  score: number
  source?: string
  filename?: string
}

export interface StudentContext {
  id?: string
  name?: string
  email?: string
  ra?: string
  course?: string
  semester?: number
  period?: string
}

export class AIService {
  private getGenAI(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      return new GoogleGenerativeAI(apiKey)
    }
    return null
  }

  /**
   * Divide um texto em partes/chunks semânticos
   */
  public chunkText(text: string, chunkSize: number = 800, overlap: number = 150): string[] {
    const clean = text.replace(/\r\n/g, '\n').trim()
    if (!clean) return []

    if (clean.length <= chunkSize) {
      return [clean]
    }

    const chunks: string[] = []
    let start = 0

    while (start < clean.length) {
      let end = start + chunkSize

      // Encontra quebra de parágrafo ou ponto para corte limpo
      if (end < clean.length) {
        const nextBreak = clean.indexOf('\n\n', end - 100)
        if (nextBreak !== -1 && nextBreak <= end + 100) {
          end = nextBreak
        } else {
          const nextPeriod = clean.indexOf('. ', end - 60)
          if (nextPeriod !== -1 && nextPeriod <= end + 60) {
            end = nextPeriod + 1
          }
        }
      }

      const chunk = clean.substring(start, end).trim()
      if (chunk) {
        chunks.push(chunk)
      }

      start = end - overlap
      if (start >= clean.length || end >= clean.length) break
    }

    return chunks
  }

  /**
   * Busca híbrida na Base de Conhecimento (KBDocument)
   */
  public async searchKnowledgeBase(query: string, limit: number = 4): Promise<KBChunkMatch[]> {
    const docs = await prisma.kBDocument.findMany({
      where: {
        status: 'ativo',
        indexed: true,
      },
    })

    if (!docs.length) return []

    const queryTokens = this.tokenize(query)

    const scoredDocs = docs.map(doc => {
      const titleTokens = this.tokenize(doc.title)
      const contentTokens = this.tokenize(doc.content)
      const catTokens = this.tokenize(doc.category)
      let tags: string[] = []
      try {
        tags = JSON.parse(doc.tags || '[]')
      } catch (e) {
        tags = []
      }
      const tagTokens = tags.flatMap(t => this.tokenize(t))

      let score = 0

      // Match em título vale mais
      queryTokens.forEach(t => {
        if (titleTokens.includes(t)) score += 6
        if (catTokens.includes(t)) score += 3
        if (tagTokens.includes(t)) score += 4
        if (contentTokens.includes(t)) score += 1
      })

      // Frase exata
      const queryLower = query.toLowerCase()
      if (doc.title.toLowerCase().includes(queryLower)) score += 12
      if (doc.content.toLowerCase().includes(queryLower)) score += 6

      return {
        docId: doc.id,
        docTitle: doc.title,
        category: doc.category,
        content: doc.content,
        score,
        source: doc.source,
        filename: doc.filename || undefined,
      }
    })

    return scoredDocs
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Gera resposta para o aluno no Chatbot usando RAG + Google Gemini
   */
  public async generateChatResponse(
    userMessage: string,
    history: { role: string; content: string }[] = [],
    student?: StudentContext
  ): Promise<{
    content: string
    sources: { title: string; filename?: string; category: string }[]
    actions: { label: string; action: string; primary?: boolean }[]
    confidence: number
  }> {
    // 1. Busca documentos relevantes no acervo institucional (RAG)
    const matches = await this.searchKnowledgeBase(userMessage, 3)

    const sources = matches.map(m => ({
      title: m.docTitle,
      filename: m.filename,
      category: m.category,
    }))

    const genAI = this.getGenAI()

    // 2. Executa geração com Google Gemini
    if (genAI) {
      for (const modelName of ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest']) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })

          const knowledgeContext = matches.length
            ? matches.map((m, i) => `[DOCUMENTO ${i + 1}: ${m.docTitle} (Categoria: ${m.category})]\n${m.content}\n`).join('\n---\n')
            : 'Nenhum documento específico encontrado na base institucional para esta busca.'

          const studentProfile = student
            ? `Nome: ${student.name || 'Estudante'}, Curso: ${student.course || 'Graduação'}, Semestre: ${student.semester || 1}º, RA: ${student.ra || 'N/A'}`
            : 'Estudante FECAP'

          const prompt = `Você é o Álvaro AI, o assistente virtual inteligente e oficial de atendimento da FECAP (Fundação Escola de Comércio Álvares Penteado).
Seu objetivo é orientar alunos com clareza, empatia, cordialidade e rigor acadêmico, baseando-se estritamente nos documentos e normas institucionais da base de conhecimento da FECAP.

INFORMAÇÕES DO ALUNO:
${studentProfile}

DOCUMENTOS INSTITUCIONAIS RECUPERADOS (RAG):
${knowledgeContext}

HISTÓRICO DA CONVERSA:
${history.slice(-4).map(h => `${h.role === 'user' ? 'Aluno' : 'Álvaro AI'}: ${h.content}`).join('\n')}

PERGUNTA DO ALUNO:
"${userMessage}"

DIRETRIZES DE RESPOSTA:
1. Responda em Português do Brasil com linguagem educada, moderna e acolhedora.
2. Use formatação Markdown elegante (listas com tópicos, negrito em prazos, valores e passos práticos).
3. Se os documentos recuperados tiverem a resposta, explique de forma didática e mencione o documento fonte (ex: "De acordo com o Regulamento Institucional...").
4. Se o documento contiver prazos, valores ou documentos necessários, liste-os claramente.
5. Se a dúvida não estiver coberta nos documentos ou exigir análise de caso específico (ex: histórico individual, desconto pessoal), oriente o aluno gentilmente a abrir um chamado no ASA ou agendar atendimento no campus.`

          const result = await model.generateContent(prompt)
          const responseText = result.response.text()

          if (responseText && responseText.trim()) {
            const actions = this.deriveActions(userMessage, matches)
            return {
              content: responseText.trim(),
              sources,
              actions,
              confidence: matches.length ? 0.96 : 0.7,
            }
          }
        } catch (err: any) {
          console.warn(`Tentativa com modelo ${modelName} falhou:`, err.message?.slice(0, 120))
        }
      }
    }

    // 3. Fallback inteligente local
    return this.generateSmartFallback(userMessage, matches, student)
  }

  /**
   * Análise preditiva de chamados com Google Gemini (Classificação, Sentimento, SLA e Recomendação)
   */
  public async analyzeTicket(
    title: string,
    description: string,
    category: string
  ): Promise<{
    intent: string
    category: string
    sentiment: 'positivo' | 'neutro' | 'negativo'
    confidence: number
    summary: string
    recommendation: string
    suggestedPriority: 'baixa' | 'media' | 'alta' | 'critica'
    sources: { title: string; filename?: string }[]
  }> {
    const text = `${title} ${description}`
    const matches = await this.searchKnowledgeBase(text, 2)

    const genAI = this.getGenAI()

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

        const knowledgeContext = matches.map(m => `Doc: ${m.docTitle} - ${m.content.slice(0, 200)}`).join('\n')

        const prompt = `Analise este chamado aberto por um aluno da faculdade FECAP e retorne uma análise estruturada para o atendente do ASA.

Título: "${title}"
Categoria: "${category}"
Descrição: "${description}"
Base de Conhecimento Relevante:
${knowledgeContext || 'Nenhuma'}

Responda APENAS em formato JSON com as chaves:
{
  "intent": "Resumo da intenção do aluno em poucas palavras",
  "sentiment": "positivo" | "neutro" | "negativo",
  "suggestedPriority": "baixa" | "media" | "alta" | "critica",
  "summary": "Resumo executivo do problema em 1-2 frases",
  "recommendation": "Sugestão de resposta/ação prática que o atendente humano deve dar ao aluno",
  "confidence": 0.95
}`

        const res = await model.generateContent(prompt)
        const textRes = res.response.text().replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(textRes)

        return {
          intent: parsed.intent || `Solicitação sobre ${category}`,
          category,
          sentiment: parsed.sentiment || 'neutro',
          confidence: parsed.confidence || 0.92,
          summary: parsed.summary || `Chamado sobre ${title}.`,
          recommendation: parsed.recommendation || `Orientar o aluno com base nos procedimentos de ${category}.`,
          suggestedPriority: parsed.suggestedPriority || 'media',
          sources: matches.map(m => ({ title: m.docTitle, filename: m.filename })),
        }
      } catch (err) {
        console.warn('Erro na análise do chamado com Gemini (usando heurística):', err)
      }
    }

    // Heurística local fallback
    const isNegative = /urgente|erro|cobrança|multa|bloqueado|trancamento|perdi|problema|injusto/i.test(text)
    const isCritical = /processo|formatura|diploma|jurídico|pagamento duplicado/i.test(text)

    const sentiment = isNegative ? 'negativo' : 'neutro'
    const suggestedPriority = isCritical ? 'critica' : isNegative ? 'alta' : 'media'

    let recommendation = ''
    if (matches.length > 0) {
      recommendation = `Orientar o aluno com base no documento "${matches[0].docTitle}". Informar os procedimentos e conferir o cadastro acadêmico.`
    } else {
      recommendation = `Verificar o histórico cadastral e financeiro do aluno na base integrada e orientar sobre os prazos de ${category}.`
    }

    const summary = `Aluno solicita atendimento referente a "${title}". Necessária conferência operacional na categoria ${category}.`

    return {
      intent: `Solicitação de ${category} (${title.slice(0, 35)}...)`,
      category,
      sentiment,
      confidence: matches.length ? 0.94 : 0.8,
      summary,
      recommendation,
      suggestedPriority,
      sources: matches.map(m => ({ title: m.docTitle, filename: m.filename })),
    }
  }

  private generateSmartFallback(
    query: string,
    matches: KBChunkMatch[],
    student?: StudentContext
  ) {
    const name = student?.name ? student.name.split(' ')[0] : 'Aluno(a)'

    if (!matches.length) {
      return {
        content: `Olá, ${name}! Não encontrei uma regra específica para essa dúvida nos documentos institucionais cadastrados.\n\nPara que possamos te ajudar com segurança, você pode **abrir um chamado** para a equipe da Central de Atendimento (ASA) ou agendar um horário presencial no campus.`,
        sources: [],
        actions: [
          { label: 'Abrir Chamado no ASA', action: 'open_ticket', primary: true },
          { label: 'Agendar Atendimento', action: 'schedule' },
        ],
        confidence: 0.5,
      }
    }

    const best = matches[0]
    const contentPreview = best.content.length > 350 ? best.content.slice(0, 350) + '...' : best.content

    let response = `Olá, ${name}! Com base no documento institucional **"${best.docTitle}"** (${best.category}):\n\n`
    response += `${contentPreview}\n\n`
    response += `Se você precisar de maiores detalhes ou de uma análise individual, você também pode abrir um chamado direto para a equipe de atendimento.`

    const actions = this.deriveActions(query, matches)

    return {
      content: response,
      sources: matches.map(m => ({ title: m.docTitle, filename: m.filename, category: m.category })),
      actions,
      confidence: 0.88,
    }
  }

  private deriveActions(query: string, matches: KBChunkMatch[]) {
    const q = query.toLowerCase()
    const actions: { label: string; action: string; primary?: boolean }[] = []

    if (q.includes('documento') || q.includes('declaração') || q.includes('atestado') || q.includes('histórico')) {
      actions.push({ label: 'Emitir Documento Digital', action: 'documents', primary: true })
    }
    if (q.includes('agendar') || q.includes('presencial') || q.includes('horário') || q.includes('campus')) {
      actions.push({ label: 'Agendar no ASA', action: 'schedule', primary: true })
    }
    if (q.includes('chamado') || q.includes('atendente') || q.includes('reclamação') || q.includes('dúvida')) {
      actions.push({ label: 'Abrir Chamado', action: 'open_ticket', primary: !actions.length })
    }

    if (!actions.length) {
      actions.push(
        { label: 'Abrir Chamado', action: 'open_ticket', primary: true },
        { label: 'Ver Documentos Digitais', action: 'documents' }
      )
    }

    return actions
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2)
  }
}

export const aiService = new AIService()
