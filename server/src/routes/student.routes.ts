import { Router } from 'express'
import { prisma } from '../db'
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth'

export const studentRouter = Router()

// List students
studentRouter.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { search, course, status, period } = req.query

    const where: any = {}

    if (course && course !== 'todos') {
      where.course = String(course)
    }

    if (status && status !== 'todos') {
      where.status = String(status)
    }

    if (period && period !== 'todos') {
      where.period = String(period)
    }

    if (search) {
      const q = String(search).toLowerCase()
      where.OR = [
        { name: { contains: q } },
        { ra: { contains: q } },
        { email: { contains: q } },
        { course: { contains: q } },
      ]
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        _count: {
          select: { tickets: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    res.json(students)
  } catch (error) {
    console.error('Erro ao listar estudantes:', error)
    res.status(500).json({ error: 'Erro ao buscar estudantes' })
  }
})

// Get single student by ID with tickets
studentRouter.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        tickets: {
          orderBy: { createdAt: 'desc' },
          include: {
            attendant: { select: { id: true, name: true, email: true } },
            aiSuggestion: true,
          },
        },
        conversations: {
          orderBy: { updatedAt: 'desc' },
          include: { messages: true },
        },
      },
    })

    if (!student) {
      return res.status(404).json({ error: 'Estudante não encontrado' })
    }

    res.json(student)
  } catch (error) {
    console.error('Erro ao buscar estudante:', error)
    res.status(500).json({ error: 'Erro ao buscar estudante' })
  }
})
