import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db'
import { JWT_SECRET, AuthenticatedRequest, authenticateToken } from '../middleware/auth'

export const authRouter = Router()

export const GLOBAL_PASSWORD = '@#$273baratA'

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email institucional é obrigatório' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Check if user is an employee (ASA or Admin)
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (user) {
      const isPasswordValid = password === GLOBAL_PASSWORD || password === user.password

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' })
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      await prisma.user.update({
        where: { id: user.id },
        data: { lastAccess: new Date() },
      })

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          status: user.status,
        },
      })
    }

    // 2. Check if user is a student
    const student = await prisma.student.findUnique({
      where: { email: cleanEmail },
    })

    if (student) {
      const isPasswordValid = password === GLOBAL_PASSWORD

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' })
      }

      const token = jwt.sign(
        { id: student.id, name: student.name, email: student.email, role: 'aluno' },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.json({
        token,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'aluno',
          ra: student.ra,
          course: student.course,
          semester: student.semester,
          period: student.period,
          status: student.status,
          phone: student.phone,
        },
      })
    }

    return res.status(401).json({ error: 'E-mail institucional não cadastrado no sistema da FECAP' })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro interno ao processar login' })
  }
})

authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    if (req.user.role === 'aluno') {
      const student = await prisma.student.findUnique({
        where: { id: req.user.id },
      })
      return res.json({
        user: {
          id: req.user.id,
          name: student?.name || req.user.name,
          email: student?.email || req.user.email,
          role: 'aluno',
          ra: student?.ra,
          course: student?.course,
          semester: student?.semester,
          period: student?.period,
          status: student?.status,
          phone: student?.phone,
        },
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        status: user.status,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ error: 'Erro interno ao buscar perfil' })
  }
})
