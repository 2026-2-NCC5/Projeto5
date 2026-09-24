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
    const { id } = req.params
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
    const { id } = req.params
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar notificação' })
  }
})
