import { Router } from 'express'
import { prisma } from '../db'
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth'
import { aiService } from '../services/ai.service'

export const chatRouter = Router()

// List conversations for authenticated student
chatRouter.get('/conversations', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    let studentId = req.user?.id || 'aluno-01'
    const studentExists = await prisma.student.findUnique({ where: { id: studentId } })
    if (!studentExists) {
      const firstStudent = await prisma.student.findFirst()
      if (firstStudent) studentId = firstStudent.id
    }

    const conversations = await prisma.conversation.findMany({
      where: { studentId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })

    const formatted = conversations.map(c => ({
      id: c.id,
      title: c.title,
      studentId: c.studentId,
      status: c.status,
      lastMessage: c.messages[0]?.content || 'Nova conversa',
      lastMessageTime: c.messages[0]?.timestamp || c.createdAt,
      unread: false,
      aiHandled: c.aiHandled,
    }))

    res.json(formatted)
  } catch (error) {
    console.error('Erro ao listar conversas:', error)
    res.status(500).json({ error: 'Erro ao buscar conversas' })
  }
})

// Create new conversation
chatRouter.post('/conversations', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    let studentId = req.user?.id || 'aluno-01'
    const studentExists = await prisma.student.findUnique({ where: { id: studentId } })
    if (!studentExists) {
      const firstStudent = await prisma.student.findFirst()
      if (firstStudent) studentId = firstStudent.id
    }

    const { title } = req.body

    const conversation = await prisma.conversation.create({
      data: {
        studentId,
        title: title || 'Nova Conversa com Álvaro AI',
        messages: {
          create: {
            role: 'assistant',
            content: 'Olá! Sou o Álvaro AI, o assistente inteligente da Central de Atendimento ao Aluno da FECAP. Como posso te orientar hoje?',
            actions: JSON.stringify([
              { label: 'Documentos & Atestados', action: 'documentos' },
              { label: 'Financeiro & Boletos', action: 'financeiro' },
              { label: 'Bolsas & FIES/Prouni', action: 'bolsas' },
              { label: 'Abrir Chamado', action: 'novo-chamado' },
            ]),
          },
        },
      },
      include: {
        messages: true,
      },
    })

    res.status(201).json({
      ...conversation,
      messages: conversation.messages.map(m => ({
        ...m,
        actions: m.actions ? JSON.parse(m.actions) : undefined,
      })),
    })
  } catch (error: any) {
    console.error('Erro ao criar conversa:', error)
    res.status(500).json({ error: error.message || 'Erro ao criar conversa' })
  }
})

// Get single conversation by ID
chatRouter.get('/conversations/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' })
    }

    res.json({
      ...conversation,
      messages: conversation.messages.map(m => ({
        ...m,
        actions: m.actions ? JSON.parse(m.actions) : undefined,
      })),
    })
  } catch (error) {
    console.error('Erro ao buscar conversa:', error)
    res.status(500).json({ error: 'Erro ao buscar conversa' })
  }
})

// Send message in conversation & receive AI response (with RAG knowledge retrieval)
chatRouter.post('/conversations/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Conteúdo da mensagem é obrigatório' })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 8,
        },
      },
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' })
    }

    // 1. Fetch student context
    const student = await prisma.student.findUnique({
      where: { id: conversation.studentId },
    })

    // 2. Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        role: 'user',
        content: content.trim(),
      },
    })

    // 3. Format conversation history for LLM
    const history = conversation.messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // 4. Generate RAG response via AIService
    const ragResult = await aiService.generateChatResponse(
      content.trim(),
      history,
      student ? {
        id: student.id,
        name: student.name,
        email: student.email,
        ra: student.ra,
        course: student.course,
        semester: student.semester,
        period: student.period,
      } : undefined
    )

    // Append source citations if available
    let finalContent = ragResult.content
    if (ragResult.sources.length > 0) {
      const sourceList = ragResult.sources
        .map(s => `• 📄 **${s.title}** (${s.category})`)
        .join('\n')
      finalContent += `\n\n---\n**Fontes Consultadas:**\n${sourceList}`
    }

    // 5. Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        role: 'assistant',
        content: finalContent,
        actions: ragResult.actions.length > 0 ? JSON.stringify(ragResult.actions) : null,
      },
    })

    // 6. Update conversation title and timestamp
    const msgCount = conversation.messages.length
    if (msgCount <= 2) {
      await prisma.conversation.update({
        where: { id },
        data: {
          title: content.slice(0, 32) + (content.length > 32 ? '...' : ''),
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      })
    }

    res.status(201).json({
      userMessage: {
        ...userMessage,
        actions: undefined,
      },
      aiMessage: {
        ...aiMessage,
        actions: ragResult.actions,
      },
    })
  } catch (error) {
    console.error('Erro ao enviar mensagem no chat:', error)
    res.status(500).json({ error: 'Erro ao processar mensagem do chat' })
  }
})
