import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'asaia-super-secret-jwt-key-2026'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role: 'aluno' | 'asa' | 'admin'
  department?: string
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Allow demo header override for rapid switching in dev/demo mode
  const demoRole = req.headers['x-demo-role'] as string
  const demoUserId = req.headers['x-demo-user-id'] as string

  if (demoRole) {
    req.user = {
      id: demoUserId || (demoRole === 'aluno' ? 'aluno-01' : demoRole === 'asa' ? 'asa-01' : 'admin-01'),
      name: demoRole === 'aluno' ? 'Esther Rodrigues' : demoRole === 'asa' ? 'Fernanda Costa' : 'Ricardo Mendes',
      email: demoRole === 'aluno' ? 'esther.rodrigues@aluno.fecap.br' : demoRole === 'asa' ? 'fernanda.costa@fecap.br' : 'ricardo.mendes@fecap.br',
      role: demoRole as 'aluno' | 'asa' | 'admin',
    }
    return next()
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    // Default fallback to aluno-01 if unauthenticated for smooth demo
    req.user = {
      id: 'aluno-01',
      name: 'Esther Rodrigues',
      email: 'esther.rodrigues@aluno.fecap.br',
      role: 'aluno',
    }
    return next()
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' })
  }
}

export function requireRole(allowedRoles: Array<'aluno' | 'asa' | 'admin'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso não autorizado para este perfil' })
    }
    next()
  }
}
