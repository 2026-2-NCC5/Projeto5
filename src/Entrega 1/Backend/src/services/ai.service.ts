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

const STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para', 'pra',
  'com', 'sem', 'sob', 'sobre', 'que', 'qual', 'quais', 'como', 'quando', 'onde', 'quem',
  'por que', 'porque', 'pq', 'qualquer', 'e', 'ou', 'mas', 'se', 'ja', 'nao',
  'mais', 'menos', 'muito', 'pouco', 'ola', 'oi', 'bom', 'dia', 'boa', 'tarde', 'noite',
  'por favor', 'favor', 'pfv', 'chat', 'ia', 'alvaro', 'gostaria', 'saber', 'quero',
  'preciso', 'esta', 'estao', 'sao', 'foi', 'ser', 'tem', 'ter', 'fazer', 'faco'
])

export class AIService {
  private getGenAI(): GoogleGenerativeAI | null {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim()
    if (apiKey && apiKey !== 'sua_chave_gemini_aqui' && apiKey.length > 10) {
      return new GoogleGenerativeAI(apiKey)
    }
    return null
  }

  public normalizeText(text: string): string {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  public stem(word: string): string {
    const w = this.normalizeText(word)
    if (w.length <= 4) return w
    return w.replace(/(coes|cao|sao|mente|ando|endo|indo|ado|ido|eza|ivo|iva|vel|ais|eis|ores|ura|ario|aria|os|as|es|o|a|e)$/, '')
  }

  public getKeywords(text: string): string[] {
    return this.normalizeText(text)
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length >= 2 && !STOPWORDS.has(t))
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
   * Localiza a seção mais relevante dentro do conteúdo integral de um documento
   */
  public extractRelevantExcerpt(
    content: string,
    query: string,
    maxChars: number = 1500
  ): { excerpt: string; score: number } {
    if (!content) return { excerpt: '', score: 0 }

    const normQuery = this.normalizeText(query)
    const keywords = this.getKeywords(query)
    const stems = keywords.map(k => this.stem(k))

    if (!keywords.length) {
      return { excerpt: content.slice(0, maxChars), score: 1 }
    }

    // Divide em blocos/parágrafos naturais
    const rawSections = content
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 20)

    if (!rawSections.length) {
      return { excerpt: content.slice(0, maxChars), score: 1 }
    }

    const scoredSections = rawSections.map((sec, idx) => {
      let score = 0
      const normSec = this.normalizeText(sec)

      // 1. Frase completa exata
      if (normSec.includes(normQuery)) {
        score += 100
      }

      // 2. N-grams (pares de palavras consecutivas)
      for (let i = 0; i < keywords.length - 1; i++) {
        const bigram = `${keywords[i]} ${keywords[i + 1]}`
        if (normSec.includes(bigram)) {
          score += 45
        }
      }

      // 3. Palavras-chave individuais e radicais
      let distinctHits = 0
      keywords.forEach((kw, i) => {
        if (normSec.includes(kw)) {
          score += 12
          distinctHits++
        } else if (stems[i] && stems[i].length >= 3 && normSec.includes(stems[i])) {
          score += 8
          distinctHits++
        }
      })

      // 4. Bônus de densidade (múltiplas palavras da pergunta juntas no mesmo parágrafo)
      if (distinctHits > 1) {
        score += distinctHits * 15
      }

      return { idx, score, text: sec }
    })

    scoredSections.sort((a, b) => b.score - a.score)

    const top = scoredSections[0]
    if (!top || top.score === 0) {
      return { excerpt: content.slice(0, maxChars), score: 1 }
    }

    // Combina o parágrafo vencedor com parágrafos adjacentes para contexto completo
    let combined = top.text
    let currentIdx = top.idx + 1
    while (currentIdx < rawSections.length && combined.length < maxChars) {
      const next = rawSections[currentIdx]
      if (combined.length + next.length > maxChars + 300) break
      combined += '\n\n' + next
      currentIdx++
    }

    return {
      excerpt: combined.slice(0, maxChars),
      score: top.score,
    }
  }

  /**
   * Busca híbrida e granular na Base de Conhecimento (KBDocument)
   */
  public async searchKnowledgeBase(query: string, limit: number = 4): Promise<KBChunkMatch[]> {
    const docs = await prisma.kBDocument.findMany({
      where: {
        status: 'ativo',
        indexed: true,
      },
    })

    if (!docs.length) return []

    const normQuery = this.normalizeText(query)
    const keywords = this.getKeywords(query)
    const stems = keywords.map(k => this.stem(k))

    const scoredDocs = docs.map(doc => {
      const normTitle = this.normalizeText(doc.title)
      const normCat = this.normalizeText(doc.category)
      let tags: string[] = []
      try {
        tags = JSON.parse(doc.tags || '[]')
      } catch (e) {
        tags = []
      }
      const normTags = tags.map(t => this.normalizeText(t))

      let titleBonus = 0
      if (normTitle.includes(normQuery)) {
        titleBonus += 90
      }

      keywords.forEach((kw, i) => {
        if (normTitle.includes(kw)) titleBonus += 25
        if (normCat.includes(kw)) titleBonus += 15
        if (normTags.some(t => t.includes(kw))) titleBonus += 20
        if (stems[i] && stems[i].length >= 3 && normTitle.includes(stems[i])) titleBonus += 15
      })

      // Extrai o trecho mais relevante do conteúdo
      const { excerpt, score: excerptScore } = this.extractRelevantExcerpt(doc.content, query)
      const totalScore = excerptScore + titleBonus

      return {
        docId: doc.id,
        docTitle: doc.title,
        category: doc.category,
        content: excerpt, // Trecho específico extraído
        score: totalScore,
        source: doc.source,
        filename: doc.filename || undefined,
      }
    })

    const matched = scoredDocs
      .filter(d => d.score > 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    if (matched.length > 0) {
      return matched
    }

    // Se nenhuma busca pontuou, retorna os documentos institucionais mais recentes como contexto
    return docs.slice(0, Math.min(limit, 2)).map(doc => ({
      docId: doc.id,
      docTitle: doc.title,
      category: doc.category,
      content: doc.content.slice(0, 1000),
      score: 1,
      source: doc.source,
      filename: doc.filename || undefined,
    }))
  }

  public cleanAndFormatText(text: string): string {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const result: string[] = []

    for (const line of lines) {
      if (/^[•\-\*]\s*/.test(line)) {
        result.push(`* ${line.replace(/^[•\-\*]\s*/, '')}`)
      } else if (/^\d+\.\s*/.test(line)) {
        result.push(`\n**${line}**`)
      } else if (/^(entrega\s*\d|data|prazo|objetivo|formato|pontos|nota|requisitos)/i.test(line)) {
        result.push(`📌 **${line}**`)
      } else {
        result.push(line)
      }
    }

    return result.join('\n')
  }

  /**
   * Gera resposta para o aluno no Chatbot usando RAG + Google Gemini ou Síntese Local Inteligente
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
    // 1. Busca trechos granulares na base institucional
    const matches = await this.searchKnowledgeBase(userMessage, 3)

    const sources = matches.map(m => ({
      title: m.docTitle,
      filename: m.filename,
      category: m.category,
    }))

    const genAI = this.getGenAI()

    // 2. Se a chave do Gemini estiver configurada, gera resposta via LLM oficial
    if (genAI) {
      const validModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']
      for (const modelName of validModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })

          const knowledgeContext = matches.length
            ? matches.map((m, i) => `[DOCUMENTO INSTITUCIONAL ${i + 1}: ${m.docTitle} (Categoria: ${m.category})]\n${m.content}\n`).join('\n---\n')
            : 'Nenhum documento específico encontrado na base institucional para esta busca.'

          const studentProfile = student
            ? `Nome: ${student.name || 'Estudante'}, Curso: ${student.course || 'Graduação'}, Semestre: ${student.semester || 1}º, RA: ${student.ra || 'N/A'}`
            : 'Estudante FECAP'

          const prompt = `Você é o Álvaro AI, o assistente virtual oficial e acolhedor de atendimento ao estudante da FECAP (Fundação Escola de Comércio Álvares Penteado).
Seu objetivo é orientar os alunos com clareza, rigor e simpatia, baseando-se estritamente nos documentos institucionais da base de conhecimento da FECAP fornecidos abaixo.

INFORMAÇÕES DO ALUNO:
${studentProfile}

TRECHOS EXTRAÍDOS DA BASE DE CONHECIMENTO FECAP (RAG):
${knowledgeContext}

HISTÓRICO DA CONVERSA:
${history.slice(-4).map(h => `${h.role === 'user' ? 'Aluno' : 'Álvaro AI'}: ${h.content}`).join('\n')}

PERGUNTA DO ALUNO:
"${userMessage}"

DIRETRIZES DE RESPOSTA OBRIGATÓRIAS:
1. Responda em Português do Brasil com linguagem educada, acolhedora e precisa.
2. Analise os trechos de documentos fornecidos e responda EXATAMENTE ao que foi perguntado.
3. Se os trechos tiverem dados concretos (prazos, datas, notas/pontuação, etapas, regras ou formatos de entrega), liste-os de forma clara e objetiva usando listas e negrito.
4. NUNCA dê uma resposta genérica ou vazia quando as informações estiverem presentes no texto fornecido.
5. Mencione o documento fonte utilizado (ex: "De acordo com as diretrizes de [Título do Documento]...").
6. Se a pergunta realmente não constar nos documentos, oriente o aluno a abrir um chamado com a equipe da Central de Atendimento (ASA).`

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

    // 3. Fallback inteligente local com extração semântica profunda
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
      for (const modelName of ['gemini-1.5-flash', 'gemini-2.0-flash']) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })

          const knowledgeContext = matches.map(m => `Doc: ${m.docTitle} - ${m.content.slice(0, 300)}`).join('\n')

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
        } catch (err: any) {
          console.warn(`Erro na análise do chamado com ${modelName}:`, err.message?.slice(0, 100))
        }
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
        content: `Olá, ${name}! Não encontrei uma regra específica para essa dúvida nos documentos institucionais cadastrados.\n\nPara que possamos te orientar com segurança, você pode **abrir um chamado** para a equipe da Central de Atendimento (ASA) ou agendar um horário presencial no campus.`,
        sources: [],
        actions: [
          { label: 'Abrir Chamado no ASA', action: 'open_ticket', primary: true },
          { label: 'Agendar Atendimento', action: 'schedule' },
        ],
        confidence: 0.5,
      }
    }

    const best = matches[0]
    const formattedContent = this.cleanAndFormatText(best.content)

    let response = `Olá, ${name}! Consultei os documentos institucionais da FECAP e localizei as seguintes orientações no documento **"${best.docTitle}"** (${best.category}):\n\n`
    response += `${formattedContent}\n\n`

    if (matches.length > 1 && matches[1].score > 25 && matches[1].docTitle !== best.docTitle) {
      const second = matches[1]
      const secondExcerpt = this.cleanAndFormatText(second.content).slice(0, 250)
      response += `> 💡 **Informação complementar encontrada em "${second.docTitle}":**\n> ${secondExcerpt}...\n\n`
    }

    response += `Se precisar de orientações adicionais ou quiser formalizar uma solicitação, você também pode abrir um chamado direto para a equipe ASA.`

    const actions = this.deriveActions(query, matches)

    return {
      content: response,
      sources: matches.map(m => ({ title: m.docTitle, filename: m.filename, category: m.category })),
      actions,
      confidence: 0.92,
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
}

export const aiService = new AIService()
