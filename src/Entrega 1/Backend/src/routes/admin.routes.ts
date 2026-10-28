import { aiService } from '../services/ai.service'
import { Router } from 'express'
import { prisma } from '../db'
import { AuthenticatedRequest, authenticateToken, requireRole } from '../middleware/auth'

export const adminRouter = Router()

// SLA Rules
adminRouter.get('/sla-rules', authenticateToken, async (req, res) => {
  try {
    const rules = await prisma.sLARule.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(rules)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar regras de SLA' })
  }
})

adminRouter.post('/sla-rules', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, priority, category, firstResponseMinutes, resolutionHours, active } = req.body
    const rule = await prisma.sLARule.create({
      data: {
        name,
        priority,
        category: category || null,
        firstResponseMinutes: Number(firstResponseMinutes),
        resolutionHours: Number(resolutionHours),
        active: active !== undefined ? Boolean(active) : true,
      },
    })
    res.status(201).json(rule)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar regra de SLA' })
  }
})

// Automations
adminRouter.get('/automations', authenticateToken, async (req, res) => {
  try {
    const automations = await prisma.automationRule.findMany({ orderBy: { createdAt: 'desc' } })
    const formatted = automations.map(a => ({
      ...a,
      trigger: JSON.parse(a.trigger || '{}'),
      conditions: JSON.parse(a.conditions || '[]'),
      actions: JSON.parse(a.actions || '[]'),
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar automações' })
  }
})

adminRouter.post('/automations', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, trigger, conditions, actions, active } = req.body
    const rule = await prisma.automationRule.create({
      data: {
        name,
        description,
        trigger: JSON.stringify(trigger || {}),
        conditions: JSON.stringify(conditions || []),
        actions: JSON.stringify(actions || []),
        active: active !== undefined ? Boolean(active) : true,
      },
    })
    res.status(201).json({
      ...rule,
      trigger: JSON.parse(rule.trigger),
      conditions: JSON.parse(rule.conditions),
      actions: JSON.parse(rule.actions),
    })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar automação' })
  }
})

// Audit Logs
adminRouter.get('/audit-logs', authenticateToken, async (req, res) => {
  try {
    const { action, userRole, limit } = req.query
    const where: any = {}
    if (action) where.action = String(action)
    if (userRole) where.userRole = String(userRole)

    const logs = await prisma.auditEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? Number(limit) : 50,
    })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria' })
  }
})

// AI Prompts
adminRouter.get('/prompts', authenticateToken, async (req, res) => {
  try {
    const prompts = await prisma.aIPrompt.findMany({ orderBy: { updatedAt: 'desc' } })
    res.json(prompts)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar prompts de IA' })
  }
})

adminRouter.put('/prompts/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const id = String(req.params.id)
    const { content, version, status, name, description } = req.body

    const dataToUpdate: any = {}
    if (content) dataToUpdate.content = content
    if (version) dataToUpdate.version = version
    if (status) dataToUpdate.status = status
    if (name) dataToUpdate.name = name
    if (description) dataToUpdate.description = description

    const prompt = await prisma.aIPrompt.update({
      where: { id },
      data: dataToUpdate,
    })
    res.json(prompt)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar prompt' })
  }
})

// Integrations
adminRouter.get('/integrations', authenticateToken, async (req, res) => {
  try {
    const integrations = await prisma.integration.findMany({ orderBy: { createdAt: 'asc' } })
    const formatted = integrations.map(i => ({
      ...i,
      config: JSON.parse(i.config || '{}'),
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar integrações' })
  }
})

// Users (Equipe ASA e Admins)
adminRouter.get('/users', authenticateToken, async (req, res) => {
  try {
    const { role } = req.query
    const where: any = {}
    if (role) where.role = String(role)

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        department: true,
        status: true,
        lastAccess: true,
        createdAt: true,
        _count: {
          select: { assignedTickets: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

// Notifications
adminRouter.get('/notifications', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notificações' })
  }
})

adminRouter.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const id = String(req.params.id)
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar notificação' })
  }
})


// ==========================================
// ADMIN DASHBOARD & REAL DATA INTEGRATIONS
// ==========================================

// Dashboard Consolidated Stats (Real Data)
adminRouter.get('/dashboard-stats', authenticateToken, requireRole(['admin', 'asa']), async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalStudents,
      totalAsa,
      activeAsa,
      totalTickets,
      openTickets,
      resolvedTickets,
      slaRiskTickets,
      appointmentsCount,
      users,
      allTickets,
      auditEvents,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.user.count({ where: { role: { in: ['asa', 'admin'] } } }),
      prisma.user.count({ where: { role: { in: ['asa', 'admin'] }, status: 'ativo' } }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { in: ['aberto', 'em_atendimento', 'aguardando_aluno'] } } }),
      prisma.ticket.count({ where: { status: { in: ['resolvido', 'fechado'] } } }),
      prisma.ticket.count({ where: { slaStatus: { in: ['risk', 'breached'] } } }),
      prisma.appointment.count(),
      prisma.user.findMany({
        where: { role: { in: ['asa', 'admin'] } },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          status: true,
          lastAccess: true,
          _count: { select: { assignedTickets: { where: { status: { in: ['aberto', 'em_atendimento'] } } } } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.ticket.findMany({
        select: { category: true, status: true, createdAt: true, updatedAt: true },
        take: 1000,
      }),
      prisma.auditEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ])

    // Categoria breakdown
    const categoryCounts: Record<string, number> = {}
    allTickets.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1
    })

    const categoryColors: Record<string, string> = {
      matricula: '#3b82f6',
      financeiro: '#10b981',
      academico: '#f59e0b',
      documentos: '#8b5cf6',
      infraestrutura: '#ec4899',
      cancelamento: '#ef4444',
      outros: '#64748b',
    }

    const pieData = Object.entries(categoryCounts).map(([cat, count]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: count,
      color: categoryColors[cat] || '#6366f1',
    }))

    // 7 dias chart
    const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const last7DaysData: { name: string; abertos: number; resolvidos: number }[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      const dayName = daysMap[d.getDay()]

      const abertos = allTickets.filter(t => {
        const ct = new Date(t.createdAt)
        return ct >= dayStart && ct <= dayEnd
      }).length

      const resolvidos = allTickets.filter(t => {
        const ut = new Date(t.updatedAt)
        return (t.status === 'resolvido' || t.status === 'fechado') && ut >= dayStart && ut <= dayEnd
      }).length

      last7DaysData.push({
        name: dayName,
        abertos,
        resolvidos,
      })
    }

    const teamStatus = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=16a34a&color=fff`,
      status: u.status,
      lastAccess: u.lastAccess,
      tickets: u._count.assignedTickets,
    }))

    const systemHealth = [
      { label: 'API Backend', status: 'Operacional', color: 'bg-green-500' },
      { label: 'Google Gemini IA', status: Boolean(process.env.GEMINI_API_KEY) ? 'Operacional' : 'Degradado', color: Boolean(process.env.GEMINI_API_KEY) ? 'bg-green-500' : 'bg-amber-500' },
      { label: 'Banco SQLite', status: 'Operacional', color: 'bg-green-500' },
      { label: 'Cloudflare R2', status: Boolean(process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET) ? 'Operacional' : 'Degradado', color: 'bg-green-500' },
      { label: 'Base de Conhecimento (RAG)', status: 'Operacional', color: 'bg-green-500' },
      { label: 'Central Presencial (ASA)', status: 'Operacional', color: 'bg-green-500' },
    ]

    res.json({
      totalStudents,
      totalAsa,
      activeAsa,
      totalTickets,
      openTickets,
      resolvedTickets,
      slaRiskTickets,
      appointmentsCount,
      pieData,
      chartData: last7DaysData,
      teamStatus,
      recentAuditEvents: auditEvents,
      systemHealth,
    })
  } catch (error: any) {
    console.error('Erro ao buscar métricas da Central de Controle:', error)
    res.status(500).json({ error: 'Erro ao gerar indicadores do dashboard' })
  }
})

// Students Administration (Real List with Pagination & Filters)
adminRouter.get('/students', authenticateToken, requireRole(['admin', 'asa']), async (req, res) => {
  try {
    const { search, course, status, period, page = '1', limit = '20' } = req.query
    const pageNum = Math.max(1, parseInt(String(page)) || 1)
    const limitNum = Math.max(1, parseInt(String(limit)) || 20)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (course && course !== 'todos') where.course = String(course)
    if (status && status !== 'todos') where.status = String(status)
    if (period && period !== 'todos') where.period = String(period)

    if (search) {
      const q = String(search).toLowerCase()
      where.OR = [
        { name: { contains: q } },
        { ra: { contains: q } },
        { email: { contains: q } },
        { course: { contains: q } },
      ]
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          _count: {
            select: {
              tickets: true,
              appointments: true,
              conversations: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.student.count({ where }),
    ])

    res.json({
      students,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (error) {
    console.error('Erro ao listar alunos no admin:', error)
    res.status(500).json({ error: 'Erro ao listar alunos' })
  }
})

// Create Student
adminRouter.post('/students', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { name, ra, email, course, semester, period, phone, status } = req.body
    if (!name || !ra || !email || !course) {
      return res.status(400).json({ error: 'Nome, RA, e-mail e curso são obrigatórios' })
    }

    const student = await prisma.student.create({
      data: {
        name,
        ra,
        email,
        course,
        semester: Number(semester) || 1,
        period: period || 'manha',
        phone: phone || null,
        status: status || 'regular',
      },
    })

    await prisma.auditEvent.create({
      data: {
        userId: req.user?.id || null,
        userName: req.user?.name || 'Administrador',
        userRole: req.user?.role || 'admin',
        action: 'CRIOU_ALUNO',
        resource: 'Student',
        resourceId: student.id,
        details: JSON.stringify({ name: student.name, ra: student.ra, course: student.course }),
        severity: 'info',
      },
    })

    res.status(201).json(student)
  } catch (error: any) {
    console.error('Erro ao cadastrar aluno:', error)
    res.status(500).json({ error: error.message || 'Erro ao cadastrar aluno' })
  }
})

// Toggle Student Status
adminRouter.patch('/students/:id/status', authenticateToken, requireRole(['admin', 'asa']), async (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id)
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'Status é obrigatório' })

    const student = await prisma.student.update({
      where: { id },
      data: { status },
    })

    await prisma.auditEvent.create({
      data: {
        userId: req.user?.id || null,
        userName: req.user?.name || 'Administrador',
        userRole: req.user?.role || 'admin',
        action: 'ALTEROU_STATUS_ALUNO',
        resource: 'Student',
        resourceId: student.id,
        details: JSON.stringify({ studentName: student.name, newStatus: status }),
        severity: 'info',
      },
    })

    res.json(student)
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar status do estudante' })
  }
})

// Create Staff User (ASA or Admin)
adminRouter.post('/users', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { name, email, password, role, department } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password || '123456',
        role: role || 'asa',
        department: department || 'Atendimento ASA',
        status: 'ativo',
      },
    })

    await prisma.auditEvent.create({
      data: {
        userId: req.user?.id || null,
        userName: req.user?.name || 'Administrador',
        userRole: req.user?.role || 'admin',
        action: 'CRIOU_USUARIO_SISTEMA',
        resource: 'User',
        resourceId: user.id,
        details: JSON.stringify({ name: user.name, email: user.email, role: user.role }),
        severity: 'info',
      },
    })

    res.status(201).json(user)
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: error.message || 'Erro ao criar usuário' })
  }
})

// Toggle Staff User Status
adminRouter.patch('/users/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id)
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'Status é obrigatório' })

    const user = await prisma.user.update({
      where: { id },
      data: { status },
    })

    await prisma.auditEvent.create({
      data: {
        userId: req.user?.id || null,
        userName: req.user?.name || 'Administrador',
        userRole: req.user?.role || 'admin',
        action: 'ALTEROU_STATUS_USUARIO',
        resource: 'User',
        resourceId: user.id,
        details: JSON.stringify({ targetUserName: user.name, newStatus: status }),
        severity: 'warning',
      },
    })

    res.json(user)
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar status do usuário' })
  }
})

// ==========================================
// REAL AI OPERATIONAL DIAGNOSTIC & ANALYSIS
// ==========================================

// Trigger new AI Administrative Analysis
adminRouter.post('/ai-analysis', authenticateToken, requireRole(['admin', 'asa']), async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalStudents,
      totalAsa,
      activeAsa,
      totalTickets,
      openTickets,
      resolvedTickets,
      slaRiskTickets,
      allTickets,
      users,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.user.count({ where: { role: { in: ['asa', 'admin'] } } }),
      prisma.user.count({ where: { role: { in: ['asa', 'admin'] }, status: 'ativo' } }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { in: ['aberto', 'em_atendimento', 'aguardando_aluno'] } } }),
      prisma.ticket.count({ where: { status: { in: ['resolvido', 'fechado'] } } }),
      prisma.ticket.count({ where: { slaStatus: { in: ['risk', 'breached'] } } }),
      prisma.ticket.findMany({ select: { category: true, title: true }, take: 100 }),
      prisma.user.findMany({
        where: { role: { in: ['asa', 'admin'] } },
        select: { name: true, _count: { select: { assignedTickets: { where: { status: { in: ['aberto', 'em_atendimento'] } } } } } },
      }),
    ])

    const categoryDistribution: Record<string, number> = {}
    allTickets.forEach(t => {
      categoryDistribution[t.category] = (categoryDistribution[t.category] || 0) + 1
    })

    const recentTicketSample = allTickets.slice(0, 10).map(t => t.title)
    const topAttendantLoads = users.map(u => ({ name: u.name, tickets: u._count.assignedTickets }))

    const analysis = await aiService.generateAdminExecutiveReport({
      totalStudents,
      totalAsa,
      activeAsa,
      totalTickets,
      openTickets,
      resolvedTickets,
      slaRiskTickets,
      categoryDistribution,
      recentTicketSample,
      topAttendantLoads,
    })

    const report = await prisma.adminAIReport.create({
      data: {
        summary: analysis.summary,
        healthScore: analysis.healthScore,
        diagnostics: JSON.stringify(analysis.diagnostics),
        recommendations: JSON.stringify(analysis.recommendations),
        metricsSnapshot: JSON.stringify({
          totalStudents,
          totalAsa,
          activeAsa,
          totalTickets,
          openTickets,
          resolvedTickets,
          slaRiskTickets,
          categoryDistribution,
        }),
        authorId: req.user?.id || null,
      },
    })

    await prisma.auditEvent.create({
      data: {
        userId: req.user?.id || null,
        userName: req.user?.name || 'Administrador',
        userRole: req.user?.role || 'admin',
        action: 'GEROU_RELATORIO_IA_ADMIN',
        resource: 'AdminAIReport',
        resourceId: report.id,
        details: JSON.stringify({ healthScore: report.healthScore, recsCount: analysis.recommendations.length }),
        severity: 'info',
      },
    })

    res.json({
      ...report,
      diagnostics: analysis.diagnostics,
      recommendations: analysis.recommendations,
      metricsSnapshot: JSON.parse(report.metricsSnapshot),
    })
  } catch (error: any) {
    console.error('Erro ao gerar relatório administrativo com IA:', error)
    res.status(500).json({ error: error.message || 'Erro ao processar análise de IA' })
  }
})

// AI Analysis History
adminRouter.get('/ai-analysis/history', authenticateToken, requireRole(['admin', 'asa']), async (req, res) => {
  try {
    const reports = await prisma.adminAIReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const formatted = reports.map(r => ({
      ...r,
      diagnostics: JSON.parse(r.diagnostics || '[]'),
      recommendations: JSON.parse(r.recommendations || '[]'),
      metricsSnapshot: JSON.parse(r.metricsSnapshot || '{}'),
    }))

    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico de análises de IA' })
  }
})
